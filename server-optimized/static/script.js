// script.js - Handles comment management and interactions for the blog page

// Global variable to store comments data
let commentsData = [];

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

// Function to fetch data from JSON
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to render related posts
function renderRelated(data) {
  const container = document.querySelector('.related');
  if (!container || !data) return;

  const html = `
    <div class="related__grid">
      ${data.map(item => `
        <div class="related__card">
          <img src="${item.img}" alt="${item.alt}" loading="lazy">
          <p>${item.title}</p>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = `<h2>You May Also Like</h2>${html}`;
}

// Function to render post list (popular/latest)
function renderPostList(data, title) {
  if (!data) return '';

  return `
    <div class="post-list">
      ${data.map(item => `
        <div class="post-list__item">
          <img src="${item.img}" alt="${item.alt}" loading="lazy">
          <div>
            <p>${item.title}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Function to render ads
function renderAds(data) {
  if (!data) return '';

  return `
    <div class="ads-grid">
      ${data.map(item => `
        <div class="ad-item">
          <img src="${item.img}" alt="${item.alt}" loading="lazy">
          <p>${item.text}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// Function to render partnership
function renderPartnership(data) {
  if (!data) return '';

  return `
    <p>${data.text}</p>
    <a href="${data.href}" class="partnership-cta">${data.cta}</a>
  `;
}

// Lazy load function
function lazyLoadSection(entry) {
  const element = entry.target;
  const src = element.getAttribute('data-src');

  if (src) {
    fetchData(src).then(data => {
      let html = '';

      if (element.classList.contains('related')) {
        renderRelated(data);
      } else if (element.querySelector('#popular-loading')) {
        html = renderPostList(data);
        element.innerHTML = `<h3>Popular Posts</h3>${html}`;
      } else if (element.querySelector('#latest-loading')) {
        html = renderPostList(data);
        element.innerHTML = `<h3>Latest Posts</h3>${html}`;
      } else if (element.querySelector('#ads-loading')) {
        html = renderAds(data);
        element.innerHTML = `<h3>Advertisement</h3>${html}`;
      } else if (element.querySelector('#partnership-loading')) {
        html = renderPartnership(data);
        element.innerHTML = `<h3>Partnership Opportunities</h3>${html}`;
      }

      element.classList.remove('lazy-load');
      element.removeAttribute('data-src');
    });
  }
}

// Initialize lazy loading
function initLazyLoading() {
  const lazyElements = document.querySelectorAll('.lazy-load');
  // Use smaller rootMargin for mobile devices
  const rootMargin = window.innerWidth < 768 ? '10px' : '50px';

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lazyLoadSection(entry);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin });

    lazyElements.forEach(element => observer.observe(element));
  } else {
    // Fallback for browsers without IO
    lazyElements.forEach(lazyLoadSection);
  }
}

// Initialize dynamic content when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function() {
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

  // Initialize lazy loading for sections
  initLazyLoading();
});