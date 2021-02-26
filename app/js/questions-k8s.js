exports.k8sQuestions = [
	{
		type	: 'rawlist', 
		name	: 'generatek8s', 
		default : 'no', 
		message : 'Do you want to generate k8s manifests? (+)', 
		choices : ['no', 'yes']
	}, 
	{
		type: 'input',
		name: 'dockerRegistry', 
		when: (answers) => answers.generatek8s === 'yes', 
		message: '  (k8s) - Please inform the docker registry: ',
		validate: function (dockerRegistry) {
			var pattern = /^([a-z]{1,}[\-]{0,1}[a-z]{1,}[\.]{0,1}[a-z]{1,}){1,}([\:]{1}[0-9]{3,5}){0,1}$/g;
			var validRegistry = pattern.exec(dockerRegistry);
			if (!validRegistry) {
				console.log('\n "   ERROR: The docker registry must have a domain format and \'can have\' a port (p.e. registry.mydomain.com:443)');
			}
			return (validRegistry != null);
		}
	}, 
	{
		type: 'input',
		name: 'dockerNamespace', 
		when: (answers) => answers.generatek8s === 'yes', 
		message: '  (k8s) - Please inform the docker namespace (subfolder): ',
		validate: function (dockerNamespace) {
			var pattern = /^[a-z]{3,}$/g;
			var validNamespace = pattern.exec(dockerNamespace);
			if (!validNamespace) {
				console.log('\n "   ERROR: The docker namespace must be a string (only lowercase letters)');
			}
			return (validNamespace != null);
		}
	}, 
	{
		type: 'input',
		name: 'clusterNamespace', 
		when: (answers) => answers.generatek8s === 'yes', 
		message: '  (k8s) - Inform the k8s namespace: ',
		validate: function (clusterNamespace) {
			var pattern = /^([a-z]{2,}[\-]{0,1}[a-z]{2,}){1,}$/g;
			var validNamespace = pattern.exec(clusterNamespace);
			if (!validNamespace) {
				console.log('\n "   ERROR: The k8s namespace must have only lowercase letters and dashe(s) (p.e business-project)');
			}
			return (validNamespace != null);
		}
	}, 
	{
		type: 'input',
		name: 'ingressHost', 
		when: (answers) => answers.generatek8s === 'yes', 
		message: '  (k8s) - Which will be the ingress hostname: ',
		validate: function (ingressHost) {
			var pattern = /^([a-z]{1,}[\-]{0,1}[a-z]{1,}[\.]{0,1}[a-z]{1,}){1,}([\:]{1}[0-9]{3,5}){0,1}$/g;
			var validHostname = pattern.exec(ingressHost);
			if (!validHostname) {
				console.log('\n "   ERROR: The ingress hostname must have a domain format (p.e. microservice.mydomain.com)');
			}
			return (validHostname != null);
		}
	}
];

