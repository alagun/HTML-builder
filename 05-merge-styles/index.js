const fs = require('fs');
const path = require('path');
let arrOfStyles = [];

const outputBundle = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'bundle.css'),
  (err) => {
    if (err) {
      return console.error(err);
    }
  },
);

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const currentFile = path.join(__dirname, 'styles',file.name);
    if (file.isFile()) {
      if(path.extname(currentFile)==='.css'){
        let tio = fs.createReadStream(currentFile, 'utf8');
        // tio.on('error', err => console.log('Error: ', err.message));
        tio.on('error', err => {
          if (err) throw err;
        });
        tio.on('data', (chunk) => {
          arrOfStyles.push(chunk);
        });
        tio.on('end', () => {
          outputBundle.write(arrOfStyles.pop().trim());
          outputBundle.write('\n\n');
        });
      }
    }
  });
}); 
