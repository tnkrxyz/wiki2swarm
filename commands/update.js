const chalk = require('chalk')
const path = require('path');
//const Downloader = require("nodejs-file-downloader");
const { DownloaderHelper } = require('node-downloader-helper');
var exec = require('child-process-promise').exec;

const swarm_cli = "swarm-cli"; // may include path if swarm-cli is not in the PATH

async function downloadZim({url, dirname}) {
    
    const dl = new DownloaderHelper(url, dirname);
    
    dl
      //.on('progress', (progress) => {console.log(`${progress.progress}%`);})
      .on('error', (err) => console.log('Download Error: ', err))
      .on('end', (info) => {console.log('Download Completed'); info = info;})
    
    return dl;
}

function _exec(cmd) {

    return exec(cmd)
            .then(function (output) {
                var stdout = output.stdout;
                var stderr = output.stderr;
                if (stdout) console.log('stdout: ', stdout);
                if (stderr) console.log('stderr: ', stderr);
            })
            .catch(function (err) {
                console.error('ERROR: ', err);
            });

    }

async function zimdump(fileName) {
    console.log(`zimdumping ${fileName}... `);
    let cmd = 'zimdump "' + fileName + '"';

    return _exec(cmd);
}

async function swarm(fileName) {
    console.log(`Uploading to Swarm ${fileName}... `);
 
    let cmd = swarm_cli + ' feed update "' + fileName + '"';
    return _exec(cmd)
}

async function upload(url) {
    console.log(`Downloadinging ${url} ... `);
    let dl = await downloadZim({url: url, dirname: "./"})
    await dl.start();

    let fileName = dl.getDownloadPath();
    await zimdump(fileName);

    await swarm(fileName);
}

module.exports = upload