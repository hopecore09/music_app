import express from 'express';
import { SongGenerator } from './generator.js';
import { loadLocales, loadGenres } from './utils.js';

const router = express.Router();

router.get('/locales', async (_, res) => {
  res.json(Object.values(await loadLocales()));
});

router.get('/genres', async (_, res) => {
  res.json(await loadGenres());
});

router.get('/songs', async (req, res) => {
  const { seed = 12345, locale = 'en', likes = 5, reviews = 3, page = 1, size = 20 } = req.query;
  
  const gen = new SongGenerator({
    seed: Number(seed),
    locale: locale,
    avgLikes: Number(likes),
    avgReviews: Number(reviews)
  });
  
  const songs = await gen.generateBatch(Number(page), Number(size));
  res.json({ songs, page: Number(page), hasMore: songs.length === Number(size) });
});

export default router;