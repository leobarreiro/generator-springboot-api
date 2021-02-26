const {keycloakQuestions} = require("./questions-keycloak.js");
const {k8sQuestions} = require("./questions-k8s.js");

const basicQuestions = [
	{
		type    : 'input',
		name    : 'group', 
		default : 'com.mydomain.api', 
		message : 'Please type the groupId [com.mydomain.api]: ', 
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
		message : 'ArtifactId: ', 
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
		choices : ['undertow', 'jetty', 'tomcat', 'netty (webflux)']
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
			{name: 'Mongo DB', value: 'mongo'}, 
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
		choices : ['none', 'postgres', 'oracle']
	}
];

exports.questions = [...basicQuestions, ...keycloakQuestions, ...k8sQuestions];

