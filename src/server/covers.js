import sharp from 'sharp';
import seedrandom from 'seedrandom';

export async function generateCover(seed) {
  const rng = seedrandom(seed.toString());
  const h = rng() * 360;
  const svg = buildSvg(rng, h);
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer.toString('base64');
}

function buildSvg(rng, h) {
  const colors = getColors(h);
  const shapes = getShapes(rng, colors);
  return wrapSvg(colors, shapes);
}

function getColors(h) {
  return [
    `hsl(${h},85%,55%)`,
    `hsl(${(h+50)%360},75%,35%)`,
    `hsl(${(h+100)%360},80%,20%)`
  ];
}

function getShapes(rng, colors) {
  let s = '';
  for (let i = 0; i < 15; i++) {
    s += getShape(rng, colors);
  }
  return s;
}

function getShape(rng, colors) {
  const x = rng() * 400, y = rng() * 400, size = 20 + rng() * 80;
  const c = colors[Math.floor(rng() * colors.length)];
  const o = 0.05 + rng() * 0.15;
  if (rng() < 0.5) {
    return `<circle cx="${x}" cy="${y}" r="${size/2}" fill="${c}" opacity="${o}"/>`;
  }
  return `<rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size*(0.3+rng()*0.7)}" fill="${c}" opacity="${o}" transform="rotate(${rng()*360},${x},${y})" rx="${5+rng()*15}"/>`;
}

function wrapSvg(colors, shapes) {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.5" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[2]}"/>
    </linearGradient></defs>
    <rect width="400" height="400" fill="url(#g)"/>
    ${shapes}
  </svg>`;
}
