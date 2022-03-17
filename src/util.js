//const Downloader = require("nodejs-file-downloader");
const { DownloaderHelper } = require('node-downloader-helper');
//const {exec, spawn} = require('child_process');
const spawn = require('await-spawn')
const path = require("path")
const fs = require('fs')

const swarm_cli = "swarm-cli";     // may include path if swarm-cli is not in the PATH
const zimdump_cli = "zimdump";     // may include path if zimdump is not in the PATH

/*
const swarm_cli = "ls -la"; // may include path if swarm-cli is not in the PATH
const zimdump_cli = "echo";     // may include path if zimdump is not in the PATH
*/

function _spawn_io(cmd, args, options={}) {
    return spawn(cmd, args = args, 
        Object.assign({ stdio: ["inherit", "inherit", "inherit"] }, options)
        )

}

/*
function _exec(cmd) {
    return exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stdout) console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
      })

    //return exec(cmd)
}
*/

async function downloadZim({url, datadir}) {
    
    const dl = new DownloaderHelper(url, datadir);
    
    dl
      //.on('progress', (progress) => {console.log(`${progress.progress}%`);})
      .on('error', (err) => console.log('Download Error: ', err))
      .on('end', (info) => {console.log('Download Completed'); info = info;})
    
    return dl;
}

async function zimdump(zimFileName) {
    console.log(`zimdumping ${zimFileName}... `);
    let dirName = path.join(path.dirname(zimFileName), path.parse(zimFileName).name)

    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName, { recursive: true });
    }

    //let cmd = `${zimdump_cli} dump --dir="${dirName}" "${zimFileName}"`;
    //console.log(`with command ${cmd}`)
    //return exec(cmd);
    let args = ["dump", `--dir=${dirName}`, `${zimFileName}`]
    return _spawn_io(zimdump_cli, args)
}

async function prepIndexDoc(zimFileName, keepAuxFiles=false) {
    console.log(`Processing dumped ${zimFileName}... `);

    let dirName = path.join(path.dirname(zimFileName), path.parse(zimFileName).name)
    
    let indexFile = `${dirName}/A/index`
    let indexHtml = `${dirName}/index.html`
    let auxFiles = ["I/", "M/", "X/"].map(x => `${dirName}/x`)
    //let cmd = `pwd && ls -la ${dirName}`
    //let cmd = `mv ${dirName}/A/index ${indexHtml}`
    return [_spawn_io("mv", [indexFile, indexHtml]),
            //cmd += ` && sed -i 's|url=|url=A/|g'  ${indexHtml}`
            _spawn_io("sed", ["-i", 's|url=|url=A/|g', indexHtml]),
            //cmd += ` && sed -i 's|a href=\"|a href=\"A/|g' ${indexHtml}`
            _spawn_io("sed", ["-i", 's|a href=\"|a href=\"A/|g', indexHtml]
            (keepAuxFiles) ? '' : _spawn_io("rm", ["-rf", ] + auxFiles)
            )
    ]

    //return _exec(cmd)

    //console.log(`with command ${cmd}... `);
    //return exec(cmd);
}

async function swarm(zimFileName) {
    let dirName = path.join(path.dirname(zimFileName), path.parse(zimFileName).name)

    console.log(`Uploading to Swarm ${dirName}... `);
 
    let cmd = `${swarm_cli} upload "${dirName}"`;
    //return _shExec(cmd)

    //const { spawn } = require('child_process');
    //var child = spawn(cmd, args = ["upload", `${dirName}`], { stdio: "inherit", stdin: "inherit" });

    return _spawn_io(swarm_cli, args = ["upload", `${dirName}`]);

}

async function cleanUp(zimFileName) {
    let dirName = path.join(path.dirname(zimFileName), path.parse(zimFileName).name)

    console.log(`Cleaning up ${zimFileName} and ${dirName}... `);
 
    //let cmd = `rm ${zimFileName}`
    return [_spawn_io("rm", [zimFileName]),
            _spawn_io("rm", ['-rf', dirName])]
    

    //return _exec(cmd)

}

module.exports = {downloadZim, zimdump, prepIndex: prepIndexDoc, swarm, cleanUp}