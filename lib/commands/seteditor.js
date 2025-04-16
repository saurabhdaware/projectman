// external dependencies
const prompts = require('prompts');

// helper functions
const color = require('../colors.js');

const {
  getSettings,
  writeSettings,
  isURL,
  onCancel,
  selectProject
} = require('../helper.js');

const questions = [
  {
    type: 'select',
    message: 'Select Project Open Command',
    name: 'selectedEditor',
    choices: [
      {
        title: 'code',
        value: 'code'
      },
      {
        title: 'cursor',
        value: 'cursor'
      },
      {
        title: 'subl',
        value: 'subl'
      },
      {
        title: 'atom',
        value: 'atom'
      },
      {
        title: 'vim',
        value: 'vim'
      },
      {
        title: 'Other',
        value: 'other'
      }
    ]
  }
];

// pm seteditor [command]
async function setEditor(command, cmdObj = undefined) {
  let commandToOpen;
  let selectedProject;
  let selectedIndex = -1; // this will have the index of selectedProject
  let projectName;
  const settings = getSettings();

  const setEditorFilter = (project) => !isURL(project.path);

  if (cmdObj.forProject) {
    // --for-project exists
    projectName = cmdObj.forProject === true ? undefined : cmdObj.forProject; // if only[--for-project], set undefined else if [--for-project [projectName]] set projectName
    selectedProject = await selectProject(
      projectName,
      'Select project to set editor for',
      setEditorFilter
    ); // sending undefined, calls list of projects to select from
    // find the index of selectedProject and add editor to that project
    selectedIndex = settings.projects.findIndex(
      (project) =>
        project.name.toLowerCase() == selectedProject.name.toLowerCase()
    );
  }

  if (!command) {
    const { selectedEditor } = await prompts(questions, { onCancel });
    if (selectedEditor == 'other') {
      console.warn('Enter command that you use to open Editor from Terminal');
      console.log(
        `E.g With VSCode Installed, you can type ${color.yellow(
          'code <directory>'
        )} in terminal to open directory`
      );
      console.log(
        `In this case, the command would be ${color.yellow('code')}\n`
      );
      const question = {
        type: 'text',
        message: 'Enter command :',
        name: 'command',
        validate: function (val) {
          return val !== '';
        }
      };
      const { command } = await prompts([question], { onCancel });
      commandToOpen = command;
    } else {
      commandToOpen = selectedEditor;
    }
  } else {
    commandToOpen = command;
  }

  if (selectedIndex < 0) {
    settings.commandToOpen = commandToOpen;
  } else {
    settings.projects[selectedIndex].editor = commandToOpen;
  }

  writeSettings(
    settings,
    'seteditor',
    `Text Editor Selected ${
      selectedIndex < 0 ? '' : `for ${settings.projects[selectedIndex].name}`
    }`
  );
}

module.exports = setEditor;
