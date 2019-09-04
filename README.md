# ProjectMan🦸

***The project is not yet stable and in its BETA stage right now so it might not work as it is suppose to though I will highly appreciate if anyone want to try it out and create some issues.***

![](/images/logo-192.png)

[![projectman version](https://img.shields.io/npm/v/projectman.svg)](https://www.npmjs.org/package/projectman) [![projectman downloads](https://img.shields.io/npm/dt/projectman.svg)](http://npm-stat.com/charts.html?package=projectman)
[![contributions welcome to projectman](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/saurabhdaware/projectman/issues) [![projectman license MIT](https://img.shields.io/npm/l/projectman.svg)](https://github.com/saurabhdaware/projectman/blob/master/LICENSE)

[![https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/projectman)

ProjectMan is a project manager command line tool to easily save open your favorite projects right from command line. 

Are you lazy to cd Desktop/projects/react/coolsite and then open the folder in your favorite text editor? Using project manager you can run `projectman open` or `pm open` and select the project and it will open it in your favorite text editor (default is set for vscode).

---

## Installation
```shell
npm install -g projectman
```
---

## Commands

`pm` is an alias of `projectman` so you can use `pm <command>` or `projectman <command>`

### Open Project
```shell
pm open
```
optionally you can also directly enter the name of your project as argument 
```shell
pm open myProject
```

### Add project
```shell
cd /till/the/project
pm add
```

*You might have to `sudo` while running add command as they need to write settings.json inside global npm directory*

### Remove Project

Just do `pm remove` and select the project from the list


### Set Editor

```shell
pm seteditor
```

---

## Usage
```
pm <command>
``` 
***or*** 
```
projectman <command>
``` 

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
            "path": "path/to/project2"
        }
    ]
}
```

#### Settings Ref:

**> commandToOpen** :
- This command will be used to open the file in your editor.
- Default is `code` which opens in vscode.
- For atom set value to `atom`
- For sublime set value to `subl`

**> projects -> name :**
- This is the name that will be visible when you type `projectman open`

**> projects -> path :**
- This should be the absolute path to your folder.

---

Please note that the settings will be rewrote everytime you update the package so I will suggest to take copy of your settings.json
