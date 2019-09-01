#!/usr/bin/env node
const program = require('commander');
const action = require('../lib/action.js');

program.version(require('../package.json').version);

// Commands
program
    .command('open [projectName]')
    .alias('o')
    .action(action.openProject);

program
    .command('add [projectDirectory]')
    .action(action.addProject);

program
    .command('edit')
    .action(action.editConfigurations);


program.parse(process.argv)