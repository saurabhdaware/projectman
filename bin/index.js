#!/usr/bin/env node
const program = require('commander');
const action = require('../lib/action.js');

program.version(require('../package.json').version);

// Commands
program
    .command('open [projectName]')
    .alias('o')
    .description("Open one of your saved projects")
    .action(action.openProject);

program
    .command('add [projectDirectory]')
    .alias('save')
    .description("Save current directory as a project")
    .action(action.addProject);

program
    .command('edit')
    .description("Edit settings.json")
    .action(action.editConfigurations);

// Parse arguments
program.parse(process.argv)