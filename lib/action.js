// external dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');

// internal modules
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// files
const settings = require('./settings.json');


// Helper functions

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
    fs.writeFile(path.join(__dirname,'settings.json'),JSON.stringify(data,null,4), err => {
        if(err){
            if(err.code === 'EACCES'){
                let errCmd = (process.platform == 'win32')?`an admin`:`a super user ${chalk.bold.yellow(`sudo pm ${command}`)}`;
                console.error(`Access Denied! please try again as ${errCmd}`);
                return;
            }
            throwCreateIssueError(err);
            return;
        }
        console.log(chalk.bold.green(">>> ")+successMessage + chalk.green(" ✔"));
    })
}

async function getProject(projectName=undefined, action="open"){
    let selectedProject;
    if(!projectName){
        // Ask which project he wants to open
        const questions = [
            {
                type: 'list',
                message: `Select project to ${action}`,
                name: 'selectedProject',
                choices: settings.projects.map(project => project.value = project)
            }
        ];

        // Redirecting to stderr in order for it to be used with command substitution
        var promptModule = inquirer.createPromptModule({ output: process.stderr });
        ({selectedProject} = await promptModule(questions));
    }else{
        // If project name is mentioned then open directly
        projectName = projectName.toLowerCase();
        selectedProject = settings.projects.find(project => project.name.toLowerCase() == projectName);
    }

    return selectedProject;
}

// 

// oncmd: projectman open [projectName]
async function openProject(projectName){
    if(settings.projects.length == 0){
        console.error("No projects to open :(");
        console.warn(`cd /till/project/directory/ and run ${chalk.bold.yellow('pm add')} to add projects and get started`);
        return;
    }

    const selectedProject = await getProject(projectName);

    if(!selectedProject){
        console.error("Project does not exist. Add it using `pm add [projectPath]` or cd till the project folder and type `pm add`");
        return;
    }

    const {stderr} = await exec(`${settings.commandToOpen}  "${selectedProject.path}"`);
    if(stderr){
        console.error("Could not open project for some reason :(");
        throwCreateIssueError(stderr);
        return;
    }

    console.log(`Opening ${selectedProject.name} :D !`);

}

async function setEditor(){
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
                }
            ]
        }
    ];

    ({selectedEditor:settings.commandToOpen} = await inquirer.prompt(editors));

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

async function removeProject(projectName){
    let selectedProjectName;
    if(!projectName){
        // Ask which project he wants to open
        const questions = [
            {
                type: 'list',
                message: 'Select project to remove',
                name: 'selectedProjectName',
                choices: settings.projects.map(project => project.value = project.name)
            }
        ];

        ({selectedProjectName} = await inquirer.prompt(questions));
    }else{
        if(!settings.projects.some(project => project.name.toLowerCase() === projectName.toLowerCase())){
            console.error("Project with that name does not exist");
            return;
        }

        selectedProjectName = projectName;

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

        const {stderr} = await exec(`${openSettingsCommand} "${path.join(__dirname,'settings.json')}"`)
        if(stderr){
            console.error("Error occured while opening the file: "+path.join(__dirname,'settings.json'));
            console.log("You can follow above path and manually edit settings.json");
            throwCreateIssueError(err);
            return;
        }
    
        console.log(chalk.bold.green(">>> ")+"Opened settings.json!");
    }catch(err){
        console.error("Error occured while opening the file: "+path.join(__dirname,'settings.json'));
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

    const selectedProject =  await getProject(projectName, "get directory");

    if(!selectedProject){
        console.error("Project does not exist. Add it using `pm add [projectPath]` or cd till the project folder and type `pm add`");
        return;
    }

    console.log(selectedProject.path);
}

module.exports = {openProject, addProject, removeProject, editConfigurations, setEditor, getProjectPath};
