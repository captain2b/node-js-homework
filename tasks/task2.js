import fs from 'fs';
import csv from 'csvtojson';

const inputFileURL = './csv/nodejs-hw1-ex1.csv';
const outputFileURL = 'nodejs-hw1-ex1.txt';

const readable = fs.createReadStream(inputFileURL, 'utf8');
const writable = fs.createWriteStream(outputFileURL);
let lineCount = 0;

const onCsvParseError = (err, module = 'parsing') => {
  console.log(module ? `Error while ${module}: ${err}` : err);
};
writable
  .on('error', (err) => {
    onCsvParseError(err, 'writing');
  })
  .on('close', () => {
    console.log('Writable stream is closed');
  });
readable
  .on('error', (err) => {
    onCsvParseError(err, 'reading');
  })
  .on('end', () => {
    console.log('Readable stream is closed');
  });
const onCsvParseComplete = () => {
  console.log('Transformation completed');
  readable.destroy();
};
csv()
  .fromStream(readable)
  .subscribe((json, lineNumber) => {
    lineCount = lineNumber;
    console.log(`Reading line ${lineNumber + 1}...`);

    writable.write(`${JSON.stringify(json)}\n`, () => {
      console.log(`Writing line ${lineNumber + 1}...`);
      if (readable.readableEnded && lineNumber === lineCount) {
        writable.destroy();
      }
    });
  }, onCsvParseError, onCsvParseComplete);
