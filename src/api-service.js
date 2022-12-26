const API_KEY = '32332367-6643b5098e6f829f8817b33dd';
const BASE_URL = 'https://pixabay.com/api';

export default class PicturesApiService {
    constructor() { 
        this.searchQuery = '';
        this.page = 1;
    }

    fetchArticles() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=5`;

     return fetch(url)
    .then(responce => responce.json())
         .then(data => {
        this.page +=1;
      return data;
   }) 

    }
    resetPage(){
   this.page = 1;
    }

    get query(){
       return this.searchQuery;
    }

    set query(newQuery){
     this.searchQuery = newQuery;   
    }
}