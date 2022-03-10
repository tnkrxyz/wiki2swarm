#! /usr/bin/env node

const program = require('commander')
const upload = require('./commands/upload')

program
    .command('upload <url>')
    .description('Upload the zim file in the specified url')
    .action(upload);

program.parse();