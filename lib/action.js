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
}

console.warn = function(message){
    console.log(chalk.bold.yellow(">>> ")+message);
}

function throwCreateIssueError(err){
    console.error("If you think it is my fault please create issue at https://github.com/saurabhdaware/projectman with below log");
    console.log(chalk.red("Err:"));
    console.log(err);
}

// Takes data as input and writes that data to settings.json
function writeSettings(data, command='<command>'){ 
    fs.writeFile(path.join(__dirname,'settings.json'),JSON.stringify(data,null,4), err => {
        if(err){
            console.log(chalk.bold.red(">>>")+ `In case of access denied error please try again as a super user 'sudo pm ${command}'`);
            throwCreateIssueError(err);
        }
        console.log(chalk.bold.green(">>>")+" Settings updated 🎉");
    })
}

// 

// oncmd: projectman open [projectName]
async function openProject(projectName){
    let selectedProject;
    if(settings.projects.length == 0){
        console.error("No projects to open :(");
        console.warn(`cd /till/project/directory/ and run ${chalk.bold.yellow('projectman add')} to add projects and get started`);
        return;
    }

    if(!projectName){
        // Ask which project he wants to open
        const questions = [
            {
                type: 'list',
                message: 'Select project to open',
                name: 'selectedProject',
                choices: settings.projects.map(project => project.value = project)
            }
        ];

        ({selectedProject} = await inquirer.prompt(questions));

    }else{
        // If project name is mentioned then open directly
        projectName = projectName.toLowerCase();
        selectedProject = settings.projects.find(project => project.name.toLowerCase() == projectName);
    }

    if(!selectedProject){
        console.error("Project does not exist. Add it using `projectman add [projectPath]` or cd till the project folder and type `projectman add`");
        return;
    }

    const {stderr} = await exec(settings.commandToOpen + ' ' + selectedProject.path);
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

    writeSettings(settings,'seteditor');
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

    writeSettings(settings, 'add');
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

    writeSettings(settings, 'remove');

}

// projectman edit
async function editConfigurations(){
    let openSettingsCommand;
    if(process.platform == 'win32'){
        openSettingsCommand = 'Notepad \"';
    }else if(process.platform == 'linux'){
        openSettingsCommand = 'xdg-open ';
    }else {
        openSettingsCommand = 'open '
    }

    try{

        const {stderr} = await exec(openSettingsCommand +' '+path.join(__dirname,'settings.json')+((process.platform == 'win32')?'\"':''))
        if(stderr){
            console.error("Error occured while opening the file: "+path.join(__dirname,'settings.json'));
            console.log("You can follow above path and manually edit settings.json");
            throwCreateIssueError(err);
            return;
        }
    
        console.log(chalk.bold.green(">>> ")+"Opened settings.json!");
    }catch(err){
        console.log("Error occured while opening the file: "+path.join(__dirname,'settings.json'));
        console.log("You can follow above path and manually edit settings.json");
        throwCreateIssueError(err);
    }
}

module.exports = {openProject, addProject, removeProject, editConfigurations, setEditor}
