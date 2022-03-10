const { program } = require('commander')
const chalk = require('chalk')
const path = require('path');
const Downloader = require("nodejs-file-downloader");

async function download({url, dir}) {
    const downloader = new Downloader({
        url: url,
        directory: dir,
        onProgress: function (percentage, chunk, remainingSize) {
          //Gets called with each chunk.
          if ( percentage % 10 == 0) {console.log(parseInt(percentage), "%");}
          //console.log("Current chunk of data: ", chunk);
          //console.log("Remaining bytes: ", remainingSize);
        },
      });

      try {
        await downloader.download();
      } catch (error) {
        console.log(error);
      }
}

async function zim(fileName: string) {
    console.log(`zimdumping ${fileName}... `);
}
}

async function upload(url) {
    console.log(`Downloadinging ${url} ... `);
    await download({url: url, dir: "./"})

    await zim(fileName);
    console.log(`Uploading ${url} to the server... `);
}

module.exports = upload