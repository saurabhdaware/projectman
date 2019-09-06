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
    .command('remove [projectName]')
    .description("Remove the project")
    .action(action.removeProject);

program
    .command('seteditor')
    .description("Set text editor to use")
    .action(action.setEditor);

program
  .command('addeditor')
  .description("Add new text editor to use")
  .action(action.addEditor);

program
    .command('edit')
    .description("Edit settings.json")
    .action(action.editConfigurations);

program
    .arguments("<command>")
    .action((command) => {
        console.log(`Command ${command} not found\n`);
        program.outputHelp();
    });

program.usage("<command>")


if (process.argv.length <= 2){ // If no command mentioned then output help
    action.openProject();
}

// Parse arguments
program.parse(process.argv);