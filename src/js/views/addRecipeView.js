//# IMPORT-----------------------------------
import View from "./View";
import icons from "url:../../img/icons.svg";

//# CLASS------------------------------------
class AddRecipeView extends View {
  //= Selector, container and private field
  _parentElement = document.querySelector(".upload");
  _successMessage = "Recipe was successfully uploaded!";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  //=
  constructor() {
    super();
    this._addHanlderShowWindow();
    this._addHandlerHideWindow();
  }

  //=
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  //= Handler form window to add recipe
  _addHanlderShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  //=
  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  //=
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr); // convert array to object
      handler(data);
    });
  }

  //= Generate form recipe
  _generateMarkup() {}
}

export default new AddRecipeView();
