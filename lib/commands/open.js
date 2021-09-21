// internal modules
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// helper functions
const color = require('../colors.js');
const logs = require('../logs.js');

const {
  getSettings,
  throwCreateIssueError,
  openURL,
  isURL,
  selectProject
} = require('../helper.js');

/**
 * COMMAND: pm open [projectName]
 *
 * ARGUMENTS: [projectName] :: Name of the project to open
 *
 * @param {string} projectName - Name of the project to open
 */
async function openProject(projectName) {
  const settings = getSettings();
  if (settings.projects.length == 0) {
    logs.noProjectsToOpen();
    return;
  }

  console.log(
    color.boldGrey('>>> Default editor: ') + color.grey(settings.commandToOpen)
  );
  const selectedProject = await selectProject(
    projectName,
    'Select project to open'
  );

  if (!selectedProject) {
    logs.projectDoesNotExist();
    return;
  }

  const commandToOpen = selectedProject.editor || settings.commandToOpen; // If project specific editor exists, Then open using that command else use global command
  let stderr;
  try {
    if (isURL(selectedProject.path)) {
      ({ stderr } = await openURL(selectedProject.path)); // If it is URL then open in Browser.
    } else {
      ({ stderr } = await exec(`${commandToOpen}  "${selectedProject.path}"`)); // This line opens projects
    }

    if (stderr) {
      console.error('Could not open project for some reason :(');
      throwCreateIssueError(stderr);
      return;
    }

    console.log(
      `${color.boldGreen('>>>')} Opening ${selectedProject.name} ${color.green(
        '✔'
      )}`
    ); // Success yay!
  } catch (err) {
    console.error('Could not open project :('); // Something broke :(
    console.warn(
      `Are you sure your editor uses command ${color.yellow(
        commandToOpen
      )} to open directories from terminal?`
    );
    console.warn(
      `If not, use ${color.yellow(
        'pm seteditor'
      )} to set Editor/IDE of your choice`
    );
    throwCreateIssueError(err);
    return;
  }
}

module.exports = openProject;
