// external dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');
const open = require('open')

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
        const projects = [...settings.projects];
        // Ask which project he wants to open
        const questions = [
            {
                type: 'list',
                message: `Select project to ${action} :`,
                name: 'selectedProject',
                choices: projects.map(({...project}) => { // Spreading project to make it immutable
                    project.value = {name:project.name,path:project.path};
                    if(project.editor && project.editor !== settings.commandToOpen){
                        project.name += chalk.grey(` (${chalk.bold.grey('editor:')} ${project.editor})`);
                        project.value.editor = project.editor;
                    }
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

    console.log(chalk.bold.grey('>>> Default editor: ')+chalk.grey(settings.commandToOpen));
    const selectedProject = await selectProject(projectName, 'open');

    if(!selectedProject){
        console.error(`Project does not exist. Add it using ${chalk.yellow('pm add [projectPath]')} or cd till the project folder and type ${chalk.yellow('pm add')}`);
        return;
    }

    const commandToOpen = selectedProject.editor || settings.commandToOpen;

    try{
        if (/^https?:\/\//.test(selectedProject.path)){
            await open(selectedProject.path)
        } else {
            const {stderr} = await exec(`${commandToOpen}  "${selectedProject.path}"`);
            if(stderr){
                console.error("Could not open project for some reason :(");
                throwCreateIssueError(stderr);
                return;
            }
        }

        console.log(`${chalk.bold.green(">>>")} Opening ${selectedProject.name} ${chalk.green("✔")}`);
        
    }catch(err){
        console.error("Could not open project :(");
        console.warn(`Are you sure your editor uses command ${chalk.yellow(commandToOpen)} to open directories from terminal?`);
        console.warn(`If not, use ${chalk.yellow('pm seteditor')} to set Editor/IDE of your choice`)
        throwCreateIssueError(err);
        return;
    }
  
}

// projectman add [projectDirectory]
async function addProject(projectDirectory = '.', cmdObj=undefined){
    let newProject = {};
    let name;
    if(cmdObj.repo) {
        if (projectDirectory === '.'){
            console.error("Must specify a URL for a repository");
            return
        }
        newProject.path = projectDirectory;
        try {
            name = projectDirectory.match(/https?:\/\/(.*?)\//)[1];
        } catch  {
            console.error('Must specify a URL for a repository');
            return
        }
    } else {
        newProject.path = path.resolve(projectDirectory);
        name = newProject.path.split(path.sep).pop();
    }

    ({finalName:newProject.name} = await inquirer.prompt([{type:'input',message:'Project Name :',name:'finalName',default:name}]));

    if(cmdObj.repo) {
        newProject.name = newProject.name.concat(` (${name.split('.')[0]})`)
    }

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


// pm seteditor [command]
async function setEditor(command,cmdObj=undefined){
    let commandToOpen;
    let selectedProject;
    let selectedIndex = -1; // this will have the index of selectedProject
    let projectName;
    if(cmdObj.forProject){ // --for-project exists
        projectName = (cmdObj.forProject === true)?undefined:cmdObj.forProject; // if only[--for-project], set undefined else if [--for-project [projectName]] set projectName
        selectedProject = await selectProject(projectName,'set editor for'); // sending undefined, calls list of projects to select from
        // find the index of selectedProject and add editor to that project
        selectedIndex = settings.projects.findIndex(project => project.name.toLowerCase() == selectedProject.name.toLowerCase())
    }


    if(!command){
        const questions = [
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
                    },
                    {
                        name:'Other',
                        value:'other'
                    }
                ]
            }
        ];
        const {selectedEditor} = await inquirer.prompt(questions);
        if(selectedEditor == 'other'){
            console.warn("Enter command that you use to open Editor from Terminal");
            console.log(`E.g With VSCode Installed, you can type ${chalk.yellow('code <directory>')} in terminal to open directory`);
            console.log(`In this case, the command would be ${chalk.yellow('code')}\n`);
            const question = {
                type:'input', 
                message:'Enter command :', 
                name:'command',
                validate:function(val){
                    return val !== ''
                }
            }
            const {command} = await inquirer.prompt([question])
            commandToOpen = command;
        }else{
            commandToOpen = selectedEditor;
        }

    }else{
        commandToOpen = command;
    }
    
    if(selectedIndex < 0){
        settings.commandToOpen = commandToOpen;
    }else{
        settings.projects[selectedIndex].editor = commandToOpen;
    }

    writeSettings(settings,'seteditor',`Text Editor Selected ${(selectedIndex < 0)?'':`for ${settings.projects[selectedIndex].name}`}`);
}

async function rmEditor(projectName,cmdObj){
    let newSettings;
    if(cmdObj.all){
        newSettings = {
            ...settings,
            projects:settings.projects.map(({...project}) => {
                if(project.editor) delete project.editor;
                return project;
            })}
    }else{
        console.log(chalk.bold.grey('>>> Default editor: ')+chalk.grey(settings.commandToOpen));
        let selectedProject = await selectProject(projectName, 'remove editor from');
        if(!selectedProject){
            console.error(`Project with name ${selectedProject} does not exist. Try ${chalk.yellow('pm rmeditor')} and select the project you want to remove the editor from`);
            return;
        }

        const selectedIndex = settings.projects.findIndex(project => selectedProject.name.toLowerCase() == project.name.toLowerCase());
        delete settings.projects[selectedIndex].editor;
        newSettings = {...settings};
    }

    writeSettings(newSettings,'rmeditor',`TextEditor Removed`);
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
        console.error(`Project does not exist. Add it using ${chalk.yellow('pm add [projectPath]')} or cd till the project folder and type ${chalk.yellow('pm add')}`);
        return;
    }

    console.log(selectedProject.path);
}

module.exports = {openProject, addProject, removeProject, editConfigurations, setEditor, rmEditor, getProjectPath};