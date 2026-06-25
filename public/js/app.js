import { API } from './api.js';
import { state, els, formatTime } from './state.js';
import { playSong, togglePlay, seekPlayback, stopPlayback } from './player.js';
import { render, appendGalleryItems, setLoading, resetGallery } from './render.js';

let isLoading = false;
let hasMore = true;

function loadLocales() {
  API.locales().then(function(locales) {
    els.locale.innerHTML = locales.map(l => `<option value="${l.code}">${l.name}</option>`).join('');
    els.locale.value = state.locale;
  });
}

function loadSongs() {
  setLoading(true);
  API.songs({
    locale: state.locale,
    seed: state.seed,
    likes: state.likes,
    reviews: state.reviews,
    page: state.page,
    size: 20
  }).then(function(data) {
    if (data.songs.length === 0) {
      hasMore = false;
    } else if (state.view === 'gallery' && state.page > 1) {
      state.songs = state.songs.concat(data.songs);
      appendGalleryItems(data.songs);
    } else {
      state.songs = data.songs;
      render();
    }
    setLoading(false);
    isLoading = false;
  });
}

function update() {
  state.locale = els.locale.value;
  state.seed = parseInt(els.seed.value) || 0;
  state.likes = parseFloat(els.likes.value);
  state.reviews = parseFloat(els.reviews.value);
  
  els.likesVal.textContent = state.likes.toFixed(1);
  els.reviewsVal.textContent = state.reviews.toFixed(1);
  
  if (state.view === 'gallery') {
    state.songs = [];
    resetGallery();
    loadSongs();
  } else {
    loadSongs();
  }
}

function handleScroll() {
  if (state.view !== 'gallery' || isLoading || !hasMore) return;
  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;
  if (nearBottom) {
    isLoading = true;
    state.page++;
    loadSongs();
  }
}

function toggleView(view) {
  state.view = view;
  state.page = 1;
  state.expanded = null;
  hasMore = true;
  state.songs = [];
  
  if (view === 'gallery') {
    document.getElementById('tablePagination').style.display = 'none';
    resetGallery();
  } else {
    document.getElementById('tablePagination').style.display = 'block';
  }
  
  loadSongs();
}

els.locale.onchange = update;
els.seed.onchange = update;

els.randomSeed.onclick = function() {
  els.seed.value = Math.floor(Math.random() * 1000000);
  update();
};

els.likes.oninput = function() {
  state.likes = parseFloat(els.likes.value);
  els.likesVal.textContent = state.likes.toFixed(1);
};

els.reviews.oninput = function() {
  state.reviews = parseFloat(els.reviews.value);
  els.reviewsVal.textContent = state.reviews.toFixed(1);
};

els.likes.onchange = update;
els.reviews.onchange = update;

els.tableViewBtn.onclick = function() {
  toggleView('table');
};

els.galleryViewBtn.onclick = function() {
  toggleView('gallery');
};

els.prevPage.onclick = function() {
  if (state.page > 1) {
    state.page--;
    state.expanded = null;
    loadSongs();
  }
};

els.nextPage.onclick = function() {
  state.page++;
  state.expanded = null;
  loadSongs();
};

els.playerPlay.onclick = togglePlay;

els.playerPrev.onclick = function() {
  const idx = state.songs.findIndex(s => s.id === state.currentSong?.id);
  if (idx > 0) { playSong(state.songs[idx - 1]); setTimeout(togglePlay, 100); }
};

els.playerNext.onclick = function() {
  const idx = state.songs.findIndex(s => s.id === state.currentSong?.id);
  if (idx < state.songs.length - 1) { playSong(state.songs[idx + 1]); setTimeout(togglePlay, 100); }
};

els.playerProgress.oninput = function(e) {
  seekPlayback(e.target.value);
};

document.onkeydown = function(e) {
  if (['INPUT', 'SELECT'].includes(e.target.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight') els.playerNext.click();
  if (e.code === 'ArrowLeft') els.playerPrev.click();
};

window.onscroll = handleScroll;

els.seed.value = state.seed;
els.likes.value = state.likes;
els.reviews.value = state.reviews;
els.likesVal.textContent = state.likes.toFixed(1);
els.reviewsVal.textContent = state.reviews.toFixed(1);

loadLocales();
loadSongs();