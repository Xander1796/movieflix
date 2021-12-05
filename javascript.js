'use strict';

const body = document.querySelector('body');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const loaderContainer = document.querySelector('.loader-container');
const movieflixHighlightContainer = document.querySelector('.movieflix-highlight-container');

const movieflixHighlightDivider = document.querySelector('.movieflix-highlight-divider');
const nav = document.querySelector('nav');
const navContentWrapper = document.querySelector('.nav-content-wrapper');
const navOptionLineAnim = document.querySelector('.nav-option-line-anim');
const navFavoritesButton = document.querySelector('.nav-favorites-button');
const navFavoritesButtonContainer = document.querySelector('.nav-favorites-button-container');
const navFavoritesButtonNotification = document.querySelector('.nav-favorites-button-notification');
const navOptions = document.querySelectorAll('.nav-options');
const navOptionActive = document.querySelector('.nav-option-active');
const movieOption = document.querySelector('.movie-option');
const searchDesktopInput = document.querySelector('.search-input');
const searchMobileContainer = document.querySelector('.search-mobile-container');
const searchMobileButton = document.querySelector('.search-mobile-icon');
const searchMobileInput = document.querySelector('.search-mobile-input');
const seriesOption = document.querySelector('.series-option');
const searchDesktopButton = document.querySelector('.nav-search-button');
const favoriteMoviesContainer = document.querySelector('.favorite-movies-container');
const favoriteMoviesWrapper = document.querySelector('.favorite-movies-wrapper');
const favoriteMoviesEmptyList = document.querySelector('.favorite-movies-empty-list');
const favoriteMoviesActionsContainer = document.querySelector('.favorite-movies-actions-container');
const favoriteMoviesActionRemoveButton = document.querySelector('.favorite-movies-action-remove-button');
const removeCheckOverlay = document.querySelector('.remove-check-overlay');
const removeCheckActionsWrapper = document.querySelector('.remove-check-actions-wrapper'); 
const closeRemoveCheckOverlay = document.querySelector('.close-remove-check-overlay'); 
const movieSection = document.querySelector('.movie-section');
const seriesSection = document.querySelector('.series-section');
const movieWrapper = document.querySelectorAll('.movie-wrapper');
const seriesWrapper = document.querySelectorAll('.series-wrapper');
const movieContainer = document.querySelectorAll('.movie-container');
const allMovieTvSection = document.querySelector('.all-movie-tv-section');
const allMovieTvTitle = document.querySelector('.all-movie-tv-title');
const allMovieTvWrapper = document.querySelector('.all-movie-tv-wrapper');
const allMovieTvResultsEnd = document.querySelector('.all-movie-tv-results-end');
const loadingSpinner = document.querySelector('.loading-spinner');
const seriesContainer = document.querySelectorAll('.series-container');
const searchSection = document.querySelector('.search-section');
const searchSectionWrapper = document.querySelector('.search-section-wrapper');
const noSearchResultsMessage = document.querySelector('.no-search-results-message');
const searchTitle = document.querySelector('.search-title');
const searchTitleContainer = document.querySelector('.search-title-container');
const searchLoadingSpinner = document.querySelector('.search-loading-spinner');
const leftArr = document.querySelectorAll('.left-arrow');
const rightArr = document.querySelectorAll('.right-arrow');
const movieTrailerContainer = document.querySelector('.movie-trailer-container');
const iframeContainer = document.querySelector('.iframe-container');
const nextPrevTrailerContainer = document.querySelector('.next-prev-trailer-container');
const prevTrailerTitle = document.querySelector('.prev-trailer-title');
const prevTrailerButton = document.querySelector('.prev-trailer-button');
const nextTrailerTitle = document.querySelector('.next-trailer-title');
const nextTrailerButton = document.querySelector('.next-trailer-button');
const currentTrailerNumber = document.querySelector('.current-trailer-number');
const totalTrailersNumber = document.querySelector('.total-trailers-number');
const movieTrailer = document.querySelector('iframe');
let addToFavoriteTrailer = document.querySelector('.add-to-favorite-trailer');
let addToFavoriteTrailerMessage = document.querySelector('.add-to-favorite-container-trailer .add-to-favorite-message');
let addToFavoriteContainerTrailer = document.querySelector('.add-to-favorite-container-trailer');
const noTrailersFound = document.querySelector('.no-trailers-found');
const numberOfTrailers = document.querySelector('.number-of-trailers');
const baseYoutubeUrl = 'https://www.youtube.com/embed/';
const closeInfoSectionMobile = document.querySelector('.close-info-section-mobile');
let movieTrailerUrl = [];
let countMovieTrailerUrl = 0;


let allSections = [movieSection, seriesSection, movieflixHighlightContainer, favoriteMoviesContainer, searchSection, allMovieTvSection];

let searchInput;
let searchButton;

window.innerWidth > 800 ? searchInput = searchDesktopInput : searchInput = searchMobileInput;
window.innerWidth > 800 ? searchButton = searchDesktopButton : searchButton = searchMobileButton;

let allMovieTvSectionCounter = 0;
let allMovieTvSectionTotalPages = 1;

let county = 0;
let infiniteCounter = 0;
let movieCount;
let wrapperChildren = [];
let movieInfoOverlayRemoveTimeout;
let itemWidth;
let itemMarginRight;
let itemsInView; 
const myApiKey = 'a751a969944e927701fba4a319575625';

let pageOffSet;

const movieflixLoaderContainerMarkup = `
<div class="movieflix-loader-container">
  <div class="movieflix-loader-title"></div>
  <div class="movieflix-loader-wrapper">
    <div class="loader-primary-1 loader-primary"></div>
    <div class="loader-primary-2 loader-primary"></div>
    <div class="loader-primary-3 loader-primary"></div>
    <div class="loader-primary-4 loader-primary"></div>
    <div class="loader-primary-5 loader-primary"></div>
    <div class="loader-primary-6 loader-primary"></div>
    <div class="loader-primary-7 loader-primary"></div>
    <div class="loader-primary-8 loader-primary"></div>
  </div>
</div>  
`;

const removeContentAllTvMoviesSection = function () {
  allMovieTvInit = false;
  thisIsLastPage = false;
  allMovieTvSectionTotalPages = 1;
  allMovieTvSectionCounter = 0;
  
  if(allMovieTvWrapper.querySelector('.all-movie-tv-results-end')) allMovieTvWrapper.querySelector('.all-movie-tv-results-end').remove(); 
  loadingSpinner.classList.remove('loading-spinner-active');

  let allMovieTvWrapperChildren = [...allMovieTvWrapper.children];

  if(allMovieTvWrapperChildren.length > 0) {
    for(const child of allMovieTvWrapperChildren) {
      child.querySelector('.img-title').removeEventListener('error', imgErrorListenerFunction);
      child.querySelector('.img-title').removeEventListener('load', imgLoadListenerFunction);
      child.remove();
    };
  };

  if(allMovieTvWrapperChildren.length === 0) allMovieTvController.abort();
};

const movieflixLoaderAnimation = function() {
  body.querySelectorAll('.loader-primary').forEach((loader, i) => loader.style.animation = `loader-primary-opacity-animation .2s ${i * .2}s ease forwards, loader-primary-background-animation 2s ${i * .2}s ease infinite`);
};

let navOptionLineAnimFunction = function() {
  navOptionLineAnim.style.left = `${nav.querySelector('.nav-option-active').getBoundingClientRect().left}px`;
  navOptionLineAnim.style.width = `${nav.querySelector('.nav-option-active').getBoundingClientRect().width}px`;
}

let navOptionLineAnimTimeout = setTimeout(navOptionLineAnimFunction, 300);

let windowInnerWidth = window.innerWidth;
let initialWindowHeight = window.innerHeight;
let initialWindowWidth = window.innerWidth;

window.addEventListener('resize', function() {
  windowInnerWidth = window.innerWidth;
  if(windowInnerWidth > 800 && searchMobileContainer.classList.contains('search-mobile-animation')) {
    if(searchInput.value.length > 0) {
      searchDesktopInput.value = searchInput.value;
      searchInput.value = '';
      outOfFocusSearchBar();

      searchInput = searchDesktopInput;
      searchButton = searchDesktopButton;
      activeSearchBar();

      inputTimeout = setTimeout(inputTimeoutFunction, 500);
    };

    if(searchMobileContainer.classList.contains('search-mobile-animation')) outOfFocusSearchBar(); 
  };

  if(windowInnerWidth <= 800 && searchInput.classList.contains('input-anim')) {
    if(searchInput.value.length > 0) {
      searchMobileInput.value = searchInput.value;
      searchInput.value = '';
      outOfFocusSearchBar();

      searchInput = searchMobileInput;
      searchButton = searchMobileButton;
      activeSearchBar();

      inputTimeout = setTimeout(inputTimeoutFunction, 300);
    };

    if(searchInput.classList.contains('input-anim')) outOfFocusSearchBar();
  };
  
  if(windowInnerWidth > 800 && !navOptionLineAnim.classList.contains('nav-option-line-anim-inactive')) {
    clearTimeout(navOptionLineAnimTimeout);
    navOptionLineAnimTimeout = setTimeout(navOptionLineAnimFunction, 300);
  };

  if(window.innerHeight < initialWindowHeight && initialWindowWidth < 500) {
    navContentWrapper.classList.add('nav-mobile-hidden-while-keyboard-open');
  } else if(window.innerHeight >= initialWindowHeight) {
    navContentWrapper.classList.remove('nav-mobile-hidden-while-keyboard-open');
  }
});

let movieInfoContainerActions = {
  movieInfoFunctionOpen: false,
  containerHiddenWhenPlayingTrailer: false
};

let hasSliderStopped = true;

