//# IMPORT-----------------------------------
import View from "./View";
import icons from "url:../../img/icons.svg";

//# CLASS------------------------------------
class PaginationView extends View {
  //= Selector, container and private field
  _parentElement = document.querySelector(".pagination");

  //= Handler button click pagination function
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const gotToPage = +btn.dataset.goto;
      handler(gotToPage);
    });
  }

  //= Generate pagination button
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    // page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage + 1, "next", "right");
    }
    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage - 1, "prev", "left");
    }
    // other page
    if (curPage < numPages) {
      return (
        this._generateMarkupButton(curPage + 1, "next", "right") +
        this._generateMarkupButton(curPage - 1, "prev", "left")
      );
    }
    // page 1, and there are NO other pages
    return "";
  }

  //= Generate markup button function
  _generateMarkupButton(page, btn, icon) {
    return `
        <button class="btn--inline pagination__btn--${btn}" data-goto="${page}"> 
          <span>Page ${page}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-${icon}"></use>
          </svg>
        </button>
    `;
  }
}

export default new PaginationView();
