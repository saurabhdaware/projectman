const color = require('./colors');
const { throwCreateIssueError } = require('./helper');

const noProjectsToOpen = () => {
  console.error('No projects to open :(');
  console.warn(
    `cd /till/project/directory/ and run ${color.boldYellow(
      'pm add'
    )} to add projects and get started`
  );
};

const projectDoesNotExist = () => {
  console.error(
    `Project does not exist. Add it using ${color.yellow(
      'pm add [projectPath]'
    )} or cd till the project folder and type ${color.yellow('pm add')}`
  );
};

const unknownError = (stderr) => {
  console.error('Something went wrong :(');
  throwCreateIssueError(stderr);
};

module.export = {
  noProjectsToOpen,
  projectDoesNotExist,
  unknownError
};
