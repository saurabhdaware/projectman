# ProjectMan
## v0.x.x
***The project is not yet stable and in its BETA stage right now so it might not work as it is suppose to though I will highly appreciate if anyone want to try it out and create some issues.***

ProjectMan is a project manager command line tool to easily save open your favorite projects right from command line. 

Are you lazy to cd Desktop/projects/react/coolsite and then open the folder in your favorite command line tool? Using project manager you can run `pm open` and select the project and it will open it in your favorite text editor. 

## Installation
```
npm install -g projectman
```

## Add project

```
cd /till/the/project
pm add
```

or you can directly edit config file using 
```
pm edit
```

## Open Project
```
pm open
```

optionally you can also directly enter the name of your project as argument 
```
pm open myProject
```