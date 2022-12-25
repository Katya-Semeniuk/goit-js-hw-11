import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicturesApiService from './api-service';

import getRefs from './get-refs';
const refs = getRefs();


refs.formEl.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

const picturesApiService = new PicturesApiService();

function onSearch(e) {
    e.preventDefault();
    
    picturesApiService.query = e.currentTarget.elements.searchQuery.value;
    if (picturesApiService.query === '') {
         Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                return;
    }
    picturesApiService.resetPage();
  picturesApiService.fetchArticles().then(data => {
    let { hits, totalHits } = data;
    let succsessTotalNumber = totalHits;
    const pictures = hits;
    successNotify(succsessTotalNumber);
        cleanGalleryContainer();
        createPicturesMarkup(pictures);
    });
   ;
    
};

function onLoadMore() {
    picturesApiService.fetchArticles().then(createPicturesMarkup); 
};


// /picrures
function createPicturesMarkup(pictures) {
    const markupPictures = pictures
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
}

function cleanGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function successNotify(succsessTotalNumber) {
  Notify.success(`Hooray! We found ${succsessTotalNumber} images`);
}