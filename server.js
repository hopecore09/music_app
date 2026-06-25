import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import apiRoutes from './src/server/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});
