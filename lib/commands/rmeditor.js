const color = require('../colors.js');

const { getSettings, writeSettings, selectProject } = require('../helper.js');

async function rmEditor(projectName, cmdObj) {
  const settings = getSettings();

  let newSettings;
  if (cmdObj.all) {
    newSettings = {
      ...settings,
      projects: settings.projects.map(({ ...project }) => {
        if (project.editor) delete project.editor;
        return project;
      })
    };
  } else {
    console.log(
      color.boldGrey('>>> Default editor: ') +
        color.grey(settings.commandToOpen)
    );
    const selectedProject = await selectProject(
      projectName,
      'Select project to remove editor from'
    );
    if (!selectedProject) {
      console.error(`Project with name ${selectedProject} does not exist.`);
      console.log(
        `Try ${color.yellow(
          'pm rmeditor'
        )} and select the project you want to remove the editor from`
      );
      return;
    }

    const selectedIndex = settings.projects.findIndex(
      (project) =>
        selectedProject.name.toLowerCase() == project.name.toLowerCase()
    );
    delete settings.projects[selectedIndex].editor;
    newSettings = { ...settings };
  }

  writeSettings(newSettings, 'rmeditor', `TextEditor Removed`);
}

module.exports = rmEditor;
