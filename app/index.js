'use strict';

const Generator = require('yeoman-generator');
const { closeSync, openSync } = require('fs');
const { questions } = require('./js/questions');
const { answersConfig } = require('./js/answers-config.js');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}
	
	start() {

		this.prompt(questions).then((answers) => {
			
			let config = answersConfig(answers);
			console.log(config);

			// root files
			this.destinationRoot(config.artifact);
			closeSync(openSync('README.md', 'w'));
			closeSync(openSync('.gitignore', 'w'));
			this.fs.copyTpl(
				this.templatePath('pom.xml'),
				this.destinationPath('pom.xml'), 
				config
			);
			this.destinationRoot('src/docker');
			this.fs.copyTpl(
				this.templatePath('docker/README-stack.md'),
				this.destinationPath('README-stack.md'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('docker/Dockerfile'),
				this.destinationPath('Dockerfile'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('docker/server-compose.yml'),
				this.destinationPath('server-compose.yml'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('docker/dev-compose.yml'),
				this.destinationPath('dev-compose.yml'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('docker/server-stack.sh'),
				this.destinationPath('server-stack.sh'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('docker/dev-stack.sh'),
				this.destinationPath('dev-stack.sh'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('docker/standalone.sh'),
				this.destinationPath('standalone.sh'), 
				config
			);

			this.destinationRoot('../postman');
			this.fs.copyTpl(
				this.templatePath('postman/postman-collection.json'),
				this.destinationPath(config.artifact + 'postman-collection.json'), 
				config
			);

			this.destinationRoot('../curl');
			this.fs.copyTpl(
				this.templatePath('curl/curl-requests.txt'),
				this.destinationPath(config.artifact + '-curl-requests.txt'), 
				config
			);

			// resources
			this.destinationRoot('../main/resources');
			this.fs.copyTpl(
				this.templatePath('application.yml'),
				this.destinationPath('application.yml'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('application-dev.yml'),
				this.destinationPath('application-dev.yml'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('application-stack.yml'),
				this.destinationPath('application-stack.yml'), 
				config
			);
			this.fs.copyTpl(
				this.templatePath('bootstrap.yml'),
				this.destinationPath('bootstrap.yml'), 
				config
			);
			
			// i18n
			this.destinationRoot('./i18n');
			
			// java
			this.destinationRoot('../../java');
			this.destinationRoot(config.packagePath);
			this.fs.copyTpl(
				this.templatePath('ApiApplication.java'),
				this.destinationPath('ApiApplication.java'), 
				config
			);
			
			// java::config
			this.destinationRoot('./config');
			if (config.redis) {
				this.fs.copyTpl(
					this.templatePath('redis/CacheConfig.java'), 
					this.destinationPath('CacheConfig.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('redis/CacheKeyGenerator.java'), 
					this.destinationPath('CacheKeyGenerator.java'), 
					config
				);
			}
			if (config.jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/JpaConfig.java'), 
					this.destinationPath('JpaConfig.java'), 
					config
				);
			}
			if (config.swagger) {
				this.fs.copyTpl(
					this.templatePath('swagger/SwaggerConfig.java'), 
					this.destinationPath('SwaggerConfig.java'), 
					config
				);
			}
			if (config.webflux) {
				this.fs.copyTpl(
					this.templatePath('webflux/NettyPortCustom.java'), 
					this.destinationPath('NettyPortCustom.java')
				);
			}

			// java::domain
			this.destinationRoot('../domain');
			this.fs.copyTpl(
				this.templatePath('domain/Person.java'), 
				this.destinationPath('Person.java'), 
				config
			);

			if (config.jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/Registry.java'), 
					this.destinationPath('Registry.java'), 
					config
				);
			}

			// java: repository
			this.destinationRoot('../repository');
			if (config.jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/RegistryRepository.java'), 
					this.destinationPath('RegistryRepository.java'), 
					config
				);
			}
			if (config.mongo) {
				this.fs.copyTpl(
					this.templatePath('mongo/PersonRepository.java'), 
					this.destinationPath('PersonRepository.java'), 
					config
				);
			}

			// java: rabbit
			if (config.rabbit) {
				this.destinationRoot('../amqp');
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitChannels.java'), 
					this.destinationPath('RabbitChannels.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitMessageListener.java'), 
					this.destinationPath('RabbitMessageListener.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('rabbit/RabbitMessageSender.java'), 
					this.destinationPath('RabbitMessageSender.java'), 
					config
				);
			}

			// java: kafka
			if (config.kafka) {
				this.destinationRoot('../amqp');
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaChannels.java'), 
					this.destinationPath('KafkaChannels.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaMessageListener.java'), 
					this.destinationPath('KafkaMessageListener.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('kafka/KafkaMessageSender.java'), 
					this.destinationPath('KafkaMessageSender.java'), 
					config
				);
			}

			// java: mqtt
			if (config.mqtt) {
				this.destinationRoot('../amqp');
				this.fs.copyTpl(
					this.templatePath('mqtt/MqttConfig.java'), 
					this.destinationPath('MqttConfig.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('mqtt/MqttMessageListener.java'), 
					this.destinationPath('MqttMessageListener.java'), 
					config
				);
				this.fs.copyTpl(
					this.templatePath('mqtt/MqttMessageSender.java'), 
					this.destinationPath('MqttMessageSender.java'), 
					config
				);
			}

			// java::service
			this.destinationRoot('../service');
			this.fs.copyTpl(
				this.templatePath('ApiBaseService.java'), 
				this.destinationPath('ApiBaseService.java'), 
				config
			);
			if (config.jpa) {
				this.fs.copyTpl(
					this.templatePath('jpa/RegistryService.java'), 
					this.destinationPath('RegistryService.java'), 
					config
				);
			}
			if (config.mongo) {
				this.fs.copyTpl(
					this.templatePath('mongo/PersonService.java'), 
					this.destinationPath('PersonService.java'), 
					config
				);
			}
			
			// java::endpoint
			this.destinationRoot('../endpoint');
			this.fs.copyTpl(
				this.templatePath('ApiBaseEndpoint.java'), 
				this.destinationPath('ApiBaseEndpoint.java'), 
				config
			);

		});
		
	}
};
