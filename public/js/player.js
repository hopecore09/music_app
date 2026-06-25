import { state, els, formatTime } from './state.js';

export function playSong(song) {
  stopPlayback();
  
  state.currentSong = song;
  state.progress = 0;
  state.isPlaying = false;
  
  els.playerCover.src = 'data:image/png;base64,' + song.cover;
  els.playerTitle.textContent = song.title;
  els.playerArtist.textContent = song.artist;
  
  try {
    const decoded = atob(song.midi);
    state.notes = JSON.parse(decoded);
    state.duration = state.notes.length ? state.notes[state.notes.length - 1].time + state.notes[state.notes.length - 1].duration : 30;
  } catch {
    state.notes = generateFakeNotes();
    state.duration = 30;
  }
  
  els.playerDuration.textContent = formatTime(state.duration);
  els.playerProgress.value = 0;
  els.playerCurrent.textContent = '0:00';
  els.playerBar.classList.remove('d-none');
  updatePlayBtn();
}

function generateFakeNotes() {
  const notes = [];
  const base = 48 + Math.floor(Math.random() * 24);
  let time = 0;
  for (let i = 0; i < 80; i++) {
    notes.push({
      pitch: base + Math.floor(Math.random() * 24),
      duration: 0.15 + Math.random() * 0.45,
      velocity: 50 + Math.random() * 77,
      time: time
    });
    time += 0.15 + Math.random() * 0.45 + (Math.random() < 0.15 ? 0.1 : 0);
  }
  return notes;
}

export function togglePlay() {
  if (!state.currentSong) return;
  state.isPlaying ? pausePlayback() : startPlayback();
}

function startPlayback() {
  if (!state.notes?.length) return;
  
  state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  state.isPlaying = true;
  updatePlayBtn();
  
  const startTime = state.audioCtx.currentTime - state.progress;
  
  state.notes.forEach(function(note) {
    const noteStart = startTime + note.time;
    if (noteStart < state.audioCtx.currentTime) return;
    
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    
    osc.frequency.value = 440 * Math.pow(2, (note.pitch - 69) / 12);
    osc.type = ['sine', 'square', 'sawtooth'][Math.floor(Math.random() * 3)];
    
    const vel = note.velocity / 127;
    gain.gain.setValueAtTime(vel * 0.3, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.duration);
    
    osc.start(noteStart);
    osc.stop(noteStart + note.duration);
  });
  
  const start = Date.now() - state.progress * 1000;
  state.timer = setInterval(function() {
    if (state.isPlaying) {
      state.progress = Math.min((Date.now() - start) / 1000, state.duration);
      els.playerProgress.value = state.progress / state.duration;
      els.playerCurrent.textContent = formatTime(state.progress);
      if (state.progress >= state.duration) stopPlayback();
    }
  }, 100);
}

function pausePlayback() {
  state.isPlaying = false;
  updatePlayBtn();
  clearInterval(state.timer);
  if (state.audioCtx) {
    state.audioCtx.close();
    state.audioCtx = null;
  }
}

export function stopPlayback() {
  pausePlayback();
  state.progress = 0;
  els.playerProgress.value = 0;
  els.playerCurrent.textContent = '0:00';
}

function updatePlayBtn() {
  const icon = state.isPlaying ? 'fa-pause' : 'fa-play';
  els.playerPlay.innerHTML = `<i class="fas ${icon}" style="margin-left:2px;"></i>`;
}

export function seekPlayback(value) {
  if (!state.currentSong) return;
  const wasPlaying = state.isPlaying;
  if (wasPlaying) pausePlayback();
  state.progress = parseFloat(value) * state.duration;
  els.playerCurrent.textContent = formatTime(state.progress);
  if (wasPlaying) setTimeout(startPlayback, 50);
}