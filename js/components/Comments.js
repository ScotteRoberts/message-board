export default class Comments extends HTMLElement {
  static get observedAttributes() {
    return ['comments'];
  }

  get comments() {
    if (this.hasAttribute('comments')) {
      return JSON.parse(this.getAttribute('comments'));
    }
    return [];
  }

  /** avoid using... */
  set comments(value) {
    this.setAttribute('comments', JSON.stringify(value));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      ${this.comments.map(comment => `<p>${comment.text}</p>`).join('')}
    `;

    // Figure out how to pass <message-board-comments></message-board-comments> instead of <p></p>
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    this.render();
  }
}
