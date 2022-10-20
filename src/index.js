import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs= {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery')
}

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30743258-d8407cc281d6c3ad648c29387';



async function fetchPhotos(q){
  try {
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`);
console.log(response);
  } catch (error) {
    console.log(error);
  }};

  
fetchPhotos('dog');

 