let baseImgUrl;
let getBaseImgUrl = async function() {
  const baseUrlPromise = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${myApiKey}`);
  const baseUrlResponse = await baseUrlPromise.json();
  baseImgUrl = baseUrlResponse.images.secure_base_url;
};
getBaseImgUrl();

let movieCountFunction = function(res) {
  if(res.vote_count <= 0) return movieCount = ' Not yet rated';
  if(res.vote_count > 0 && res.vote_count < 1000) return movieCount = `${res.vote_count} votes`;
  if(res.vote_count >= 1000 && res.vote_count < 10000) return movieCount = `${res.vote_count.toString().slice(0, 1).concat(',').concat(res.vote_count.toString().slice(1))} votes`;
  if(res.vote_count >= 10000) return movieCount = `${res.vote_count.toString().slice(0, 2).concat(',').concat(res.vote_count.toString().slice(2))} votes`;
}

let scrollToTop = function() {
  window.scrollTo({top: 0});
};

scrollToTop();

let movieInfo;
let cardOverlay;
let movieRuntimes = [];
let favorites = new Array();

const wasLoaded = {
  movie: false,
  series: false,
  highlight: false
};

if(localStorage.getItem('favorites')) {
  if(JSON.parse(localStorage.getItem('favorites')).length > 0) favorites = JSON.parse(localStorage.getItem('favorites'));
};

let favoritesJSON;

window.addEventListener('load', function() {
    body.querySelector('.netflix-intro').style.display = 'flex';
    body.querySelector('.netflix-intro-mask').remove();
    body.querySelector('.netflix-intro').addEventListener('animationend', function() {
      this.remove();
      body.classList.remove('body-overflow-hidden');
      movieflixHighlightContainer.classList.remove('section-inactive');
      movieflixHighlightContainer.classList.add('section-active');
      main.classList.remove('section-inactive');
      main.classList.add('section-active');
    });
  
});


const removeNextPrevButtons = function() {
  if(nextTrailerTitle.classList.contains('next-prev-button-inactive') && nextTrailerButton.classList.contains('next-prev-button-inactive')) {
    nextTrailerTitle.classList.remove('next-prev-button-inactive');
    nextTrailerButton.classList.remove('next-prev-button-inactive');
  }
  
  if(!prevTrailerTitle.classList.contains('next-prev-button-inactive') && !prevTrailerButton.classList.contains('next-prev-button-inactive')) {
    prevTrailerTitle.classList.add('next-prev-button-inactive');
    prevTrailerButton.classList.add('next-prev-button-inactive');
  }
  
  movieTrailerUrl = [];
  countMovieTrailerUrl = 0;
}

let moviesOrSeriesWrapper = movieWrapper;

let sectionToGoBackTo = movieSection;
let sectionActive = movieSection;
let previousActiveSection = sectionActive;
let moviesOrSeriesOption = movieOption;
let moviesOrSeries = 'movie';

const favoriteListEmpty = function() {
  if(favorites.length > 0) {
    favoriteMoviesActionRemoveButton.classList.add('favorite-movies-remove-button-active');
    favoriteMoviesEmptyList.classList.remove('favorite-movies-empty-list-active');
    favoriteMoviesEmptyList.classList.add('favorite-movies-empty-list-inactive');
  } else {
    favoriteMoviesActionRemoveButton.classList.remove('favorite-movies-remove-button-active');
    favoriteMoviesEmptyList.classList.remove('favorite-movies-empty-list-inactive');
    favoriteMoviesEmptyList.classList.add('favorite-movies-empty-list-active');
  };
};

const removeMovieFlixLoaderFunction = function() {
  if(body.querySelector('.movieflix-loader-container') && removeMovieflixLoaderTimeout !== null) {
    body.querySelector('.movieflix-loader-container').remove();
    body.classList.remove('body-overflow-hidden');
    clearTimeout(removeMovieflixLoaderTimeout);
    removeMovieflixLoaderTimeout = null;
  };
};

const toggleSectionVisibility = function() {
  for (const section of allSections) {
    if(section !== sectionActive) {
      section.classList.remove('section-active');
      section.classList.add('section-inactive');
    };

    if(section === sectionActive) {
      section.classList.remove('section-inactive');
      section.classList.add('section-active');
    };
  };
};

const deactivateSearchBar = function() {
  if(searchInput.value.length > 0) {
    searchInput.value = '';
    outOfFocusSearchBar();
    searchButton.addEventListener('click', activeSearchBar);
    searchInput.addEventListener('blur', outOfFocusSearchBar);
  };
};

nav.addEventListener('click', function(e) {
  // if(e.target.classList.contains('fa-search')) searchDesktopButton.classList.toggle('nav-search-button-active');
  if(e.target.classList.contains('nav-search-button') || e.target.classList.contains('search-desktop-icon')) {
    searchInput = searchDesktopInput;
    searchButton = searchDesktopButton;
    activeSearchBar();
  };

  if(e.target.classList.contains('close-search-mobile-container') && inputValue > 0) {
    searchInput.value = '';
    inputTimeoutEmptyFunction();
    outOfFocusSearchBar();
  };

  if(e.target.classList.contains('search-mobile-icon')) {
    searchInput = searchMobileInput;
    searchButton = searchMobileButton;
    activeSearchBar();
  };

  if(e.target.classList.contains('nav-option-inactive')) {
    deactivateSearchBar();


    navOptionLineAnim.style.left = `${e.target.getBoundingClientRect().left}px`;
    navOptionLineAnim.style.width = `${e.target.getBoundingClientRect().width}px`;
    
    if(sectionActive === allMovieTvSection) removeContentAllTvMoviesSection();
    if(allMovieTvInitTimeout !== null) clearTimeout(allMovieTvInitTimeout);

    if(e.target.dataset.type === 'movies') {
      moviesOrSeries = 'movie';
      sectionActive = movieSection;
      previousActiveSection = sectionActive;
      moviesOrSeriesWrapper = movieWrapper;
      sectionToGoBackTo = movieSection;
      moviesOrSeriesOption = movieOption;
    };

    if(e.target.dataset.type === 'series') {
      moviesOrSeries = 'tv';
      previousActiveSection = sectionActive;
      sectionActive = seriesSection;
      moviesOrSeriesWrapper = seriesWrapper;
      sectionToGoBackTo = seriesSection;
      moviesOrSeriesOption = seriesOption;
    }; 
    
    navOptions.forEach((option) =>  {
      option.classList.remove('nav-option-active');
      option.classList.add('nav-option-inactive');
    });
    e.target.classList.remove('nav-option-inactive');
    e.target.classList.add('nav-option-active');
    navOptionLineAnim.classList.remove('nav-option-line-anim-inactive');

    toggleSectionVisibility();

    navFavoritesButton.classList.add('nav-fav-inactive');
    navFavoritesButtonContainer.classList.add('nav-fav-inactive');
    navFavoritesButtonNotification.classList.add('nav-fav-inactive');
    navFavoritesButtonContainer.classList.remove('nav-fav-active');

    body.classList.add('body-overflow-hidden');

    removeMovieFlixLoaderFunction();

    body.insertAdjacentHTML('afterbegin', movieflixLoaderContainerMarkup);

    movieflixLoaderAnimation();
            
    iJustTest();
    
    if(moviesOrSeries === 'movie' & wasLoaded.movie === false) {
      movieWrapper.forEach((wrapper, index) => {
        fillMovieWrappers(wrapper, index, movieContainer);
      })      
    } else if(moviesOrSeries === 'tv' && wasLoaded.series === false) {
      seriesWrapper.forEach((wrapper, index) => {
        fillMovieWrappers(wrapper, index, seriesContainer);
      });    
    };

    removeFavoriteTimeoutAndUndo();

    scrollToTop();
  };

  if(e.target.classList.contains('nav-fav-inactive')) {
    removeMovieFlixLoaderFunction();
    if(body.querySelector('.movieflix-loader-container')) {
      body.querySelector('.movieflix-loader-container').remove();
      body.classList.remove('body-overflow-hidden');
    };

    deactivateSearchBar();
    
    previousActiveSection = sectionActive;
    sectionActive = favoriteMoviesContainer;
    movieflixHighlightDivider.classList.add('section-inactive');

    navFavoritesButton.classList.remove('nav-fav-inactive');
    navFavoritesButtonContainer.classList.remove('nav-fav-inactive');
    navFavoritesButtonContainer.classList.add('nav-fav-active');

    if(navFavoritesButtonNotification.classList.contains('nav-favorites-button-notification-active')) {
      navFavoritesButtonNotification.classList.remove('nav-favorites-button-notification-active');
    };
    
    favoriteListEmpty();

    navOptions.forEach((option) =>  {
      option.classList.remove('nav-option-active');
      option.classList.add('nav-option-inactive');
    });
    navOptionLineAnim.classList.add('nav-option-line-anim-inactive');

    toggleSectionVisibility();
    
    scrollToTop();
  };
});

function movieRuntimeConvert(n) {
  let number = Number(n);
  let hours = (number / 60);
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  return `${rhours >= 1 ? `${rhours} h ${rminutes} min.` : `${rminutes} min.`}`;
};

const favoritesLocalStorage = function (favoriteMovie) {
  if(favorites.some(favorite => favorite.id === favoriteMovie.id)) return;
  favorites.push(favoriteMovie)
  favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favorites', favoritesJSON);
};

const removeFavoriteFromStorage = function(movieId, favorite, favoriteContainer) {
  if(favorite) favorite.classList.remove('favorite-button-anim');
  if(favoriteContainer) favoriteContainer.classList.remove('added-to-favorite');
  favorites = favorites.filter(movie => movie.id !== movieId);
  favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favorites', favoritesJSON);
};

const appendToFavoriteMoviesWrapper = async function (child) {
  let movieFetchRuntimes = await fetch(`https://api.themoviedb.org/3/${child.dataset.type}/${child.dataset.id}?api_key=${myApiKey}`);
  let movieRuntimesResponse = await movieFetchRuntimes.json();
  childMarkup(favoriteMoviesWrapper, movieRuntimesResponse, child.dataset);

  sizesAndChildren(favoriteMoviesWrapper);
  movieCardFunctionality(favoriteMoviesWrapper.lastElementChild);    
};

let removeFavoriteChildTimeout = null;
let findChildIndex;
let pendingChildIndexes = [];
let countFavorite;

const favoritesMoviesWrapperChildrenTransition = function() {
  sizesAndChildren(favoriteMoviesWrapper);

  findChildIndex = wrapperChildren.findIndex((child) => {
    if(child.classList.contains('remove-from-favorite-list')) return child;
    if(child.classList.contains('undo-remove-from-favorite-list')) return child;
  });

  if(findChildIndex >= itemsInView) {
    countFavorite = ((findChildIndex + itemsInView) - (findChildIndex % itemsInView));
  };

  if(findChildIndex < itemsInView) {
    countFavorite = itemsInView;
  };

  if(wrapperChildren.length > itemsInView) {
    for(let i = countFavorite; i <= wrapperChildren.length - 1; i++) {
      wrapperChildren[i].classList.add('remove-from-favorite-list-opacity');
    }; 
  };
};

const removeFavoriteTimeoutAndUndo = function() {
  if(favoriteMoviesWrapper.querySelector('.remove-undo-container')) {
    let wrapperChildren = [...favoriteMoviesWrapper.children];
    wrapperChildren[findChildIndex].remove();
    clearTimeout(removeFavoriteChildTimeout);
    removeFavoriteChildTimeout = null;
    removeFavoriteFromStorage(wrapperChildren[findChildIndex].dataset.id);
    favoriteMoviesWrapper.querySelector('.remove-undo-container').remove();
    pendingChildIndexes = [];
  };
};

// const clearExistingRemoveUndoTimeout = function() {
//   if(favoriteMoviesWrapper.querySelector('.remove-undo-container')) clearTimeout(removeFavoriteChildTimeout);
// }

const removeFromFavoriteMoviesWrapper = function(child) {

  const removeFavoriteChildTimeoutFunction = function() {
    child.remove();

    removeFavoriteFromStorage(child.dataset.id);

    favoriteMoviesWrapper.querySelector('.remove-undo-container').classList.add('remove-undo-container-inactive');
    favoriteMoviesWrapper.querySelector('.remove-undo-container').addEventListener('animationend', function() {
      this.remove();
      removeFavoriteChildTimeout = null;
      favoriteListEmpty();
    });
  };
  
  wrapperChildren.forEach(child => child.addEventListener('animationend', function() {
    child.classList.remove('child-remove-hover','remove-from-favorite-list-opacity', 'undo-remove-from-favorite-list');
  }));

  child.querySelector('.movie-info').classList.remove('movie-info-overlay-active');
  child.querySelector('.card-overlay').classList.remove('movie-info-overlay-active');
  child.classList.remove('child-hover-active');
  child.classList.add('child-remove-hover');

   
  child.addEventListener('animationend', function() {
    sizesAndChildren(favoriteMoviesWrapper);
    child.classList.add('remove-from-favorite-list');

    favoriteMoviesWrapper.insertAdjacentHTML('beforeend', `
      <div class="remove-undo-container">
        <p class="remove-undo-message"><span class="remove-undo-message-title">${child.dataset.name.length >= 20 ? child.dataset.name.split('').splice(0, 20).join('').concat('...') : child.dataset.name}</span> has been removed from my list</p>
        <button class="remove-undo-button-cancel undo-favorite-removing">
        <i class="fas fa-undo-alt remove-undo-button-cancel-icon undo-favorite-removing"></i>
        Undo
        </button>
      </div>
    `);
    
    favoritesMoviesWrapperChildrenTransition();
    
    pendingChildIndexes.push(findChildIndex);
    
    removeFavoriteChildTimeout = setTimeout(removeFavoriteChildTimeoutFunction, 6000);
  }, {once: true});
};


const removeFromFavoriteMoviesWrapper2 = function(child) {
  let favoriteMoviesWrapperChildren = [...favoriteMoviesWrapper.children];
  for(const favoriteChild of favoriteMoviesWrapperChildren) {
    if(favoriteChild.dataset.id === child.dataset.id) favoriteChild.remove();
  };
}

