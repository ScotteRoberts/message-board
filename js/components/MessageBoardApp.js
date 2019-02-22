import MessageBoardAPI, { commentData } from '../MessageBoardAPI.js';

class MessageBoardApp extends HTMLElement {
  constructor() {
    super();
    this.api = new MessageBoardAPI(commentData);
    this.state = {
      comments: this.api.getCommentsSortedByTime(),
      searchText: '',
    };

    // DEV: for any custom removeComment event
    this.addEventListener('removeComment', this.handleRemoveComment);
  }

  // takes in new pieces of state
  setState(newState) {
    // for each piece of state
    Object.keys(newState).forEach(key => {
      // update the correct key
      this.state[key] = newState[key];
      // select all child elements tracking this piece of state via attributes
      this.querySelectorAll(`[${key}]`).forEach(element => {
        // calls the setter in the commentList class
        // OR... element.setAttribute(key, newState[key]);
        element[key] = newState[key];
      });
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <nav>
        <form>
          <input
            type="text"
            name="search"
            placeholder="Search here"
          />
        </form>
      </nav>
      <message-board-comment-list></message-board-comment-list>
        <div class="add-comment">
          <form>
            <input
              type="text"
              name="comment"
              placeholder="Your opinion here"
            />
            <button type="submit">Comment</button>
          </form>
        </div>
    `;

    this.querySelector('message-board-comment-list').setAttribute('comments', JSON.stringify(this.state.comments));
    this.querySelector('message-board-comment-list').setAttribute('searchText', JSON.stringify(this.state.searchText));

    // add event listeners
    this.querySelector('nav form').addEventListener('submit', this.handleSearchSubmit);
    this.querySelector('nav form input').addEventListener('input', this.handleResponsiveSearchSubmit);
    this.querySelector('.add-comment form').addEventListener('submit', this.handleAddComment);
  }
  /**
   * Filters comments by a substring contained in the text
   * @param {string} substring Substring to be filtered
   * @returns {array} Filtered array of comment objects
   */
  filterSearchByText = (substring = '') =>
    this.state.comments.filter(comment => comment.text.toLowerCase().includes(substring.toLowerCase()));

  handleResponsiveSearchSubmit = event => {
    const searchText = event.target.value;
    this.setState({ searchText });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    const searchText = new FormData(event.target).get('search');
    const comments = this.api.filterCommentsByText(searchText);
    this.setState({ comments });
  };

  handleAddComment = event => {
    event.preventDefault();
    const commentText = new FormData(event.target).get('comment');
    event.target.reset();
    const updatedComments = this.api.addComment(commentText);
    this.setState({ comments: updatedComments });
  };

  handleRemoveComment = event => {
    const confirmed = window.confirm(`Really delete "${event.detail}" ?`);
    if (confirmed) {
      const updatedComments = this.api.removeComment(event.target.comment.id);
      this.setState({ comments: updatedComments });
    }
  };
}

export default MessageBoardApp;
