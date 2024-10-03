const listaPelisDiv = document.getElementById('lista');
const API_URL = "https://japceibal.github.io/japflix_api/movies-data.json";

function showData(movies) {
    listaPelisDiv.innerHTML = '';
    movies.forEach(movie => {
        listaPelisDiv.innerHTML += `
        <li>
            <div class="pb-3 mb-0 small lh-sm border-bottom w-100" onclick="mostrarInformacion(${movie.id})">
                <div class="d-flex justify-content-between">
                    <strong class="text-white">${movie.title}</strong>
                    <div>${puntajeEstrellas(movie.vote_average)}</div>
                </div>
                <span class="d-block text-secondary fst-italic">${movie.tagline}</span>
            </div>
        </li>
        `;  
    }); 
}
function puntajeEstrellas(votos) {
    const stars = Math.round(votos / 2);
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if(stars >= i)
            estrellas += `<span class="fa fa-star checked"></span>`;
        else {
            estrellas += `<span class="fa fa-star"></span>`
        }
    }
    return estrellas;
}

function mostrarInformacion(id){
    const movie = allMovies.find(pelicula => pelicula.id === id);
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'offcanvas offcanvas-top show';
    detailsContainer.style.visibility = 'visible';
    detailsContainer.innerHTML = `
        <div class="offcanvas-header">
            <h5>${movie.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <p>${movie.overview}</p>
            <hr>
            <div class="d-flex justify-content-between">
                <p>${movie.genres.map((genero) => genero.name).join(' - ')} </p>
                <div>
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        More
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Year: ${new Date(movie.release_date).getFullYear()}</a></li>
                        <li><a class="dropdown-item" href="#">Runtime: ${movie.runtime}</a></li>
                        <li><a class="dropdown-item" href="#">Budget: $${movie.budget}</a></li>
                        <li><a class="dropdown-item" href="#">Revenue: $${movie.revenue}</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(detailsContainer);
    const offcanvas = new bootstrap.Offcanvas(detailsContainer);
    offcanvas.show();
}

document.getElementById('btnBuscar').addEventListener('click', function () {
    const searchTerm = document.getElementById('inputBuscar').value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => {
        const title = movie.title ? movie.title.toLowerCase() : '';
        const tagline = movie.tagline ? movie.tagline.toLowerCase() : '';
        const overview = movie.overview ? movie.overview.toLowerCase() : '';
        return title.includes(searchTerm) ||  movie.genres.some((genero) => genero.name.toLowerCase().includes(searchTerm)) || tagline.includes(searchTerm) || overview.includes(searchTerm);
    });
    showData(filteredMovies);
});    

let allMovies = [];

function getAPIData(url) {
    return fetch(url)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        allMovies = data; // Guardamos los productos en la variable global
    })
    .catch((error) => {
        console.error("Hubo un problema con el fetch:", error);
    });
}

getAPIData(API_URL);