const checkExistingFavoriteStorage = function(movieId, favorite, favoriteContainer, addToFavoriteMessage) {
  if(favorite) {
    favorite.classList.remove('favorite-button-anim', 'fa-plus', 'fa-check');
    favorite.classList.add('fa-plus');
  };

  if(addToFavoriteMessage) addToFavoriteMessage.innerText = 'Add to favorite';


  if(favoriteContainer) favoriteContainer.classList.remove('added-to-favorite');

  if(localStorage.getItem('favorites') && localStorage.getItem('favorites').length > 0) {
    if(JSON.parse(localStorage.getItem('favorites')).some(movie => movie.id === movieId)) {
      if(favorite && !favorite.classList.contains('favorite-button-anim') && !favorite.classList.contains('fa-check')) {
        favorite.classList.add('favorite-button-anim');
        favorite.classList.toggle('fa-plus');
        favorite.classList.toggle('fa-check');    
      };
      if(addToFavoriteMessage) addToFavoriteMessage.innerText = 'Remove from favorite';
      if(favoriteContainer) favoriteContainer.classList.add('added-to-favorite');
    };
  };
};

let removeMovieflixLoaderTimeout = null;

const movieflixLoaderTimeout = function() {
  body.classList.remove('body-overflow-hidden');
  if(body.querySelector('.movieflix-loader-container')) body.querySelector('.movieflix-loader-container').remove();

  sectionToGoBackTo.classList.add('section-active');

  movieflixHighlightContainer.classList.remove('section-inactive');
  movieflixHighlightContainer.classList.add('section-active');
  movieflixHighlightDivider.classList.remove('section-inactive');
};

const movieTrailerFunctionality = async function (movie) {
  removeNextPrevButtons();
  movieTrailerContainer.classList.add('movie-trailer-container-visible');
  
  currentTrailerNumber.innerHTML = countMovieTrailerUrl + 1;
  body.classList.add('body-overflow-hidden');
  let movieFetch = await fetch(`https://api.themoviedb.org/3/${movie.dataset.type}/${movie.dataset.id}?api_key=${myApiKey}&append_to_response=videos`);
  let movieFetchResponse = await movieFetch.json();
  movieTrailerContainer.dataset.id = movie.dataset.id;
  movieTrailerContainer.dataset.name = movie.dataset.name;
  movieTrailerContainer.dataset.type = movie.dataset.type;
  movieFetchResponse.videos.results.forEach(res => movieTrailerUrl.push(res.key));

  checkExistingFavoriteStorage(movieTrailerContainer.dataset.id, addToFavoriteTrailer, addToFavoriteContainerTrailer, addToFavoriteTrailerMessage);
  
  nextTrailerTitle.style.display = 'inline-block';
  nextTrailerButton.style.display = 'inline-block';
  if(movieFetchResponse.videos.results.length <= 1) {
    nextTrailerButton.style.display = 'none';
    nextTrailerTitle.style.display = 'none';
  };
  
  totalTrailersNumber.innerHTML = `/${movieFetchResponse.videos.results.length}`;
  if(movieTrailerUrl.length > 0) {
    noTrailersFound.classList.remove('no-trailers-found-active');
    movieTrailer.classList.remove('iframe-inactive');
    numberOfTrailers.classList.remove('number-of-trailers-inactive');

    movieTrailer.src = baseYoutubeUrl.concat(`${movieTrailerUrl[0]}?&autoplay=1`);
  } else {
    noTrailersFound.classList.add('no-trailers-found-active');
    numberOfTrailers.classList.add('number-of-trailers-inactive');
    movieTrailer.classList.add('iframe-inactive');
  };
};

const addToFavoriteFunction = function(e, child, addToFavorite, addToFavoriteContainer, addToFavoriteMessage) {
  const movieHighlightInfo = movieflixHighlightContainer.querySelector('.movie-highlight-info');
  const movieHighlightAddFavorite = movieflixHighlightContainer.querySelector('.movie-highlight-add-favorite-icon');      

  addToFavorite.classList.toggle('favorite-button-anim');
  addToFavorite.classList.toggle('fa-plus');
  addToFavorite.classList.toggle('fa-check');
  addToFavoriteContainer.classList.toggle('added-to-favorite');
  addToFavoriteMessage.innerText = 'Remove from favorite';

  if(!addToFavorite.classList.contains('favorite-button-anim')) {
    removeFavoriteFromStorage(child.dataset.id, addToFavorite, addToFavoriteContainer);
    removeFromFavoriteMoviesWrapper2(child);
    checkExistingFavoriteStorage(movieHighlightInfo.dataset.id, movieHighlightAddFavorite);
    addToFavoriteMessage.innerText = 'Add to favorite';
    // addToFavoriteTrailerMessage.innerText = 'Add to favorite';
  };
  
  if(e.target.classList.contains('favorite-button-anim') || e.target.classList.contains('added-to-favorite')) {
    favoritesLocalStorage({name: child.dataset.name, id: child.dataset.id, type: child.dataset.type});
    appendToFavoriteMoviesWrapper(child);
    checkExistingFavoriteStorage(movieHighlightInfo.dataset.id, movieHighlightAddFavorite);
    navFavoritesButtonNotification.classList.add('nav-favorites-button-notification-active'); 
  };
};

const iJustTest = async function() {

  movieflixHighlightContainer.innerHTML = '';
  let randomPage = Math.floor((Math.random() * 5) + 1);
  let getHighlightMovieId = await fetch(`https://api.themoviedb.org/3/discover/${moviesOrSeries}?api_key=${myApiKey}&language=en-US&include_adult=false&include_video=false&page=${randomPage}&with_watch_monetization_types=flatrate&vote_count.gte=2000`);
  let getHighlightMovieIdResponse = await getHighlightMovieId.json();
  let randomNumber = Math.floor(Math.random() * 19);
  let randomMovieId = getHighlightMovieIdResponse.results[randomNumber].id;
  
  let highlightMovie = await fetch(`https://api.themoviedb.org/3/${moviesOrSeries}/${randomMovieId}?api_key=${myApiKey}&append_to_response=videos,credits,recommendations`);
  let highlightMovieResponse = await highlightMovie.json();
  let highlightMovieGenres = [];
  let highlightMovieMobileGenre = highlightMovieResponse.genres[0].name;
  
  let movieName = highlightMovieResponse.title ? highlightMovieResponse.title.toUpperCase() : highlightMovieResponse.original_name.toUpperCase();
  
  let seasons = highlightMovieResponse.number_of_seasons <= 1 ? highlightMovieResponse.number_of_seasons + ' season' :highlightMovieResponse.number_of_seasons + ' seasons';
  
  highlightMovieResponse.genres.forEach((genre, i) => {
     if(i >= 2) return;
     highlightMovieGenres.push(" " + genre.name);
  });
  
  const movieTagline = highlightMovieResponse.tagline ? `<p class="movie-highlight-tagline">
  ${highlightMovieResponse.tagline}
  <span class="movie-highlight-tagline-separator"></span>
  </p>` : '';
  
  
  movieflixHighlightContainer.insertAdjacentHTML('afterbegin',`
  <div class="movie-highlight-overlay"></div>
  <img alt="Movie Poster: ${movieName}" src="${baseImgUrl}original${highlightMovieResponse.poster_path}" alt="" class=" img-highlight-title user-select-none">
  <div class="movie-highlight-info" data-id="${highlightMovieResponse.id.toString()}" data-type="${moviesOrSeries}" data-name="${movieName}">
  <h1 class="movie-highlight-name movie-highlight-animation">${movieName.length > 25 ? movieName.toUpperCase().split('').splice(0, 25).join('').concat('...') : movieName}
  </h1>
  <div class="movie-highlight-info-date-genres movie-highlight-animation">
  <span class="movie-highlight-info-date">${moviesOrSeries === 'movie' ? highlightMovieResponse.release_date.substring(0, 4) : highlightMovieResponse.first_air_date.substring(0, 4)}</span>
  <span class="highlight-delimitator"></span>
  <span class="movie-highlight-mobile-genre">${highlightMovieMobileGenre}</span>
  <span class="movie-highlight-info-genres">
  ${[...highlightMovieGenres]}
  </span>
  <span class="highlight-delimitator"></span>
  <span class="movie-highlight-info-runtime">
  ${moviesOrSeries === 'movie' ? movieRuntimeConvert(highlightMovieResponse.runtime) : seasons}
  </span>
  </div>
  <p class="movie-highlight-info-overview movie-highlight-animation">${highlightMovieResponse.overview.length >= 180 ? highlightMovieResponse.overview.slice(0, 180).concat('...') : highlightMovieResponse.overview}</p>
    <div class="movie-highlight-info-actions movie-highlight-animation">
      <div class="movie-highlight-add-favorite-container">
        <i class="fas fa-plus movie-highlight-add-favorite-icon"></i>
        <span class="movie-highlight-add-favorite-text user-select-none">My list</span>
      </div>
      <span class="movie-highlight-play-trailer user-select-none"><i class="fas fa-play play-trailer-highlight-icon"></i> Play</span>
      <div class="movie-highlight-more-info-container">
        <i class="fa fa-info-circle movie-highlight-more-info-icon movie-highlight-more-info"></i>
        <span class="movie-highlight-more-info-text movie-highlight-more-info user-select-none">Info</span>
      </div>
      </div>
  </div>
  `)
  let movieHighlightAddFavorite = movieflixHighlightContainer.querySelector('.movie-highlight-add-favorite-icon');
  let movieHighlightInfo = movieflixHighlightContainer.querySelector('.movie-highlight-info'); 
  
  checkExistingFavoriteStorage(highlightMovieResponse.id.toString(), movieHighlightAddFavorite);
  
  movieflixHighlightContainer.querySelector('.movie-highlight-info-actions').addEventListener('click', async function(e) { 
      
      if(e.target.classList.contains('movie-highlight-play-trailer') || e.target.classList.contains('play-trailer-highlight-icon')) {
        movieTrailerFunctionality(movieHighlightInfo);
  
        checkExistingFavoriteStorage(movieTrailerContainer.dataset.id, addToFavoriteTrailer, addToFavoriteContainerTrailer, addToFavoriteTrailerMessage);
      };
      
      if(e.target.classList.contains('movie-highlight-add-favorite-icon') || e.target.classList.contains('movie-highlight-add-favorite-text')) {
        movieHighlightAddFavorite.classList.toggle('favorite-button-anim',);
        movieHighlightAddFavorite.classList.toggle('fa-plus');
        movieHighlightAddFavorite.classList.toggle('fa-check');
  
        if(!movieHighlightAddFavorite.classList.contains('favorite-button-anim')) {
          removeFavoriteFromStorage(highlightMovieResponse.id.toString(), movieHighlightAddFavorite);
          removeFromFavoriteMoviesWrapper2(movieHighlightInfo);
        };
  
        if(movieHighlightAddFavorite.classList.contains('favorite-button-anim')) {
          favoritesLocalStorage({name: movieName, id: highlightMovieResponse.id.toString(), type: moviesOrSeries});
          appendToFavoriteMoviesWrapper(movieHighlightInfo);
  
  
          const imageFavoriteAnimation = document.createElement('img');
          imageFavoriteAnimation.classList.add('image-favorite-animation');      
          imageFavoriteAnimation.src = `${baseImgUrl}w92${highlightMovieResponse.poster_path}`;
  
          body.querySelector('.image-favorite-animation-container').innerHTML = '';
          body.querySelector('.image-favorite-animation-container').appendChild(imageFavoriteAnimation);
          imageFavoriteAnimation.classList.add('image-favorite-animation-animate');
          navFavoritesButtonNotification.classList.add('nav-favorites-button-notification-active'); 
  
          setTimeout(function() {
            body.querySelector('.nav-favorites-button').classList.add('nav-favorites-button-anim');
          }, 1200) 
        }
        
      };
  
      if(e.target.classList.contains('movie-highlight-more-info')) {
        movieInfoFunction(movieHighlightInfo);
      };
  });
  
  if(!body.querySelector('.netflix-intro')) {
    movieflixHighlightContainer.querySelector('.img-highlight-title').addEventListener('load', function() {
      if(wasLoaded.highlight === false) {
        removeMovieflixLoaderTimeout = setTimeout(movieflixLoaderTimeout, 1700);
        wasLoaded.highlight = true;
      } else {
        removeMovieflixLoaderTimeout = setTimeout(movieflixLoaderTimeout, 500);
      };
    });
  };
};

