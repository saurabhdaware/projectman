const fs = require('fs');


function setDefaultSettings(){
    const data = {
        "commandToOpen": "code",
        "projects": [
            {
                "name": "Project1",
                "path": "path/to/project1"
            },
            {
                "name": "Project2",
                "path": "path/to/project2"
            },
        ]
    }
    
    fs.writeFileSync('./lib/settings.json',JSON.stringify(data,null,4),'utf8');
}



setDefaultSettings();