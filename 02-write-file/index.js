const fs = require('fs');
const path = require('path');

const pio = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(pio);

const { stdin, stdout } = process;
stdout.write('Введите текст?\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit'){
    stdout.write('Ввод закончен <EXIT>! Проверьте файл text.txt. Удачи');
    process.exit();
  } else {
    output.write(data);
  }
});
process.on('SIGINT', () => {
  stdout.write('Ввод закончен <Ctrl + C>. Проверьте файл text.txt. Удачи'); 
  process.exit();
});  
