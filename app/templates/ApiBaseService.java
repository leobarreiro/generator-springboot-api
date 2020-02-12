package <%= packageService %>;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;<% if (redis) { %>
import org.springframework.cache.annotation.Cacheable;<% } %>
import org.springframework.stereotype.Service;

import <%= packageDomain %>.Person;

<% if (rabbit) { %>
import <%=packageAmqp%>.RabbitMessageSender;<% } if (kafka) { %>
import <%=packageAmqp%>.KafkaMessageSender;<% } if (mqtt) { %>
import <%=packageAmqp%>.MqttMessageSender;<% } %>

@Service
public class ApiBaseService {
<% if (rabbit) { %>

	@Autowired
	private RabbitMessageSender rabbitSender;<% } if (kafka) { %>

	@Autowired
	private KafkaMessageSender kafkaSender;<% } if (mqtt) { %>

	@Autowired
	private MqttMessageSender mqttSender;<% } %>

<% if (redis) { %>
	@Cacheable("date-now")<% } %>
	public String localDate() {
		return LocalDate.now().toString();
	}

	public String hello() {
		return "Hello";
	}<% if (rabbit) { %>
		
	public void sendMessageToRabbit(Person person) {
		rabbitSender.sendMessage(person);
	}<% } if (kafka) { %>
	
	public void sendMessageToKafka(Person person) {
		kafkaSender.sendMessage(person);
	}<% } if (mqtt) { %>

	public void sendMessageToMqtt(Person person) {
		mqttSender.sendMessage(person);
	}<% } %>

}