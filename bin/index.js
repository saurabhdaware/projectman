#!/usr/bin/env node
const program = require('commander');
const { suggestCommands } = require('../lib/helper');
const actions = require('../lib/actions');

program.version(require('../package.json').version);

// Commands
program
  .command('open [projectName]')
  .alias('o')
  .description('Open one of your saved projects')
  .action(actions.openProject);

program
  .command('create [projectName]')
  .alias('c')
  .description('Create project')
  .action(actions.createProject);

program
  .command('add [projectDirectory]')
  .alias('save')
  .option('-u, --url [link]', 'Add a link to a repository to projects')
  .description('Save current directory as a project')
  .action(actions.addProject);

program
  .command('remove [projectName]')
  .description('Remove the project')
  .action(actions.removeProject);

program
  .command('seteditor [commandToOpen]')
  .description('Set text editor to use')
  .option(
    '-f|--for-project [projectName]',
    'set different editor for specific project'
  )
  .action(actions.setEditor);

program
  .command('rmeditor [projectName]')
  .description('Remove text editor to use')
  .option('-a|--all', 'remove editors from all projects')
  .action(actions.rmEditor);

program
  .command('edit')
  .description('Edit settings.json')
  .action(actions.editConfigurations);

program
  .command('getpath [projectName]')
  .alias('gp')
  .description('Get project path')
  .action(actions.getProjectPath);

program.arguments('<command>').action((command) => {
  console.log(`Command ${command} not found\n`);
  program.outputHelp();
  suggestCommands(command);
});

program.usage('<command>');

if (process.argv.length <= 2) {
  // If no command mentioned then output help
  actions.openProject();
}

// Parse arguments
program.parse(process.argv);
