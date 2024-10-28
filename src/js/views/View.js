//# IMPORT-----------------------------------
import icons from "url:../../img/icons.svg";

//# CLASS------------------------------------
export default class View {
  _data;

  /**
   * Render the received object to the DOM.
   * @param {Object|Object[]} data - The data to be rendered (e.g., a recipe object).
   * @param {boolean} [render=true] - If false, returns a markup string instead of rendering to the DOM.
   * @returns {undefined|string} A markup string is returned if render=false.
   * @this {Object} View instance
   * @author Syahrin Matlail
   * @todo finish implementation
   */
  render(data, render = true) {
    // Checking and validaating input serchbar
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Updates the DOM to reflect changes in data without re-rendering the entire view.
   * @param {Object|Object[]} data - The updated data.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    // check DOM element
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        console.log("💥", newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  /**
   * Clears the parent element's inner HTML.
   * @private
   */
  _clear() {
    this._parentElement.innerHTML = "";
  }

  /**
   * Renders a loading spinner to the DOM.
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Renders an error message to the DOM.
   * @param {string} [message=this._errorMessage] - Custom error message to display.
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Renders a success message to the DOM.
   * @param {string} [message=this._successMessage] - Custom success message to display.
   */
  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
