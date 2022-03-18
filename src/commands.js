const chalk = require('chalk');
const path = require('path');
const {downloadZim, zimdump, prepIndexDoc, swarm, cleanUp} = require('./util')
//const Downloader = require("nodejs-file-downloader");
const Queue = require('bee-queue');

const jobQueue = new Queue('job');
const jobSeq = {0: downloadZim, 1: zimdump, 2: prepIndexDoc, 3: swarm, 4: cleanUp}

async function upload(url, datadir="data/") {
    //let vv = jobSeq.map(async (fn) => {jobQueue.createJob({fn: fn, url: url, datadir: datadir}).save()})
    //console.log(vv)

    jobQueue.createJob({seqId: 0, url: url, datadir: datadir}).save()

    jobQueue.process(async (job, done) => {
        console.log(`Processing job ${job.id}:`);
        console.log(job.data);
        let fn = jobSeq[job.data.seqId]
        let ret = fn(args=job.data)

        return ret
        
    });

    jobQueue.on('succeeded', (job, result) => {
        console.log(`Completed job seq ${job.data.seqId}`);
        //console.log(result);
        if (job.data.seqId == Math.max(...Object.keys(jobSeq))) {
            // at the end of sequence of jobs
            return
        }
        job.data.seqId += 1
        job.data = {...job.data, ...result}
        jobQueue.createJob(job.data).save()
        //console.log('Next job queued:');
        //console.log(job.data);
    });

    jobQueue.on('error', (err) => {
        console.log('A queue error happened:');
        console.error(err)
    });

    jobQueue.on('failed', (job, err) => {
        console.log(`Job ${job.id} failed with error:`);
        console.error(err)
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
