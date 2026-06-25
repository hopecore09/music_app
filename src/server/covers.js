import sharp from 'sharp';
import seedrandom from 'seedrandom';

export async function generateCover(seed, { title, artist }) {
  const rng = seedrandom(seed.toString());
  const h = rng() * 360;
  
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${h},85%,55%)"/>
        <stop offset="0.5" stop-color="hsl(${(h+50)%360},75%,35%)"/>
        <stop offset="1" stop-color="hsl(${(h+100)%360},80%,20%)"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g)"/>
    ${getShapes(rng, h)}
    <text x="200" y="180" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${Math.min(40, 350/(title.length/2+1))}" font-weight="700" fill="#ffffff" stroke="rgba(0,0,0,0.5)" stroke-width="4">${esc(title)}</text>
    <text x="200" y="235" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${Math.min(26, 350/(artist.length/2+1))}" font-weight="300" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.3)" stroke-width="2">${esc(artist)}</text>
    <line x1="120" y1="270" x2="280" y2="270" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  </svg>`;
  
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer.toString('base64');
}

function getShapes(rng, h) {
  let s = '';
  for (let i = 0; i < 25; i++) {
    const x = rng() * 400, y = rng() * 400, size = 20 + rng() * 80;
    const c = `hsla(${h + rng()*60},80%,70%,${0.05 + rng()*0.15})`;
    if (rng() < 0.5) {
      s += `<circle cx="${x}" cy="${y}" r="${size/2}" fill="${c}"/>`;
    } else {
      s += `<rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size*(0.3+rng()*0.7)}" fill="${c}" transform="rotate(${rng()*360},${x},${y})" rx="${5+rng()*15}"/>`;
    }
  }
  return s;
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
