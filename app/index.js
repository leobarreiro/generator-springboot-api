'use strict';

const { closeSync, openSync } = require('fs');
const touch = filename => closeSync(openSync(filename, 'w'));
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Initializing...');
  }

	start() {
		this.log('Do something...');
		this.prompt([
			{
			type    : 'input',
			name    : 'group',
			message : 'Enter a name for the groupId (i.e.: org.javaleo.api): '
			}, 
			{
			type    : 'input',
			name    : 'artifact',
			message : 'Enter a name for the artifactId (i.e.: springest): '
			} 
		]).then((answers) => {
			this.destinationRoot(answers.artifact);
			closeSync(openSync('README.md', 'w'));
			closeSync(openSync('.gitignore', 'w'));
			this.fs.copyTpl(
				this.templatePath('pom.xml'),
				this.destinationPath('pom.xml'), 
				{
					artifactId: answers.artifact, 
					groupId: answers.group
				}
			);
			this.destinationRoot('src/main/resources');
			this.destinationRoot('../java');
			var packagePath = answers.group.split('.').join('/');
			this.destinationRoot(packagePath);
		});
	}
};
