const path = require('path');
const { createCommandInterface, parseOutput } = require('cli-testing-tool');
const cleanUp = require('./utils/cleanup');
const { STRING_ESC } = require('cli-testing-tool/lib/cli-ansi-parser');

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
    // add tests and utils
    await addProject(__dirname);
    await addProject(path.join(__dirname, 'utils'));

    const openCommandInterface = createCommandInterface(
      'node ../bin/index.js open',
      {
        cwd: __dirname
      }
    );
    await openCommandInterface.keys.arrowDown(); // move down to select utils
    const { rawOutput } = await openCommandInterface.getOutput();
    /**
     * Why slice from last clear line?
     *
     * Even though we see one output in terminal, sometimes libraries can create multiple outputs
     * slicing from the last clear line just makes sure we only get final output.
     */
    const outputAfterLastLineClear = rawOutput.slice(
      rawOutput.lastIndexOf(`${STRING_ESC}2K`)
    );
    const parsedOutputAfterLastLineClear = parseOutput(
      outputAfterLastLineClear
    );

    expect(parsedOutputAfterLastLineClear.stringOutput).toBe(
      `? Select project to open:› \ntests \nutils`
    );
  });
});
