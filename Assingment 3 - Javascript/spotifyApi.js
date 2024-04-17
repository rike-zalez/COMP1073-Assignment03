const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = 'db764bebc4244ffeb1bbd0ce58647216';
const redirectUri = encodeURIComponent('http://15.222.122.223/~Enrique200512266/Assingment%203%20-%20Javascript/');
const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'user-read-recently-played'
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
    if (token) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('action-section').style.display = 'block';
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('action-section').style.display = 'none';
    }
}

document.getElementById('fetch-data').addEventListener('click', function() {
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    window.location = authUrl;
});

document.getElementById('get-playlists').addEventListener('click', () => fetchData('https://api.spotify.com/v1/me/playlists'));
document.getElementById('get-recent-tracks').addEventListener('click', () => fetchData('https://api.spotify.com/v1/me/player/recently-played'));
document.getElementById('search-music').addEventListener('click', () => {
    const query = document.getElementById('search-query').value;
    fetchData(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`);
});

function fetchData(url) {
    const token = sessionStorage.getItem('spotifyToken');
    if (!token) {
        console.error('Authentication token is not available.');
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
        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('Error fetching data:', error));
}

