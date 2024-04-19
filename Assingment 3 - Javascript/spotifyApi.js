const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = 'db764bebc4244ffeb1bbd0ce58647216';
const redirectUri = encodeURIComponent('http://15.222.122.223/~Enrique200512266/Assingment%203%20-%20Javascript/');
const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private'
]; 

document.addEventListener('DOMContentLoaded', function() {
    const token = getAccessTokenFromHash();
    if (token) {
        sessionStorage.setItem('spotifyToken', token);
    }
    manageUIBasedOnToken();
});

function getAccessTokenFromHash() {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
        if (item) {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    window.location.hash = '';
    return hash.access_token;
}

function manageUIBasedOnToken() {
    const token = sessionStorage.getItem('spotifyToken');
    document.getElementById('login-section').style.display = token ? 'none' : 'block';
    document.getElementById('action-section').style.display = token ? 'block' : 'none';
}

document.getElementById('fetch-data').addEventListener('click', function() {
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    window.location = authUrl;
});

document.getElementById('get-playlists').addEventListener('click', () => fetchData('https://api.spotify.com/v1/me/playlists'));
document.getElementById('search-music').addEventListener('click', () => {
    const query = document.getElementById('search-query').value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }
    fetchData(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`);
});

function fetchData(url) {
    const token = sessionStorage.getItem('spotifyToken');
    if (!token) {
        console.error('Authentication token is not available.');
        alert('Please login to fetch data.');
        return;
    }
    fetch(url, {
        headers: {'Authorization': `Bearer ${token}`}
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        displayPlaylists(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data: ' + error.message);
    });
}

function displayPlaylists(data) {
    const container = document.getElementById('result');
    container.innerHTML = '';
    const playlists = data.items || [];
    if (playlists.length === 0) {
        container.innerHTML = '<p>No playlists found or failed to load playlists.</p>';
        return;
    }
    playlists.forEach(playlist => {
        const element = document.createElement('div');
        element.className = 'playlist';
        element.innerHTML = `
            <h3>${playlist.name}</h3>
            <p>${playlist.description || 'No description available'}</p>
            <img src="${playlist.images[0] ? playlist.images[0].url : 'default-image.png'}" alt="${playlist.name}" style="width: 200px; height: auto;">
            <p>Tracks: ${playlist.tracks.total}</p>
            <a href="${playlist.external_urls.spotify}" target="_blank">Open in Spotify</a>
        `;
        container.appendChild(element);
    });
}