iJustTest();

const sizesAndChildren = function(wrapper) {
  let theRest;

  itemWidth = Number((wrapper.firstElementChild.getBoundingClientRect().width).toFixed(2));
  itemMarginRight = (window
    .getComputedStyle(wrapper.firstElementChild)
    .getPropertyValue('margin-right'))
    .slice(0, -2);

  itemsInView = Math.round(wrapper.getBoundingClientRect().width / (itemWidth + Number(itemMarginRight)));
  
  if(wrapper === allMovieTvWrapper && wrapper.children.length > 20) {
    theRest = [...wrapper.children];
    wrapperChildren = theRest.slice(-Number(allMovieTvResults));
  } else {
    wrapperChildren = [...wrapper.children];
  };
};

const insertDataMovieHover = async function(child) {
  if(child.dataset.dataInserted === 'no') {
    child.dataset.dataInserted = 'yes'
    let movieFetchRuntimes = await fetch(`https://api.themoviedb.org/3/${child.dataset.type}/${child.dataset.id}?api_key=${myApiKey}`);
    let movieRuntimesResponse = await movieFetchRuntimes.json();
    let seasons = movieRuntimesResponse.number_of_seasons <= 1 ? movieRuntimesResponse.number_of_seasons + ' season' : movieRuntimesResponse.number_of_seasons + ' seasons';
    let movieRatingContainer = child.querySelector('.movie-info-actions-rating-container');
    movieRatingContainer.insertAdjacentHTML('beforeend', `
    <span class="movie-duration">${child.dataset.type === 'movie' ? movieRuntimeConvert(movieRuntimesResponse.runtime) : seasons}
    </span>`);
      movieRuntimesResponse.genres.forEach((genre, i) => {
        child.querySelector('.movie-info-genre-container').insertAdjacentHTML('beforeend', `
           <span class="movie-info-genre">${i <= 3 ? genre.name : ''}${movieRuntimesResponse.genres.length - 1 === i || i >= 3 ? '' : ',\u00A0'}</span>        
        `)
      })

      child.querySelector('.movie-info-name-language').insertAdjacentHTML('beforeend', `
      <div class="movie-language"><span class="delimitator"></span>
      ${movieRuntimesResponse.original_language}</div>
      `);
  }

};

const setMovieMargin =  function(child, container) {
  if(container.getBoundingClientRect().width - Number(window.getComputedStyle(container).getPropertyValue('padding-right').slice(0, -2)) !== Math.round(child.getBoundingClientRect().right + Number(window.getComputedStyle(child).getPropertyValue('margin-right').slice(0, -2)))) child.classList.remove('transform-right');

  if(container.getBoundingClientRect().width - Number(window.getComputedStyle(container).getPropertyValue('padding-right').slice(0, -2)) === 
  Math.round(child.getBoundingClientRect().right + Number(window.getComputedStyle(child).getPropertyValue('margin-right').slice(0, -2)))) child.classList.add('transform-right');

  Math.round(child.getBoundingClientRect().left - (Number(window.getComputedStyle(child).getPropertyValue('margin-right').slice(0, -2)) + Number(window.getComputedStyle(container).getPropertyValue('padding-left').slice(0, -2)))) <= 0 ? child.classList.add('transform-left') : child.classList.remove('transform-left');
};

const mouseEnterChildFunction = function() {
  if(windowInnerWidth > 800) {
    let addToFavorite = this.querySelector('.add-to-favorite');
    let addToFavoriteContainer = this.querySelector('.add-to-favorite-container');
    let addToFavoriteMessage = this.querySelector('.add-to-favorite-message');
  
    if(!this.querySelector('.child-loader')) {
      const thisKeyword = this;
  
      checkExistingFavoriteStorage(this.dataset.id, addToFavorite, addToFavoriteContainer, addToFavoriteMessage);
  
      this.classList.remove('child-remove-hover');
      this.classList.remove('child-hover-active');
  
      setMovieMargin(this, this.closest('.container-transform-origin'));
      movieInfoOverlayRemoveTimeout = setTimeout(async function() {
  
        thisKeyword.querySelector('.play-trailer-button').classList.add('play-trailer-button-animation');
        thisKeyword.querySelector('.movie-info-actions').classList.add('movie-info-actions-animation');
        thisKeyword.querySelector('.img-title').style.borderRadius = '5px 5px 0 0';
        thisKeyword.querySelector('.movie-info').classList.remove('movie-info-overlay-remove-active');
        thisKeyword.querySelector('.card-overlay').classList.remove('movie-info-overlay-remove-active');
        thisKeyword.classList.add('child-hover-active');
        thisKeyword.querySelector('.movie-info').classList.add('movie-info-overlay-active');
        thisKeyword.querySelector('.card-overlay').classList.add('movie-info-overlay-active');
  
        insertDataMovieHover(thisKeyword);
      }, 500);
      
      };    
  };
};

const movieCardFunctionality = async function(child, i) {

  let addToFavorite = child.querySelector('.add-to-favorite');
  let addToFavoriteContainer = child.querySelector('.add-to-favorite-container');
  let addToFavoriteMessage = child.querySelector('.add-to-favorite-message');
  
  child.addEventListener('mouseenter', mouseEnterChildFunction);
  
  child.addEventListener('mouseleave', function() {
    if(windowInnerWidth > 800) {
      child.querySelector('.play-trailer-button').classList.remove('play-trailer-button-animation');
      child.querySelector('.movie-info-actions').classList.remove('movie-info-actions-animation');
      clearTimeout(movieInfoOverlayRemoveTimeout);
      child.querySelector('.img-title').style.borderRadius = '5px';
      
      if(child.classList.contains('child-hover-active') || child.querySelector('.movie-info').classList.contains('movie-info-overlay-active')) {
        child.classList.remove('child-hover-active');
        child.classList.add('child-remove-hover');
        child.querySelector('.movie-info').classList.remove('movie-info-overlay-active');
        child.querySelector('.movie-info').classList.add('movie-info-overlay-remove-active');
        child.querySelector('.card-overlay').classList.remove('movie-info-overlay-active');
        child.querySelector('.card-overlay').classList.add('movie-info-overlay-remove-active');  
      };
    };
  });

  child.addEventListener('animationend', function() {
    child.classList.remove('child-remove-hover');
  });

  child.addEventListener('click', async function(e) {
    if(e.target.classList.contains('more-movie-info') || e.target.classList.contains('more-movie-info-container')) {
      movieInfoFunction(child);
    };

    if(windowInnerWidth < 800) {
      movieInfoFunction(child);
    };

    if(e.target.classList.contains('add-to-favorite') || e.target.classList.contains('add-to-favorite-container')) {
      addToFavoriteFunction(e, child, addToFavorite, addToFavoriteContainer, addToFavoriteMessage);
      
      if(e.target.classList.contains('favorite-button-anim') || e.target.classList.contains('added-to-favorite')) {
        const imageFavoriteAnimation = document.createElement('img');
        imageFavoriteAnimation.classList.add('image-favorite-animation');      
        imageFavoriteAnimation.src = child.querySelector('.img-title').src;
        
        body.querySelector('.image-favorite-animation-container').innerHTML = '';
        body.querySelector('.image-favorite-animation-container').appendChild(imageFavoriteAnimation);
        imageFavoriteAnimation.classList.add('image-favorite-animation-animate'); 

        setTimeout(function() {
          body.querySelector('.nav-favorites-button').classList.add('nav-favorites-button-anim');
        }, 1200)
      };          
    };

    if(e.target.classList.contains('remove-from-favorite') || e.target.classList.contains('remove-from-favorite-container')) {
      removeFromFavoriteMoviesWrapper(child);
    };

            
    if(e.target.classList.contains('play-trailer-button') || e.target.classList.contains('play-trailer-icon')) {
      movieTrailerFunctionality(child);

      checkExistingFavoriteStorage(movieTrailerContainer.dataset.id, addToFavoriteTrailer, addToFavoriteContainerTrailer, addToFavoriteTrailerMessage);

      if(e.target.closest('.favorite-child')) {
        addToFavoriteContainerTrailer.classList.add('add-to-favorite-trailer-inactive');
      };
      if(e.target.closest('.child')) {
        addToFavoriteContainerTrailer.classList.remove('add-to-favorite-trailer-inactive');
      };
    };        
  });

};

const childMarkup = async function(wrapper, res, movie) {
  let removeOrAddString;
  let removeOrAddText;
  let typeOf;
  let addedToFavorite;
  let movieOrTv;
  let favoriteIconClass;
  let childLoader = '';
  let observed = '';

  if(wrapper.classList.contains('movie-wrapper') || wrapper.classList.contains('series-wrapper')) {
    removeOrAddString = 'add-to';
    removeOrAddText = 'Add to favorite';
    typeOf = 'child';
    movieOrTv = moviesOrSeries;
    favoriteIconClass = 'fas fa-plus';
    addedToFavorite = '';
};

  if(wrapper.classList.contains('search-section-wrapper')) {
    childLoader = `<div class="child-loader"></div>`;
    removeOrAddString = 'add-to';
    removeOrAddText = 'Add to favorite';
    typeOf = 'search-child';
    movieOrTv = res.media_type;
    favoriteIconClass = 'fas fa-plus';
    addedToFavorite = '';
  };

  if(wrapper.classList.contains('favorite-movies-wrapper')) {
    removeOrAddString = 'remove-from';
    addedToFavorite = 'added-to-favorite';
    removeOrAddText = 'Remove from favorite';
    typeOf = 'favorite-child';
    movieOrTv = movie.type;
    favoriteIconClass = 'fas fa-check favorite-button-anim';
};

  if(wrapper.classList.contains('all-movie-tv-wrapper')) {
    observed = 'data-observed="false"';
    childLoader = `<div class="child-loader"></div>`;
    removeOrAddString = 'add-to';
    removeOrAddText = 'Add to favorite';
    typeOf = 'all-movie-tv-child';
    movieOrTv = moviesOrSeries;
    favoriteIconClass = 'fas fa-plus';
    addedToFavorite = '';
  };
  
  let movieName = res.title ? res.title : res.original_name;

  movieCountFunction(res);

  wrapper.insertAdjacentHTML('beforeend', `
<div class="${typeOf}" data-id='${res.id}' data-name='${movieName}' data-type="${movieOrTv}" data-data-inserted="no" ${observed}>
    <div class="movie-img-container">
       ${childLoader}
       <img alt="Movie Image for: ${movieName}" src="${baseImgUrl}/w500/${res.poster_path}" class="img-title user-select-none">
       <div class="card-overlay">
          <div class="play-trailer-button">
             <i class="fas fa-play play-trailer-icon"></i>
          </div>
       </div>
    </div>
    
    <div class="movie-info">
         <div class="movie-info-name-language-actions">
           <div class="movie-info-name-language">
              <h3 class="movie-name">${movieName.length >= 20 ? movieName.split('').splice(0, 20).join('').concat('...') : movieName}
              </h3>
           </div>

           <div class="movie-info-actions">
             <div class="movie-info-actions-icons">
               <div class="more-movie-info-container">
                 <i class="fas fa-info more-movie-info"></i>
                 <span class="more-movie-info-message user-select-none">More info</span>    
               </div>

               <div class="${removeOrAddString.concat('-favorite-container')} ${addedToFavorite}">
                 <i class="${favoriteIconClass} ${removeOrAddString.concat('-favorite')}"></i>
                 <span class="${removeOrAddString.concat('-favorite-message')} user-select-none">${removeOrAddText}</span>
               </div>
              </div>
            </div>

        </div>

         <div class="movie-info-genre-container">
         </div>
         <div class="movie-info-actions-rating-container">
            <div class="movie-info-rating"> 
               <span class="movie-grade">Rating: ${res.vote_average > 0 ? `${res.vote_average}/10` : ''}</span>
               <span class="delimitator"></span>
               <span class="persons-rating">${movieCount}</span>
            </div>
      </div>
    </div>
</div>
`);
};


