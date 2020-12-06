# ProjectMan🦸

<br>
<p align="center">


<br>
<a href="https://www.npmjs.com/package/projectman"><img src="https://nodei.co/npm/projectman.png?downloads=true&downloadRank=true&stars=true"></a>

</p>

ProjectMan is a CLI which lets you add projects to favorites using command `pm add` and open them from anywhere you want using command `pm open`.

Along with this there are also other commands like `pm seteditor`, `pm remove`, `cd $(pm getpath)` mentioned in documentation below.

---
<p align="center"><img width=800 alt="ProjectMan gif explaining how it works" src="https://res.cloudinary.com/saurabhdaware/image/upload/v1570355298/npm/projectman/terminal.gif"></p>

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

## # Commands
`pm` is an alias of `projectman` so you can use `pm <command>` or `projectman <command>`

### ## Open Project
**Usage :** 
```shell
pm open [projectName]
```
`[projectName]` is an optional parameter.

**Alias:** `pm o`, `pm`

v1.3.0 onwards, after typing `pm open` you can start typing letters and it will autocomplete the project name.

### ## Add project
```shell
cd /till/the/project
pm add
```

### ## Add URL
***Added in v1.3.0.***
```shell
pm add --url
```
This command can be used to save your repositories/websites/any other important links. 
These links will show up in normal `pm open` with `(URL)` appended to their name.

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
(Note: This does not work in Windows cmd, You can use it in Windows Powershell)

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

### v1.3.3 *[LATEST RELEASE]*

Command suggestions added (Thanks [@jamesgeorge007](https://github.com/jamesgeorge007) for [#PR32](https://github.com/saurabhdaware/projectman/pull/32))

**.
.
.**
***For More Changes read [CHANGELOG.md](CHANGELOG.md)***

---
## Rust Port
[@hskang9](https://github.com/hskang9) has made a pretty cool rust port for projectman. You can check it out at: https://github.com/hskang9/projectman-rust

---
## Contributing to ProjectMan
[![contributions welcome to projectman](https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square&logo=github)](https://github.com/saurabhdaware/projectman/issues)

I would be extremely happy to have people contribute to ProjectMan. You can read Contribution guidelines in **[CONTRIBUTING.md](CONTRIBUTING.md)**

---

**Thank you for showing Interest! Do contribute and star [ProjectMan🦸 on GitHub](https://github.com/saurabhdaware/projectman)**