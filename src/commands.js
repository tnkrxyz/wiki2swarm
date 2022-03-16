const chalk = require('chalk')
const path = require('path');
const {downloadZim, zimdump, process, swarm} = require('./util')
//const Downloader = require("nodejs-file-downloader");

async function upload(url, datadir="data/") {
    
    console.log(`Mirroring/uploading ${url} to Swarm ... `);
    let dl = await downloadZim({url: url, datadir: datadir})
    await dl.start();

    let zimFileName = dl.getDownloadPath();
    
    //var zimFileName = "data/wikipedia_en_ray_charles_mini_2022-02.zim"
    await zimdump(zimFileName);
    
    await process(zimFileName);

    await swarm(zimFileName)
}

async function feed(url, datadir="data/") {
    console.log(`Mirroring/feeding ${url} to Swarm ... `);
    let dl = await downloadZim({url: url, datadir: datadir})
    await dl.start();

    let zimFileName = dl.getDownloadPath();
    await zimdump(zimFileName);
    await processZim(zimFileName, datadir="data/")

    await swarm(zimFileName, datadir="data/")
}

module.exports = {upload, feed}
