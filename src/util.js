//const Downloader = require("nodejs-file-downloader");
const chalk = require('chalk');
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

async function processURL(args={}) {
    if (args.verbose) console.log(`Processing URL ${args.url}`)
}

async function downloadZim(args={}) {
    if (args.verbose) console.log(`Downloading zim file at ${args.url} to ${args.datadir}`)
    const dl = new DownloaderHelper(args.url, args.datadir, 
                                    {override:true}
                                    );
    
    dl
      .on('progress', (progress) => {if (args.verbose) console.log(`${args.url}: ${Math.round(progress.progress)}%`);})
      .on('error', (err) => console.log('Download Error: ', err))
      .on('end', (info) => {if (args.verbose) console.log('Download Completed'); info = info;})
    
    await dl.start();

    return {zimFileName: dl.getDownloadPath()}
}

async function zimdump(args={}) {
    
    let zimFileName = args.zimFileName
    if (args.verbose) console.log(`zimdumping ${zimFileName}... `);
    let dirName = getDirName(zimFileName)

    if (fs.existsSync(dirName)){
        fs.rmSync(dirName, { recursive: true, force: true });
    }
    fs.mkdirSync(dirName, { recursive: true });

    //let cmd = `${zimdump_cli} dump --dir="${dirName}" "${zimFileName}"`;
    //console.log(`with command ${cmd}`)
    //return exec(cmd);
    let cmdArgs = ["dump", `--dir=${dirName}`, zimFileName]
    
    await _spawn_io(zimdump_cli, cmdArgs)

    return {}
}

async function prepFiles(args={}) {
    let zimFileName = args.zimFileName
    if (args.verbose) console.log(`Prepare files ${zimFileName} for uploading ... `);
    
    let dirName = getDirName(zimFileName)

    let indexFile = `${dirName}/A/index`
    let indexHtml = `${dirName}/index.html`

    // rename A/index -> index.html
    await _spawn_io("mv", [indexFile, indexHtml])
    // fix url & href relative to index.html
    await _spawn_io("sed", ["-i", 's|url=|url=A/|g', indexHtml])
    await _spawn_io("sed", ["-i", 's|a href=\"|a href=\"A/|g', indexHtml])

    // swarm doesn't like super long filename
    // rename "-/mw/skins.minerva.base.reset|skins.minerva.content.styles|ext.cite.style|site.styles|mobile.app.pagestyles.android|mediawiki.page.gallery.styles|mediawiki.skinning.content.parsoid.css" -> skins.css
    //await _spawn_io("ls", ["-la", `${dirName}/`])
    //await _spawn_io("ls", ["-la", `${dirName}/-/mw/skins*`], { shell: true })
    await _spawn_io("mv", [`${dirName}/-/mw/skins*`, `${dirName}/-/mw/skins.css`], { shell: true })
    await _spawn_io("find", [dirName, "-type", "f", "-exec", "sed", "-i", "s/skins.*\.css/skins.css/g", "{}", "\;"])

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

    if (args.verbose) console.log(`Uploading ${dirName} to Swarm ... `);
    
    let cmdArgs = []
    if (args.beeApiUrl) cmdArgs.push('--bee-api-url', args.beeApiUrl)
    if (args.beeDebugApiUrl) cmdArgs.push('--bee-debug-api-url', args.beeDebugApiUrl)
    if (args.stamp) cmdArgs.push('--stamp', args.stamp)

    console.log(chalk.bold.yellow("Wiki Snapshot URL: ") + args.url)
    if (args.feed) {
        let baseFileName = path.parse(zimFileName).name
        let topic = baseFileName.replace(/[\d,\s\(\)-_]*$/, '').replaceAll(/_/g, " ")
        if (args.identity) cmdArgs.push('--identity', args.identity)
        if (args.password) cmdArgs.push('--password', args.password)  
        cmdArgs = ["feed", "upload", dirName, '--topic-string', topic].concat(cmdArgs)
        if (args.verbose) console.log(`Calling ${swarm_cli} ${cmdArgs.join(' ')}`);
        await _spawn_io(swarm_cli, args = cmdArgs)
    } else {
        cmdArgs = ["upload", dirName].concat(cmdArgs)
        if (args.verbose) console.log(`Calling ${swarm_cli} ${cmdArgs.join(' ')}`);
        await _spawn_io(swarm_cli, args = cmdArgs)
    }

    return {}
}

async function cleanUp(args={}) {
    if (args.cleanup) {
        let zimFileName = args.zimFileName
        let dirName = getDirName(zimFileName)

        if (args.verbose) console.log(`Cleaning up ${zimFileName} and ${dirName}... `);
    
        //let cmd = `rm ${zimFileName}`
        await _spawn_io("rm", [zimFileName])
        await _spawn_io("rm", ['-rf', dirName])
    }

    return {}
}

module.exports = {downloadZim, zimdump, prepIndexDoc: prepFiles, swarm, cleanUp, _spawn_io}