# Production Releases
(Note: Only production releases will be mentioned here, If you want to see beta releases, you can find them [here](https://github.com/saurabhdaware/projectman/releases))

## v1.1.0 [LATEST RELEASE]
```shell
npm install -g projectman
```
- ***Project specific editors*** (Thanks to #4 @fechy for issue)
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
 


- Projects will not be erased after updating furthur (However they will still be erased while installing this update so I'll recommend to take copy of your settings.json If you have added multiple projects already) (Sorry but this is the last time when you'll have to do this :cry: )) 
(Thank you @codyaverett and @Tanuj69 issue (#2) and helping me out solving this)
- Added `vim` in `pm seteditor` and added a message explaining 'How to set editors/IDE that are not listed in the menu'
- `pm` is now equivalent to `pm open`
(Thank you @johannesjo for suggestion)
- `pm seteditor [commandToOpenEditor]` added which will set default editor command, This can be used when the editor you want to use is not listed in `pm seteditor`. (Note: `pm seteditor` will work exactly same as it did before)

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
