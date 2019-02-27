import MessageBoardAPI, { commentData } from '../MessageBoardAPI.js';

class MessageBoardApp extends HTMLElement {
  constructor() {
    super();
    this.api = new MessageBoardAPI(commentData);
    // Do not put asynchronous code in a constructor...
    this.state = {
      comments: [],
      search: '',
      loading: true,
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

      // ANDREW: THIS MUST DETECT AN ATTRIBUTE 'LOADING' TO WORK!!
      this.querySelectorAll(`[${key}]`).forEach(element => {
        // calls the setter in the commentList class
        // OR... element.setAttribute(key, newState[key]);
        element[key] = newState[key];
      });
    });
  }

  connectedCallback() {
    // data can be updated when the browser is attempting to render.
    this.api.getComments().then(comments => {
      this.setState({ comments, loading: false });
    });

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
        <message-board-loader loading='true'></message-board-loader>
    `;

    this.querySelector('message-board-comment-list').setAttribute('comments', JSON.stringify(this.state.comments));
    this.querySelector('message-board-comment-list').setAttribute('search', JSON.stringify(this.state.search));

    // add event listeners
    this.querySelector('nav form').addEventListener('submit', this.handleSearchSubmit);
    this.querySelector('nav form input').addEventListener('input', this.handleResponsiveSearchSubmit);
    this.querySelector('.add-comment form').addEventListener('submit', this.handleAddComment);
  }

  handleResponsiveSearchSubmit = event => {
    const search = event.target.value;
    this.setState({ search });
  };

  handleSearchSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const search = new FormData(event.target).get('search');
    const comments = await this.api.filterCommentsByText(search);
    this.setState({ comments, loading: false });
  };

  handleAddComment = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const commentText = new FormData(event.target).get('comment');
    event.target.reset();
    const updatedComments = await this.api.addComment(commentText);
    this.setState({ comments: updatedComments, loading: false });
  };

  handleRemoveComment = async event => {
    this.setState({ loading: true });
    const confirmed = window.confirm(`Really delete "${event.detail}" ?`);
    if (confirmed) {
      const updatedComments = await this.api.removeComment(event.target.comment.id);
      this.setState({ comments: updatedComments, loading: false });
    }
  };
}

export default MessageBoardApp;
