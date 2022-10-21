import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMapkup } from './createMarcup';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30743258-d8407cc281d6c3ad648c29387';
let page = 1;

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  if (refs.input.value === '') {
    Notiflix.Notify.failure('Please enter a keyword');
    return;
  }
  refs.gallery.innerHTML = '';
  page = 1;
  fetchPhotos(refs.input.value);
}

export async function fetchPhotos(q) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    console.log(response.data);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderImages(response.data.hits);
  } catch (error) {
    console.log(error);
  }
}

function renderImages(images) {
  const markup = createMapkup(images);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
