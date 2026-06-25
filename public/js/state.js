export const state = {
  locale: 'en',
  seed: 0,
  likes: 5,
  reviews: 3,
  page: 1,
  view: 'table',
  songs: [],
  expanded: null,
  currentSong: null,
  isPlaying: false,
  progress: 0,
  duration: 30,
  audioCtx: null,
  timer: null,
  notes: []
};

export const els = {
  locale: document.getElementById('locale'),
  seed: document.getElementById('seed'),
  randomSeed: document.getElementById('randomSeed'),
  likes: document.getElementById('likes'),
  likesVal: document.getElementById('likesVal'),
  reviews: document.getElementById('reviews'),
  reviewsVal: document.getElementById('reviewsVal'),
  tableViewBtn: document.getElementById('tableViewBtn'),
  galleryViewBtn: document.getElementById('galleryViewBtn'),
  tableContainer: document.getElementById('tableContainer'),
  galleryContainer: document.getElementById('galleryContainer'),
  tableBody: document.getElementById('tableBody'),
  galleryGrid: document.getElementById('galleryGrid'),
  prevPage: document.getElementById('prevPage'),
  nextPage: document.getElementById('nextPage'),
  pageInfo: document.getElementById('pageInfo'),
  loading: document.getElementById('loading'),
  playerBar: document.getElementById('playerBar'),
  playerCover: document.getElementById('playerCover'),
  playerTitle: document.getElementById('playerTitle'),
  playerArtist: document.getElementById('playerArtist'),
  playerPlay: document.getElementById('playerPlay'),
  playerPrev: document.getElementById('playerPrev'),
  playerNext: document.getElementById('playerNext'),
  playerProgress: document.getElementById('playerProgress'),
  playerCurrent: document.getElementById('playerCurrent'),
  playerDuration: document.getElementById('playerDuration')
};

export function formatTime(s) {
  if (!s) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}