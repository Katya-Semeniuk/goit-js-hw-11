const API_KEY = '32332367-6643b5098e6f829f8817b33dd';
const BASE_URL = 'https://pixabay.com/api';
import axios from "axios";


export default class PicturesApiService {
    constructor() { 
        this.searchQuery = '';
        this.page = 1;
    }
      async getPictures() {
        const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
  const response = await axios.get(url);
        this.page += 1;
return response.data}

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


