//# CLASS------------------------------------
class SearchView {
  //= Selector, container and private field
  _parentElement = document.querySelector(".search");

  //= Get query function
  getQuery() {
    const query = this._parentElement.querySelector(`.search__field`).value;
    this._clearInput();
    return query;
  }

  //= Clear input function
  _clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  //= Handler Search function
  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

//# EXPORT-----------------------------------
export default new SearchView();
