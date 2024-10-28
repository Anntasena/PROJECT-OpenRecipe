//# IMPORT-----------------------------------
import * as model from "./model.js";
import { MDOAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
// import paginationView from "./views/paginationView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

//# PARCEL SETUP -----------------------------
// This code not from JS, its form parcel to make not refresh after changing code
// if (module.hot) {
//   module.hot.accept();
// }

//# SELECTOR & CONTAINER---------------------
// Controller file dont need DOM

//# CONTROLLER FUNCTION-----------------------
//= Control recipe function
const controlRecipes = async function () {
  try {
    // change hash URL
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. UPDATE RESULT VIEW TO MARK SELECTED SEARCH RESULT
    resultView.update(model.getSearchResultPage());

    // 1. UPDATE BOOKMARK VIEW
    bookmarksView.update(model.state.bookmarks);

    // 2. LOADING RECIPE
    await model.loadRecipe(id);

    // 3. RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

//= Control search result function
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // console.log(recipeView);

    // 1. GET SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    // 2. LOAD SEARCH RESULTS
    await model.loadSearchResults(query);

    // 3. RENDER RESULTS
    // resultView.render(model.state.search.result);
    resultView.render(model.getSearchResultPage());

    // 4. RENDER INITIAL PAGINATION BUTTON
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

//= Control pagination function
const controlPagination = function (gotToPage) {
  // 1. RENDER NEW RESULT
  resultView.render(model.getSearchResultPage(gotToPage));
  // 2. RENDER NEW PAGINATION BUTTON
  paginationView.render(model.state.search);
};

//= Control foods servings function
const controlServings = function (newServings) {
  // 1. UPDATE RECIPE SERVINGS (IN STATE)
  model.updateServings(newServings);

  // 2. UPDATE THE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//= Control add bookmark function
const controlAddBookmark = function () {
  // 1. Add / Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

//= Control bookmark function
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//= Control add recipe function
const controlAddRecipe = async function (newRecipe) {
  try {
    // loading spinner
    addRecipeView.renderSpinner();

    //  UPLOAD THE NEW RECIPE DATA
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MDOAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error("💥", error);
    addRecipeView.renderError(error.message);
  }
};

//= Initial function
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
};
init();
