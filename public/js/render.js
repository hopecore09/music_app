import { state, els } from './state.js';
import { playSong, togglePlay } from './player.js';

export function render() {
  state.view === 'table' ? renderTable() : renderGallery();
}

function renderTable() {
  els.tableContainer.style.display = 'block';
  els.galleryContainer.classList.add('d-none');
  els.tableViewBtn.className = 'btn btn-primary active';
  els.galleryViewBtn.className = 'btn btn-outline-primary';
  
  let html = '';
  state.songs.forEach(function(s) {
    const expanded = state.expanded === s.id;
    html += `<tr class="${expanded ? 'table-active' : ''}" style="cursor:pointer;" data-id="${s.id}">
      <td>${s.id}</td><td>${s.title}</td><td>${s.artist}</td><td>${s.album}</td>
      <td><span class="badge bg-secondary">${s.genre}</span></td>
    </tr>`;
    
    if (expanded) {
      html += `<tr><td colspan="5" class="p-0">
        <div class="p-3 bg-light"><div class="row">
          <div class="col-md-4 text-center">
            <div style="position:relative; display:inline-block;">
              <img src="data:image/png;base64,${s.cover}" class="img-fluid rounded" style="max-width:250px; width:100%;" alt="${s.title}">
              <div style="position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent, rgba(0,0,0,0.7)); padding:20px 10px 15px; border-radius:0 0 8px 8px;">
                <div style="color:white; font-weight:bold; font-size:18px; text-shadow:0 2px 4px rgba(0,0,0,0.5);">${s.title}</div>
                <div style="color:rgba(255,255,255,0.8); font-size:14px; text-shadow:0 1px 2px rgba(0,0,0,0.5);">${s.artist}</div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <h3>${s.title}</h3>
            <p class="text-muted">${s.artist}</p>
            <p><strong>Album:</strong> ${s.album}</p>
            <p><span class="badge bg-secondary">${s.genre}</span></p>
            <p><strong>Likes:</strong> ${s.likes}</p>
            <button class="btn btn-success btn-sm play-btn" data-id="${s.id}"><i class="fas fa-play me-1"></i>Play</button>
            ${s.reviews?.length ? `<div class="mt-2"><strong>Reviews:</strong>${s.reviews.map(r => `<div class="bg-white p-2 rounded mb-1 border-start border-3 border-success">${r}</div>`).join('')}</div>` : ''}
          </div>
        </div></div>
      </td></tr>`;
    }
  });
  els.tableBody.innerHTML = html;
  
  document.querySelectorAll('#tableBody tr:not(:has(td.p-0))').forEach(function(tr) {
    tr.onclick = function() {
      const id = parseInt(this.dataset.id);
      state.expanded = state.expanded === id ? null : id;
      render();
    };
  });
  
  document.querySelectorAll('.play-btn').forEach(function(btn) {
    btn.onclick = function(e) {
      e.stopPropagation();
      const song = state.songs.find(s => s.id === parseInt(this.dataset.id));
      if (song) { playSong(song); setTimeout(togglePlay, 100); }
    };
  });
  
  els.pageInfo.textContent = 'Page ' + state.page;
}

function renderGallery() {
  els.tableContainer.style.display = 'none';
  els.galleryContainer.classList.remove('d-none');
  els.tableViewBtn.className = 'btn btn-outline-primary';
  els.galleryViewBtn.className = 'btn btn-primary active';
  
  if (state.page === 1) {
    els.galleryGrid.innerHTML = '';
    appendGalleryItems(state.songs);
  }
}

export function appendGalleryItems(songs) {
  if (!songs?.length) return;
  
  const html = songs.map(s => `
    <div class="col">
      <div class="card h-100 shadow-sm gallery-card" style="cursor:pointer;border-radius:12px;overflow:hidden;" data-id="${s.id}">
        <div style="position:relative;">
          <img src="data:image/png;base64,${s.cover}" class="card-img-top" style="height:200px;object-fit:cover;" alt="${s.title}">
          <div style="position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent, rgba(0,0,0,0.7)); padding:12px 10px 10px;">
            <div style="color:white; font-weight:bold; font-size:14px; text-shadow:0 1px 3px rgba(0,0,0,0.6);">${s.title}</div>
            <div style="color:rgba(255,255,255,0.8); font-size:12px; text-shadow:0 1px 2px rgba(0,0,0,0.5);">${s.artist}</div>
          </div>
        </div>
        <div class="card-body" style="padding:12px;">
          <span class="badge bg-secondary" style="font-size:11px;">${s.genre}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  els.galleryGrid.innerHTML += html;
  
  document.querySelectorAll('.gallery-card').forEach(function(card) {
    card.onclick = function() {
      const id = parseInt(this.dataset.id);
      state.view = 'table';
      state.expanded = id;
      render();
    };
  });
}

export function resetGallery() {
  els.galleryGrid.innerHTML = '';
}

export function setLoading(value) {
  value ? els.loading.classList.remove('d-none') : els.loading.classList.add('d-none');
}
