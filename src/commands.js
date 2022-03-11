const chalk = require('chalk')
const path = require('path');
const {downloadZim, zimdump, swarm} = require('./util')
//const Downloader = require("nodejs-file-downloader");

async function upload(url) {
    console.log(`Downloadinging ${url} ... `);
    let dl = await downloadZim({url: url, dirname: "./"})
    await dl.start();

    let fileName = dl.getDownloadPath();
    await zimdump(fileName);

    await swarm(fileName);
}

async function feed(url) {
    console.log(`Downloadinging ${url} ... `);
    let dl = await downloadZim({url: url, dirname: "./"})
    await dl.start();

    let fileName = dl.getDownloadPath();
    await zimdump(fileName);

    await swarm(fileName);
}

module.exports = {upload, feed}