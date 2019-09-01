const util = require('util');
const exec = util.promisify(require('child_process').exec);
const settings = require('./settings.json');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

async function openProject(projectName){
    let selectedProject;
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
        console.log("Project does not exist. Add it using `projectman add <projectPath>`");
        return;
    }

    exec(settings.commandToOpen + ' ' + selectedProject.path)
        .then(({stdout,stderr}) => {
            if(stderr) throw stderr;
            console.log(`There you go with your project ${selectedProject.name} :D !`);
        })
        .catch(err => {
            console.log("Could not open project for some reason :(");
            console.log("If you think it is my fault please create issue on https://github.com/saurabhdaware/projectman/issues with proper title");
            console.log("Error log :")
            console.log(err);
            console.log("=====================\n");
        })
}   

async function addProject(projectDirectory = '.'){
    let newProject = {};
    newProject.path = path.resolve(projectDirectory);
    let name = newProject.path.split(path.sep).pop();
    ({finalName:newProject.name} = await inquirer.prompt([{type:'input',message:'Project Name',name:'finalName',default:name}]))

    if(settings.projects.some(project => project.name.toLowerCase() == newProject.name.toLowerCase())){
        console.log("Err: Project with this name already exists");
        return;
    }
    settings.projects.push(newProject);

    try{
        fs.writeFileSync(path.join(__dirname,'settings.json'),JSON.stringify(settings,null,4));
    }catch(err){
        console.log(err)
    }
}

function editConfigurations(){
    exec(settings.commandToOpen + ' '+path.join(__dirname,'settings.json'))
        .then(({stdout,stderr}) => {
            if(stderr) throw stderr;
            console.log("Opened settings.json");
        })
        .catch(console.log);
}

module.exports = {openProject, addProject, editConfigurations}
