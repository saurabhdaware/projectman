// external dependencies
const prompts = require('prompts');
const gitIgnoreParser = require('gitignore-parser');

// internal modules
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

// helper functions
const color = require('../colors.js');
const logs = require('../logs.js');

const {
  onCancel,
  selectProject,
  copyFolderSync,
  getSettings,
  isURL,
  logger
} = require('../helper.js');

// pm create [projectName]
async function createProject(projectName) {
  const settings = getSettings();
  if (settings.projects.length == 0) {
    logs.error('No projects to open :(');
    console.warn(
      `cd /till/project/directory/ and run ${color.boldYellow(
        'pm add'
      )} to add projects and get started`
    );
    return;
  }

  const selectedTemplate = await selectProject(
    undefined,
    'Select starting template'
  );

  if (!selectedTemplate) {
    logs.error(
      `Project does not exist. Add it using ${color.yellow(
        'pm add [projectPath]'
      )} or cd to the project folder and type ${color.yellow('pm add')}`
    );
    return;
  }

  if (!projectName) {
    ({ projectName } = await prompts(
      [
        {
          type: 'text',
          message: 'Project Name:',
          name: 'projectName',
          initial: '',
          validate: (val) => {
            if (!val) {
              return false;
            }

            return true;
          }
        }
      ],
      { onCancel }
    ));
  }

  const newProjectDirectoryName = projectName.toLowerCase().replace(/ /g, '-');
  const newProjectDirectory = path.join(process.cwd(), newProjectDirectoryName);

  if (isURL(selectedTemplate.path)) {
    if (!selectedTemplate.path.includes('github.com')) {
      console.error(
        'Currently only github.com URLs can be used to scaffold project'
      );
      return;
    }

    const childProcess = spawn(
      'git',
      ['clone', selectedTemplate.path, newProjectDirectory],
      {
        stdio: 'inherit'
      }
    );

    childProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('');
        logger.success(
          // eslint-disable-next-line max-len
          `${newProjectDirectoryName} is successfully scaffolded from ${selectedTemplate.path}`
        );
      } else {
        console.log('');
        logger.error(
          // eslint-disable-next-line max-len
          `Could not scaffold project. Git clone exitted with 1. Check error above`
        );
      }
    });

    return;
  }

  let gitignoreContent = '.git/\n';
  const gitignorePath = path.join(selectedTemplate.path, '.gitignore');

  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  }

  const gitignore = gitIgnoreParser.compile(gitignoreContent);
  copyFolderSync(
    selectedTemplate.path,
    newProjectDirectory,
    gitignore,
    true,
    selectedTemplate.path
  );
}

module.exports = createProject;
