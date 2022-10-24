import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMapkup } from './createMarkup';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30743258-d8407cc281d6c3ad648c29387';
let page = 1;
let searchQuery = '';
const observerOpions = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onload, observerOpions);
const lightbox = new SimpleLightbox('.gallery a', {});
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.guard'),
};

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();

  if (refs.input.value.trim() === '') {
    Notiflix.Notify.failure('Please enter a keyword');
    return;
  }

  searchQuery = refs.input.value;
  refs.gallery.innerHTML = '';
  page = 1;

  const response = await fetchPhotos();

  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
  renderImages(response.data.hits);
  observer.observe(refs.guard);
  lightbox.refresh();
}

async function fetchPhotos() {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response;
  } catch (error) {
    observer.unobserve(refs.guard);
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
}

function renderImages(images) {
  const markup = createMapkup(images);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  page += 1;
}

function onload(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        const response = await fetchPhotos();
        renderImages(response.data.hits);
      } catch (error) {
        console.log(error);
      }
    }
  });
  lightbox.refresh();
}
