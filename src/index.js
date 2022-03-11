#! /usr/bin/env node

const program = require('commander')
const {upload, feed} = require('./commands')

program
    .command('upload <url> [options]')
    .description('Upload the zim file in the specified url')
    .action(upload);

program
    .command('feed <url> [options]')
    .description('Feed upload/update the zim file in the specified url')
    .action(feed);

program.parse();