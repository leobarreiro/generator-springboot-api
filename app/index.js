'use strict';

const { closeSync, openSync } = require('fs');
const { uniqueNamesGenerator, names, animals, starWars } = require('unique-names-generator');
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
				default : 'com.quasarbot.api', 
				message : 'Please type the groupId [com.quasarbot.api]: ', 
				validate: function(group) {
					var validPack = typeof group == 'string' && group.indexOf('.') > 0;
					if (!validPack) {
						console.log('\n "groupId" must be a string and contains at least one point "."');
					}
					return validPack;
				}
			}, 
			{
				type    : 'input',
				name    : 'artifact', 
				message : 'Enter a name for the artifactId: ', 
				validate: function(artifact) {
					var pattern = /^[a-z]{1,}[\-]{0,1}[a-z]{1,}$/g;
					var validArtifactName = pattern.exec(artifact);
					if (!validArtifactName) {
						console.log('\n "artifactId" must contain only lowercase letters (from a to z) and perhaps may contain a dash "-"');
					}
					return (validArtifactName != null);
				}
			}, 
			{
				type    : 'input',
				name    : 'version', 
				default : '0.1.0', 
				message : 'Please type the API version [0.1.0]: ', 
				validate: function(version) {
					var validVersion = typeof version == 'string' && version.indexOf('.') > 0;
					if (!validVersion) {
						console.log('\n version must be a string and contains at least one point "."');
					}
					return validVersion;
				}
			}, 
			{
				type	: 'rawlist', 
				name	: 'container', 
				default : 'undertow', 
				message : 'Select an embedded server [1 = undertow]: ', 
				choices : ['undertow', 'jetty', 'tomcat']
			}, 
			{
				type	: 'number', 
				name	: 'port', 
				default : '8080', 
				message : 'Type the port number to your micro-service [8080]: '
			}, 
			{
				type	: 'checkbox', 
				name	: 'options',  
				message : 'Select additional options as desired: ', 
				radio 	: true, 
				choices : [
					{name: 'Devtools', value: 'devtools'}, 
					{name: 'Mongo DB', value: 'mongodb'}, 
					{name: 'Redis Cache', value: 'cache-redis'}, 
					{name: 'Spring Actuator', value: 'actuator'}, 
					{name: 'Metrics InfluxDB', value: 'metrics-influx'}, 
					{name: 'Swagger Docs', value: 'swagger'} 
				]
			}, 
			{
				type	: 'rawlist', 
				name 	: 'mqueue', 
				message : 'Do you want to use a message queue?', 
				default : 'none', 
				choices : [
					{name: 'None', value: 'none'}, 
					{name: 'RabbitMQ', value: 'rabbit'}, 
					{name: 'Apache Kafka', value: 'kafka'}, 
					{name: 'MQTT', value: 'mqtt'}
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
			var packageRoot 		= answers.group;
			var artifactName 		= answers.artifact;
			var appVersion 			= answers.version;
			var portNumber 			= answers.port;
			var redis 				= answers.options.includes('cache-redis');
			var rabbit	 			= (answers.mqueue == 'rabbit');
			var kafka 				= (answers.mqueue == 'kafka');
			var mqtt 				= (answers.mqueue == 'mqtt');
			var cloud 				= (kafka || rabbit);
			var kafkaTopic 			= answers.artifact.replace(/\w\S*/g, function(txt){ return txt.toLowerCase(); });
			var kafkaGroupId 		= 'group_id';
			var swagger 			= answers.options.includes('swagger');
			var devtools 			= answers.options.includes('devtools');
			var actuator	 	 	= answers.options.includes('actuator');
			var metricsinflux 		= answers.options.includes('metrics-influx');
			var mongodb 			= answers.options.includes('mongodb');
			var postgres 			= answers.database == 'postgres';
			var jpa 				= postgres;
			var databaseJpa 		= (answers.database == 'postgres') ? 'POSTGRESQL' : 'MYSQL';
			var databaseDialect 	= (answers.database == 'postgres') ? 'PostgreSQL9Dialect' : 'MysqlDialect';
			var packageConfig 		= packageRoot + '.config';
			var packageService 		= packageRoot + '.service';
			var packageEndpoint 	= packageRoot + '.endpoint';
			var packageAmqp  		= packageRoot + '.amqp';
			var packageDomain  		= packageRoot + '.domain';
			var packageRepository 	= packageRoot + '.repository';
			var packagePath 		= answers.group.split('.').join('/');
			var appTitle 			= artifactName.replace(/\W/g, ' ') + ' API';
			var randomName 			= uniqueNamesGenerator({dictionaries: [names, starWars], separator: ' ', length: 2});
			var randomSurname 		= uniqueNamesGenerator({dictionaries: [starWars, names], separator: ' ', length: 2});
			var randomPasswd 		= (uniqueNamesGenerator({dictionaries: [starWars], separator: '', length: 1}) + (Math.random() * 10000).toString().substr(0, 4)).replace(' ', '');
			
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
					appVersion 			: appVersion, 
					cloud 				: cloud, 
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
					kafka 				: kafka, 
					mqtt 				: mqtt
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
					kafka 				: kafka, 
					mqtt 				: mqtt, 
					randomPasswd 		: randomPasswd
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
					kafka				: kafka, 
					mqtt 				: mqtt
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/server-compose.yml'),
				this.destinationPath('server-compose.yml'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka 				: kafka, 
					mqtt 				: mqtt, 
					randomPasswd 		: randomPasswd
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/dev-compose.yml'),
				this.destinationPath('dev-compose.yml'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka 				: kafka, 
					mqtt 				: mqtt, 
					randomPasswd 		: randomPasswd
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/server-stack.sh'),
				this.destinationPath('server-stack.sh'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka				: kafka, 
					mqtt 				: mqtt
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/dev-stack.sh'),
				this.destinationPath('dev-stack.sh'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka				: kafka, 
					mqtt 				: mqtt
				}
			);
			this.fs.copyTpl(
				this.templatePath('docker/standalone.sh'),
				this.destinationPath('standalone.sh'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					swagger 			: swagger, 
					mongodb 			: mongodb, 
					metricsinflux 		: metricsinflux, 
					postgres			: postgres, 
					redis 				: redis, 
					rabbit 				: rabbit, 
					kafka				: kafka, 
					mqtt 				: mqtt, 
					randomPasswd 		: randomPasswd
				}
			);

			this.destinationRoot('../postman');
			this.fs.copyTpl(
				this.templatePath('postman/postman-collection.json'),
				this.destinationPath(artifactName + '-postman-collection.json'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					mongodb 			: mongodb, 
					rabbit 				: rabbit, 
					kafka 				: kafka, 
					mqtt 				: mqtt, 
					jpa 				: jpa, 
					randomName 			: randomName, 
					randomSurname 		: randomSurname
				}
			);

			this.destinationRoot('../curl');
			this.fs.copyTpl(
				this.templatePath('curl/curl-requests.txt'),
				this.destinationPath(artifactName + '-curl-requests.txt'), 
				{
					artifact			: artifactName, 
					apptitle			: appTitle, 
					portNumber 			: portNumber, 
					mongodb 			: mongodb, 
					rabbit 				: rabbit, 
					kafka 				: kafka, 
					mqtt 				: mqtt, 
					jpa 				: jpa, 
					randomName 			: randomName, 
					randomSurname 		: randomSurname
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
					portNumber 		: portNumber, 
					packageroot		: packageRoot, 
					swagger 		: swagger, 
					mongodb 		: mongodb, 
					actuator 		: actuator, 
					metricsinflux 	: metricsinflux, 
					redis 			: redis, 
					rabbit 			: rabbit, 
					kafka 			: kafka, 
					mqtt 			: mqtt, 
					cloud 			: cloud, 
					kafkaTopic 		: kafkaTopic, 
					kafkaGroupId 	: kafkaGroupId, 
					jpa 			: jpa, 
					databaseJpa 	: databaseJpa, 
					postgres		: postgres, 
					databaseDialect : databaseDialect, 
					randomPasswd 	: randomPasswd
				}
			);
			this.fs.copyTpl(
				this.templatePath('application-dev.yml'),
				this.destinationPath('application-dev.yml'), 
				{
					apptitle		: appTitle, 
					artifact 		: artifactName, 
					portNumber 		: portNumber, 
					packageroot		: packageRoot, 
					swagger 		: swagger, 
					mongodb 		: mongodb, 
					actuator 		: actuator, 
					metricsinflux 	: metricsinflux, 
					redis 			: redis, 
					rabbit 			: rabbit, 
					kafka 			: kafka, 
					mqtt 			: mqtt, 
					cloud 			: cloud, 
					kafkaTopic 		: kafkaTopic, 
					kafkaGroupId 	: kafkaGroupId, 
					jpa 			: jpa, 
					databaseJpa 	: databaseJpa, 
					postgres		: postgres, 
					databaseDialect : databaseDialect, 
					randomPasswd 	: randomPasswd 
				}
			);
			this.fs.copyTpl(
				this.templatePath('application-stack.yml'),
				this.destinationPath('application-stack.yml'), 
				{
					apptitle		: appTitle, 
					artifact 		: artifactName, 
					portNumber 		: portNumber, 
					packageroot		: packageRoot, 
					swagger 		: swagger, 
					mongodb 		: mongodb, 
					actuator 		: actuator, 
					metricsinflux 	: metricsinflux, 
					redis 			: redis, 
					rabbit 			: rabbit, 
					kafka 			: kafka, 
					mqtt 			: mqtt, 
					cloud 			: cloud, 
					kafkaTopic 		: kafkaTopic, 
					kafkaGroupId 	: kafkaGroupId, 
					jpa 			: jpa, 
					databaseJpa 	: databaseJpa, 
					postgres		: postgres, 
					databaseDialect : databaseDialect, 
					randomPasswd 	: randomPasswd
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
				this.destinationPath('ApiApplication.java'), 
				{
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

			// java::domain
			this.destinationRoot('../domain');
			this.fs.copyTpl(
				this.templatePath('domain/Person.java'), 
				this.destinationPath('Person.java'), 
				{
					packageDomain	: packageDomain, 
					mongo 			: mongodb
				}
			);

			if (jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/Registry.java'), 
					this.destinationPath('Registry.java'), 
					{
						packageDomain	: packageDomain
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
				this.destinationRoot('../amqp');
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitChannels.java'), 
					this.destinationPath('RabbitChannels.java'), 
					{
						packageAmqp		: packageAmqp, 
						artifact		: artifactName 
					}
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitMessageListener.java'), 
					this.destinationPath('RabbitMessageListener.java'), 
					{
						packageAmqp		: packageAmqp, 
						packageDomain 	: packageDomain
					}
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitMessageSender.java'), 
					this.destinationPath('RabbitMessageSender.java'), 
					{
						packageAmqp		: packageAmqp, 
						packageDomain 	: packageDomain
					}
				);
			}

			// java: kafka
			if (kafka) {
				this.destinationRoot('../amqp');
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaChannels.java'), 
					this.destinationPath('KafkaChannels.java'), 
					{
						packageAmqp		: packageAmqp, 
						artifact		: artifactName 
					}
				);
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaMessageListener.java'), 
					this.destinationPath('KafkaMessageListener.java'), 
					{
						packageAmqp		: packageAmqp, 
						packageDomain 	: packageDomain
					}
				);
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaMessageSender.java'), 
					this.destinationPath('KafkaMessageSender.java'), 
					{
						packageAmqp		: packageAmqp, 
						packageDomain 	: packageDomain
					}
				);
			}

			// java: mqtt
			if (mqtt) {
				this.destinationRoot('../amqp');
				this.fs.copyTpl(
					this.templatePath('mqtt/MqttConfig.java'), 
					this.destinationPath('MqttConfig.java'), 
					{
						packageAmqp		: packageAmqp, 
						artifact		: artifactName 
					}
				);
				this.fs.copyTpl(
					this.templatePath('mqtt/MqttMessageListener.java'), 
					this.destinationPath('MqttMessageListener.java'), 
					{
						packageAmqp		: packageAmqp, 
						packageDomain 	: packageDomain
					}
				);
				this.fs.copyTpl(
					this.templatePath('mqtt/MqttMessageSender.java'), 
					this.destinationPath('MqttMessageSender.java'), 
					{
						artifact		: artifactName, 
						packageAmqp		: packageAmqp, 
						packageDomain 	: packageDomain
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
					packageAmqp			: packageAmqp, 
					packageRepository	: packageRepository, 
					packageDomain		: packageDomain, 
					redis				: redis, 
					rabbit 				: rabbit, 
					kafka 				: kafka, 
					mqtt 				: mqtt 
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
					kafka 			: kafka, 
					mqtt 			: mqtt, 
					mongodb 		: mongodb
				}
			);
		});
	}
};
