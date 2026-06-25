export var API = {
  locales: function() {
    return fetch('/api/locales').then(function(r) { return r.json(); });
  },
  songs: function(p) {
    return fetch('/api/songs?' + new URLSearchParams(p)).then(function(r) { return r.json(); });
  }
};