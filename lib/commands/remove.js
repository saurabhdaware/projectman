// helper functions
const color = require('../colors.js');

const { getSettings, writeSettings, selectProject } = require('../helper.js');

// pm remove [projectName]
async function removeProject(projectName) {
  const settings = getSettings();

  const { name: selectedProjectName } = await selectProject(
    projectName,
    'Select project to remove'
  );

  if (!selectedProjectName) {
    console.error(`Project with name ${selectedProjectName} does not exist.`);
    console.log(
      `Try ${color.yellow(
        'pm remove'
      )} and select the project you want to remove`
    );
    return;
  }
  // removing project
  settings.projects = settings.projects.filter(
    (project) =>
      project.name.toLowerCase() !== selectedProjectName.toLowerCase()
  );

  writeSettings(settings, 'remove', 'Project Removed');
}

module.exports = removeProject;
