// external dependencies
const inquirer = require("inquirer");
const chalk = require("chalk");

// internal modules
const path = require("path");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const os = require("os");

// Default settings.
const settingsData = {
  commandToOpen: {},
  projects: []
};

// Create settings.json if does not exist or just require it if it does exist
const settingsPath = path.join(os.homedir(), ".projectman", "settings.json");

let settings;
try {
  settings = require(settingsPath);
} catch (err) {
  const settingsDir = path.join(os.homedir(), ".projectman");
  if (err.code === "MODULE_NOT_FOUND") {
    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir);
    }
    fs.writeFileSync(
      settingsPath,
      JSON.stringify(settingsData, null, 4),
      "utf8"
    );
    settings = settingsData;
  }
}
//

// Helper functions

console.error = function(message) {
  console.log(chalk.bold.red(">>> ") + message);
};

console.warn = function(message) {
  console.log(chalk.bold.yellow(">>> ") + message);
};

function throwCreateIssueError(err) {
  console.error(
    "If you think it is my fault please create issue at https://github.com/saurabhdaware/projectman with below log"
  );
  console.log(chalk.red("Err:"));
  console.log(err);
}

// Takes data as input and writes that data to settings.json
function writeSettings(
  data,
  command = "<command>",
  successMessage = "Settings updated :D !"
) {
  fs.writeFile(settingsPath, JSON.stringify(data, null, 4), err => {
    if (err) {
      if (err.code === "EACCES") {
        const errCmd =
          process.platform == "win32"
            ? `an admin`
            : `a super user ${chalk.bold.yellow(`sudo pm ${command}`)}`;
        console.error(`Access Denied! please try again as ${errCmd}`);
        return;
      }
      throwCreateIssueError(err);
      return;
    }
    console.log(chalk.bold.green(">>> ") + successMessage + chalk.green(" ✔"));
  });
}

//

// projectman open [projectName]
async function openProject(projectName) {
  let selectedProject;
  if (settings.projects.length == 0) {
    console.error("No projects to open :(");
    console.warn(
      `cd /till/project/directory/ and run ${chalk.bold.yellow(
        "pm add"
      )} to add projects and get started`
    );
    return;
  }

  if (!projectName) {
    // Ask which project he wants to open
    const questions = [
      {
        type: "list",
        message: "Select project to open",
        name: "selectedProject",
        choices: settings.projects.map(project => (project.value = project))
      }
    ];

    ({ selectedProject } = await inquirer.prompt(questions));
  } else {
    // If project name is mentioned then open directly
    projectName = projectName.toLowerCase();
    selectedProject = settings.projects.find(
      project => project.name.toLowerCase() == projectName
    );
  }

  if (!selectedProject) {
    console.error(
      "Project does not exist. Add it using `pm add [projectPath]` or cd till the project folder and type `pm add`"
    );
    return;
  }

  const commandToOpen =
    selectedProject.editor || settings.commandToOpen[`${selectedProject.name}`];

  try {
    const { stderr } = await exec(
      `${commandToOpen}  "${selectedProject.path}"`
    );
    if (stderr) {
      console.error("Could not open project for some reason :(");
      throwCreateIssueError(stderr);
      return;
    }

    console.log(
      `${chalk.bold.green(">>>")} Opening ${selectedProject.name} ${chalk.green(
        "✔"
      )}`
    );
  } catch (err) {
    console.error("Could not open project :(");
    console.warn(
      `Are you sure your editor uses command ${chalk.yellow(
        commandToOpen
      )} to open directories from terminal?`
    );
    throwCreateIssueError(err);
    return;
  }
}

// pm seteditor [command]
async function setEditor(command) {
  let commandToOpen;
  if (!command) {
    const questions = [
      {
        type: "list",
        message: "Select project to set editor",
        name: "selectedProject",
        choices: settings.projects.map(project => (project.value = project))
      }
    ];
    const editors = [
      {
        type: "list",
        message: "Select text editor",
        name: "selectedEditor",
        choices: [
          {
            name: "VSCode",
            value: "code"
          },
          {
            name: "Sublime",
            value: "subl"
          },
          {
            name: "Atom",
            value: "atom"
          },
          {
            name: "Vim",
            value: "vim"
          }
        ]
      }
    ];

    console.warn(
      `\nIf the TextEditor/IDE you are looking for is not listed here, Run ${chalk.yellow(
        "pm seteditor [commandToOpenEditor]"
      )} \n'commandToOpenEditor' is the command you can type in terminal to open project E.g for Webstorm it is 'wstorm' for VSCode it is 'code'\n`
    );
    ({ selectedProject } = await inquirer.prompt(questions));
    ({ selectedEditor: commandToOpen } = await inquirer.prompt(editors));
  } else {
    commandToOpen = command;
  }
  console.log(settings.commandToOpen);

  settings.commandToOpen[`${selectedProject}`] = commandToOpen;

  writeSettings(settings, "seteditor", "Text Editor Selected");
}

