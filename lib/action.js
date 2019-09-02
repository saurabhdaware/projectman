const util = require('util');
const exec = util.promisify(require('child_process').exec);
const settings = require('./settings.json');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

// projectman open [projectName]
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
        console.log("Project does not exist. Add it using `projectman add [projectPath]` or cd till the project folder and type `projectman add`");
        return;
    }

    const {stderr} = await exec(settings.commandToOpen + ' ' + selectedProject.path);
    if(stderr){
        console.log("Could not open project for some reason :(");
        console.log("If you think it is my fault please create issue on https://github.com/saurabhdaware/projectman/issues with proper title");
        console.log("Error log :")
        console.log(err);
        console.log("=====================\n");
        return;
    }
    
    console.log(`Opening ${selectedProject.name} :D !`);

}

// projectman add [projectDirectory]
async function addProject(projectDirectory = '.'){
    let newProject = {};
    newProject.path = path.resolve(projectDirectory);
    const name = newProject.path.split(path.sep).pop();
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
            console.log("Err:")
            console.log(stderr);
            return;
        }
    
        console.log("Opened settings.json!");
    }catch(err){
        console.log("Error occured while opening the file: "+path.join(__dirname,'settings.json'));
        console.log("You can follow above path and manually edit settings.json");
        console.log("Please create issue on https://github.com/saurabhdaware/projectman with following error log");
        console.log(err);
    }
}

module.exports = {openProject, addProject, editConfigurations}
