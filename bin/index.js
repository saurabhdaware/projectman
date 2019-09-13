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
    .option('-r, --repo', 'Add a link to a repository to projects')
    .description("Save current directory as a project")
    .action(action.addProject);

program
    .command('remove [projectName]')
    .description("Remove the project")
    .action(action.removeProject);

program
    .command('seteditor [commandToOpen]')
    .description("Set text editor to use")
    .option('-f|--for-project [projectName]', 'set different editor for specific project')
    .action(action.setEditor);

program
    .command('rmeditor [projectName]')
    .description("Remove text editor to use")
    .option('-a|--all', 'remove editors from all projects')
    .action(action.rmEditor);

program
    .command('edit')
    .description("Edit settings.json")
    .action(action.editConfigurations);

program
    .command('getpath [projectName]')
    .alias('gp')
    .description("Get project path")
    .action(action.getProjectPath);

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