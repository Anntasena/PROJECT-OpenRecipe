//# IMPORT-----------------------------------
import View from "./View";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView";

//# CLASS------------------------------------
class ResultView extends View {
  //= Selector, container and private field
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes from your input! please check again";
  _successMessage = "";

  //= Generate list recipe function
  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultView();
