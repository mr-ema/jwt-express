const shell = require('shelljs');

// Copy Public Folder
shell.cp('-R', 'public', 'dist/');
// Copy WWW File
shell.cp('-R', 'src/bin', 'dist/src');
// Copy All Views Templates
shell.cp('-R', 'src/views', 'dist/src');