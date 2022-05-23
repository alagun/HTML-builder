const fs = require('fs');
const path = require('path');

// The filename is simple the local directory and tacks on the requested
const pio = path.join(__dirname, 'text.txt');

let readableStream = fs.createReadStream(pio, 'utf8');
readableStream.on('data', function(chunk){ 
  console.log(chunk);
});