// external dependencies
const prompts = require('prompts');

// helper functions
const color = require('../colors.js');

const { onCancel, getChoices, getSettings } = require('../helper.js');

async function getProjectPath(projectName) {
  const settings = getSettings();
  let selectedProject;
  if (settings.projects.length === 0) {
    console.error('No projects to get path :(');
    console.warn(
      `cd /till/project/directory/ and run ${color.boldYellow(
        'pm add'
      )} to add projects and get started`
    );
    return;
  }

  if (!projectName) {
    const question = {
      name: 'selectedProject',
      message: 'Select project you want to cd to:',
      type: 'autocomplete',
      stdout: process.stderr,
      choices: getChoices(),
      onRender: () => {
        process.stderr.write('\033c');
      }
    };

    ({ selectedProject } = await prompts([question], { onCancel }));
    if (!selectedProject) {
      console.error(
        `Project does not exist. Add it using ${color.yellow(
          'pm add [projectPath]'
        )} or cd till the project folder and type ${color.yellow('pm add')}`
      );
      return;
    }
  } else {
    selectedProject = settings.projects.find(
      (project) => project.name.toLowerCase() == projectName.toLowerCase()
    );
  }

  // Print path
  console.log(selectedProject.path);
}

module.exports = getProjectPath;
