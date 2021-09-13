// external dependencies
const prompts = require('prompts');
const program = require('commander');
const didYouMean = require('didyoumean');

// internal modules
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');

// helper functions
const color = require('./colors.js');

// Default settings.
const DEFAULT_SETTINGS = {
  commandToOpen: 'code',
  projects: []
};

// Create settings.json if does not exist or just require it if it does exist
const SETTINGS_PATH = path.join(os.homedir(), '.projectman', 'settings.json');

/**
 * Returns settings if already exists, else creates default settings and returns it
 * @returns {import('../types/utils').SettingsType}
 */
const getSettings = () => {
  let settings;
  try {
    settings = require(SETTINGS_PATH);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      // Create if doesn't exist
      const settingsDir = path.join(os.homedir(), '.projectman');
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir);
      }
      fs.writeFileSync(
        SETTINGS_PATH,
        JSON.stringify(DEFAULT_SETTINGS, null, 4),
        'utf8'
      );
      settings = DEFAULT_SETTINGS;
    }
  }

  return settings;
};
//

const settings = getSettings();

const logger = {
  error: (message) => console.log(color.boldRed('>>> ') + message),
  warn: (message) => console.log(color.boldYellow('>>> ') + message),
  success: (message) => console.log(color.boldGreen('>>> ') + message + ' ✔')
};

function throwCreateIssueError(err) {
  logger.error(
    // eslint-disable-next-line max-len
    'If you think it is my fault please create issue at https://github.com/saurabhdaware/projectman with below log'
  );
  console.log(color.boldRed('Err:'));
  console.log(err);
}

// Takes data as input and writes that data to settings.json
function writeSettings(
  data,
  command = '<command>',
  successMessage = 'Settings updated :D'
) {
  fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      if (err.code === 'EACCES') {
        const errCmd =
          process.platform == 'win32'
            ? `an admin`
            : `a super user ${color.boldYellow(`sudo pm ${command}`)}`;
        logger.error(`Access Denied! please try again as ${errCmd}`);
        return;
      }
      throwCreateIssueError(err);
      return;
    }
    logger.success(successMessage);
  });
}

async function openURL(url) {
  let stderr;
  switch (process.platform) {
    case 'darwin':
      ({ stderr } = await exec(`open ${url}`));
      break;
    case 'win32':
      ({ stderr } = await exec(`start ${url}`));
      break;
    default:
      ({ stderr } = await exec(`xdg-open ${url}`));
      break;
  }
  if (stderr) {
    console.log(stderr);
  }
  return stderr;
}

function isURL(str) {
  // eslint-disable-next-line max-len
  const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
}

const suggestFilter = (input, choices) => {
  return Promise.resolve(
    choices.filter((choice) =>
      choice.title.toLowerCase().includes(input.toLowerCase())
    )
  );
};

const suggestCommands = (cmd) => {
  const suggestion = didYouMean(
    cmd,
    program.commands.map((cmd) => cmd._name)
  );
  if (suggestion) {
    console.log();
    console.log(`Did you mean ${suggestion}?`);
  }
};

const onCancel = () => {
  logger.error("See ya ('__') /");
  process.exit();
  return false;
};

function getChoices(customFilter = () => true) {
  const projects = [...settings.projects];
  const result = projects.filter(customFilter).map(({ ...project }) => {
    // Spreading project to make it immutable
    project.title = project.name;
    project.value = { name: project.name, path: project.path };
    if (project.editor && project.editor !== settings.commandToOpen) {
      project.title += color.grey(
        ` (${color.boldGrey('editor:')} ${color.grey(project.editor + ')')}`
      );
      project.value.editor = project.editor;
    }

    if (isURL(project.path)) {
      project.title += color.boldGrey(` (URL)`);
      project.description = project.path;
    }

    return project;
  });

  return result;
}

async function selectProject(projectName, action, customFilter = () => true) {
  let selectedProject;
  if (!projectName) {
    // Ask which project he wants to open
    const questions = [
      {
        type: 'autocomplete',
        message: `Select project to ${action} :`,
        name: 'selectedProject',
        choices: getChoices(customFilter),
        limit: 40,
        suggest: suggestFilter
      }
    ];

    // Redirecting to stderr in order for it to be used with command substitution
    ({ selectedProject } = await prompts(questions, { onCancel }));
  } else {
    // If project name is mentioned then open directly
    selectedProject = settings.projects.find(
      (project) => project.name.toLowerCase() == projectName.toLowerCase()
    );
  }
  return selectedProject;
}

// Helper funcitions [END]

module.exports = {
  settings,
  getSettings,
  SETTINGS_PATH,
  throwCreateIssueError,
  writeSettings,
  openURL,
  isURL,
  suggestCommands,
  onCancel,
  getChoices,
  selectProject
};
