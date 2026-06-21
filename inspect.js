import fs from 'fs';
import path from 'path';

const directory = 'e:/osou/client/src/assets/product';

function readPngChunks(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // Verify PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    return { error: 'Not a valid PNG file' };
  }
  
  let offset = 8;
  const metadata = {};
  
  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) break;
    
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    
    if (type === 'tEXt' || type === 'iTXt' || type === 'zTXt') {
      const chunkData = buffer.slice(offset + 8, offset + 8 + length);
      // Find null separator
      const nullIndex = chunkData.indexOf(0);
      if (nullIndex !== -1) {
        const keyword = chunkData.toString('ascii', 0, nullIndex);
        const text = chunkData.toString('utf8', nullIndex + 1);
        metadata[keyword] = text;
      }
    }
    
    offset += 8 + length + 4; // length + type + data + crc
  }
  
  return metadata;
}

try {
  const files = fs.readdirSync(directory).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} PNG files. Inspecting first 10 for metadata...`);
  
  for (let i = 0; i < Math.min(files.length, 15); i++) {
    const file = files[i];
    const fullPath = path.join(directory, file);
    const meta = readPngChunks(fullPath);
    console.log(`File: ${file}, Size: ${(fs.statSync(fullPath).size / (1024 * 1024)).toFixed(2)} MB`);
    if (Object.keys(meta).length > 0) {
      console.log('Metadata:', meta);
    } else {
      console.log('No metadata found.');
    }
    console.log('---');
  }
} catch (err) {
  console.error('Error:', err);
}
