const tmdbApiKey = "f90eff7cc01723f6dc16ac490ce782bb";
const popularDiv = document.getElementById("popular-movies");

document.addEventListener("DOMContentLoaded", function () {
    fetchPopularMovies();
});

function fetchPopularMovies() {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1`;
    fetch(tmdbUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.results && data.results.length > 0) {
                displayPopularMovies(data.results);
                localStorage.setItem("lastView", "popular");
            } else {
                popularDiv.innerHTML = `<p>No popular movies found. Please try again later.</p>`;
            }
        })
        .catch((error) => {
            console.error("Error fetching popular movies:", error);
            popularDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        });
}

function displayPopularMovies(movies) {
    popularDiv.innerHTML = `
        <div class="popular-section">
        <h2>Popular Movies</h2>
        <div class="movie-list">
            ${movies
                .map(
                    (movie) => `
                        <div class="movie-card">
                            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                            <h3>${movie.title}</h3>
                            <p>${movie.release_date.slice(0, 4)}</p>
                            <button onclick="viewMovieDetails(${movie.id})">View Details</button>
                        </div>`
                )
                .join("")}
        </div>
    `;
}

function viewMovieDetails(movieId) {
    window.location.href = `details.html?id=${movieId}`;
}

document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("query").value.trim();
    if (query) {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
});
