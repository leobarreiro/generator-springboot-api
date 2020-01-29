package <%= packageService %>;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

<% if (rabbit) {%>
import <%= packageDomain %>.Person;
import <%= packageRabbit %>.RabbitMessageSender;
<% } %>

@Service
public class ApiBaseService {
	
	<% if (rabbit) { %>@Autowired
	private RabbitMessageSender rabbitSender;<% } %>

	<% if (redis) { %>@Cacheable("date-now")<% } %>
	public String localDate() {
		return LocalDate.now().toString();
	}

	public String hello() {
		return "Hello";
	}

	<% if (rabbit) { %>public void sendMessageToRabbit(Person person) {
		rabbitSender.sendMessage(person);
	} <% } %>

}