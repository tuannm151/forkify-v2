import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    let pagePrevModifier = '';
    let pageNextModifier = '';

    if (numPages === 1) return '';

    if (currentPage === 1 && numPages > 1) {
      pagePrevModifier = 'pagination__btn--hidden';
    }

    if (currentPage === numPages && numPages > 1) {
      pageNextModifier = 'pagination__btn--hidden';
    }

    return `
        <button data-goto=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev ${pagePrevModifier}">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            <button data-goto=${
              currentPage + 1
            } class="btn--inline pagination__btn--next ${pageNextModifier}">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
    `;
  }
}

export default new PaginationView();