const fillMovieWrappers = async function(wrapper, index, container) {
  moviesOrSeries === 'movie' ? wasLoaded.movie = true : wasLoaded.series = true;
  let howManyVotes = moviesOrSeries === 'movie' ? '1000' : '300';
  
  const genres = await fetch(`https://api.themoviedb.org/3/genre/${moviesOrSeries}/list?api_key=${myApiKey}&language=en-US`)
  const genresResp = await genres.json();
 
  const promise1 = await fetch(`https://api.themoviedb.org/3/discover/${moviesOrSeries}?api_key=${myApiKey}&language=en-US&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&with_genres=${genresResp.genres[index].id}&vote_count.gte=${howManyVotes}
  `);
  const response1 = await promise1.json();

  if(response1.total_results < 19) return;

  container[index].insertAdjacentHTML('beforebegin', `
    <h2 class="slider-title-${moviesOrSeries}" data-genre-id="${genresResp.genres[index].id}" data-type="${moviesOrSeries}" data-name="${genresResp.genres[index].name}">
    ${genresResp.genres[index].name}
      <div class="slider-title-${moviesOrSeries}-arrow-container">
        <i class="fas fa-angle-right slider-title-${moviesOrSeries}-arrow"></i>
        <span class="slider-title-${moviesOrSeries}-text">All ${genresResp.genres[index].name} ${moviesOrSeries === 'movie' ? 'movies' : 'TV Series'}</span>
      </div>
    </h2>
  `);
  

  for(const response of response1.results) {
    childMarkup(wrapper, response);
  };

  sizesAndChildren(wrapper);

  wrapperChildren.forEach(movieCardFunctionality);
  if(wrapperChildren[0].classList.contains('child')) {
    for(let i = 0; i <= 6; i++) {
      wrapperChildren[i].classList.add('movie-card-invisible');
    };
  };
};

  movieWrapper.forEach((wrapper, index) => {
    fillMovieWrappers(wrapper, index, movieContainer);
  });
  
  const carouselFunction = function(e) {
    if(!e.target.classList.contains('slider-prev') && !e.target.classList.contains('slider-next')) return;
    let itemWidth = Number((moviesOrSeriesWrapper[0].firstElementChild.getBoundingClientRect().width).toFixed(2));
    
    let itemMarginRight = (window
                           .getComputedStyle(moviesOrSeriesWrapper[0].firstElementChild)
                           .getPropertyValue('margin-right'))
                           .slice(0, -2);
                           
    let itemMarginLeft = (window
    .getComputedStyle(moviesOrSeriesWrapper[0].firstElementChild)
    .getPropertyValue('margin-left'))
    .slice(0, -2);

    itemsInView = Math.round(moviesOrSeriesWrapper[0].getBoundingClientRect().width / (itemWidth + Number(itemMarginRight)));

    const sliderButtonsFunction = function() {
      let closestWrapper = e.target.closest('.container-slider').querySelector('.wrapper-slider');

      e.target.classList.contains('slider-prev') ? infiniteCounter = -1 : infiniteCounter = 1;
      closestWrapper.style.transition = 'transform .7s ease';

      if(e.target.classList.contains('slider-prev')) {
        closestWrapper.style.transform = `translateX(${(itemWidth + +itemMarginLeft + +itemMarginRight) * itemsInView}px)`;
      };
      
      if(e.target.classList.contains('slider-next')) {
        closestWrapper.style.transform = `translateX(${(-itemWidth - +itemMarginLeft - +itemMarginRight) * itemsInView}px)`;
      };     
    };
    
    if(e.target.classList.contains('slider-prev') || e.target.classList.contains('slider-next')) {
      sliderButtonsFunction();
    };
  };

  movieContainer.forEach(container => container.addEventListener('click', carouselFunction), {once: true});
  seriesContainer.forEach(container => container.addEventListener('click', carouselFunction), {once: true});

let infiniteCarousel = function(e) {
  hasSliderStopped = true;
  if(!e.target.classList.contains('movie-wrapper') && !e.target.classList.contains('series-wrapper')) return;
  const movieOrSeriesContainer = e.target.classList.contains('movie-wrapper') ? e.target.closest('.movie-container') :  e.target.closest('.series-container') 

    let wrapperChildren = [...e.target.children];
    for(const child of wrapperChildren) {
      child.addEventListener('mouseenter', mouseEnterChildFunction);
      child.style.cursor = 'pointer';
    };

    e.target.style.transition = 'none';
    e.target.style.transform = `none`;
    movieOrSeriesContainer.addEventListener('click', carouselFunction);
  
    if(infiniteCounter === 1) {
      for(let i = 0;i < itemsInView;i++) {
        e.target.appendChild(wrapperChildren[i]);
      };
      if(this.parentElement.querySelector('.left-arrow').classList.contains('left-arrow-inactive')) {
        this.parentElement.querySelector('.left-arrow').classList.remove('left-arrow-inactive');

        for(let i = 0; i <= 6; i++) {
          wrapperChildren[i].classList.remove('movie-card-invisible');
        };
      } ;
    };
    
    if(infiniteCounter === -1) {
      for(let i = wrapperChildren.length - 1;i >= wrapperChildren.length - itemsInView;i--) {
        e.target.prepend(wrapperChildren[i]);
      }
    }; 
  
};

movieWrapper.forEach(function (wrapper) {
  wrapper.addEventListener('transitionend', infiniteCarousel);
});

seriesWrapper.forEach(function(wrapper) {
  wrapper.addEventListener('transitionend', infiniteCarousel);
});

movieWrapper.forEach(wrapper => wrapper.addEventListener('transitionstart', function(e) {
  if(!e.target.classList.contains('movie-wrapper')) return;
  e.target.closest('.movie-container').removeEventListener('click', carouselFunction);

  let wrapperChildren = [...e.target.children];
  for(const child of wrapperChildren) {
    child.removeEventListener('mouseenter', mouseEnterChildFunction);
    child.style.cursor = 'default';
  };
}));

seriesWrapper.forEach(wrapper => wrapper.addEventListener('transitionstart', function(e) {
  if(!e.target.classList.contains('series-wrapper')) return;
  e.target.closest('.series-container').removeEventListener('click', carouselFunction);

  let wrapperChildren = [...e.target.children];
  for(const child of wrapperChildren) {
    child.removeEventListener('mouseenter', mouseEnterChildFunction);
    child.style.cursor = 'default';
  };
}));


movieTrailerContainer.addEventListener('click', function(e) {
  const movieHighlightInfo = movieflixHighlightContainer.querySelector('.movie-highlight-info');
  const movieHighlightAddFavorite = movieflixHighlightContainer.querySelector('.movie-highlight-add-favorite-icon');
 
  if(e.target.classList.contains('add-to-favorite-trailer') || e.target.classList.contains('add-to-favorite-container-trailer')) {
    addToFavoriteTrailer.classList.toggle('favorite-button-anim');
    addToFavoriteContainerTrailer.classList.toggle('added-to-favorite');
    addToFavoriteTrailer.classList.toggle('fa-plus');
    addToFavoriteTrailer.classList.toggle('fa-check');
     
    if(!addToFavoriteTrailer.classList.contains('favorite-button-anim')) {
      removeFavoriteFromStorage(movieTrailerContainer.dataset.id, addToFavoriteTrailer, addToFavoriteContainerTrailer);
      removeFavoriteFromStorage(movieTrailerContainer.dataset.id, movieflixHighlightContainer.querySelector('.movie-highlight-add-favorite'));
      removeFromFavoriteMoviesWrapper2(movieTrailerContainer);

      movieHighlightAddFavorite.classList.remove('favorite-button-anim');
      movieHighlightAddFavorite.classList.toggle('fa-check');
      movieHighlightAddFavorite.classList.toggle('fa-plus');
      addToFavoriteTrailerMessage.innerText = 'Add to favorite';

      if(JSON.parse(localStorage.getItem('favorites')).length <= 0) {
        favoriteMoviesActionRemoveButton.classList.remove('favorite-movies-remove-button-active');
      };

    }

    if(addToFavoriteTrailer.classList.contains('favorite-button-anim')) {
      favoritesLocalStorage({name: movieTrailerContainer.dataset.name, id: movieTrailerContainer.dataset.id, type: moviesOrSeries});
      appendToFavoriteMoviesWrapper(movieTrailerContainer);
      movieHighlightAddFavorite.classList.add('favorite-button-anim');
      movieHighlightAddFavorite.classList.toggle('fa-check');
      movieHighlightAddFavorite.classList.toggle('fa-plus');
      addToFavoriteTrailerMessage.innerText = 'Remove from favorite';
      navFavoritesButtonNotification.classList.add('nav-favorites-button-notification-active');
    }

  }

  if(e.target.classList.contains('close-movie-trailer-container') || e.target.classList.contains('close-movie-trailer')|| e.target.classList.contains('movie-trailer-container')) {
    movieTrailerContainer.classList.remove('movie-trailer-container-visible');
    body.classList.remove('body-overflow-hidden');
    movieTrailer.src = '';

    if(movieInfoContainerActions.containerHiddenWhenPlayingTrailer === true) {
      movieInfoSection.classList.add('movie-info-section-active');
      movieInfoSection.classList.remove('section-inactive');
    };
  }

  if(e.target.classList.contains('next-trailer-button') || e.target.classList.contains('next-trailer-title')) {
    if(countMovieTrailerUrl === movieTrailerUrl.length - 2 && countMovieTrailerUrl > 0 && !nextTrailerTitle.classList.contains('next-prev-button-inactive') && !nextTrailerButton.classList.contains('next-prev-button-inactive') || movieTrailerUrl.length === 2
    ) {
      nextTrailerButton.classList.add('next-prev-button-inactive');
      nextTrailerTitle.classList.add('next-prev-button-inactive');  
    };
    if(countMovieTrailerUrl === movieTrailerUrl.length - 1 || movieTrailerUrl.length === 1) return;
    prevTrailerButton.classList.remove('next-prev-button-inactive');
    prevTrailerTitle.classList.remove('next-prev-button-inactive');
    countMovieTrailerUrl++;
    currentTrailerNumber.innerHTML = countMovieTrailerUrl + 1;
    movieTrailer.src = baseYoutubeUrl.concat(`${movieTrailerUrl[countMovieTrailerUrl]}?&autoplay=1`);
  }

  if(e.target.classList.contains('prev-trailer-button') || e.target.classList.contains('prev-trailer-title')) {
    if(countMovieTrailerUrl === 1 && !prevTrailerTitle.classList.contains('next-prev-button-inactive') && !prevTrailerButton.classList.contains('next-prev-button-inactive')
    ) {
      prevTrailerButton.classList.add('next-prev-button-inactive');
      prevTrailerTitle.classList.add('next-prev-button-inactive');
      nextTrailerButton.classList.remove('next-prev-button-inactive');
      nextTrailerTitle.classList.remove('next-prev-button-inactive');    
    };
    if(countMovieTrailerUrl === 0) return;
    countMovieTrailerUrl--;
    currentTrailerNumber.innerHTML = countMovieTrailerUrl + 1;
    if(countMovieTrailerUrl === movieTrailerUrl.length - 2) {
      nextTrailerButton.classList.remove('next-prev-button-inactive');
      nextTrailerTitle.classList.remove('next-prev-button-inactive');  
    }
    movieTrailer.src = baseYoutubeUrl.concat(`${movieTrailerUrl[countMovieTrailerUrl]}?&autoplay=1`);
  };

});

body.querySelector('.nav-favorites-button').addEventListener('animationend', function() {
  body.querySelector('.nav-favorites-button').classList.remove('nav-favorites-button-anim');
});

body.querySelector('.image-favorite-animation-container').addEventListener('animationend', function() {
  body.querySelector('.image-favorite-animation').remove();
})

let inputValue;

let imgLoadListenerFunction = function () {
  if(this) {
    this.previousElementSibling.remove();
  };
};

let imgErrorListenerFunction = function () {
this.setAttribute('src', 'svg/not-available.png');
this.previousElementSibling.remove();
};

