export default class Loader extends HTMLElement {
  static get observedAttributes() {
    return ['loading'];
  }

  get loading() {
    return this.getAttribute('loading');
  }

  // allows us to set "comments" attribute by using this.comments = newValue
  set loading(value) {
    if (value) {
      this.setAttribute('loading', 'true');
    } else {
      this.setAttribute('loading', 'false');
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class='wonky-spinner'></div>
      <h2>Loading</h2>
    `;
  }
}
