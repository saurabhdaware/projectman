// external dependencies

const openProject = require('./commands/open');
const addProject = require('./commands/add');
const removeProject = require('./commands/remove');
const editConfigurations = require('./commands/edit');
const setEditor = require('./commands/seteditor');
const rmEditor = require('./commands/rmeditor');
const getProjectPath = require('./commands/getpath');
const createProject = require('./commands/create');

module.exports = {
  openProject,
  addProject,
  removeProject,
  editConfigurations,
  setEditor,
  rmEditor,
  getProjectPath,
  createProject
};
