// external dependencies
const prompts = require('prompts');

// internal modules
const path = require('path');

// helper functions
const color = require('../colors.js');

const { getSettings, writeSettings, isURL, onCancel } = require('../helper.js');

/*

COMMAND: pm add [projectDirectory] [--url [link]]
ARGUMENTS: 
[projectDirectory] :: Directory of the project that you want to add. OR when --url flag is added, URL of the repository.

FLAG:
[--url [link]] :: Adds URL.

RETURNS: newProject object.

*/
async function addProject(projectDirectory = '.', cmdObj = undefined) {
  const settings = getSettings();
  const newProject = {};
  let name;
  let enteredUrl;

  if (cmdObj.url) {
    if (projectDirectory !== '.') {
      console.warn(
        "Project's local directory value will be ignore when --url flag is on"
      );
    }

    if (cmdObj.url == true) {
      ({ enteredUrl } = await prompts(
        [
          {
            type: 'text',
            message: 'Project URL :',
            name: 'enteredUrl',
            initial: 'https://github.com/',
            validate: (url) => (isURL(url) ? true : 'Not a valid URL')
          }
        ],
        { onCancel }
      ));
      name = enteredUrl.split('/').pop(); // Get last route of URL to set default name
      newProject.path = enteredUrl;
    } else {
      if (!isURL(cmdObj.url)) {
        console.error('Not a valid URL');
        console.warn(
          'A valid URL looks something like ' +
            color.yellow('https://github.com/saurabhdaware/projectman')
        );
        return;
      }
      name = cmdObj.url.split('/').pop(); // Get last route of URL to set default name
      newProject.path = cmdObj.url;
    }
  } else {
    newProject.path = path.resolve(projectDirectory);
    name = newProject.path.split(path.sep).pop();
  }

  ({ finalName: newProject.name } = await prompts(
    [
      {
        type: 'text',
        message: 'Project Name :',
        name: 'finalName',
        initial: name
      }
    ],
    { onCancel }
  ));

  if (
    settings.projects.some(
      (project) => project.name.toLowerCase() == newProject.name.toLowerCase()
    )
  ) {
    console.error('Project with this name already exists');
    return;
  }

  settings.projects.push(newProject);

  writeSettings(settings, 'add', 'Project Added');

  return newProject;
}

module.exports = addProject;
