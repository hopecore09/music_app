import seedrandom from 'seedrandom';

export async function generateMidi(seed) {
  const rng = seedrandom(seed.toString());
  
  const notes = [];
  const scale = [0, 2, 4, 5, 7, 9, 11];
  const base = 48 + Math.floor(rng() * 12);
  let time = 0;
  
  for (let i = 0; i < 80 + Math.floor(rng() * 40); i++) {
    const pitch = base + scale[Math.floor(rng() * scale.length)] + Math.floor(rng() * 12);
    const duration = 0.15 + rng() * 0.45;
    const velocity = 60 + Math.floor(rng() * 67);
    
    notes.push({
      pitch: Math.min(127, Math.max(0, pitch)),
      duration: duration,
      velocity: Math.min(127, Math.max(0, velocity)),
      time: time
    });
    
    time += duration + (rng() < 0.15 ? duration * 0.5 : 0);
  }
  

  return Buffer.from(JSON.stringify(notes)).toString('base64');
}