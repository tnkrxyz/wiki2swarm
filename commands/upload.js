const { program } = require('commander')
const chalk = require('chalk')
const {createWriteStream} = require('fs');
const {pipeline} = require('stream');
const {promisify} = require('util');
const fetch =  require('node-fetch');
const path = require('path');
const Downloader = require("nodejs-file-downloader");

async function download({url, dir}) {
    const downloader = new Downloader({
        url: url,
        directory: dir,
        onProgress: function (percentage, chunk, remainingSize) {
          //Gets called with each chunk.
          console.log("% ", percentage);
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

async function upload(url) {
    console.log(`Downloadinging ${url} ... `);
    await download({url: url, dir: "./"})

    console.log(`zimdumping ${url}... `);

    console.log(`Uploading ${url} to the server... `);
}

module.exports = upload