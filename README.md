# ProjectMan🦸

![](/images/logo-192.png)

[![projectman version](https://img.shields.io/npm/v/projectman.svg)](https://www.npmjs.org/package/projectman) [![projectman downloads](https://img.shields.io/npm/dt/projectman.svg)](http://npm-stat.com/charts.html?package=projectman)
[![contributions welcome to projectman](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/saurabhdaware/projectman/issues) [![projectman license MIT](https://img.shields.io/npm/l/projectman.svg)](https://github.com/saurabhdaware/projectman/blob/master/LICENSE)

[![https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/projectman)

ProjectMan is a project manager command line tool to easily save/open your favorite projects right from command line in your favorite text editor. 

Are you lazy to 'cd Desktop/projects/react/coolsite' and then open the folder in your favorite text editor? Add your favorite projects using `pm add` and open them anytime you want using `pm open`

---

## Installation
```shell
npm install -g projectman
```
---

![](images/terminal.png)

---
## Commands

`pm` is an alias of `projectman` so you can use `pm <command>` or `projectman <command>`

### Open Project
```shell
pm open
```
or you can simply
```
pm
```
to open projects.

optionally you can also directly enter the name of your project as an argument 
```shell
pm open myProject
```

### Add project
```shell
cd /till/the/project
pm add
```

### Remove Project

Just do `pm remove` and select the project from the list
or do `pm remove <projectName>`


### Set Editor

```shell
pm seteditor
```
This will show you available options of text editors. You can select from them and get started!

#### If your editor is not listed:
```shell
pm seteditor [commandToOpen]
```
commandToOpen is the command you use to open your Editor/IDE from command line. E.g for VSCode we can use `code` to open folders in terminal so the command to set vscode will be `pm seteditor code`

Read [commandsToOpen ref](#settings-ref) for more info.

#### If you want to open `Project2` in Atom but other projects in VSCode:

You can set `editor` key in [settings.json](settingsjson) with [commandToOpen](#settings-ref) value 

**Read [example settings from 'pm edit'](#settingsjson)**

---

## Settings.json
type `pm edit` or `projectman edit` to open settings.json


#### Example settings:
```json
{
    "commandToOpen": "code",
    "projects": [
        {
            "name": "Project1",
            "path": "path/to/project1"
        },
        {
            "name": "Project2",
            "path": "path/to/project2",
            "editor": "atom"
        },
        {
            "name": "Project3",
            "path": "path/to/project3"
        }
    ]
}
```
This will show three projects in `pm open` and project2 will be opened in Atom and other projects will be opened in Visual Studio Code


#### Settings Ref:

**> commandToOpen** :
- This command will be used to open the file in your editor.
- Default is `code` which opens in vscode.
- This is the command that you normally use to open directories in your editor.

| Editor        |'commandToOpen' value|
|---------------|-----------|
| **VSCode**    | code      | 
| **Atom**      | atom      | 
| **Sublime**   | subl      | 
| **Vim**       | vim       | 
| **WebStorm**  | wstorm    |

**> projects. name :**
- This is the name that will be visible when you type `projectman open`

**> projects. path :**
- This should be the absolute path to your folder.

**> projects. editor :**
- This is optional key. In case it doesn't exist it will read value from `commandToOpen` 
- You can use this to specify separate editor for a particular project.
- You can set it by adding `"editor": "<commandToOpen>"` in projects array in settings.json ([Example](#settingsjson) is shown above) 

---

## ChangeLogs

#### v1.1.0 *[LATEST RELEASE]*

- ***Project specific editors*** (Thanks [#4](https://github.com/saurabhdaware/projectman/issues/4) [@fechy](https://github.com/fechy) for issue)
     - Now you can `pm edit` and set `editor` key in `settings.json` projects[] with the value of the command of your editor.
    -  `settings.json` E.g.
```js
{
    "commandToOpen": "code",
    "projects": [
        {
            "name":"MyCoolProject",
            "path":"/home/path/projects/mycoolproject",
            "editor":"vim"
        },
        {
            "name":"TwoProject",
            "path":"/path/something/project"
        }
    ]
}
```
This will allow users to open other projects in **VSCode** but use **Vim** to open `MyCoolProject`
 


- ***Projects will not be erased after updating furthur*** 
(However they will still be erased while installing this update so I'll recommend to take copy of your settings.json If you have added multiple projects already) (Sorry but this is the last time when you'll have to do this :cry: )) 
(Thank you [@codyaverett](https://github.com/codyaverett) and [@Tanuj69](https://github.com/Tanuj69) issue [#2](https://github.com/saurabhdaware/projectman/issues/2) and helping me out solving this)
- ***Added `vim` in `pm seteditor`*** 
also added a message explaining 'How to set editors/IDE that are not listed in the menu'
- `pm` is now alias for `pm open`
(Thank you [@johannesjo](https://github.com/johannesjo) for suggestion)
- **`pm seteditor [commandToOpenEditor]` added** 
This will set default editor command, This can be used when the editor you want to use is not listed in `pm seteditor`. (Note: `pm seteditor` will work exactly same as it did before)



***For More ChangeLog read [CHANGELOG.md](CHANGELOG.md)***

---

## Contributing to ProjectMan
[![contributions welcome to projectman](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/saurabhdaware/projectman/issues) 

I would be extremely happy to have people contribute to ProjectMan. You can read Contribution guidelines in **[CONTRIBUTING.md](CONTRIBUTING.md)**

---

**Thank you for showing Interest! Do contribute and star [ProjectMan🦸 on GitHub](https://github.com/saurabhdaware/projectman)**