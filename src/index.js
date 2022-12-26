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


function onSearch(e) {
    e.preventDefault();
    
  picturesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  
  if (picturesApiService.query === '') {
    failedRequest()
    return;
  };

  picturesApiService.resetPage();
  picturesApiService.fetchArticles()
    .then(data => {
      if (data.hits.length === 0) {
        unsuccessfulNotify()
          return;
  };
    let { hits, totalHits } = data;
    let succsessTotalNumber = totalHits;
      let pictures = hits;

     cleanGalleryContainer(); 
    successNotify(succsessTotalNumber);
    createPicturesMarkup(pictures);
    makeBtnLoadMoreVisible();
    })
};

function onLoadMore() {
  picturesApiService.fetchArticles().then(data => {
    let { hits} = data;
  let pictures = hits;
  createPicturesMarkup(pictures)
  }); 
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

function successNotify(succsessTotalNumber) {
  Notify.success(`Hooray! We found ${succsessTotalNumber} images`);
};

function unsuccessfulNotify() {
   Notify.failure('Sorry, there are no images matching your search query. Please try again.');
};

function failedRequest() {
  Notify.failure('Try to write the correct name');
};
// let restOfPhotos = response.data.totalHits - pixabayAPIService.page * pixabayAPIService.perPage;
//       if (restOfPhotos <= 0) {
//         reachedEndSearch();
//         return;
// } 
      
// function reachedEndSearch() {
//   Notify.warning("We're sorry, but you've reached the end of search results.")
//   makeBtnLoadMoreHidden()
// }



// const lightbox = new SimpleLightbox('.gallery a', {
//     captionsData: "alt",
//     captionDelay: 250,
// });