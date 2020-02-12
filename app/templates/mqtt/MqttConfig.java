package <%=packageAmqp%>;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

	@Value("${<%=artifact%>.messages.input-queue}")
    private String inputTopic;
    
    @Value("${<%=artifact%>.mqtt.clientId}")
    private String clientId;

	@Value("${<%=artifact%>.mqtt.hostname}")
	private String hostname;

	@Value("${<%=artifact%>.mqtt.port}")
	private Integer port;

	@Autowired
	private MqttMessageListener messageListener;

	@Bean("defaultMqttConfig")
	@ConfigurationProperties(prefix = "<%=artifact%>.mqtt")
	public MqttConnectOptions mqttConnectOptions() {
		MqttConnectOptions options = new MqttConnectOptions();
		options.setAutomaticReconnect(true);
		options.setCleanSession(true);
		options.setConnectionTimeout(10);
		options.setServerURIs(new String[] { "tcp://" + hostname + ":" + port });
		return options;
	}

	@Bean("mqttDefaultClient")
	public MqttClient mqttClient() throws MqttException {
		MqttClient mqttClient = new MqttClient("tcp://" + hostname + ":" + port, clientId);
		mqttClient.connect(mqttConnectOptions());
		mqttClient.subscribe(inputTopic, messageListener);
		return mqttClient;
	}

}