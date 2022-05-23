const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'),{ withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    console.log('\nCurrent directory filenames:');
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(__dirname, 'secret-folder', file.name), 
          (err, stats) => {
            if (err) throw err;
            const currentFile = file.name.split('.');
            const size = Math.round(stats.size / 1024 * 1000) / 1000;
            console.log(`${currentFile[0]} - ${currentFile[1]} - ${size}kB`);
          });
      }
    });
  }
});

