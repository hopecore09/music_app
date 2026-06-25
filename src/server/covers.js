import { createCanvas } from 'canvas';
import seedrandom from 'seedrandom';

export async function generateCover(seed, { title, artist }) {
  const rng = seedrandom(seed.toString());
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  
  drawBackground(ctx, rng);
  drawShapes(ctx, rng);
  drawText(ctx, title, artist, rng);
  
  return canvas.toBuffer('image/png').toString('base64');
}

function drawBackground(ctx, rng) {
  const h = rng() * 360;
  const grad = ctx.createLinearGradient(0, 0, 400, 400);
  grad.addColorStop(0, `hsl(${h},85%,55%)`);
  grad.addColorStop(1, `hsl(${(h+60)%360},80%,25%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 400);
}

function drawShapes(ctx, rng) {
  const h = rng() * 360;
  for (let i = 0; i < 25 + rng() * 10; i++) {
    const x = rng() * 400, y = rng() * 400;
    const size = 10 + rng() * 60;
    const color = `hsla(${h + rng()*60},80%,70%,${0.05 + rng()*0.15})`;
    
    ctx.beginPath();
    if (rng() < 0.5) {
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
    } else {
      ctx.rect(x - size/2, y - size/2, size, size * (0.3 + rng()*0.7));
    }
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function drawText(ctx, title, artist, rng) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  
  const ts = Math.min(40, 350 / (title.length / 2 + 1));
  ctx.font = `bold ${ts}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(title, 200, 180);
  
  ctx.shadowBlur = 5;
  const as = Math.min(26, 350 / (artist.length / 2 + 1));
  ctx.font = `${as}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(artist, 200, 240);
}
