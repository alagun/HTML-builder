const fs = require('fs');
const path = require('path');

const currentDirectory = path.join(__dirname, 'assets');
const currentCopyDirectory = path.join(__dirname, 'project-dist', 'assets');

let arrOfStyles = [];

// creature directory project-dist
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true, force: true }, err => {
  if (err) throw err;
});

// creature directory assets
fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true, force: true }, err => {
  if (err) throw err;
});

// copy directory assets
function copyDirectory(directory ,directoryCopy){
  fs.readdir(path.join(directory), 
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        let dir = path.join(directory, file.name);
        let dirCopy = path.join(directoryCopy, file.name);
        if (file.isDirectory()) {
          fs.mkdir(dirCopy, { recursive: true, force: true }, err => {
            if (err) throw err;
          });
          copyDirectory(dir, dirCopy);
        }
        if (file.isFile()) {
          fs.copyFile(dir,dirCopy, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  );
}
copyDirectory (currentDirectory,currentCopyDirectory);

// add style.css
const outputBundle = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'style.css'),
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

// copy template & create index

// array of replacements
const template = path.join(__dirname, 'template.html');
const indexHTML = path.join(__dirname, 'project-dist', 'index.html');
fs.copyFile(template, indexHTML, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readFile(template, 'utf-8', (err, data) => {
  if (err) console.log(err);

  let templateData = data;
  const tags = data.match(/{{\w+}}/gm);

  for (let tag of tags) {
    const tagPath = path.join(__dirname, 'components', `${tag.slice(2, -2)}.html`,
    );

    fs.readFile(tagPath, 'utf-8', (err, dataTag) => {
      if (err) console.error(err);

      templateData = templateData.replace(tag, dataTag);

      fs.rm(indexHTML, { recursive: true, force: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        const index = fs.createWriteStream(indexHTML);
        index.write(templateData);
      });
    });
  }
});