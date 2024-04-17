const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = 'db764bebc4244ffeb1bbd0ce58647216';
const redirectUri = 'http%3A%2F%2F15.222.122.223%2F~Enrique200512266%2FAssingment%25203%2520-%2520Javascript%2F'; 
const scopes = [
    'user-read-private', 
    'user-read-email'
];

document.getElementById('fetch-data').addEventListener('click', function() {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
});