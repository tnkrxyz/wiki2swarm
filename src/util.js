//const Downloader = require("nodejs-file-downloader");
const { DownloaderHelper } = require('node-downloader-helper');
var exec = require('child-process-promise').exec;

/*
const swarm_cli = "swarm-cli"; // may include path if swarm-cli is not in the PATH
const zimdump_cli = "zimdump";     // may include path if zimdump is not in the PATH
*/

const swarm_cli = "ls -la"; // may include path if swarm-cli is not in the PATH
const zimdump_cli = "echo";     // may include path if zimdump is not in the PATH

function _shExec(cmd) {

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

async function downloadZim({url, dirname}) {
    
    const dl = new DownloaderHelper(url, dirname);
    
    dl
      //.on('progress', (progress) => {console.log(`${progress.progress}%`);})
      .on('error', (err) => console.log('Download Error: ', err))
      .on('end', (info) => {console.log('Download Completed'); info = info;})
    
    return dl;
}

async function zimdump(fileName) {
    console.log(`zimdumping ${fileName}... `);
    let cmd = `${zimdump_cli} "${fileName}"`;

    return _shExec(cmd);
}

async function swarm(dirName) {
    console.log(`Uploading to Swarm ${dirName}... `);
 
    let cmd = `${swarm_cli} upload "${dirName}"`;
    return _shExec(cmd)
}

module.exports = {downloadZim, zimdump, swarm}