'use strict';

const { closeSync, openSync } = require('fs');
const touch = filename => closeSync(openSync(filename, 'w'));
const Generator = require('yeoman-generator');
const Prompt = require('prompt-checkbox');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.log('Initializing...');
	}
	
	start() {
		
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
				name 	: 'appname', 
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
				radio 	: true, 
				choices : [
					{name: 'Git integration', value: 'git'}, 
					{name: 'DEV Tools', value: 'devtools'}, 
					{name: 'Mensageria', value: 'rabbitmq'}, 
					{name: 'JPA', value: 'jpa'}, 
					{name: 'MySQL', value: 'mysql'}, 
					{name: 'Postgres', value: 'postgres'}, 
					{name: 'Redis', value: 'redis'}, 
					{name: 'Cache', value: 'cache'}, 
					{name: 'MongoDB', value: 'mongodb'}
				]
			}
		]).then((answers) => {
			this.destinationRoot(answers.artifact);
			closeSync(openSync('README.md', 'w'));
			closeSync(openSync('.gitignore', 'w'));
			this.fs.copyTpl(
				this.templatePath('pom.xml'),
				this.destinationPath('pom.xml'), 
				{
					artifact	: answers.artifact, 
					group		: answers.group, 
					container	: answers.container, 
					appname		: answers.appname, 
					devtools 	: answers.options.includes('devtools')
				}
			);
			this.destinationRoot('src/main/resources');
			this.destinationRoot('../java');
			var packagePath = answers.group.split('.').join('/');
			this.destinationRoot(packagePath);
			var strApp = answers.appname.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }).split(' ').join('') + 'Application';
			this.fs.copyTpl(
				this.templatePath('ApiApplication.java'),
				this.destinationPath(strApp + '.java'), 
				{
					appname	: strApp, 
					group	: answers.group
				}
			);
		});
	}
};