let inputTimeoutEmptyFunction = function() {
  let searchSectionWrapperChildren = [...searchSectionWrapper.children];
  sectionActive = previousActiveSection;
  toggleSectionVisibility();

  searchLoadingSpinner.classList.remove('search-loading-spinner-active');

  if(sectionActive === movieSection || sectionActive === seriesSection) {
    movieflixHighlightDivider.classList.remove('section-inactive');
    moviesOrSeriesOption.classList.remove('nav-option-inactive');
    moviesOrSeriesOption.classList.add('nav-option-active');
    navOptionLineAnim.classList.remove('nav-option-line-anim-inactive');
    movieflixHighlightContainer.classList.remove('section-inactive');
    movieflixHighlightContainer.classList.add('section-active');
  };

  if(sectionActive === allMovieTvSection) {
    navOptionLineAnim.classList.remove('nav-option-line-anim-inactive');
    moviesOrSeriesOption.classList.remove('nav-option-inactive');
    moviesOrSeriesOption.classList.add('nav-option-active');
  };

  if(sectionActive === favoriteMoviesContainer) {
    navFavoritesButton.classList.remove('nav-fav-inactive');
    navFavoritesButtonContainer.classList.remove('nav-fav-inactive');
    navFavoritesButtonContainer.classList.add('nav-fav-active');
  };

  if(searchSectionWrapperChildren.length > 0) {
    for(const child of searchSectionWrapperChildren) {
      child.querySelector('.img-title').removeEventListener('error', imgErrorListenerFunction);
      child.querySelector('.img-title').removeEventListener('load', imgLoadListenerFunction);
      child.remove();
    };
  };

  if(favoriteMoviesEmptyList.classList.contains('favorite-movies-empty-list-active') && favoriteMoviesWrapper.children.length > 0) {
    favoriteMoviesEmptyList.classList.remove('favorite-movies-empty-list-active');
    favoriteMoviesEmptyList.classList.add('favorite-movies-empty-list-inactive');
    favoriteMoviesActionRemoveButton.classList.add('favorite-movies-remove-button-active');
  };
  // body.querySelector('.nav-search-button').addEventListener('click', activeSearchBar);
  searchMobileInput.addEventListener('blur', outOfFocusSearchBar);
  searchDesktopInput.addEventListener('blur', outOfFocusSearchBar);  
};

let inputTimeoutFunction =  async function() {
  inputValue = searchInput.value.length;

  searchLoadingSpinner.classList.add('search-loading-spinner-active');
  noSearchResultsMessage.classList.remove('no-search-results-message-visible');

  const searchSectionWrapperChildren = [...searchSectionWrapper.children];
  if(searchSectionWrapperChildren.length > 0 && inputValue > 0) {
    for(const child of searchSectionWrapperChildren) {
      child.querySelector('.img-title').removeEventListener('error', imgErrorListenerFunction);
      child.querySelector('.img-title').removeEventListener('load', imgLoadListenerFunction);
      child.remove();
    };
  };

 
  if(inputValue > 0) {
    removeMovieFlixLoaderFunction();
    scrollToTop();

    searchButton.removeEventListener('click', activeSearchBar);
    searchInput.removeEventListener('blur', outOfFocusSearchBar);

    movieflixHighlightDivider.classList.add('section-inactive');
    
    if(sectionActive !== searchSection) {
      if(sectionActive === favoriteMoviesContainer) {
        navFavoritesButton.classList.add('nav-fav-inactive');
        navFavoritesButtonContainer.classList.remove('nav-fav-active');
        navFavoritesButtonContainer.classList.add('nav-fav-inactive');
        navFavoritesButtonNotification.classList.add('nav-fav-inactive');
      };

      previousActiveSection = sectionActive
      sectionActive = searchSection;
      toggleSectionVisibility();
    };

    navOptions.forEach((option) =>  {
      option.classList.remove('nav-option-active');
      option.classList.add('nav-option-inactive');
    });
    navOptionLineAnim.classList.add('nav-option-line-anim-inactive');
    
    const response1 = await fetch(`
    https://api.themoviedb.org/3/search/multi?api_key=${myApiKey}&language=en-US&page=1&include_adult=false&query=${searchInput.value}`);
    const response2 = await response1.json();

    if(response1.ok === true) searchLoadingSpinner.classList.remove('search-loading-spinner-active');
    
    let thereAreSearchResults = response2.results.filter(res => res.vote_count > 100);
    
    if(thereAreSearchResults.length > 0) {
      noSearchResultsMessage.classList.remove('no-search-results-message-visible');

      for(const res of thereAreSearchResults) {
          childMarkup(searchSectionWrapper, res);
        };
      
      searchSectionWrapper.querySelectorAll('.img-title').forEach((img, i) => {
        img.addEventListener('load', imgLoadListenerFunction);
        img.addEventListener('error', imgErrorListenerFunction);
      });
     } else {
        noSearchResultsMessage.classList.add('no-search-results-message-visible');
    };

      if(thereAreSearchResults.length > 0) {
        sizesAndChildren(searchSectionWrapper);
        wrapperChildren.forEach(movieCardFunctionality);    
      };
    
  } else if(inputValue <= 0) {
    inputTimeoutEmptyFunction();
  };
};

let inputTimeout = setTimeout(inputTimeoutFunction, 300);

searchDesktopInput.addEventListener('input', function(e) {
  e.preventDefault();
  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(inputTimeoutFunction, 300);
});

searchMobileInput.addEventListener('input', function(e) {
  e.preventDefault();
  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(inputTimeoutFunction, 300);
});


const activeSearchBar = function() {
  if(searchInput === searchDesktopInput && !searchInput.classList.contains('input-anim')) {
    searchInput.classList.add('input-anim');
    searchDesktopButton.classList.add('search-icon-default-cursor');
    searchInput.focus();
    body.querySelector('.nav-search-container').classList.add('nav-search-container-active');
  };

  if(searchInput === searchMobileInput) {
    searchMobileContainer.classList.add('search-mobile-animation');
    searchMobileButton.classList.add('search-icon-default-cursor');
    searchInput.focus();
  }
};

const outOfFocusSearchBar = function() {
  if(searchInput === searchDesktopInput) {
    searchInput.classList.remove('input-anim');
    searchDesktopButton.classList.remove('search-icon-default-cursor');
    body.querySelector('.nav-search-container').classList.remove('nav-search-container-active'); 
  };

  if(searchInput === searchMobileInput) {
    if(!searchInput.classList.contains('search-mobile-remove-animation')) {
      searchMobileContainer.classList.add('search-mobile-remove-animation');
      searchMobileContainer.addEventListener('animationend', searchMobileContainerAnimationFunction);
    };
    searchMobileContainer.classList.remove('search-mobile-animation');
    searchMobileButton.classList.remove('search-icon-default-cursor');
  };
};

