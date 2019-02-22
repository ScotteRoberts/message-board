export default class CommentItem extends HTMLElement {
  get comment() {
    if (this.hasAttribute('comment')) {
      return JSON.parse(this.getAttribute('comment'));
    }
    return {
      id: -1,
      timestamp: Date.now(),
      text: '',
    };
  }

  set comment(value) {
    this.setAttribute('comment', JSON.stringify(value));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <p>${this.comment.text}</p>
      <button type="button" class="delete-button">x</button>
    `;

    // create a custom event and emit it.
    this.querySelector('button.delete-button').addEventListener('click', this.dispatchRemoveEvent);
  }

  dispatchRemoveEvent = () => {
    this.dispatchEvent(
      new CustomEvent('removeComment', {
        bubbles: true,
        detail: this.comment.text,
      })
    );
  };
}
