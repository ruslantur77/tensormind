import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Simple solid/gradient PNG generator using zlib
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Gradient effect
      const grad = 1 - (y / height) * 0.4;
      rawData[pxOffset] = Math.min(255, Math.floor(r * grad));     // R
      rawData[pxOffset + 1] = Math.min(255, Math.floor(g * grad)); // G
      rawData[pxOffset + 2] = Math.min(255, Math.floor(b * grad)); // B
      rawData[pxOffset + 3] = 255;                                  // A
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        let bit = (crc ^ byte) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const body = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, body, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = chunk('IHDR', ihdrData);
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, 14, 165, 233));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, 14, 165, 233));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, 14, 165, 233));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, 14, 165, 233));
fs.writeFileSync('./public/favicon.ico', createPNG(32, 32, 14, 165, 233));
console.log('PWA PNG assets successfully generated.');
