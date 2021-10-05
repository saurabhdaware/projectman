const path = require('path');
const { createCommandInterface } = require('cli-testing-library');
const cleanUp = require('./utils/cleanup');

const NO_PROJECT_FOUND_ERROR =
  '[BOLD_START][RED_START]>>>[COLOR_END][BOLD_END] No projects to open :(';
const CD_TO_ADD_PROJECT_MSG =
  // eslint-disable-next-line max-len
  '[BOLD_START][BLUE_START]>>>[COLOR_END][BOLD_END] cd /till/project/directory/ and run [YELLOW_START]pm add[COLOR_END] to add projects and get started';

async function addProject(dir) {
  const addCommandInterface = createCommandInterface(
    `node ${__dirname}/../bin/index.js add`,
    {
      cwd: dir
    }
  );
  await addCommandInterface.keys.enter(); // selects default name
  return addCommandInterface.getOutput();
}

describe('projectman open', () => {
  afterEach(() => {
    cleanUp();
  });

  test('should log no error found and pm add instructions', async () => {
    const commandInterface = createCommandInterface(
      'node ../bin/index.js open',
      {
        cwd: __dirname
      }
    );

    const terminal = await commandInterface.getOutput();
    expect(terminal.tokenizedOutput).toBe(
      NO_PROJECT_FOUND_ERROR + '\n' + CD_TO_ADD_PROJECT_MSG
    );
  });

  // eslint-disable-next-line max-len
  test('should show dropdown with tests and utils and with arrow on utils', async () => {
    await addProject(__dirname);
    await addProject(path.join(__dirname, 'utils'));

    const openCommandInterface = createCommandInterface(
      'node ../bin/index.js open',
      {
        cwd: __dirname
      }
    );
    await openCommandInterface.keys.arrowDown(); // move down to select utils
    const outputAfterArrowDown = await openCommandInterface.getOutput();
    expect(outputAfterArrowDown.stringOutput).toBe(
      '? Select project to open:  › \n    tests\n❯   utils'
    );
  });
});
