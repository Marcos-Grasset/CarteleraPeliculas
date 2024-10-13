const peliculas = {
  "Guason 2 Folie a Deux": "./images/guason.jpg",
  "Transformers UNO": "./images/transformers.jpg",
  "Alien Romulus": "./images/alien.jpg",
  "Beetlejuice": "./images/beetlejuice.jpg",
  "Intensa Mente 2": "./images/intensamente.jpeg",
  "Sonríe 2": "./images/sonrie.jpeg",
  "Deadpool & Wolverine": "./images/deadpool.jpg",
  "Alice": "./images/alice.jpg",
  "Carnada": "./images/carnada.jpg",
  "Deep Web": "./images/deep web.jpg",
  "Hellboy": "./images/hellboy.jpg",
  "Mi Villano Favorito 4": "./images/mi villano favorito 4.jpg",
};

function irAReseña(pelicula) {
  const peliculaData = {
    nombre: pelicula,
    imagen: peliculas[pelicula],
  };
  localStorage.setItem("peliculaSeleccionada", JSON.stringify(peliculaData));
  window.location.href = "reseñar.html";
}

function actualizarRanking() {
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  const puntuaciones = {};

  reseñas.forEach((reseña) => {
    if (!puntuaciones[reseña.pelicula]) {
      puntuaciones[reseña.pelicula] = { total: 0, count: 0 };
    }
    puntuaciones[reseña.pelicula].total += reseña.estrellas;
    puntuaciones[reseña.pelicula].count++;
  });

  const peliculasOrdenadas = Object.keys(peliculas)
    .sort(
      (a, b) => (puntuaciones[b]?.total || 0) - (puntuaciones[a]?.total || 0)
    )
    .slice(0, 10);

  peliculasOrdenadas.forEach((pelicula) => {
    const li = document.createElement("li");
    li.textContent = `${pelicula}: `;

    const totalEstrellas = puntuaciones[pelicula]?.total || 0;
    for (let i = 1; i <= 5; i++) {
      const estrella = document.createElement("span");
      estrella.textContent = "★";
      estrella.style.color = i <= totalEstrellas ? "gold" : "black";
      li.appendChild(estrella);
    }

    const editarBtn = document.createElement("button");
    editarBtn.textContent = "Editar";
    editarBtn.classList.add("editar-btn");
    editarBtn.onclick = () => editarReseña(pelicula);

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.classList.add("eliminar-btn");
    eliminarBtn.onclick = () => eliminarReseña(pelicula);

    li.appendChild(editarBtn);
    li.appendChild(eliminarBtn);

    rankingList.appendChild(li);
  });
}
function editarReseña(pelicula) {
  const reseñas = JSON.parse(localStorage.getItem('reseñas')) || [];
  const reseña = reseñas.find(r => r.pelicula === pelicula);
  if (reseña) {
      const nuevoComentario = prompt('Editar comentario:', reseña.comentario);
      const nuevasEstrellas = prompt('Editar estrellas (1-5):', reseña.estrellas);

      if (nuevoComentario && nuevasEstrellas >= 1 && nuevasEstrellas <= 5) {
          reseña.comentario = nuevoComentario;
          reseña.estrellas = parseInt(nuevasEstrellas);

          localStorage.setItem('reseñas', JSON.stringify(reseñas));
          alert('Reseña actualizada');
          actualizarRanking();
      } else {
          alert('Número inválido. Asegúrate de ingresar una puntuación entre 1 y 5.');
      }
  } else {
      alert('Reseña no encontrada.');
  }
}

function eliminarReseña(pelicula) {
  let reseñas = JSON.parse(localStorage.getItem('reseñas')) || [];
  const reseña = reseñas.find(r => r.pelicula === pelicula);

  if (reseña) {
      reseña.estrellas = 0; 
      localStorage.setItem('reseñas', JSON.stringify(reseñas));

      alert('Reseña eliminada.');
      actualizarRanking();
  } else {
      alert('Reseña no encontrada.');
  }
}

let currentIndex = 0;
const peliculasKeys = Object.keys(peliculas);
const carouselContainer = document.querySelector('.carousel');
const peliculasVisibles = 5;

function mostrarPeliculas() {
  carouselContainer.innerHTML = '';

  for (let i = currentIndex; i < currentIndex + peliculasVisibles; i++) {
    const peliculaKey = peliculasKeys[i % peliculasKeys.length];
    const peliculaImg = peliculas[peliculaKey];

    const peliculaDiv = document.createElement('div');
    peliculaDiv.classList.add('pelicula');

    const img = document.createElement('img');
    img.src = peliculaImg;
    img.alt = peliculaKey;

    const p = document.createElement('p');
    p.textContent = peliculaKey;

    const btn = document.createElement('button');
    btn.textContent = 'Reseñar';
    btn.onclick = () => irAReseña(peliculaKey);

    peliculaDiv.appendChild(img);
    peliculaDiv.appendChild(p);
    peliculaDiv.appendChild(btn);
    carouselContainer.appendChild(peliculaDiv);
  }
}

function moverCarousel(direction) {
  currentIndex = (currentIndex + direction + peliculasKeys.length) % peliculasKeys.length;
  mostrarPeliculas();
}

mostrarPeliculas();
actualizarRanking();