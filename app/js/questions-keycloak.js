exports.keycloakQuestions = [
	{
		type	: 'rawlist', 
		name	: 'keycloak', 
		default : 'no', 
		message : 'Do you want to integrate with Keycloak? (+)', 
		choices : ['no', 'yes']
	}, 
	{
		type: 'input',
		name: 'kcRealm', 
		when: (answers) => answers.keycloak === 'yes', 
		message: '  (Keycloak) - Type the Realm to the keycloak integration: ',
		validate: function (kcRealm) {
			var pattern = /^[a-zA-Z]{3,}$/g;
			var validKcRealm = pattern.exec(kcRealm);
			if (!validKcRealm) {
				console.log('\n "   ERROR: The keycloak Realm must have a string format (only letters)');
			}
			return (validKcRealm != null);
		}
	},
	{
		type: 'input',
		name: 'kcUrl', 
		when: (answers) => answers.keycloak === 'yes', 
		message: '  (Keycloak) - Please inform the existing keycloak instance URL: ',
		validate: function (kcUrl) {
			var pattern = /^[a-z]{1,}[\-]{0,1}[a-z]{1,}$/g;
			var validKcUrl = pattern.exec(kcUrl);
			if (!validKcUrl) {
				console.log('\n "   ERROR: The keycloak URL must be a valid URL');
			}
			return (validKcUrl != null);
		}
	},
	{
		type: 'input',
		name: 'kcUrl', 
		when: (answers) => answers.keycloak === 'yes', 
		message: '  (Keycloak) - Please inform the existing keycloak instance URL: ',
		validate: function (kcUrl) {
			var pattern = /^[a-z]{1,}[\-]{0,1}[a-z]{1,}$/g;
			var validKcUrl = pattern.exec(kcUrl);
			if (!validKcUrl) {
				console.log('\n "   ERROR: The keycloak URL must be a valid URL');
			}
			return (validKcUrl != null);
		}
	},
	{
		type: 'input',
		name: 'kcClientId', 
		when: (answers) => answers.keycloak === 'yes', 
		message: '  (Keycloak) - Please inform the clientID: ',
		validate: function (kcClientId) {
			var pattern = /^[a-z]{1,}[\-]{0,1}[a-z]{1,}$/g;
			var validKcClientId = pattern.exec(kcClientId);
			if (!validKcClientId) {
				console.log('\n "   ERROR: The keycloak clientId cannot be null');
			}
			return (validKcClientId) != null;
		}
	},
	{
		type: 'input',
		name: 'kcClientSecret', 
		when: (answers) => answers.keycloak === 'yes', 
		message: '  (Keycloak) - Please inform the clientSecret: '
	}
];

