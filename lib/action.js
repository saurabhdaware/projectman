// external dependencies
const prompts = require('prompts');

// internal modules
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// helper functions
const color = require('./colors.js');

const {
    settings,
    settingsPath,
    throwCreateIssueError,
    writeSettings,
    openURL,
    isURL,
    onCancel,
    getChoices,
    selectProject
} = require('./helper.js');

// Includes end.

/*

COMMAND: pm open [projectName]
ARGUMENTS: [projectName] :: Name of the project to open

*/

async function openProject(projectName) {
    if (settings.projects.length == 0) {
        console.error("No projects to open :(");
        console.warn(`cd /till/project/directory/ and run ${color.boldYellow('pm add')} to add projects and get started`);
        return;
    }

    console.log(color.boldGrey('>>> Default editor: ') + color.grey(settings.commandToOpen));
    const selectedProject = await selectProject(projectName, 'open');

    if (!selectedProject) {
        console.error(`Project does not exist. Add it using ${color.yellow('pm add [projectPath]')} or cd till the project folder and type ${color.yellow('pm add')}`);
        return;
    }

    const commandToOpen = selectedProject.editor || settings.commandToOpen; // If project specific editor exists, Then open using that command else use global command
    let stderr;
    try {

        if (isURL(selectedProject.path)) {
            ({stderr} = await openURL(selectedProject.path)); // If it is URL then open in Browser.
        } else {
            ({stderr} = await exec(`${commandToOpen}  "${selectedProject.path}"`)); // This line opens projects
        }

        if (stderr) {
            console.error("Could not open project for some reason :(");
            throwCreateIssueError(stderr);
            return;
        }

        console.log(`${color.boldGreen(">>>")} Opening ${selectedProject.name} ${color.green("✔")}`); // Success yay!

    } catch (err) {
        console.error("Could not open project :("); // Something broke :(
        console.warn(`Are you sure your editor uses command ${color.yellow(commandToOpen)} to open directories from terminal?`);
        console.warn(`If not, use ${color.yellow('pm seteditor')} to set Editor/IDE of your choice`)
        throwCreateIssueError(err);
        return;
    }

}

/*

COMMAND: pm add [projectDirectory] [--url [link]]
ARGUMENTS: 
[projectDirectory] :: Directory of the project that you want to add. OR when --url flag is added, URL of the repository.

FLAG:
[--url [link]] :: Adds URL.

RETURNS: newProject object.

*/

async function addProject(projectDirectory = '.', cmdObj = undefined) {
    let newProject = {};
    let name;
    let enteredUrl;

    if (cmdObj.url) {
        if(projectDirectory !== '.'){
            console.warn("Project's local directory value will be ignore when --url flag is on");
        }

        if(cmdObj.url == true){
            ({enteredUrl} = await prompts([{
                type: 'text',
                message: 'Project URL :',
                name: 'enteredUrl',
                initial: 'https://github.com/',
                validate:(url) => isURL(url)?true:'Not a valid URL'
            }],{onCancel}));
            name = enteredUrl.split('/').pop(); // Get last route of URL to set default name
            newProject.path = enteredUrl;

        }else{
            if(!isURL(cmdObj.url)){
                console.error("Not a valid URL");
                console.warn("A valid URL looks something like " +color.yellow("https://github.com/saurabhdaware/projectman"));
                return;
            }
            name = cmdObj.url.split('/').pop(); // Get last route of URL to set default name
            newProject.path = cmdObj.url;
        }

    } else {
        newProject.path = path.resolve(projectDirectory);
        name = newProject.path.split(path.sep).pop();
    }


    ({finalName: newProject.name} = await prompts([{
        type: 'text',
        message: 'Project Name :',
        name: 'finalName',
        initial: name
    }],{onCancel}));

    if (settings.projects.some(project => project.name.toLowerCase() == newProject.name.toLowerCase())) {
        console.error("Project with this name already exists");
        return;
    }

    settings.projects.push(newProject);

    writeSettings(settings, 'add', "Project Added");

    return newProject;
}

// pm remove [projectName]
async function removeProject(projectName) {
    const {name: selectedProjectName} = await selectProject(projectName, 'remove');

    if (!selectedProjectName) {
        console.error(`Project with name ${selectedProjectName} does not exist. Try ${color.yellow('pm remove')} and select the project you want to remove`);
        return;
    }
    // removing project
    settings.projects = settings.projects.filter(project => project.name.toLowerCase() !== selectedProjectName.toLowerCase());

    writeSettings(settings, 'remove', "Project Removed");
}

