#! /usr/bin/env node

const program = require('commander')
const {mirror} = require('./commands')

program
    //.command('mirror <url> [options]')
    .name("wiki2swarm")
    .description('Mirror Wikipedia snapshot in zim format to Swarm')
    .argument('<url...>', 'zim url(s) to be mirrored to Swarm')
    .option('-d, --datadir <dir>', 'directory to store zim and temporary files"', 'data/')
    .option('-f, --feed', 'Use Swarm "feed upload" instead of "upload"', false)
    .option('-k, --keep-aux-files', 'keep auxillary files (jpg, media, tag, and search index)', false)
    .option('-c, --cleanup', 'Clean up downloaded and extracted files after uploading', true)
    .option('-v, --verbose', 'Print all console messages', false)
    .option('--bee-api-url <url>', 'Bee API URL (arugment passing to swarm-cli)').env("")
    .option('--bee-debug-api-url <url>', 'Bee Debug API URL (arugment passing to swarm-cli)').env("BEE_API_URL")
    .option('--stamp <stamp>', 'id of stamp postage to use (arugment passing to swarm-cli)').env("BEE_DEBUG_API_URL")
    .option('--identity <identity>', 'identity to use for "feed upload" (arugment passing to swarm-cli)').env("STAMP")
    .option('--password <password>', 'password for using identity for "fee upload" (arugment passing to swarm-cli)').env("PASSWORD")
    //.argument('[swarmOptions]', 'additional options passing to swarm-cli')
    .action(mirror);

program.parse();