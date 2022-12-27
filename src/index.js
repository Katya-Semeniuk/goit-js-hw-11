import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PicturesApiService from './api-service';

import getRefs from './get-refs';
const refs = getRefs();

refs.formEl.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

const picturesApiService = new PicturesApiService();

let gallery = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
});

makeBtnLoadMoreHidden();


async function onSearch(e) {  
  try {
      e.preventDefault();
  picturesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  
  if (picturesApiService.query === '') {
    failedRequestNotify()
    return;
  };

  picturesApiService.resetPage();
    await picturesApiService.getPictures()
    .then(data => {
      let { hits, totalHits } = data;
      let pictures = hits;
      
       if (pictures.length === 0) {
        unsuccessfulNotify()
          return;
  }; 
     cleanGalleryContainer(); 
     createPicturesMarkup(pictures);
       successNotify(totalHits);
    makeBtnLoadMoreVisible();
    })
   } catch (error) {
    console.log(error)
  }
  
};


async function onLoadMore() {
  try {
   await  picturesApiService.getPictures().then(data => {
    let { hits, totalHits } = data;
    let pictures = hits;
  
    createPicturesMarkup(pictures);
    if (pictures.length === 0 && totalHits > 0 ) {
         reachedEndSearch();
         return;
      }
  });
} catch(error){console.log(error)}
  };

function createPicturesMarkup(pictures) {
    const markupPictures = pictures
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
                  <b>Likes</b>
                <span class="subtitle">'${likes}'</span>  
    </p>
    <p class="info-item">
                  <b>Views</b>
                  <span class="subtitle">'${views}</span> '
    </p>
    <p class="info-item">
                  <b>Comments</b>
                  <span class="subtitle">'${comments}'</span>
    </p>
    <p class="info-item">
                  <b>Downloads</b>
                <span class="subtitle">'${downloads}' </span> 
    </p>
  </div>
</div>`)
        .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markupPictures)
  
gallery.refresh();
};

function cleanGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
};

function makeBtnLoadMoreVisible() {
  refs.btnLoadMore.hidden = false;
};

function makeBtnLoadMoreHidden() {
  refs.btnLoadMore.hidden = true;
};

function successNotify(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images`);
};

function unsuccessfulNotify() {
   Notify.failure('Sorry, there are no images matching your search query. Please try again.');
};

function failedRequestNotify() {
  Notify.failure('Try to write the correct name');
};
 
      
function reachedEndSearch() {
  Notify.warning("We're sorry, but you've reached the end of search results.")
  makeBtnLoadMoreHidden();
}



// const { height: cardHeight } = document.querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });