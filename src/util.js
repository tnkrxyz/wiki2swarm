//const Downloader = require("nodejs-file-downloader");
const { DownloaderHelper } = require('node-downloader-helper');
//const {exec, spawn} = require('child_process');
const spawn = require('await-spawn')
const path = require("path")
const fs = require('fs')

const swarm_cli = "swarm-cli";     // may include path if swarm-cli is not in the PATH
const zimdump_cli = "zimdump";     // may include path if zimdump is not in the PATH

function getDirName(zimFileName) {
    return path.join(path.dirname(zimFileName), path.parse(zimFileName).name)
}

async function _spawn_io(cmd, args, options={}) {
    return spawn(cmd, args = args, 
        Object.assign({ stdio: ["inherit", "inherit", "inherit"] }, options)
        )

}

async function downloadZim(args={}) {
    console.log(`downloadZim called with ${args.url} and ${args.datadir}`)
    const dl = new DownloaderHelper(args.url, args.datadir);
    
    dl
      .on('progress', (progress) => {console.log(`${progress.progress}%`);})
      .on('error', (err) => console.log('Download Error: ', err))
      .on('end', (info) => {console.log('Download Completed'); info = info;})
    
    await dl.start();

    return {zimFileName: dl.getDownloadPath()}
}

async function zimdump(args={}) {
    let zimFileName = args.zimFileName
    console.log(`zimdumping ${zimFileName}... `);
    let dirName = getDirName(zimFileName)

    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName, { recursive: true });
    }

    //let cmd = `${zimdump_cli} dump --dir="${dirName}" "${zimFileName}"`;
    //console.log(`with command ${cmd}`)
    //return exec(cmd);
    let cmdArgs = ["dump", `--dir=${dirName}`, zimFileName]
    
    await _spawn_io(zimdump_cli, cmdArgs)

    return {}
}

async function prepIndexDoc(args={}) {
    let zimFileName = args.zimFileName
    console.log(`Processing dumped ${zimFileName}... `);
    
    let dirName = getDirName(zimFileName)

    let indexFile = `${dirName}/A/index`
    let indexHtml = `${dirName}/index.html`

    // rename A/index -> index.html
    await _spawn_io("mv", [indexFile, indexHtml])
    // fix url & href relative to index.html
    await _spawn_io("sed", ["-i", 's|url=|url=A/|g', indexHtml])
    await _spawn_io("sed", ["-i", 's|a href=\"|a href=\"A/|g', indexHtml])

    // swarm doesn't like the directory "-", which contains js
    // rename "-"" -> js
    await _spawn_io("mv", [`${dirName}/-`, `${dirName}/js`])
    await _spawn_io("find", [dirName, "-type", "f", "-exec", "sed", "-i", "s|/-/|/js/|g", "{}", "\;"])

    let auxFiles = ["I/", "M/", "X/"].map(x => `${dirName}/${x}`)
    //console.log(["-rf"].concat(auxFiles));
    if (!args.keepAuxFiles)
        await _spawn_io("rm", ["-rf"].concat(auxFiles))
    //await _spawn_io(zimdump_cli, cmdArgs)

    return {}
}

async function swarm(args={}) {
    let zimFileName = args.zimFileName
    let dirName = getDirName(zimFileName)

    console.log(`Uploading to Swarm ${dirName}... `);

    if (args.feed) {
        let baseFileName = path.parse(zimFileName).name
        let topic = baseFileName.replace(/[\d,\s\(\)-_]*$/, '').replaceAll(/_/g, " ")
        await _spawn_io(swarm_cli, args = ["feed", "upload", dirName])
    } else {
        await _spawn_io(swarm_cli, args = ["upload", dirName])
    }

    return {}
}

async function cleanUp(args={}) {
    let zimFileName = args.zimFileName
    let dirName = getDirName(zimFileName)

    console.log(`Cleaning up ${zimFileName} and ${dirName}... `);
 
    //let cmd = `rm ${zimFileName}`
    await _spawn_io("rm", [zimFileName])
    await _spawn_io("rm", ['-rf', dirName])
    
    return {}
}

module.exports = {downloadZim, zimdump, prepIndexDoc, swarm, cleanUp}