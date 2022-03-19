const path = require('path');
const {downloadZim, zimdump, prepIndexDoc: prepFiles, swarm, cleanUp} = require('./util')
//const Downloader = require("nodejs-file-downloader");
const Queue = require('bee-queue');

const TIMEOUT = 3 * 1000;  //mseconds
const jobQueue = new Queue('job');
const jobSeq = {0: downloadZim, 1: zimdump, 2: prepFiles, 3: swarm, 4: cleanUp}

async function closeIdleQueue(queue, verbose=false) {
    queue
    .getJobs('active', {size: 100})
    .then((jobs) => {
        //console.log(jobs);
        if (jobs.length == 0) {
            setTimeout(async () => queue.close(TIMEOUT), TIMEOUT);
            if (verbose) console.log(`No active jobs left in the queue; Shutting down job queue in ${TIMEOUT/1000} seconds.`);
        }
    })
}

async function mirror(urls, args) {

    for (const url of urls) {
        jobQueue.createJob({...args, ...{seqId: 0, url: url}}).save()
    }

    jobQueue.process(async (job, done) => {
        if (args.verbose) console.log(`Processing job ${job.id} with arguments:`);
        if (args.verbose) console.log(job.data)
        
        let fn = jobSeq[job.data.seqId]
        let ret = fn(args=job.data)

        return ret
        
    });

    jobQueue.on('succeeded', (job, result) => {
        if (args.verbose) console.log(`Job ${job.id} completed`);
        //console.log(result);
        if (job.data.seqId == Math.max(...Object.keys(jobSeq))) {
            // at the end of job sequence
            // close queue if there are no more active jobs
            closeIdleQueue(jobQueue, verbose=args.verbose)
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
        closeIdleQueue(jobQueue, verbose=args.verbose)
    });
}

module.exports = {mirror}
