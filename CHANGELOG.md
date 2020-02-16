# Production Releases
(Note: Only production releases will be mentioned here, If you want to see beta releases, you can find them [here](https://github.com/saurabhdaware/projectman/releases))

### v1.3.3 *[LATEST RELEASE]*
Command suggestions added (Thanks [@jamesgeorge007](https://github.com/jamesgeorge007) for [#PR32](https://github.com/saurabhdaware/projectman/pull/32))



### v1.3.2
- `pm getpath` Question fix
- prompts updated to v2.3.0
- Unit testing for helper added ([@junaidrahim](https://github.com/junaidrahim) - [#27](https://github.com/saurabhdaware/projectman/pull/27))


### v1.3.1 

Documentation Update



### v1.3.0 
---
```shell
npm install -g projectman
```
**Release Date:** 20th Sept, 2019

---

- ## Brought dependencies from 36 packages to 4 packages!! 🎉
Some internal code refactoring and asking myself "Do I really need this package?" helped me bring down dependency tree of 37 packages to 4 packages!!!
- ## AutoComplete added during project selection.
In `pm open` and other project selection menus. You can now start typing the letters and list will be filtered out to show projects matching the letters.
- ## Ability to open/add URLs  (Thank You [@ZakariaTalhami](https://github.com/ZakariaTalhami) for PR [#20](https://github.com/saurabhdaware/projectman/pull/20) )
    - `pm add --url [URL]` to add URLs to the projectman. `[URL]` is an optional parameter
    - These URLs will show up in `pm open` with (URL) appended to their names.
    - On selecting the URL in `pm open` they will be opened in your default browser.
    - This can be used to store your repositories/websites/other useful links.

---
---
### v1.2.0
```shell
npm install -g projectman@1.2.0
```
**Release Date:** 12th Sept, 2019

---
- [Presenting ProjectMan Binaries](#presenting-projectman-binaries)
- [`cd` to directory without opening the project](#cd-to-directory-without-opening-the-project)
- [Added `--for-project` flag in `pm seteditor`](#added-for-project-flag-in-pm-seteditor)
- [`Other` option addbed in `pm seteditor`](#other-option-added-in-pm-seteditor)
- [New command `pm rmeditor`](#new-command-pm-rmeditor)
---

#### > Presenting ProjectMan binaries 🎉🦸
Why should Node developers have all the fun? Now use ProjectMan without NodeJS or NPM installed.

Download binaries and follow installation instructions given with them :

[![Download button for windows](https://img.shields.io/badge/for_windows-0099ff?style=for-the-badge&logo=windows)](https://apps.saurabhdaware.in/projectman#windows) [![Download button for Linux](https://img.shields.io/badge/for_linux-032f62?style=for-the-badge&logo=linux&logoColor=white)](https://apps.saurabhdaware.in/projectman/#linux-and-mac) [![Download button for MACOS](https://img.shields.io/badge/for_macos-111111?style=for-the-badge&logo=apple&logoColor=white)](https://apps.saurabhdaware.in/projectman/#linux-and-mac)

#### > `cd` to directory without opening the project.
```shell
cd $(pm getpath)
```
This will allow users to jump to a directory in command line without opening the project.

**PR :** [#9](https://github.com/saurabhdaware/projectman/pull/9) (Thank You [@ZakariaTalhami](https://github.com/ZakariaTalhami))
**Issue :** [#5](https://github.com/saurabhdaware/projectman/issues/5) (Thank you [@feitzi](https://github.com/feitzi))

#### > Added `--for-project` flag in `pm seteditor`:
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

---

## v1.1.0
```shell
npm install -g projectman@1.1.0
```
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

---

## v1.0.0 
```shell
npm install -g projectman@1.0.0
```

Initial release of ProjectMan.

Includes following commands:

```shell
pm add
pm remove
pm open
pm seteditor
```
