import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { loadLocales, loadGenres, pickRandom, fractionalRound } from './utils.js';
import { generateCover } from './covers.js';
import { generateMidi } from './midi.js';

const cache = new Map();

const REVIEW_TEMPLATES = {
  en: [
    'This {adj} track by {artist} is {adv} amazing!',
    'The {noun1} and {noun2} in {song} blend perfectly.',
    '{artist} made a {adj} masterpiece.',
    'Been listening to {song} on repeat all {time}.',
    'This song gives me {emotion} every time.',
    'The {adj1} melody and {adj2} rhythm make this unforgettable.',
    'Perfect for {activity}! This song is {adj}.',
    'This is the {adj} song I heard in {time}.'
  ],
  de: [
    'Dieser {adj} Track von {artist} ist {adv} großartig!',
    'Die {noun1} und {noun2} in {song} verschmelzen perfekt.',
    '{artist} hat ein {adj} Meisterwerk geschaffen.',
    'Höre {song} seit {time} in Dauerschleife.',
    'Dieser Song löst {emotion} bei mir aus.',
    'Die {adj1} Melodie und der {adj2} Rhythmus machen unvergesslich.',
    'Perfekt für {activity}! Dieser Song ist {adj}.',
    'Das ist der {adj} Song, den ich in {time} gehört habe.'
  ]
};

export class SongGenerator {
  constructor({ seed, locale, avgLikes, avgReviews }) {
    this.baseSeed = seed;
    this.locale = locale;
    this.avgLikes = avgLikes;
    this.avgReviews = avgReviews;
  }
  
  async generateBatch(page, size) {
    const start = (page - 1) * size;
    const songs = [];
    for (let i = 0; i < size; i++) {
      songs.push(await this.getSong(start + i));
    }
    return songs;
  }
  
  async getSong(index) {
    const seed = this.baseSeed + index;
    const song = await this.getContent(seed);
    
    const likesRng = seedrandom(`${seed}-likes`);
    const reviewsRng = seedrandom(`${seed}-reviews`);
    
    const likes = fractionalRound(likesRng, this.avgLikes);
    const count = fractionalRound(reviewsRng, this.avgReviews);
    const allReviews = this.generateReviews(reviewsRng);
    const reviews = allReviews.slice(0, count);
    
    return { id: index + 1, ...song, likes, reviews };
  }
  
  async getContent(seed) {
    const key = `${seed}-${this.locale}`;
    if (cache.has(key)) return cache.get(key);
    const localeHash = this.locale.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const localeSeed = seed + localeHash;
    const rng = seedrandom(localeSeed.toString());
    
    const locales = await loadLocales();
    const genres = await loadGenres();
    const cfg = locales[this.locale] || locales.en;
    
    faker.seed(Math.floor(rng() * 1000000));
    
    const title = faker.music.songName();
    const artist = rng() < 0.5 ? faker.company.name() : faker.person.fullName();
    const album = rng() < 0.3 ? 'Single' : `${faker.word.adjective()} ${faker.word.noun()}`;
    const genre = pickRandom(genres, rng);
    const cover = await generateCover(seed + 1000);
    const midi = await generateMidi(seed + 2000);
    
    const song = { title, artist, album, genre, cover, midi };
    cache.set(key, song);
    return song;
  }
  
  generateReviews(rng) {
    const templates = REVIEW_TEMPLATES[this.locale] || REVIEW_TEMPLATES.en;
    const reviews = [];
    
    for (let i = 0; i < 10; i++) {
      const rr = seedrandom(rng() + i);
      let template = pickRandom(templates, rr);
      
      const wr = seedrandom(rng() + i + 100);
      faker.seed(Math.floor(wr() * 1000000));
      
      const words = {
        adj: faker.word.adjective,
        adj1: faker.word.adjective,
        adj2: faker.word.adjective,
        adv: faker.word.adverb,
        artist: faker.person.fullName,
        song: faker.music.songName,
        noun1: faker.word.noun,
        noun2: faker.word.noun,
        emotion: faker.word.noun,
        activity: faker.word.noun,
        time: faker.date.weekday
      };
      
      Object.keys(words).forEach(key => {
        template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), words[key]());
      });
      
      reviews.push(template);
    }
    
    return reviews;
  }
}