const searchMobileContainerAnimationFunction = function() {
  this.classList.remove('search-mobile-remove-animation');
  removeEventListener('animationend', searchMobileContainerAnimationFunction);
};

     const favoriteListFunction = async function(favorites) {
        for (const movie of favorites) {
          let movieFetchRuntimes = await fetch(`https://api.themoviedb.org/3/${movie.type}/${movie.id}?api_key=${myApiKey}`);
          let movieRuntimesResponse = await movieFetchRuntimes.json();
          childMarkup(favoriteMoviesWrapper, movieRuntimesResponse, movie)
        };

        sizesAndChildren(favoriteMoviesWrapper);
        wrapperChildren.forEach(movieCardFunctionality);    
     };

    
    if(localStorage.getItem('favorites') && JSON.parse(localStorage.getItem('favorites')).length > 0) {
        favoriteListFunction(favorites);
    };

    favoriteMoviesWrapper.addEventListener('click', function(e) {

    if(e.target.classList.contains('remove-from-favorite') || e.target.classList.contains('remove-from-favorite-container')) {

      if(removeFavoriteChildTimeout !== null) {
        clearTimeout(removeFavoriteChildTimeout);
        removeFavoriteChildTimeout = null;

        pendingChildIndexes.forEach((childIndex) => {
          removeFavoriteFromStorage(wrapperChildren[childIndex].dataset.id);
          wrapperChildren[childIndex].remove();
        });
        pendingChildIndexes = [];
        
        if(favoriteMoviesWrapper.querySelector('.remove-undo-container')) favoriteMoviesWrapper.querySelector('.remove-undo-container').remove();
      }; 
    
    };
    
    wrapperChildren = [...favoriteMoviesWrapper.children];

    if(e.target.classList.contains('undo-favorite-removing')) {
      clearTimeout(removeFavoriteChildTimeout);
      removeFavoriteChildTimeout = null;

      pendingChildIndexes = [];
      
      setTimeout(function() {
      wrapperChildren[findChildIndex].classList.remove('remove-from-favorite-list');
      wrapperChildren[findChildIndex].classList.add('undo-remove-from-favorite-list');
      }, 120);

      favoritesMoviesWrapperChildrenTransition();

      e.target.closest('.remove-undo-container').classList.add('remove-undo-container-inactive');
      e.target.closest('.remove-undo-container').addEventListener('animationend', function() {
        this.remove();
      });
    };
  });

    favoriteMoviesActionsContainer.addEventListener('click', function(e) {
  
      if(e.target.classList.contains('close-favorite-list')) {
        favoriteMoviesContainer.classList.remove('section-active');
        favoriteMoviesContainer.classList.add('section-inactive');
        
        if(sectionToGoBackTo === movieSection || sectionToGoBackTo === seriesSection) {
          movieflixHighlightContainer.classList.remove('section-inactive');
          movieflixHighlightContainer.classList.add('section-active');
          movieflixHighlightDivider.classList.remove('section-inactive');
  
          sectionToGoBackTo.classList.remove('section-inactive');
          sectionToGoBackTo.classList.add('section-active');
          sectionActive = sectionToGoBackTo;
          previousActiveSection = sectionToGoBackTo;
        };

        if(sectionToGoBackTo === allMovieTvSection) {
          sectionToGoBackTo.classList.remove('section-inactive');
          sectionToGoBackTo.classList.add('section-active');
          sectionActive = sectionToGoBackTo;
          previousActiveSection = sectionToGoBackTo;
        };
        
        moviesOrSeriesOption.classList.remove('nav-option-inactive');
        moviesOrSeriesOption.classList.add('nav-option-active');
        navOptionLineAnim.classList.remove('nav-option-line-anim-inactive');
    
        navFavoritesButton.classList.add('nav-fav-inactive');
        navFavoritesButtonContainer.classList.remove('nav-fav-active');
        navFavoritesButtonContainer.classList.add('nav-fav-inactive');
        navFavoritesButtonNotification.classList.add('nav-fav-inactive');

        let movieHighlightAddFavorite = movieflixHighlightContainer.querySelector('.movie-highlight-add-favorite-icon');
        let movieHighlightInfo = movieflixHighlightContainer.querySelector('.movie-highlight-info');

        removeFavoriteTimeoutAndUndo();
  
        checkExistingFavoriteStorage(movieHighlightInfo.dataset.id, movieHighlightAddFavorite);

        scrollToTop();
      };

      if(e.target.classList.contains('remove-all-favorite-movies')) {
        const favoriteMoviesWrapperChildren = [...favoriteMoviesWrapper.children];
        for(const favoriteMovie of favoriteMoviesWrapperChildren) {
          favoriteMovie.classList.add('pending-remove-animation');
        }

        removeCheckOverlay.classList.add('remove-check-overlay-active');
        removeCheckOverlay.addEventListener('animationend', function() {
          removeCheckActionsWrapper.classList.add('remove-check-actions-wrapper-active');
          closeRemoveCheckOverlay.classList.add('close-remove-check-overlay-active');
        });
      };
    });

    removeCheckOverlay.addEventListener('click', function(e) {
      const favoriteMoviesWrapperChildren = [...favoriteMoviesWrapper.children];

      if(e.target.classList.contains('remove-cancel')) {
        for(const favoriteMovie of favoriteMoviesWrapperChildren) {
          favoriteMovie.classList.add('remove-pending-remove-animation');
          favoriteMovie.classList.remove('pending-remove-animation');

          favoriteMovie.addEventListener('animationend', function() {
            favoriteMovie.classList.remove('remove-pending-remove-animation');
          });
        };
        removeCheckOverlay.classList.remove('remove-check-overlay-active');
        removeCheckActionsWrapper.classList.remove('remove-check-actions-wrapper-active');
        closeRemoveCheckOverlay.classList.remove('close-remove-check-overlay-active');
      };

      if(e.target.classList.contains('check-yes-remove-all')) {
        removeFavoriteTimeoutAndUndo();
        for (const favoriteMovie of favoriteMoviesWrapperChildren) {
          favoriteMoviesActionRemoveButton.classList.remove('favorite-movies-remove-button-active');
          favoriteMovie.classList.add('favorite-transition-before-remove');
          favoriteMovie.addEventListener('animationend', function() {
            favoriteMovie.remove();
  
            favorites = [];
            favoritesJSON = JSON.stringify(favorites);
            localStorage.setItem('favorites', favoritesJSON);

            favoriteMoviesEmptyList.classList.remove('favorite-movies-empty-list-inactive');
            favoriteMoviesEmptyList.classList.add('favorite-movies-empty-list-active');
            scrollToTop();      
          });
        };
      };
    });

    const movieInfoSectionContainer = document.querySelector('.movie-info-section-container');
    const movieInfoSection = document.querySelector('.movie-info-section');


    const loadImgSimilarMovieInfo = function() {
      if(this.closest('.movie-info-similar-child').firstElementChild) this.closest('.movie-info-similar-child').firstElementChild.remove();
    };

    const errorImgSimilarMovieInfo = function() {
      if(this) this.setAttribute('src', 'svg/not-available.png');
    };

    const loadImgHighlightMovieInfo = function() {
      if(this.previousElementSibling) this.previousElementSibling.remove();
   };
   const errorImgHighlightMovieInfo = function() {
     if(this) this.setAttribute('src', 'svg/not-available.png');
   };

   
    const movieInfoFunction = async function(child) {
      movieInfoSectionContainer.innerHTML = '';
      movieInfoContainerActions.movieInfoFunctionOpen = true;
      movieInfoContainerActions.containerHiddenWhenPlayingTrailer = false;

      if(movieInfoContainerActions.movieInfoFunctionOpen === false) return;
      pageOffSet = window.pageYOffset;

      sectionActive.classList.add('section-fixed');
      footer.classList.toggle('footer-inactive');

      if(sectionActive === movieSection || sectionActive === seriesSection) {
        const movieflixHighlightDividerMargin = Number(window.getComputedStyle(body.querySelector('.movieflix-highlight-divider')).getPropertyValue('margin-bottom').slice(0, -2));
        const movieflixHighlightContainerPosition = Number(window.getComputedStyle(body.querySelector('.movieflix-highlight-container')).getPropertyValue('top').slice(0, -2));

        const fixedMeasurements = `${pageOffSet < movieflixHighlightDividerMargin  ? movieflixHighlightDividerMargin - pageOffSet : -(pageOffSet - movieflixHighlightDividerMargin)}px`; 
        
        sectionActive.style.top = fixedMeasurements;

        movieflixHighlightContainer.classList.add('section-fixed');
        movieflixHighlightContainer.style.top = `${pageOffSet < movieflixHighlightContainerPosition ? movieflixHighlightContainerPosition - pageOffSet : -(pageOffSet - movieflixHighlightContainerPosition)}px`;
      } else {
        sectionActive.style.top = `-${pageOffSet}px`;
      };

      // if(windowInnerWidth <= 800) {
      //   closeInfoSectionMobile.classList.add('close-info-section-mobile-active');
      // } else {
      //   closeInfoSectionMobile.classList.remove('close-info-section-mobile-active');
      // }
      
      scrollToTop();
      movieInfoSection.classList.remove('section-inactive');
      movieInfoSection.classList.add('movie-info-section-active');

      movieInfoSectionContainer.classList.remove('movie-info-section-container-inactive');
      movieInfoSectionContainer.classList.add('movie-info-section-container-active');

      let promise = await fetch(`https://api.themoviedb.org/3/${child.dataset.type}/${child.dataset.id}?api_key=${myApiKey}&append_to_response=release_dates,credits,recommendations`);
      let response = await promise.json();
      
      const yearFunction = function(res) {
        const year = child.dataset.type === 'movie' ? res.release_date.substring(0, 4) : res.first_air_date.substring(0, 4);
        return year;
      };

      const runtimeOrSeasons = function(res) {
        let seasons = res.number_of_seasons <= 1 ? res.number_of_seasons + ' season' : res.number_of_seasons + ' seasons';
        const runtimeOrSeasons = child.dataset.type === 'movie' ? movieRuntimeConvert(res.runtime) : seasons;
        return runtimeOrSeasons;
      };
      
      const movieNameFunction = function(res) {
        let howManyLetters = res === response ? 30 : 23;
        let typeOfTitle = res.title ? res.title : res.original_name;
        let movieName = typeOfTitle.length >= howManyLetters ? typeOfTitle.split('').splice(0, howManyLetters).join('').concat('...') : typeOfTitle;
        return movieName;
      };

      let overview = function(res) {
      const overview = res.overview.length >= 180 ? res.overview.slice(0, 180).concat('...') : res.overview;
      return overview;
    }
     
    let findDirector;
    let findDirectorFunction = function() {
      findDirector = response.credits.crew.find(crew => crew.job === 'Director');
      if(findDirector !== undefined) return `
      <div class="about-director">
        <span class="about-director-title about-title">Director:</span>
        <span class="about-director-content about-content">${findDirector.name}</span>
      </div>
      `;
    }
    findDirectorFunction();

    let releaseDateMarkup = function() {
      if(child.dataset.type === 'movie' && response.release_date) {
        return `Release Date:
        <span class="about-release-date-content about-content">${response.release_date}</span>`
      } else if(child.dataset.type === 'tv' && response.first_air_date) {
        return `First Air Date:
        <span class="about-release-date-content about-content">${response.first_air_date}</span>`
      };
    };

         
      let highlightGenresArray = [];
      let aboutGenresArray = [];
      let castAboutArray = [];
      let castHighlightArray = [];
      let productionCompaniesArray = [];

      for(let i = 0; i < response.genres.length; i++) {
        aboutGenresArray.push(" " + response.genres[i].name);
      };

      for(let i = 0; i < 3 && i < response.genres.length; i++) {
        highlightGenresArray.push(" " + response.genres[i].name);
      };

      for(let i = 0; i < 3 && i < response.credits.cast.length; i++) {
        castHighlightArray.push(" " + response.credits.cast[i].name);
      };

      for(let i = 0; i < 11 && i < response.credits.cast.length; i++) {
        castAboutArray.push(" " + response.credits.cast[i].name);
      };

      for(let i = 0; i < 5 && i < response.production_companies.length; i++) {
        productionCompaniesArray.push(" " + response.production_companies[i].name);
      };

      movieInfoSectionContainer.dataset.id = child.dataset.id;
      movieInfoSectionContainer.dataset.type = child.dataset.type;
      movieInfoSectionContainer.dataset.name = child.dataset.name;


      movieInfoSectionContainer.insertAdjacentHTML('afterbegin', `
      <div class="close-info-section-mobile-container close-info-section-mobile">
        <i class="fas fa-arrow-left close-info-section-mobile"></i>
      </div>
      <button class="close-movie-info-section-button close-movie-info-section"><i class="close-movie-info-section fas fa-times"></i></button>
      <div class="movie-info-section-highlight-actions">
      <div class="movie-info-section-highlight-image-container">
        <div class="movie-info-section-highlight-image-loader"></div>
        <img alt="Image for: ${response.title ? response.title : response.original_name}" src="${baseImgUrl}/w780/${response.poster_path}" alt="" class="movie-info-section-highlight-image">
        <div class="movie-info-section-image-overlay user-select-none"></div>
      </div>
      
      <div class="movie-info-section-title-actions">
        <h1 class="movie-info-section-title">${movieNameFunction(response)}</h1>
        <div class="movie-info-section-highlight-actions">
          <button class="movie-info-section-play-highlight info-section-play-highlight user-select-none">
            <i class="fas fa-play info-section-play-highlight"></i> Play
          </button>
          <button class="add-to-favorite-info-section-highlight-container info-section-favorite-container">
            <div class="movie-info-section-favorite-highlight-message info-section-favorite-message user-select-none">Add to favorite</div>
            <i class="fas fa-plus add-to-favorite-info-section-highlight info-section-add-favorite"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="movie-info-section-highlight-informations-container">
      <div class="movie-info-section-highlight-top-informations">
        <span class="movie-info-section-highlight-rating">Rating: ${response.vote_average}/10</span>
        <span class="movie-info-section-highlight-year">${yearFunction(response)}</span>
        <span class="movie-info-section-highlight-language">${response.original_language}</span>
        <span class="movie-info-section-highlight-runtime">${runtimeOrSeasons(response)}</span>
      </div>

      <p class="movie-info-section-highlight-overview">${overview(response)}</p>

      <div class="movie-info-section-highlight-cast-genres">
        <div class="movie-info-section-highlight-cast"><span class="cast-title">Cast:</span> ${[...castHighlightArray]},<span class="more-cast user-select-none">more</span></div>
        <div class="movie-info-section-highlight-genres"><span class="genres-title">Genres:</span> ${[...highlightGenresArray]}</div>
      </div>
    </div>

    <h2 class="movie-info-similar-titles-title">Similar titles</h2>
    <div class="movie-info-section-similar-wrapper"></div>
    </div>
    <h2 class="movie-info-section-about-title">About <span>${response.title ? response.title : response.original_name}</span></h2>

    <div class="movie-info-section-about">
      ${findDirector !== undefined ? findDirectorFunction() : ''}
      <div class="about-production-companies">
        Production Companies:
        <span class="about-production-companies-content about-content">${[...productionCompaniesArray]}</span>
      </div>
      <div class="about-cast">
      Cast:
      <span class="about-cast-content about-content">${[...castAboutArray]}</span>
      </div>
      <div class="about-genres">
      Genres:
      <span class="about-genres-content about-content">${[...aboutGenresArray]}</span>
      </div>
      <div class="about-movie-status">
        Status:
        <span class="about-movie-status-content about-content">${response.status}</span>
      </div>
      <div class="about-release-date">
        ${releaseDateMarkup()}
      </div>
    </div>
`);

const addToFavoriteHighlightContainer = movieInfoSectionContainer.querySelector('.add-to-favorite-info-section-highlight-container');
const addToFavoriteHighlight = movieInfoSectionContainer.querySelector('.add-to-favorite-info-section-highlight');
const addToFavoriteHighlightMessage = movieInfoSectionContainer.querySelector('.movie-info-section-favorite-highlight-message');

const movieInfoSectionHighlightImageLoader =  movieInfoSectionContainer.querySelector('.movie-info-section-highlight-image-loader');
const movieInfoSectionHighlightImage = movieInfoSectionContainer.querySelector('.movie-info-section-highlight-image');

checkExistingFavoriteStorage(child.dataset.id, addToFavoriteHighlight, addToFavoriteHighlightContainer, addToFavoriteHighlightMessage);

movieInfoSectionHighlightImage.addEventListener('load', loadImgHighlightMovieInfo);
movieInfoSectionHighlightImage.addEventListener('error', errorImgHighlightMovieInfo);
   
for(let i = 0; i <= response.recommendations.results.length - 1; i++) {
if(movieInfoContainerActions.movieInfoFunctionOpen === false || response.recommendations.results.length === 0 || i === 9) break;

 movieInfoSectionContainer.querySelector('.movie-info-section-similar-wrapper').insertAdjacentHTML('beforeend', `
 <div class="movie-info-similar-child movie-info-section-child">
   <div class="child-loader child-loader-${i}"></div>
 </div>
 `);
};

const similarChild = movieInfoSectionContainer.querySelectorAll('.movie-info-similar-child');
for(const recommendation of response.recommendations.results) {
  let findIndexOfChild = Number(response.recommendations.results.indexOf(recommendation));

  if(movieInfoContainerActions.movieInfoFunctionOpen === false) return;

  if(response.recommendations.results.indexOf(recommendation) <= 8) {

    const recommendationPromise = await fetch(`https://api.themoviedb.org/3/${child.dataset.type}/${recommendation.id}?api_key=${myApiKey}&append_to_response=release_dates,credits`);
    const recommendationResponse = await recommendationPromise.json();
    

      similarChild[findIndexOfChild].dataset.id = recommendationResponse.id;
      similarChild[findIndexOfChild].dataset.type = child.dataset.type;
      similarChild[findIndexOfChild].dataset.name = recommendationResponse.title ? recommendationResponse.title : recommendationResponse.original_name;

      similarChild[findIndexOfChild].insertAdjacentHTML('beforeend', `
        <div class="movie-info-similar-image-container">
          <img src="${recommendationResponse.poster_path ? `${baseImgUrl}/w300/${recommendationResponse.poster_path}` : "svg/not-available.png"}" alt="Image for:${recommendationResponse.title ? recommendationResponse.title : recommendationResponse.original_name}" class="movie-info-similar-image user-select-none" data-number='${findIndexOfChild}'>
          <div class="movie-info-similar-image-overlay"></div>
          <div class="movie-info-similar-language-maturity">
            <span class="movie-info-similar-language">${recommendationResponse.original_language}</span>
          </div>

          <div class="movie-info-similar-title-informations">
            <h3 class="movie-info-similar-title">${movieNameFunction(recommendationResponse)}</h3>
            <div class="movie-info-similar-informations">
              <span class="movie-info-similar-rating">Rating: ${recommendationResponse.vote_average}</span>
              <span class="green-delimitator"></span>
              <span class="movie-info-similar-year">${yearFunction(recommendationResponse)}</span>
              <span class="green-delimitator"></span>
              <span class="movie-info-similar-duration">${runtimeOrSeasons(recommendationResponse)}</span>
            </div>
          </div>
        </div>

        <div class="movie-info-similar-actions">
          <button class="movie-info-similar-play-trailer info-similar-play-trailer user-select-none"><i class="fas fa-play info-similar-play-trailer"></i> Play</button>
          <button class="movie-info-similar-add-favorite-container info-section-favorite-container">
          <i class="fas fa-plus movie-info-similar-add-favorite info-section-add-favorite"></i>
          <div class="movie-info-section-favorite-similar-message info-section-favorite-message user-select-none">Add to favorite</div>
          </button>
        </div>

        <p class="movie-info-similar-overview">${overview(recommendationResponse)}</p>
      `);
      const allSimilarChildImages = movieInfoSectionContainer.querySelectorAll('.movie-info-similar-image');

        allSimilarChildImages[findIndexOfChild].addEventListener('load', loadImgSimilarMovieInfo);
        allSimilarChildImages[findIndexOfChild].addEventListener('error', errorImgSimilarMovieInfo);

      const movieInfoSimilarAddToFavoriteContainer = similarChild[findIndexOfChild].querySelector('.movie-info-similar-add-favorite-container');
      const movieInfoSimilarAddToFavorite = similarChild[findIndexOfChild].querySelector('.movie-info-similar-add-favorite');
      const movieInfoSimilarAddToFavoriteMessage = similarChild[findIndexOfChild].querySelector('.movie-info-section-favorite-similar-message');

      checkExistingFavoriteStorage(recommendationResponse.id.toString(), movieInfoSimilarAddToFavorite, movieInfoSimilarAddToFavoriteContainer, movieInfoSimilarAddToFavoriteMessage);
    };
  };
};


