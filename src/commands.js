const chalk = require('chalk');
const path = require('path');
const {downloadZim, zimdump, prepIndexDoc, swarm, cleanUp} = require('./util')
//const Downloader = require("nodejs-file-downloader");
const Queue = require('bee-queue');

const downloadQueue = new Queue('download');
const zimdumpQueue = new Queue('zimdump');
const prepIndexDocQueue = new Queue('prepIndexDoc');
const swarmQueue = new Queue('swarm');
const cleanUpQueue = new Queue('cleanUp');

function doSth(args) {
    console.log(args.url)
    console.log(args.datadir)
}

async function upload(url, datadir="data/") {
    //console.log(`Mirroring/uploading ${url} to Swarm ... `);
    downloadQueue
        .createJob({url:url, datadir:datadir})
        .save();

    downloadQueue.on('succeeded', (job, result) => {
        console.log(`Download completed job ${job.id}:`);
        console.log(result);
        zimdumpQueue
            .createJob(Object.assign(job.data, {zimFileName: result}))
            .save()
    });
    /*
    zimdumpQueue.on('succeeded', (job, result) => {
        console.log(`zimdump completed job ${job.id}: ${result}`);
        prepIndexDocQueue
            .createJob({parent: job.data, result, keepAuxFiles})
            .save()
    });

    prepIndexDocQueue.on('succeeded', (job, result) => {
        console.log(`zimdump completed job ${job.id}: ${result}`);
        swarmQueue
            .createJob({parent: job.data, result})
            .save()
    });

    swarmQueue.on('succeeded', (job, result) => {
        console.log(`zimdump completed job ${job.id}: ${result}`);
        cleanUpQueue
            .createJob({parent: job.data, result})
            .save()
    });
    */

    //downloadQueue.process(doSth)
     downloadQueue.process(async (job, done) => {
        let dl = await downloadZim(job.data)
        await dl.start()
        let zimFileName = dl.getDownloadPath();
        console.log(zimFileName);
        //done()
        return zimFileName
    });

    zimdumpQueue.process(async (job, done) => {
        console.log(`Processing job ${job.id}`);
        console.log(job.data);
        let dl = await zimdump(job.data.zimFileName)
        await dl.start()
        let zimFileName = dl.getDownloadPath();

        return done(null, zimFileName);
    });

    prepIndexDocQueue.process(async (job, done) => {
        console.log(`Processing job ${job.id}`);
        await prepIndexDoc(job.data.url, job.data.datadir, keepAuxFiles=false)

        return done(null, job.data.zimFileName);
    });

    swarmQueue.process(async (job, done) => {
        console.log(`Processing job ${job.id}`);
        await swarm(job.data.zimFileName)

        return done(null, job.data.zimFileName);
    });

    cleanUpQueue.process(async (job, done) => {
        console.log(`Processing job ${job.id}`);
        await cleanUp(job.data.zimFileName)

        return done(null, job.data.zimFileName);
    });

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
