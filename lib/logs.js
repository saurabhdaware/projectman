const color = require('./colors');
const { throwCreateIssueError } = require('./helper');

const error = (message) => {
  console.error(color.boldRed('>>>'), message);
};

const warn = (message) => {
  console.warn(color.boldYellow('>>>'), message);
};

const info = (message) => {
  console.log(color.boldBlue('>>>'), message);
};

const noProjectsToOpen = () => {
  error('No projects to open :(');
  info(
    `cd /till/project/directory/ and run ${color.yellow(
      'pm add'
    )} to add projects and get started`
  );
};

const projectDoesNotExist = () => {
  error(
    `Project does not exist. Add it using ${color.yellow(
      'pm add [projectPath]'
    )} or cd till the project folder and type ${color.yellow('pm add')}`
  );
};

const unknownError = (stderr) => {
  error('Something went wrong :(');
  throwCreateIssueError(stderr);
};

module.exports = {
  noProjectsToOpen,
  projectDoesNotExist,
  unknownError,
  error,
  warn
};
