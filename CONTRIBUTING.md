## Setting up local development
- [Fork the project](https://github.com/saurabhdaware/projectman/fork) using fork button in the top right corner.
- Clone the project to your device using `git clone https://github.com/{yourUsername}/projectman.git`
- `npm install` to install the required dependencies
- Type `npm link` to install the content in your global directory. (Your directory will be linked to your global node folder which means if you change anything in the directory it will change inside the global directory as well)
- Type `projectman open` to test your code. 


## Directory Structure
There are two important folders that you should care about `lib` and `bin`
```
- lib
    -> action.js // Contains all the main logic and functions
- bin
    -> index.js // Main file, This file is triggered when `projectman` or `pm` is called
```

## Contribution Guidelines
- If you're planning to implement a new feature I will recommend you to discuss with me before you start coding so you won't end up working on something that I don't want to implement. Create an Issue with proper name and content for discussion. 
- If you need any help understanding the code you can reach out to me on twitter/[@saurabhcodes](https://twitter.com/saurabhcodes)

- For Contributing to this project or any project on GitHub
  1. Fork project.
  2. Create a branch with the name of feature that you're working on (e.g. `multiple-editors`).
  3. Once you're done coding create a merge request from your new branch to my `develop`. (Read the Local Development section above for local setup guidelines)


## Coding Guidelines
- Please write comments wherever necessary.
- Write unit tests wherever possible.
- If you create a new file that exports various functions, put it inside `lib` folder
- Please write proper commit messages explaining your changess.
