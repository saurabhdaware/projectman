const fs = require('fs');
const path = require('path');

const dotProjectMan = path.join(__dirname, '..', 'dotprojectman');
const cleanUp = () => {
  fs.rmSync(dotProjectMan, { recursive: true });
};

module.exports = cleanUp;
