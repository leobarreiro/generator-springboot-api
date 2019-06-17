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
				default : 'springfield', 
				message : 'Enter a name for the artifactId [springfield]: '
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
					{name: 'Mongo DB', value: 'mongodb'}, 
					{name: 'RabbitMQ', value: 'amqp-rabbit'}, 
					{name: 'Apache Kafka', value: 'kafka'}, 
					{name: 'Spring Actuator', value: 'actuator'}, 
					{name: 'Metrics InfluxDB', value: 'metrics-influx'} 
				]
			}, 
			{
				type	: 'rawlist', 
				name	: 'database', 
				default : 'none', 
				message : 'Please pick a database [1 = none]: ', 
				choices : ['none', 'postgres']
			}
		]).then((answers) => {
			var redis 				= answers.options.includes('cache-redis');
			var rabbit	 			= answers.options.includes('amqp-rabbit');
			var kafka 				= answers.options.includes('kafka');
			var kafkaTopic 			= answers.artifact.replace(/\w\S*/g, function(txt){ return txt.toLowerCase(); });
			var kafkaGroupId 		= 'group_id';
			var swagger 			= answers.options.includes('swagger');
			var devtools 			= answers.options.includes('devtools');
			var actuator	 	 	= answers.options.includes('actuator');
			var metricsinflux 		= answers.options.includes('metrics-influx');
			var dtsourceinflux 		= answers.options.includes('dtsource-influx');
			var mongodb 			= answers.options.includes('mongodb');
			var postgres 			= answers.database == 'postgres';
			var jpa 				= postgres;
			var databaseJpa 		= (answers.database == 'postgres') ? 'POSTGRESQL' : 'MYSQL';
			var databaseDialect 	= (answers.database == 'postgres') ? 'PostgreSQL9Dialect' : 'MysqlDialect';
			var packageRoot 		= answers.group;
			var artifactName 		= answers.artifact;
			var packageConfig 		= packageRoot + '.config';
			var packageService 		= packageRoot + '.service';
			var packageEndpoint 	= packageRoot + '.endpoint';
			var packageRabbit  		= packageRoot + '.rabbit';
			var packageKafka 		= packageRoot + '.kafka';
			var packageDomain  		= packageRoot + '.domain';
			var packageRepository 	= packageRoot + '.repository';
			var packageMongo 		= packageRoot + '.document';
			var packageMongoDomain 	= packageRoot + '.document.domain';
			var packageMongoRepo  	= packageRoot + '.document.repository';
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
					mongodb 			: mongodb, 
					devtools 			: devtools, 
					actuator 			: actuator, 
					metricsinflux 		: metricsinflux, 
					jpa 				: jpa, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka 				: kafka
				}
			);
			this.destinationRoot('src/docker');
			this.fs.copyTpl(
				this.templatePath('docker/README-stack.md'),
				this.destinationPath('README-stack.md'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka 				: kafka
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/Dockerfile'),
				this.destinationPath('Dockerfile'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka				: kafka
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/docker-compose.yml'),
				this.destinationPath('docker-compose.yml'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka 				: kafka
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/stack.sh'),
				this.destinationPath('stack.sh'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka				: kafka
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/standalone.sh'),
				this.destinationPath('standalone.sh'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka				: kafka
				}
			);

			this.destinationRoot('../postman');
			this.fs.copyTpl(
				this.templatePath('postman/postman-collection.json'),
				this.destinationPath(artifactName + '-postman-collection.json'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					mongodb 			: mongodb, 
					kafka 				: kafka, 
					jpa 				: jpa
				}
			);

			this.destinationRoot('../curl');
			this.fs.copyTpl(
				this.templatePath('curl/curl-requests.txt'),
				this.destinationPath(artifactName + '-curl-requests.txt'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					mongodb 			: mongodb, 
					kafka 				: kafka, 
					jpa 				: jpa
				}
			);

			// resources
			this.destinationRoot('../main/resources');
			this.fs.copyTpl(
				this.templatePath('application.yml'),
				this.destinationPath('application.yml'), 
				{
					apptitle		: appTitle, 
					artifact 		: artifactName, 
					packageroot		: packageRoot, 
					swagger 		: swagger, 
					mongodb 		: mongodb, 
					actuator 		: actuator, 
					metricsinflux 	: metricsinflux, 
					redis 			: redis, 
					rabbit 			: rabbit, 
					kafka 			: kafka, 
					kafkaTopic 		: kafkaTopic, 
					kafkaGroupId 	: kafkaGroupId, 
					jpa 			: jpa, 
					databaseJpa 	: databaseJpa, 
					postgres		: postgres, 
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
					this.templatePath('redis/CacheConfig.java'), 
					this.destinationPath('CacheConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
				this.fs.copyTpl(
					this.templatePath('redis/CacheKeyGenerator.java'), 
					this.destinationPath('CacheKeyGenerator.java'), 
					{
						packageConfig: packageConfig
					}
				);
			}
			if (jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/JpaConfig.java'), 
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
					this.templatePath('swagger/SwaggerConfig.java'), 
					this.destinationPath('SwaggerConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
			}
			if (rabbit) {
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitConfig.java'), 
					this.destinationPath('RabbitConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
			}
			if (kafka) {
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaConfig.java'), 
					this.destinationPath('KafkaConfig.java'), 
					{
						packageConfig: packageConfig
					}
				);
			}

			// java::domain
			this.destinationRoot('../domain');
			if (jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/Registry.java'), 
					this.destinationPath('Registry.java'), 
					{
						packageDomain: packageDomain
					}
				);
			}
			if (mongodb) {
				this.fs.copyTpl(
					this.templatePath('mongo/Person.java'), 
					this.destinationPath('Person.java'), 
					{
						packageDomain: packageDomain
					}
				);
			}

			// java: repository
			this.destinationRoot('../repository');
			if (jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/RegistryRepository.java'), 
					this.destinationPath('RegistryRepository.java'), 
					{
						packageRepository	: packageRepository, 
						packageDomain		: packageDomain
					}
				);
			}
			if (mongodb) {
				this.fs.copyTpl(
					this.templatePath('mongo/PersonRepository.java'), 
					this.destinationPath('PersonRepository.java'), 
					{
						packageRepository	: packageRepository, 
						packageDomain		: packageDomain
					}
				);
			}

			// java: rabbit
			if (rabbit) {
				this.destinationRoot('../rabbit');
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitConverter.java'), 
					this.destinationPath('RabbitConverter.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitMessageListener.java'), 
					this.destinationPath('RabbitMessageListener.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitSamplePojo.java'), 
					this.destinationPath('RabbitSamplePojo.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitSender.java'), 
					this.destinationPath('RabbitSender.java'), 
					{
						packageRabbit	: packageRabbit
					}
				);
			}

			// java: kafka
			if (kafka) {
				this.destinationRoot('../kafka');
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaProducer.java'), 
					this.destinationPath('KafkaProducer.java'), 
					{
						packageKafka	: packageKafka, 
						kafkaTopic 		: kafkaTopic, 
						kafkaGroupId 	: kafkaGroupId
					}
				);
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaConsumer.java'), 
					this.destinationPath('KafkaConsumer.java'), 
					{
						packageKafka	: packageKafka, 
						kafkaTopic 		: kafkaTopic, 
						kafkaGroupId 	: kafkaGroupId
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
					this.templatePath('jpa/RegistryService.java'), 
					this.destinationPath('RegistryService.java'), 
					{
						packageService		: packageService, 
						packageRepository	: packageRepository, 
						packageDomain		: packageDomain
					}
				);
			}
			if (mongodb) {
				this.fs.copyTpl(
					this.templatePath('mongo/PersonService.java'), 
					this.destinationPath('PersonService.java'), 
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
					packageDomain 	: packageDomain, 
					jpa 			: jpa, 
					rabbit 			: rabbit, 
					mongodb 		: mongodb
				}
			);
		});
	}
};
