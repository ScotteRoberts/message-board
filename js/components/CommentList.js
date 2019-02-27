export default class CommentList extends HTMLElement {
  static get observedAttributes() {
    return ['comments', 'search'];
  }

  get comments() {
    if (this.hasAttribute('comments')) {
      return JSON.parse(this.getAttribute('comments'));
    }
    return [];
  }

  // allows us to set "comments" attribute by using this.comments = newValue
  set comments(value) {
    this.setAttribute('comments', JSON.stringify(value));
  }

  get search() {
    if (this.hasAttribute('search')) {
      return JSON.parse(this.getAttribute('search'));
    }
    return '';
  }

  set search(value) {
    this.setAttribute('search', JSON.stringify(value));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = '';
    this.comments
      .filter(comment => comment.text.toLowerCase().includes(this.search.toLowerCase()))
      .forEach(comment => {
        // TODO: Filter comments here with a substring that we pass down from the input.

        // create a comment-list element
        const newComment = document.createElement('message-board-comment-item');
        // set its comment attribute
        // WITHOUT COMMENTITEM SETTER: newComment.setAttribute('comment', JSON.stringify(comment));
        newComment.comment = comment;
        // append it to comment list
        this.appendChild(newComment);
      });

    // Figure out how to pass <message-board-comments></message-board-comments> instead of <p></p>
  }

  // Listens for changes on the "obervedAttributes".
  attributeChangedCallback(attributeName, oldValue, newValue) {
    this.render();
  }
}
