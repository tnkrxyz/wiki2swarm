const { program } = require('commander')
const chalk = require('chalk')
const {createWriteStream} = require('fs');
const {pipeline} = require('stream');
const {promisify} = require('util');
const fetch =  require('node-fetch');
const path = require('path');

async function download({url, dir}) {
    const streamPipeline = promisify(pipeline);

    const response = await fetch(url);
    let fileName = url.split("/").pop();

    if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
    }

    await streamPipeline(response.body, createWriteStream(path.join(dir, fileName)));
}

async function upload(url) {
    console.log(`Downloadinging ${url} ... `);
    await download({url: url, dir: "./"})

    console.log(`zimdumping ${url}... `);

    console.log(`Uploading ${url} to the server... `);
}

module.exports = upload