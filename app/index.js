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
				default : 'org.javaleo.api', 
				message : 'Please type the groupId [org.javaleo.api]: ', 
				validate: function(group) {
					var validPack = typeof group == 'string' && group.indexOf('.') > 0;
					if (!validPack) {
						console.log('\n groupId must be a string and contains at least one point "."');
					}
					return validPack;
				}
			}, 
			{
				type    : 'input',
				name    : 'artifact', 
				default : 'springest', 
				message : 'Enter a name for the artifactId [springest]: '
			}, 
			{
				type 	: 'input', 
				name 	: 'applicationName', 
				default : 'Api Base Application', 
				message : 'Type the application Title [Api Base Application]: ' 
			}, 
			{
				type	: 'rawlist', 
				name	: 'container', 
				default : 'undertow', 
				message : 'Select a micro-server [1 = undertow]: ', 
				choices : ['undertow', 'jetty', 'tomcat']
			}, 
			{
				type	: 'checkbox', 
				name	: 'options',  
				message : 'Select the aditional options as below: ', 
				choices : [
					{name: 'Git integration', value: 'git'}, 
					{name: 'Mensageria', value: 'rabbitmq'}, 
					{name: 'JPA', value: 'jpa'}, 
					{name: 'SGDB MySQL', value: 'mysql'}, 
					{name: 'SGDB Postgres', value: 'postgres'}, 
					{name: 'Cache Redis', value: 'redis'}, 
					{name: 'MongoDB', value: 'mongodb'}
				]
			}
		]).then((answers) => {
			console.log(answers.options);
			this.destinationRoot(answers.artifact);
			closeSync(openSync('README.md', 'w'));
			closeSync(openSync('.gitignore', 'w'));
			this.fs.copyTpl(
				this.templatePath('pom.xml'),
				this.destinationPath('pom.xml'), 
				{
					artifactId: answers.artifact, 
					groupId: answers.group, 
					containerId: answers.container
				}
			);
			this.destinationRoot('src/main/resources');
			this.destinationRoot('../java');
			var packagePath = answers.group.split('.').join('/');
			this.destinationRoot(packagePath);
			var strApp = answers.applicationName.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }).split(' ').join('') + 'Application';
			this.fs.copyTpl(
				this.templatePath('ApiApplication.java'),
				this.destinationPath(strApp + '.java'), 
				{
					applicationName: strApp, 
					groupId: answers.group
				}
			);
		});
	}
};