movieInfoSection.addEventListener('click', function(e) {
  movieInfoContainerActions.movieInfoFunctionOpen = false;
  const movieInfoSectionHighlightImage = movieInfoSectionContainer.querySelector('.movie-info-section-highlight-image');
  const movieInfoSectionSimilarImg = movieInfoSectionContainer.querySelectorAll('.movie-info-similar-image');

  if(e.target.classList.contains('info-section-play-highlight')) {
    movieInfoContainerActions.containerHiddenWhenPlayingTrailer = true;

    movieInfoSection.classList.add('section-inactive');
    movieInfoSection.classList.remove('movie-info-section-active');
    movieTrailerFunctionality(movieInfoSectionContainer);
    addToFavoriteContainerTrailer.classList.add('add-to-favorite-trailer-inactive');
  };

  if(e.target.classList.contains('info-similar-play-trailer')) {
    movieInfoContainerActions.containerHiddenWhenPlayingTrailer = true;

    const similarChild = e.target.closest('.movie-info-similar-child');

    movieInfoSection.classList.add('section-inactive');
    movieInfoSection.classList.remove('movie-info-section-active');
    movieTrailerFunctionality(similarChild);
    addToFavoriteContainerTrailer.classList.add('add-to-favorite-trailer-inactive');
  };


  if(e.target.classList.contains('info-section-favorite-container') || e.target.classList.contains('info-section-add-favorite')) {
    const child = e.target.closest('.movie-info-section-child');
    const addToFavoriteContainer = e.target.closest('.movie-info-section-child').querySelector('.info-section-favorite-container');
    const addToFavorite = e.target.closest('.movie-info-section-child').querySelector('.info-section-add-favorite');
    const addToFavoriteMessage = e.target.closest('.movie-info-section-child').querySelector('.info-section-favorite-message');


    addToFavoriteFunction(e, child, addToFavorite, addToFavoriteContainer, addToFavoriteMessage);
  };


  if(e.target.classList.contains('close-movie-info-section') || e.target.classList.contains('movie-info-section-active') || e.target.classList.contains('close-info-section-mobile')) {
    setTimeout(function() {
      movieInfoContainerActions.containerHiddenWhenPlayingTrailer = false;
      movieInfoSection.classList.add('section-inactive');
      movieInfoSection.classList.remove('movie-info-section-active');
      sectionActive.classList.remove('section-fixed');
      sectionActive.style.top = '';
      window.scrollTo({top: pageOffSet, behavior: 'auto'});
  
      sectionActive.classList.remove('section-fixed');
      footer.classList.toggle('footer-inactive');
  
      movieflixHighlightContainer.classList.remove('section-fixed');
      movieflixHighlightContainer.style.top = '';

      for(const child of movieInfoSectionContainer.children) {
        child.remove();
      };
    }, 300);
        

    movieInfoSectionHighlightImage.removeEventListener('load', loadImgHighlightMovieInfo);
    movieInfoSectionHighlightImage.removeEventListener('error', errorImgHighlightMovieInfo);

    for(const img of movieInfoSectionSimilarImg) {
      img.removeEventListener('load', loadImgSimilarMovieInfo);
      img.removeEventListener('error', errorImgSimilarMovieInfo);
    };

    movieInfoSectionContainer.classList.remove('movie-info-section-container-active');
    movieInfoSectionContainer.classList.add('movie-info-section-container-inactive');
  };

  if(e.target.classList.contains('more-cast')) {
    window.scrollTo({top: movieInfoSectionContainer.scrollHeight, behavior:'smooth'});
  };
});

let allMovieTvObserver;

let allMovieTvInit = false;
let allMovieTvGenreId;
let allMovieTvGenreName;
let allMovieTvResults;
let thisIsLastPage = false;

let stopObserving = false;
let allMovieTvController = new AbortController();
let allMovieTvSignal = allMovieTvController.signal;

let allMovieTvInitTimeout = null;

const allMovieTvFunction = async function() {
  stopObserving = false;
  allMovieTvSectionCounter++;
  
  
  if(Number(allMovieTvSectionTotalPages) === allMovieTvSectionCounter && allMovieTvSectionCounter !== 1) thisIsLastPage = true;
  if(allMovieTvSectionCounter === 10) thisIsLastPage = true;

  if(Number(allMovieTvSectionTotalPages) >= allMovieTvSectionCounter && allMovieTvSectionCounter <= 10) {

    const promise1 = await fetch(`https://api.themoviedb.org/3/discover/${moviesOrSeries}?api_key=${myApiKey}&language=en-US&include_adult=false&include_video=false&page=${allMovieTvSectionCounter
  }&with_watch_monetization_types=flatrate&with_genres=${allMovieTvGenreId}&vote_count.gte=300
    `, {allMovieTvSignal});
    const response1 = await promise1.json();
    allMovieTvResults = response1.results.length;

    if(promise1.ok === true) {
      allMovieTvSectionTotalPages = response1.total_pages;
      
      if(allMovieTvInit === false) {
        allMovieTvInitTimeout = setTimeout(function() {
          movieflixHighlightDivider.classList.add('section-inactive');
          toggleSectionVisibility();  
          if(body.querySelector('.movieflix-loader-container')) body.querySelector('.movieflix-loader-container').remove();
          body.classList.remove('body-overflow-hidden');
          allMovieTvInit = true;

          allMovieTvInitTimeout = null;
        }, 700);
      };

      loadingSpinner.classList.remove('loading-spinner-active');
    };
  
    for(const res of response1.results) {
      childMarkup(allMovieTvWrapper, res);
    };

    sizesAndChildren(allMovieTvWrapper);
    wrapperChildren.forEach(movieCardFunctionality);
  
    allMovieTvWrapper.querySelectorAll('.img-title').forEach((img) => {
      img.addEventListener('load', imgLoadListenerFunction);
      img.addEventListener('error', imgErrorListenerFunction);
    });
    
    allMovieTvObserver = new IntersectionObserver(function(entries) {
      if(entries[0].isIntersecting && entries[0].target.dataset.observed === 'false' && thisIsLastPage === true) {
        allMovieTvWrapper.insertAdjacentHTML('beforeend', `
          <p class="all-movie-tv-results-end">END OF RESULTS</p>
        `);

        allMovieTvObserver.unobserve(entries[0].target);
        entries[0].target.dataset.observed = 'true';
      };

      if(entries[0].isIntersecting && entries[0].target.dataset.observed === 'false' && thisIsLastPage === false ) {
        loadingSpinner.classList.add('loading-spinner-active');

        allMovieTvObserver.unobserve(entries[0].target);
        entries[0].target.dataset.observed = 'true';

        allMovieTvFunction();
      } 
    }, {root: null, threshold: 1});
  
    allMovieTvObserver.observe(allMovieTvWrapper.lastElementChild);
  };
};

main.addEventListener('click', function(e) {
  // if(!e.target.closest('.slider-title-movie') || !e.target.closest('.slider-title-tv')) return;
  if(e.target.closest('.slider-title-movie') || e.target.closest('.slider-title-tv')) {
    const sliderTitle = e.target.closest(`.slider-title-${moviesOrSeries}`);
    allMovieTvGenreId = sliderTitle.dataset.genreId;
    allMovieTvGenreName = sliderTitle.dataset.name;

    allMovieTvTitle.innerHTML = '';
    allMovieTvTitle.insertAdjacentHTML('afterbegin', `
    <h2 class="all-movie-tv-title"><i class="fas fa-arrow-left close-all-movie-tv-section"></i>${allMovieTvGenreName} ${moviesOrSeries === 'movie' ? 'Movies' : 'TV Series'}</h2>
    `);
    
    scrollToTop();

    body.insertAdjacentHTML('afterbegin', movieflixLoaderContainerMarkup);
    body.classList.add('body-overflow-hidden');
    
    movieflixLoaderAnimation();

    previousActiveSection = allMovieTvSection;
    sectionToGoBackTo = allMovieTvSection;
    sectionActive = allMovieTvSection;

    allMovieTvFunction();
  };
});

allMovieTvSection.addEventListener('click', function(e) {
  if(e.target.classList.contains('close-all-movie-tv-section')) {
    removeContentAllTvMoviesSection();
    moviesOrSeries === 'movie' ? sectionActive = movieSection : sectionActive = seriesSection;

    sectionToGoBackTo = sectionActive;
    previousActiveSection = sectionActive;

    toggleSectionVisibility();
    scrollToTop()
    
    movieflixHighlightContainer.classList.remove('section-inactive');
    movieflixHighlightContainer.classList.add('section-active');
    movieflixHighlightDivider.classList.remove('section-inactive');
  };
});

