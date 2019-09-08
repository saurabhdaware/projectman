// external dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');

// internal modules
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');

// Default settings.
const settingsData = {
    "commandToOpen": "code",
    "projects": []
}

// Create settings.json if does not exist or just require it if it does exist
const settingsPath = path.join(os.homedir(),'.projectman','settings.json');

let settings;
try{
    settings = require(settingsPath);
}catch(err){
    const settingsDir = path.join(os.homedir(),'.projectman');
    if(err.code === 'MODULE_NOT_FOUND'){
        if (!fs.existsSync(settingsDir)){
            fs.mkdirSync(settingsDir);
        }
        fs.writeFileSync(settingsPath,JSON.stringify(settingsData,null,4),'utf8');
        settings = settingsData;
    }
}
//

// Helper functions [START]
console.error = function(message){
    console.log(chalk.bold.red(">>> ") + message);
};

console.warn = function(message){
    console.log(chalk.bold.yellow(">>> ")+message);
}

function throwCreateIssueError(err){
    console.error("If you think it is my fault please create issue at https://github.com/saurabhdaware/projectman with below log");
    console.log(chalk.red("Err:"));
    console.log(err);
}

// Takes data as input and writes that data to settings.json
function writeSettings(data, command='<command>', successMessage = "Settings updated :D !"){ 
    fs.writeFile(settingsPath,JSON.stringify(data,null,4), err => {
        if(err){
            if(err.code === 'EACCES'){
                const errCmd = (process.platform == 'win32')?`an admin`:`a super user ${chalk.bold.yellow(`sudo pm ${command}`)}`;
                console.error(`Access Denied! please try again as ${errCmd}`);
                return;
            }
            throwCreateIssueError(err);
            return;
        }
        console.log(chalk.bold.green(">>> ")+successMessage + chalk.green(" ✔"));
    })
}

async function selectProject(projectName, action){
    let selectedProject;
    if(!projectName){
        // Ask which project he wants to open
        const questions = [
            {
                type: 'list',
                message: `Select project to ${action}`,
                name: 'selectedProject',
                choices: settings.projects.map(project => {
                    project.value = {name:project.name,path:project.path};
                    return project;
                })
            }
        ];

        // Redirecting to stderr in order for it to be used with command substitution
        var promptModule = inquirer.createPromptModule({ output: process.stderr });
        ({selectedProject} = await promptModule(questions));
    }else{
        // If project name is mentioned then open directly
        selectedProject = settings.projects.find(project => project.name.toLowerCase() == projectName.toLowerCase());
    }
    console.log(selectedProject);
    return selectedProject;
}

// Helper funcitions [END]

// oncmd: projectman open [projectName]
async function openProject(projectName){
    if(settings.projects.length == 0){
        console.error("No projects to open :(");
        console.warn(`cd /till/project/directory/ and run ${chalk.bold.yellow('pm add')} to add projects and get started`);
        return;
    }

    const selectedProject = await selectProject(projectName, 'open');

    if(!selectedProject){
        console.error("Project does not exist. Add it using `pm add [projectPath]` or cd till the project folder and type `pm add`");
        return;
    }

    const commandToOpen = selectedProject.editor || settings.commandToOpen;

    try{
        const {stderr} = await exec(`${commandToOpen}  "${selectedProject.path}"`);
        if(stderr){
            console.error("Could not open project for some reason :(");
            throwCreateIssueError(stderr);
            return;
        }

        console.log(`${chalk.bold.green(">>>")} Opening ${selectedProject.name} ${chalk.green("✔")}`);
        
    }catch(err){
        console.error("Could not open project :(");
        console.warn(`Are you sure your editor uses command ${chalk.yellow(commandToOpen)} to open directories from terminal?`);
        throwCreateIssueError(err);
        return;
    }
  
}

// pm seteditor [command]
async function setEditor(command){
    let commandToOpen;
    if(!command){
        const editors = [
            {
                type: 'list',
                message: 'Select text editor',
                name: 'selectedEditor',
                choices: [
                    {
                        name:'VSCode',
                        value:'code'
                    },
                    {
                        name:'Sublime',
                        value:'subl'
                    },
                    {
                        name:'Atom',
                        value:'atom'
                    },
                    {
                        name:'Vim',
                        value:'vim'
                    }
                ]
            }
        ];
    
        console.log(); // Just wanted to line break; Sorry god of good practices ;_;
        console.warn(`If the TextEditor/IDE you are looking for is not listed here, Run ${chalk.yellow('pm seteditor [commandToOpenEditor]')} \n'commandToOpenEditor' is the command you can type in terminal to open project E.g for Webstorm it is 'wstorm' for VSCode it is 'code'\n`);
        ({selectedEditor:commandToOpen} = await inquirer.prompt(editors));
    }else{
        commandToOpen = command;
    }

    settings.commandToOpen = commandToOpen;
    
    writeSettings(settings,'seteditor',"Text Editor Selected");
}

// projectman add [projectDirectory]
async function addProject(projectDirectory = '.'){
    let newProject = {};
    newProject.path = path.resolve(projectDirectory);
    const name = newProject.path.split(path.sep).pop();
    ({finalName:newProject.name} = await inquirer.prompt([{type:'input',message:'Project Name',name:'finalName',default:name}]))

    if(settings.projects.some(project => project.name.toLowerCase() == newProject.name.toLowerCase())){
        console.error("Project with this name already exists");
        return;
    }
    
    settings.projects.push(newProject);

    writeSettings(settings, 'add', "Project Added");
}

// pm remove [projectName]
async function removeProject(projectName){
    const {name:selectedProjectName} = await selectProject(projectName,'remove');

    if(!selectedProjectName){
        console.error(`Project with name ${selectedProjectName} does not exist. Try ${chalk.yellow('pm remove')} and select the project you want to remove`);
        return;
    }
    // removing project
    settings.projects = settings.projects.filter(project => project.name.toLowerCase() !== selectedProjectName.toLowerCase());

    writeSettings(settings, 'remove', "Project Removed");
}

// projectman edit
async function editConfigurations(){
    let openSettingsCommand;
    if(process.platform == 'win32'){
        openSettingsCommand = 'Notepad ';
    }else if(process.platform == 'linux'){
        openSettingsCommand = 'xdg-open ';
    }else {
        openSettingsCommand = 'open '
    }

    try{

        const {stderr} = await exec(`${openSettingsCommand} "${settingsPath}"`)
        if(stderr){
            console.error("Error occured while opening the file: "+settingsPath);
            console.log("You can follow above path and manually edit settings.json");
            throwCreateIssueError(err);
            return;
        }
    
        console.log(chalk.bold.green(">>> ")+"Opening settings.json"+ chalk.green(" ✔"));
    }catch(err){
        console.error("Error occured while opening the file: "+settingsPath);
        console.warn("You can follow above path and manually edit settings.json");
        throwCreateIssueError(err);
    }
}

async function getProjectPath(projectName){
    if(settings.projects.length === 0){
        console.error("No projects to get path :(");
        console.warn(`cd /till/project/directory/ and run ${chalk.bold.yellow('pm add')} to add projects and get started`);
        return;
    }

    const selectedProject =  await selectProject(projectName, "get directory");

    if(!selectedProject){
        console.error("Project does not exist. Add it using `pm add [projectPath]` or cd till the project folder and type `pm add`");
        return;
    }

    console.log(selectedProject.path);
}

module.exports = {openProject, addProject, removeProject, editConfigurations, setEditor, getProjectPath};
