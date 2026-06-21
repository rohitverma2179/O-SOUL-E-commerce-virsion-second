import fs from 'fs';
import path from 'path';

const directory = 'e:/osou/client/src/assets/product';

function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    return null;
  }
  
  // Find IHDR chunk
  let offset = 8;
  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) break;
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    
    if (type === 'IHDR') {
      const width = buffer.readUInt32BE(offset + 8);
      const height = buffer.readUInt32BE(offset + 12);
      return { width, height };
    }
    
    offset += 8 + length + 4;
  }
  return null;
}

try {
  const files = fs.readdirSync(directory)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });
    
  console.log(`Found ${files.length} PNG files. Dimensions:`);
  
  const groups = {};
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const dim = getPngDimensions(fullPath);
    if (dim) {
      const key = `${dim.width}x${dim.height}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(file);
    }
  }
  
  for (const [dim, fileList] of Object.entries(groups)) {
    console.log(`Dimension ${dim}: ${fileList.length} files (e.g. ${fileList.slice(0, 5).join(', ')}...)`);
  }
} catch (err) {
  console.error(err);
}
