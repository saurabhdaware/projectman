const fs = require('fs');


function setDefaultSettings(){
    const data = {
        "commandToOpen": "code",
        "projects": []
    }
    
    fs.writeFileSync('./lib/settings.json',JSON.stringify(data,null,4),'utf8');
}



setDefaultSettings();