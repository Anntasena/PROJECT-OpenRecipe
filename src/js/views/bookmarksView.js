//# IMPORT-----------------------------------
import View from "./View";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg";

//# CLASS------------------------------------
class BookmarksView extends View {
  //= Selector, container and private field
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmarks it ;)";
  _successMessage = "";

  //=
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  //= Generate list bookmark function
  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
