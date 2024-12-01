const omdbApiKey = "e29bddc4";
const resultsDiv = document.getElementById("results");

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (query) {
        localStorage.setItem("lastQuery", query);
        localStorage.setItem("lastView", "search");
        searchMovies(query);
    } else {
        resultsDiv.innerHTML = `<p>No search query provided. Please try again.</p>`;
    }
    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document.getElementById("query").value.trim();
        if (query) {
            // Update the URL with the new query string and reload the page
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    });
});

function searchMovies(query) {
    const omdbUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${omdbApiKey}`;
    fetch(omdbUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === "True") {
                displaySearchResults(data.Search);
            } else {
                resultsDiv.innerHTML = `<p>No results found. Try a different query.</p>`;
            }
        })
        .catch((error) => {
            console.error("Error fetching OMDb data:", error);
            resultsDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        });
}

function displaySearchResults(movies) {
    resultsDiv.innerHTML = `
        <h2>Search Results</h2>
        <div class="movie-list">
            ${movies
                .map(
                    (movie) => ` 
                    <div class="movie-card">
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/placeholder.png"}" alt="${movie.Title}">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year.slice(0, 4)}</p>
                        <button onclick="viewMovieDetails('${movie.imdbID}')">View Details</button>
                    </div>`
                )
                .join("")}
        </div>
    `;
}

function viewMovieDetails(movieId) {
    window.location.href = `details.html?id=${movieId}`;
}
