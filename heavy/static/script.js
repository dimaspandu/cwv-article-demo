// script.js - Handles dynamic content generation and comment management for the blog page

// Global variable to store comments data
let commentsData = [];

// Function to generate long article content with placeholder text and inline ads
function generateLongContent() {
  const contentContainer = document.getElementById("long-content");
  if (!contentContainer) return; // Exit if container not found

  let longText = "";
  // Generate 20 paragraphs of Lorem Ipsum text with ads inserted every 8 paragraphs
  for (let i = 0; i < 20; i++) {
    longText += `
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    `;

    // Insert ad every 8 paragraphs
    if ((i + 1) % 8 === 0 && i < 19) { // Avoid ad at the very end
      longText += `
        <div class="content-ad">
          <div class="content-ad__content">
            <span class="content-ad__label">Sponsored</span>
            <h4>Enhance Your Writing Skills</h4>
            <p>Discover tools to improve your content creation and reach more readers.</p>
            <a href="#" class="content-ad__cta">Explore Now</a>
          </div>
          <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=300" alt="Writing tools advertisement">
        </div>
      `;
    }
  }

  // Add content after a delay to simulate loading
  setTimeout(() => {
    contentContainer.innerHTML = longText;
  }, 1200);
}

// Function to fetch comments from JSON file
async function fetchComments() {
  try {
    const response = await fetch('comments.json');
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    commentsData = await response.json();
    return commentsData;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Function to generate HTML for a single comment
function generateCommentHTML(comment, isChild = false) {
  const commentClass = isChild ? 'comment comment--child' : 'comment';
  return `
    <div class="${commentClass}" data-comment-id="${comment.id}">
      <div class="comment__avatar"></div>
      <div class="comment__content">
        <div class="comment__bubble">
          <strong>${comment.name}</strong>
          <span class="comment__date">${comment.date}</span>
          <p>${comment.text}</p>
        </div>
        ${!isChild ? '<span class="comment__reply" data-reply-to="' + comment.id + '">Reply</span>' : ''}
        ${comment.replies ? comment.replies.map(reply => generateCommentHTML(reply, true)).join('') : ''}
      </div>
    </div>
  `;
}

// Function to render all comments
function renderComments(comments) {
  const commentsContainer = document.getElementById("comments-generated");
  if (!commentsContainer) return;

  const commentsHTML = comments.map(comment => generateCommentHTML(comment)).join('');
  commentsContainer.innerHTML = commentsHTML;

  // Update comment count
  const commentCountElement = document.querySelector('.comments h2');
  if (commentCountElement) {
    commentCountElement.textContent = `${comments.length} Comments`;
  }
}

// Function to handle comment form submission
function handleCommentSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const commentText = formData.get('comment');
  const name = formData.get('name');
  const email = formData.get('email');
  const website = formData.get('website');

  // Validate required fields
  if (!commentText || !name || !email) {
    alert('Please fill in all required fields.');
    return;
  }

  // Create new comment object
  const newComment = {
    id: Date.now(), // Simple ID generation
    name: name,
    date: new Date().getFullYear().toString(),
    text: commentText,
    replies: []
  };

  // Add to comments data
  commentsData.push(newComment);

  // Re-render comments
  renderComments(commentsData);

  // Reset form
  form.reset();

  // Scroll to the new comment
  const newCommentElement = document.querySelector(`[data-comment-id="${newComment.id}"]`);
  if (newCommentElement) {
    newCommentElement.scrollIntoView({ behavior: 'smooth' });
  }
}

// Function to handle reply button clicks
function handleReplyClick(event) {
  if (!event.target.classList.contains('comment__reply')) return;

  const commentId = parseInt(event.target.getAttribute('data-reply-to'));
  const commentElement = event.target.closest('.comment');

  // Remove any existing reply forms
  document.querySelectorAll('.reply-form').forEach(form => form.remove());

  // Create reply form
  const replyForm = document.createElement('form');
  replyForm.className = 'reply-form comment-form';
  replyForm.innerHTML = `
    <div>
      <label for="reply-text-${commentId}">Reply</label>
      <textarea id="reply-text-${commentId}" name="comment" placeholder="Write your reply..." required></textarea>
    </div>
    <div>
      <label for="reply-name-${commentId}">Name</label>
      <input id="reply-name-${commentId}" name="name" type="text" placeholder="Your Name" required>
    </div>
    <div>
      <label for="reply-email-${commentId}">Email</label>
      <input id="reply-email-${commentId}" name="email" type="email" placeholder="your.email@example.com" required>
    </div>
    <div>
      <label for="reply-website-${commentId}">Website</label>
      <input id="reply-website-${commentId}" name="website" type="url" placeholder="https://yourwebsite.com">
    </div>
    <button type="submit">Post Reply</button>
    <button type="button" class="cancel-reply">Cancel</button>
  `;

  // Add event listener for reply form submission
  replyForm.addEventListener('submit', function(replyEvent) {
    replyEvent.preventDefault();
    handleReplySubmit(replyEvent, commentId);
  });

  // Add cancel button functionality
  replyForm.querySelector('.cancel-reply').addEventListener('click', function() {
    replyForm.remove();
  });

  // Insert reply form after the comment content
  commentElement.querySelector('.comment__content').appendChild(replyForm);
}

// Function to handle reply form submission
function handleReplySubmit(event, parentCommentId) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const replyText = formData.get('comment');
  const name = formData.get('name');
  const email = formData.get('email');

  // Validate required fields
  if (!replyText || !name || !email) {
    alert('Please fill in all required fields.');
    return;
  }

  // Create new reply object
  const newReply = {
    id: Date.now(),
    name: name,
    date: new Date().getFullYear().toString(),
    text: replyText
  };

  // Find parent comment and add reply
  const parentComment = commentsData.find(comment => comment.id === parentCommentId);
  if (parentComment) {
    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    parentComment.replies.push(newReply);

    // Re-render comments
    renderComments(commentsData);
  }
}

// Initialize dynamic content when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function() {
  generateLongContent();

  // Fetch and render comments
  const comments = await fetchComments();
  renderComments(comments);

  // Add event listener for main comment form
  const commentForm = document.querySelector('.comment-form form');
  if (commentForm) {
    commentForm.addEventListener('submit', handleCommentSubmit);
  }

  // Add event listener for reply buttons (using event delegation)
  const commentsContainer = document.getElementById('comments-generated');
  if (commentsContainer) {
    commentsContainer.addEventListener('click', handleReplyClick);
  }
});