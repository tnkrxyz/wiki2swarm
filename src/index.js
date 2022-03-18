#! /usr/bin/env node

const program = require('commander')
const {upload, feed} = require('./commands')

program
    .command('upload <url> [options]')
    .description('Upload the zim file in the specified url')
    .action(upload);

program.parse();