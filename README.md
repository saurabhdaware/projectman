# ProjectMan🦸

![](/images/logo-192.png)

[![projectman version](https://img.shields.io/npm/v/projectman?style=flat-square)](https://www.npmjs.org/package/projectman) [![projectman downloads](https://img.shields.io/npm/dt/projectman?label=npm%20downloads&style=flat-square)](http://npm-stat.com/charts.html?package=projectman)
[![contributions welcome to projectman](https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square&logo=github)](https://github.com/saurabhdaware/projectman/issues) [![projectman license MIT](https://img.shields.io/npm/l/projectman?color=success&style=flat-square)](https://github.com/saurabhdaware/projectman/blob/master/LICENSE)

[![https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/projectman)


![]()
ProjectMan is a CLI which lets you add projects to favorites using command `pm add` and open them from anywhere you want using command `pm open`.

Along with this there are also other commands like `pm seteditor`, `pm remove`, `cd $(pm getpath)` which we will see below.

---

## # Installation

#### ## Using NPM
If you have [NodeJS](https://nodejs.org) installed in your machine
```shell
npm install -g projectman
```
**OR**

#### ## Download Binaries
[![Download button for windows](https://img.shields.io/badge/for_windows-0099ff?style=for-the-badge&logo=windows)](https://apps.saurabhdaware.in/projectman#windows) [![Download button for Linux](https://img.shields.io/badge/for_linux-032f62?style=for-the-badge&logo=linux&logoColor=white)](https://apps.saurabhdaware.in/projectman/#linux-and-mac) [![Download button for MACOS](https://img.shields.io/badge/for_macos-111111?style=for-the-badge&logo=apple&logoColor=white)](https://apps.saurabhdaware.in/projectman/#linux-and-mac)


---

![](images/terminal.png)

---
## # Commands
`pm` is an alias of `projectman` so you can use `pm <command>` or `projectman <command>`

### ## Open Project
**Usage :** 
```shell
pm open [projectName]
```
`[projectName]` is an optional parameter.

**Alias:** `pm o`, `pm`


### ## Add project
```shell
cd /till/the/project
pm add
```

### ## Set Editor

```shell
pm seteditor
```
Sets default editor to open projects from.

**Flag:** `--for-project`
```shell
pm seteditor --for-project
```
Sets different editor for a specific project.
E.g You can use VSCode for other projects and Atom for `CoolProject1`

If your TextEditor/IDE is not listed, You can select option `Other` from the list and give your `editorCommand`.
Read [editorCommand ref](#settings-ref) for more information.


### ## `cd` to a project without opening.
```shell
cd $(pm getpath [projectName])
```
`[projectName]` is an optional parameter.
**Alias :** `cd $(pm gp)`


### ## Remove Project
```shell
pm remove
```
Removes project from favorites.

### ## Remove editor
```shell
pm rmeditor
```
Shows list of project and removes the project specific editor from the project.

```shell
pm rmeditor --all
```
removes all project specific editors.

---

## Settings.json

If you want to sort projects/change name of project/change path, You can type `pm edit` to open settings.json


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
- This is your editor's command, this command will be used to open the file in your editor.
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

### v1.2.0 *[LATEST RELEASE]*

#### > `cd` to directory without opening the project.
```shell
cd $(pm getpath)
```
This will allow users to jump to a directory in command line without opening the project.

**PR :** [#9](https://github.com/saurabhdaware/projectman/pull/9) (Thank You [@ZakariaTalhami](https://github.com/ZakariaTalhami))
**Issue :** [#5](https://github.com/saurabhdaware/projectman/issues/5) (Thank you [@feitzi](https://github.com/feitzi))

#### > `--for-project` flag in `pm seteditor`:
```shell
pm seteditor --for-project
```
This will allow users to set different editor for a specific project
E.g. Set Atom for `Project1` and have VSCode for other projects
**Isssue :** [#13](https://github.com/saurabhdaware/projectman/issues/13)
**PR :** [#16](https://github.com/saurabhdaware/projectman/pull/16)

#### > `Other` option added in `pm seteditor` :
You can now select `other` option and type the editorCommand as an input rather than typing `pm seteditor [editorCommand]`

#### > New command `pm rmeditor`:
```shell
pm rmeditor
```
This will allow users to remove the project specific editors.
You can either `pm rmeditor` and choose the project to remove editor or `pm rmeditor --all` to remove all project specific editors.

**.
.
.
.**
***For More Changes read [CHANGELOG.md](CHANGELOG.md)***

---

## Contributing to ProjectMan
[![contributions welcome to projectman](https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square&logo=github)](https://github.com/saurabhdaware/projectman/issues)

I would be extremely happy to have people contribute to ProjectMan. You can read Contribution guidelines in **[CONTRIBUTING.md](CONTRIBUTING.md)**

---

**Thank you for showing Interest! Do contribute and star [ProjectMan🦸 on GitHub](https://github.com/saurabhdaware/projectman)**