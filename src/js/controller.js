import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../sass/main.scss';
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // Update results view to match selected search results
    resultsView.update(model.getSearchedResultsPage());
    // Update bookmarks selected recipeView
    bookmarksView.update(model.state.bookmarks);
    // Loading recipe
    await model.loadRecipe(id);
    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchedResultsPage(goToPage));
  // Render new pagination buttons
  paginationView.render(model.state.searched);
};

const controlSearchedRecipes = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchedResults(query);
    controlPagination();
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlAddBookmarks = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmarks(model.state.recipe);
  } else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  if (model.state.bookmarks.length === 0) {
    bookmarksView.renderError();
  } else {
    bookmarksView.render(model.state.bookmarks);
  }
};

const controlServings = function (servings) {
  // Update state
  model.updateServings(servings);
  // Update view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  if (model.state.bookmarks.length === 0) {
    bookmarksView.renderError();
    return;
  }

  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    location.reload();
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchedRecipes);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
