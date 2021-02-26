const { uniqueNamesGenerator, names, animals, starWars } = require('unique-names-generator');

exports.answersConfig = function(answers) {
	let genConfig = {

		artifact			: answers.artifact, 
		group				: answers.group, 
		appVersion 			: answers.version, 
		portNumber 			: answers.port, 
		containerDep 		: (answers.container == 'netty (webflux)') ? 'webflux' : answers.container,  
		webflux 			: (answers.container == 'netty (webflux)'), 
		redis 				: answers.options.includes('cache-redis'), 
		kafka 				: (answers.mqueue == 'kafka'), 
		rabbit 				: (answers.mqueue == 'rabbit'), 
		mqtt 				: (answers.mqueue == 'mqtt'), 
		cloud 				: ((answers.mqueue == 'kafka') || (answers.mqueue == 'rabbit')), 
		
		kafkaTopic 			: answers.artifact.replace(/\w\S*/g, function(txt){ return txt.toLowerCase(); }), 
		kafkaGroupId 		: 'group_id', 
		
		devtools 			: answers.options.includes('devtools'), 
		swagger 			: answers.options.includes('swagger'), 
		actuator	 	 	: answers.options.includes('actuator'), 
		metricsinflux 		: answers.options.includes('metrics-influx'), 
		mongo 				: answers.options.includes('mongo'), 
		
		postgres 			: answers.database == 'postgres', 
		oracle 				: answers.database == 'oracle', 
		jpa 				: (answers.database == 'postgres' || answers.database == 'oracle'), 
		databaseJpa 		: (answers.database == 'postgres') ? 'POSTGRESQL' : 'ORACLE', 
		databaseDialect 	: (answers.database == 'postgres') ? 'PostgreSQL9Dialect' : 'Oracle10gDialect', 
		
		packageRoot 		: answers.group, 
		packageConfig 		: answers.group + '.config', 
		packageService 		: answers.group + '.service', 
		packageEndpoint 	: answers.group + '.endpoint', 
		packageAmqp  		: answers.group + '.amqp', 
		packageDomain  		: answers.group + '.domain', 
		packageRepository 	: answers.group + '.repository', 
		packagePath 		: answers.group.split('.').join('/'), 
		
		appTitle 			: answers.artifact.replace(/\W/g, ' ') + ' API', 
		randomName 			: uniqueNamesGenerator({dictionaries: [names, starWars], separator: ' ', length: 2}), 
		randomSurname 		: uniqueNamesGenerator({dictionaries: [starWars, names], separator: ' ', length: 2}), 
		randomPasswd 		: (uniqueNamesGenerator({dictionaries: [starWars], separator: '', length: 1}) + (Math.random() * 10000).toString().substr(0, 4)).replace(' ', ''), 

		keycloak 			: answers.keycloak == 'yes', 
		randomName 			: uniqueNamesGenerator({dictionaries: [names, starWars], separator: ' ', length: 2}),
		randomSurname 		: uniqueNamesGenerator({dictionaries: [starWars, names], separator: ' ', length: 2}),
		randomPasswd 		: (uniqueNamesGenerator({dictionaries: [starWars], separator: '', length: 1}) + (Math.random() * 10000).toString().substr(0, 4)).replace(' ', ''),

		generatek8s 		: answers.generatek8s == 'yes',
		dockerRegistry 		: answers.dockerRegistry,
		dockerNamespace 	: answers.dockerNamespace,
		clusterNamespace 	: answers.clusterNamespace,
		ingressHost 		: answers.ingressHost

	};
	return genConfig;
}
