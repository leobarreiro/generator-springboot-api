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
				default : 'springfast', 
				message : 'Enter a name for the artifactId [springfast]: '
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
					{name: 'Git Repo', value: 'git'}, 
					{name: 'Devtools', value: 'devtools'}, 
					{name: 'Swagger Docs', value: 'swagger'}, 
					{name: 'Redis Cache', value: 'cache-redis'}, 
					{name: 'RabbitMQ', value: 'amqp-rabbit'}, 
					{name: 'InfluxDB Datasource', value: 'dtsource-influx'}, 
					{name: 'MongoDB', value: 'dtsource-mongo'}, 
					{name: 'Spring Actuator', value: 'actuator'}, 
					{name: 'Metrics InfluxDB', value: 'metrics-influx'} 
				]
			}, 
			{
				type	: 'rawlist', 
				name	: 'database', 
				default : 'none', 
				message : 'Please pick a database [1 = none]: ', 
				choices : ['none', 'postgres', 'mysql']
			}
		]).then((answers) => {
			var redis 				= answers.options.includes('cache-redis');
			var rabbit	 			= answers.options.includes('amqp-rabbit');
			var swagger 			= answers.options.includes('swagger');
			var devtools 			= answers.options.includes('devtools');
			var actuator	 	 	= answers.options.includes('actuator');
			var metricsinflux 		= answers.options.includes('metrics-influx');
			var dtsourceinflux 		= answers.options.includes('dtsource-influx');
			var postgres 			= answers.database == 'postgres';
			var mysql 				= answers.database == 'mysql';
			var jpa 				= (postgres || mysql);
			var databaseUpper 		= "" + answers.database + "".toUpperCase();
			var databaseDialect 	= (answers.database == 'postgres') ? 'PostgreSQL9Dialect' : 'MysqlDialect';
			var dtsourcemongo	 	= answers.options.includes('dtsource-mongo');
			var packageRoot 		= answers.group;
			var artifactName 		= answers.artifact;
			var packageConfig 		= packageRoot + '.config';
			var packageService 		= packageRoot + '.service';
			var packageEndpoint 	= packageRoot + '.endpoint';
			var packageRabbit  		= packageRoot + '.rabbit';
			var packageDomain  		= packageRoot + '.domain';
			var packageRepository 	= packageRoot + '.repository';
			var packagePath 		= answers.group.split('.').join('/');
			var appTitle 			= answers.appname;
			var appName 			= answers.appname.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }).split(' ').join('') + 'Application';
			
			// root files
			this.destinationRoot(answers.artifact);
			closeSync(openSync('README.md', 'w'));
			closeSync(openSync('.gitignore', 'w'));
			this.fs.copyTpl(
				this.templatePath('pom.xml'),
				this.destinationPath('pom.xml'), 
				{
					artifact			: artifactName, 
					group				: packageRoot, 
					container			: answers.container, 
					apptitle			: appTitle, 
					swagger 			: swagger, 
					devtools 			: devtools, 
					actuator 			: actuator, 
					metricsinflux 		: metricsinflux, 
					dtsourceinflux 		: dtsourceinflux, 
					dtsourcemongo 		: dtsourcemongo, 
					jpa 				: jpa, 
					postgres			: postgres, 
					mysql 				: mysql, 
					redis 				: redis, 
					rabbit 				: rabbit
				}
			);

			// resources
			this.destinationRoot('src/main/resources');
			this.fs.copyTpl(
				this.templatePath('application.yml'),
				this.destinationPath('application.yml'), 
				{
					apptitle		: appTitle, 
					artifact 		: artifactName, 
					packageroot		: packageRoot, 
					swagger 		: swagger, 
					actuator 		: actuator, 
					metricsinflux 	: metricsinflux, 
					dtsourceinflux 	: dtsourceinflux, 
					redis 			: redis, 
					rabbit 			: rabbit, 
					postgres		: postgres, 
					mysql 			: mysql, 
					databaseUpper 	: databaseUpper, 
					databaseDialect : databaseDialect 
				}
			);
			this.fs.copyTpl(
				this.templatePath('bootstrap.yml'),
				this.destinationPath('bootstrap.yml'), 
				{
					artifact 	: artifactName
				}
			);
			
			// i18n
			this.destinationRoot('./i18n');
			
			// java
			this.destinationRoot('../../java');
			this.destinationRoot(packagePath);
			this.fs.copyTpl(
				this.templatePath('ApiApplication.java'),
				this.destinationPath(appName + '.java'), 
				{
					appname		: appName, 
					group		: packageRoot
				}
			);
			
			// java::config
			this.destinationRoot('./config');
			if (redis) {
				this.fs.copyTpl(
					this.templatePath('CacheConfig.java'), 
					this.destinationPath('CacheConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
				this.fs.copyTpl(
					this.templatePath('CacheKeyGenerator.java'), 
					this.destinationPath('CacheKeyGenerator.java'), 
					{
						packageConfig: packageConfig
					}
				);
			}
			if (postgres || mysql) {
				this.fs.copyTpl(
					this.templatePath('JpaConfig.java'), 
					this.destinationPath('JpaConfig.java'), 
					{
						packageConfig		: packageConfig, 
						packageRepository	: packageRepository, 
						packageDomain		: packageDomain
					}
				);
			}
			if (swagger) {
				this.fs.copyTpl(
					this.templatePath('SwaggerConfig.java'), 
					this.destinationPath('SwaggerConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
			}
			if (rabbit) {
				this.fs.copyTpl(
					this.templatePath('RabbitConfig.java'), 
					this.destinationPath('RabbitConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
				this.destinationRoot('../rabbit');
				this.fs.copyTpl(
					this.templatePath('RabbitConverter.java'), 
					this.destinationPath('RabbitConverter.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
				this.fs.copyTpl(
					this.templatePath('RabbitMessageListener.java'), 
					this.destinationPath('RabbitMessageListener.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
				this.fs.copyTpl(
					this.templatePath('RabbitSamplePojo.java'), 
					this.destinationPath('RabbitSamplePojo.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
				this.fs.copyTpl(
					this.templatePath('RabbitSender.java'), 
					this.destinationPath('RabbitSender.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
			}

			// java::data
			if (jpa) {
				this.destinationRoot('../domain');
				this.fs.copyTpl(
					this.templatePath('Registry.java'), 
					this.destinationPath('Registry.java'), 
					{
						packageDomain: packageDomain
					}
				);
				this.destinationRoot('../repository');
				this.fs.copyTpl(
					this.templatePath('RegistryRepository.java'), 
					this.destinationPath('RegistryRepository.java'), 
					{
						packageRepository	: packageRepository, 
						packageDomain		: packageDomain
					}
				);
			}

			// java::service
			this.destinationRoot('../service');
			this.fs.copyTpl(
				this.templatePath('ApiBaseService.java'), 
				this.destinationPath('ApiBaseService.java'), 
				{
					packageService		: packageService, 
					packageRabbit		: packageRabbit, 
					packageRepository	: packageRepository, 
					packageDomain		: packageDomain, 
					redis				: redis, 
					rabbit 				: rabbit
				}
			);
			if (jpa) {
				this.fs.copyTpl(
					this.templatePath('RegistryService.java'), 
					this.destinationPath('RegistryService.java'), 
					{
						packageService		: packageService, 
						packageRepository	: packageRepository, 
						packageDomain		: packageDomain
					}
				);
			}
			
			// java::endpoint
			this.destinationRoot('../endpoint');
			this.fs.copyTpl(
				this.templatePath('ApiBaseEndpoint.java'), 
				this.destinationPath('ApiBaseEndpoint.java'), 
				{
					packageEndpoint	: packageEndpoint, 
					packageService	: packageService, 
					rabbit 			: rabbit
				}
			);
		});
	}
};
