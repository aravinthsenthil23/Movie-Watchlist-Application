if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service worker active'))
            .catch(err => console.log('Registration failed', err))
    });
}

let movies_container = document.getElementById("movies-container")
let movies_lists = JSON.parse(localStorage.getItem('myWatchList')) || []
let index = 0;

document.getElementById("search-btn").addEventListener("click", async () => {
    const movie_name = document.getElementById("search-value").value
    const res = await fetch(`https://www.omdbapi.com?apikey=574e9abd&s=${movie_name}`)
    const data = await res.json()
    if (!data.response) {
        unableToFind()
    }
    movies_container.innerHTML = ""
    for (const movie of data.Search) {
        moviesList(movie)
    }

})

function unableToFind() {
    movies_container.style.setProperty("background-image", 'url("../img/unableToFind.png")')
}

movies_container.addEventListener('click', (event) => {

    if (event.target.classList.contains('watchlist')) {
        const imdbID = event.target.dataset.imdbid;
        const index = movies_lists.indexOf(imdbID);
        if (index === -1) {
            movies_lists.push(imdbID)
            event.target.innerHTML = 'Remove Watchlist<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z"/></svg>'
            alert("Movie added to your watchlist!")
        } else {
            movies_lists.splice(index, 1)
            event.target.innerHTML = 'Add Watchlist<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z"/></svg>'
            alert("Movie removed from your watchlist")
        }
        localStorage.setItem('myWatchList', JSON.stringify(movies_lists))
        
        console.log("Updated Local Storage : ", movies_lists)
    }


})

async function moviesList(movie) {
    movies_container.style.setProperty("background-image", 'none')
    const res = await fetch(`https://www.omdbapi.com?apikey=574e9abd&i=${movie.imdbID}`)
    const data = await res.json()

    const isAdded = movies_lists.includes(data.imdbID)
    const buttonText = isAdded ? 'Remove Watchlist' : 'Add Watchlist'
    movies_container.innerHTML += `
    <div class="movie">
        <img src="${data.Poster} "/>
        <artcle class="article">
            <div class="title-rating">
                <h4>${data.Title}</h4>
                <p class="rating"><svg xmlns="http://www.w3.org/2000/svg" height="17px" viewBox="0 -960 960 960" width="20px" fill="#ECB576"><path d="m332-264 148-113 148 113-56-182 148-106H538l-58-192-58 192H240l148 106-56 182ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>${data.imdbRating}</p>
            </div>
            <div class="time-genre-watchlist">
                <p class="runtime">${data.Runtime}</p>
                <p>${data.Genre}</p>
                <a class="watchlist" data-imdbid="${data.imdbID}" >${buttonText} <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z"/></svg></a>
            </div>
            <p class="plot">${data.Plot}<p>
        </article>
        
    </div>
    <hr />
    `
}