// pm seteditor [command]
async function setEditor(command, cmdObj = undefined) {
    let commandToOpen;
    let selectedProject;
    let selectedIndex = -1; // this will have the index of selectedProject
    let projectName;
    const setEditorFilter = project => !isURL(project.path);
    if (cmdObj.forProject) { // --for-project exists
        projectName = (cmdObj.forProject === true) ? undefined : cmdObj.forProject; // if only[--for-project], set undefined else if [--for-project [projectName]] set projectName
        selectedProject = await selectProject(projectName, 'set editor for', setEditorFilter); // sending undefined, calls list of projects to select from
        // find the index of selectedProject and add editor to that project
        selectedIndex = settings.projects.findIndex(project => project.name.toLowerCase() == selectedProject.name.toLowerCase())
    }


    if (!command) {
        const questions = [
            {
                type: 'select',
                message: 'Select text editor',
                name: 'selectedEditor',
                choices: [
                    {
                        title: 'VSCode',
                        value: 'code'
                    },
                    {
                        title: 'Sublime',
                        value: 'subl'
                    },
                    {
                        title: 'Atom',
                        value: 'atom'
                    },
                    {
                        title: 'Vim',
                        value: 'vim'
                    },
                    {
                        title: 'Other',
                        value: 'other'
                    }
                ]
            }
        ];
        const {selectedEditor} = await prompts(questions,{onCancel});
        if (selectedEditor == 'other') {
            console.warn("Enter command that you use to open Editor from Terminal");
            console.log(`E.g With VSCode Installed, you can type ${color.yellow('code <directory>')} in terminal to open directory`);
            console.log(`In this case, the command would be ${color.yellow('code')}\n`);
            const question = {
                type: 'text',
                message: 'Enter command :',
                name: 'command',
                validate: function (val) {
                    return val !== ''
                }
            }
            const {command} = await prompts([question],{onCancel})
            commandToOpen = command;
        } else {
            commandToOpen = selectedEditor;
        }

    } else {
        commandToOpen = command;
    }

    if (selectedIndex < 0) {
        settings.commandToOpen = commandToOpen;
    } else {
        settings.projects[selectedIndex].editor = commandToOpen;
    }

    writeSettings(settings, 'seteditor', `Text Editor Selected ${(selectedIndex < 0) ? '' : `for ${settings.projects[selectedIndex].name}`}`);
}

async function rmEditor(projectName, cmdObj) {
    let newSettings;
    if (cmdObj.all) {
        newSettings = {
            ...settings,
            projects: settings.projects.map(({...project}) => {
                if (project.editor) delete project.editor;
                return project;
            })
        }
    } else {
        console.log(color.boldGrey('>>> Default editor: ') + color.grey(settings.commandToOpen));
        let selectedProject = await selectProject(projectName, 'remove editor from');
        if (!selectedProject) {
            console.error(`Project with name ${selectedProject} does not exist. Try ${color.yellow('pm rmeditor')} and select the project you want to remove the editor from`);
            return;
        }

        const selectedIndex = settings.projects.findIndex(project => selectedProject.name.toLowerCase() == project.name.toLowerCase());
        delete settings.projects[selectedIndex].editor;
        newSettings = {...settings};
    }

    writeSettings(newSettings, 'rmeditor', `TextEditor Removed`);
}

// projectman edit
async function editConfigurations() {
    let openSettingsCommand;
    if (process.platform == 'win32') {
        openSettingsCommand = 'Notepad ';
    } else if (process.platform == 'linux') {
        openSettingsCommand = 'xdg-open ';
    } else {
        openSettingsCommand = 'open '
    }

    try {
        const {stderr} = await exec(`${openSettingsCommand} "${settingsPath}"`)
        if (stderr) {
            console.error("Error occured while opening the file: " + settingsPath);
            console.log("You can follow above path and manually edit settings.json");
            throwCreateIssueError(err);
            return;
        }

        console.log(color.boldGreen(">>> ") + "Opening settings.json" + color.green(" ✔"));
    } catch (err) {
        console.error("Error occured while opening the file: " + settingsPath);
        console.warn("You can follow above path and manually edit settings.json");
        throwCreateIssueError(err);
    }
}

async function getProjectPath(projectName) {
    
    let selectedProject;
    if (settings.projects.length === 0) {
        console.error("No projects to get path :(");
        console.warn(`cd /till/project/directory/ and run ${color.boldYellow('pm add')} to add projects and get started`);
        return;
    }

    if(!projectName){
        const question = {
            name:'selectedProject',
            message:'Select project you want to cd to:',
            type:'autocomplete',
            out:process.stderr,
            choices:getChoices(),
            onRender:() => {
                process.stderr.write('\033c');
            }
        };
    
        ({selectedProject} = await prompts([question],{onCancel}));
        if (!selectedProject) {
            console.error(`Project does not exist. Add it using ${color.yellow('pm add [projectPath]')} or cd till the project folder and type ${color.yellow('pm add')}`);
            return;
        }
        
    }else{
        selectedProject = settings.projects.find(project => project.name.toLowerCase() == projectName.toLowerCase());
    }

    // Print path
    console.log(selectedProject.path);
}

module.exports = {openProject, addProject, removeProject, editConfigurations, setEditor, rmEditor, getProjectPath};