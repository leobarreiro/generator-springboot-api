package <%=packageAmqp%>;

import org.eclipse.paho.client.mqttv3.IMqttMessageListener;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import <%=packageDomain%>.Person;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MqttMessageListener implements IMqttMessageListener {

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		Person person = objectMapper.readValue(new String(message.getPayload(), "utf-8"), Person.class);
		log.info("Message received from MQTT - {}", person.toString());
	}

}