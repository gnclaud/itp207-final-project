const tmdbApiKey = "f90eff7cc01723f6dc16ac490ce782bb";
const youtubeApiKey = "AIzaSyCwVSBey_d3lXGUHh54mTMFZvclOLF_4mE";
const movieDetailsDiv = document.getElementById("movie-details");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

fetchMovieDetails(movieId);

function fetchMovieDetails(movieId) {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US`;
    fetch(tmdbUrl)
        .then((response) => response.json())
        .then((movie) => {
            if (movie) {
                displayMovieDetails(movie);
            } else {
                movieDetailsDiv.innerHTML = `<p>Movie not found.</p>`;
            }
        })
        .catch((error) => {
            console.error("Error fetching movie details:", error);
            movieDetailsDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        });
}

function displayMovieDetails(movie) {
    const { title, overview, release_date, vote_average, poster_path } = movie;
    const poster = poster_path
        ? `https://image.tmdb.org/t/p/w300${poster_path}`
        : "assets/placeholder.png";

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        title
    )} trailer&key=${youtubeApiKey}`;

    fetch(youtubeUrl)
        .then((response) => response.json())
        .then((data) => {
            const videoId = data.items[0]?.id?.videoId || null;
            movieDetailsDiv.innerHTML = `
                <h2>${title} (${release_date.slice(0, 4)})</h2>
                <img src="${poster}" alt="${title}" style="width: 300px; border-radius: 5px;">
                <p>${overview || "No description available."}</p>
                <p><strong>Rating:</strong> ${vote_average || "N/A"}/10</p>
                ${
                    videoId
                        ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
                        : `<p>No trailer available.</p>`
                }
            `;
        })
        .catch((error) => {
            console.error("Error fetching YouTube data:", error);
            movieDetailsDiv.innerHTML = `
                <h2>${title} (${release_date.slice(0, 4)})</h2>
                <img src="${poster}" alt="${title}" style="width: 300px; border-radius: 5px;">
                <p>${overview || "No description available."}</p>
                <p><strong>Rating:</strong> ${vote_average || "N/A"}/10</p>
                <p>Details fetched, but no trailer available.</p>
            `;
        });
}

function goBack() {
    const lastView = localStorage.getItem("lastView");
    const lastQuery = localStorage.getItem("lastQuery");

    if (lastView === "popular") {
        window.location.href = "index.html";
    }
    if (lastView === "search" && lastQuery) {
        window.location.href = `search.html?query=${encodeURIComponent(lastQuery)}`;
    } else {
        window.location.href = "index.html";
    }
}