// projectman add [projectDirectory]
async function addProject(projectDirectory = ".") {
  let newProject = {};
  newProject.path = path.resolve(projectDirectory);
  const name = newProject.path.split(path.sep).pop();
  ({ finalName: newProject.name } = await inquirer.prompt([
    { type: "input", message: "Project Name", name: "finalName", default: name }
  ]));

  if (
    settings.projects.some(
      project => project.name.toLowerCase() == newProject.name.toLowerCase()
    )
  ) {
    console.error("Project with this name already exists");
    return;
  }

  // Ask what editor the project uses
  const editors = [
    {
      type: "list",
      message: "Select text editor",
      name: "selectedEditor",
      choices: [
        {
          name: "VSCode",
          value: "code"
        },
        {
          name: "Sublime",
          value: "subl"
        },
        {
          name: "Atom",
          value: "atom"
        },
        {
          name: "Vim",
          value: "vim"
        },
        {
          name: "Webstorm",
          value: "wstorm"
        },
        {
          name: "Pycharm",
          value: "pycharm"
        }
      ]
    }
  ];
  ({ selectedEditor: command } = await inquirer.prompt(editors));

  console.warn(
    `\nIf the TextEditor/IDE you are looking for is not listed here, Run ${chalk.yellow(
      "pm seteditor [commandToOpenEditor]"
    )} \n'commandToOpenEditor' is the command you can type in terminal to open project E.g for Webstorm it is 'wstorm' for VSCode it is 'code'\n`
  );
  settings.projects.push(newProject);
  settings.commandToOpen[`${newProject.name}`] = command;

  writeSettings(settings, "add", "Project Added");
}

// pm remove [projectName]
async function removeProject(projectName) {
  let selectedProjectName;
  if (!projectName) {
    // Ask which project he wants to open
    const questions = [
      {
        type: "list",
        message: "Select project to remove",
        name: "selectedProjectName",
        choices: settings.projects.map(
          project => (project.value = project.name)
        )
      }
    ];

    ({ selectedProjectName } = await inquirer.prompt(questions));
  } else {
    if (
      !settings.projects.some(
        project => project.name.toLowerCase() === projectName.toLowerCase()
      )
    ) {
      console.error("Project with that name does not exist");
      return;
    }

    selectedProjectName = projectName;
  }

  // removing project
  Object.keys(settings.commandToOpen).map(project =>
    project.toLowerCase() !== selectedProjectName.toLowerCase()
      ? null
      : delete settings.commandToOpen[`${project}`]
  );
  settings.projects = settings.projects.filter(
    project => project.name.toLowerCase() !== selectedProjectName.toLowerCase()
  );

  writeSettings(settings, "remove", "Project Removed");
}

// projectman edit
async function editConfigurations() {
  let openSettingsCommand;
  if (process.platform == "win32") {
    openSettingsCommand = "Notepad ";
  } else if (process.platform == "linux") {
    openSettingsCommand = "xdg-open ";
  } else {
    openSettingsCommand = "open ";
  }

  try {
    const { stderr } = await exec(`${openSettingsCommand} "${settingsPath}"`);
    if (stderr) {
      console.error("Error occured while opening the file: " + settingsPath);
      console.log("You can follow above path and manually edit settings.json");
      throwCreateIssueError(err);
      return;
    }

    console.log(
      chalk.bold.green(">>> ") + "Opening settings.json" + chalk.green(" ✔")
    );
  } catch (err) {
    console.error("Error occured while opening the file: " + settingsPath);
    console.warn("You can follow above path and manually edit settings.json");
    throwCreateIssueError(err);
  }
}

module.exports = {
  openProject,
  addProject,
  removeProject,
  editConfigurations,
  setEditor
};
