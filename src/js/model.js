//# IMPORT-----------------------------------
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

//# STATE------------------------------------
/**
 * @namespace state
 * @property {Object} recipe - Data resep saat ini
 * @property {search} search - Data pencarian resep
 * @property {string} search.query - Kata kunci pencarian
 * @property {Array<Object>} search.result - Hasil pencarian
 * @property {number} search.page - Halaman pencarian saat ini
 * @property {number} search.resultPerPage - Jumlah hasil halaman
 * @property {Array<Object>} bookmarks - Daftar bookmark
 */
export const state = {
  recipe: {},
  search: {
    query: "",
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//# MODEL FUNCTION---------------------------

/**
 * Membuat objek resep dengam format yang diingnkan
 * @param {*} data - Data asli yang diterima dari API
 * @returns {Object} Objek resep yang diformat
 * @private
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Memuat resep dari API bedasarkan ID
 * @param {string} id - ID resep yang akan dimuat
 * @async
 * @returns {Promise<void>}
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(`${error} 💥💥`);
    throw error;
  }
};

/**
 * Memuat hasil pencarian bedasarkan querry
 * @param {string} query - Kata kunci pencarian
 * @async
 * @returns {Promise<void>}
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.result = data.recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 💥💥`);
    throw error;
  }
};

/**
 * Mendapatkan hasil pencarian bedasarkan halaman
 * @param {number} [page=state.search.page] - Halaman pencarian
 * @returns {Array<Object>} Hasil pencarian pada halaman tertentu
 */
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.result.slice(start, end);
};

/**
 * Mengupdate jumlah porsi resep menyesuaikan jumlah bahan
 * @param {number} newSevings - Jumlah porsi baru
 */
export const updateServings = function (newSevings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newSevings) / state.recipe.servings;
  });
  state.recipe.servings = newSevings;
};

/**
 * Menympan bookmark ke local storage
 * @private
 */
const presistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/**
 * Menambah resep ke bookmark
 * @param {Object} recipe - Resep yang akan ditambahkan ke bookmark
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  presistBookmarks();
};

/**
 * Menghapus resep dari bookmark
 * @param {string} id - ID resep yang akan dihapus dari bookmark
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  presistBookmarks();
};

/**
 * Inisiasi bookmark dari local storage
 * @private
 */
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * Mengupload resep baru ke API dengan menambahkannya ke bookmark
 * @param {Object} newRecipe - Data resep baru yang akan diungah
 * @async
 * @throws {error} Jika format bahan salah atau unggahan gagal
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
