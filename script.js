const container = document.getElementById('user-container');
const reloadBtn = document.getElementById('reload');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

async function fetchGitHubUsers() {
  container.innerHTML = 'Loading...';
  try {
    const res = await fetch('https://api.github.com/users');
    if (!res.ok) throw new Error('Failed to fetch GitHub users.');
    const users = await res.json();

    container.innerHTML = '';
    users.forEach(user => createUserCard(user));
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.login}">
    <p><strong>${user.login}</strong></p>
    <div class="user-details" style="display: none;">Loading...</div>
  `;

  let isExpanded = false;

  card.addEventListener('click', async () => {
    const detailsDiv = card.querySelector('.user-details');
    if (isExpanded) {
      detailsDiv.style.display = 'none';
      isExpanded = false;
      return;
    }

    try {
      const res = await fetch(`https://api.github.com/users/${user.login}`);
      const full = await res.json();

      detailsDiv.innerHTML = `
        <p><strong>Name:</strong> ${full.name || full.login}</p>
        <p><strong>Bio:</strong> ${full.bio || 'N/A'}</p>
        <p><strong>Location:</strong> ${full.location || 'N/A'}</p>
        <p><strong>Followers:</strong> ${full.followers}</p>
        <p><strong>Following:</strong> ${full.following}</p>
        <div class="github-button-wrapper">
          <a href="${full.html_url}" target="_blank" class="github-link">View on GitHub</a>
        </div>
      `;
    } catch {
      detailsDiv.innerHTML = '<p style="color:red;">Failed to load details.</p>';
    }

    detailsDiv.style.display = 'block';
    isExpanded = true;
  });

  container.appendChild(card);
}

// Search user by username
searchBtn.addEventListener('click', async () => {
  const username = searchInput.value.trim();
  if (!username) return;

  container.innerHTML = 'Searching...';

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error('User not found');
    const user = await res.json();

    container.innerHTML = '';
    createUserCard(user);
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
});

reloadBtn.addEventListener('click', fetchGitHubUsers);
window.addEventListener('load', fetchGitHubUsers);
