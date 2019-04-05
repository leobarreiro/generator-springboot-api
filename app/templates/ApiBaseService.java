package <%= packageService %>;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
<% if (rabbit) {%>import <%= packageRabbit %>.RabbitSender;<% } %>

@Service
public class ApiBaseService {
	
	<% if (rabbit) { %>@Autowired
	private RabbitSender rabbitSender;<% } %>

	<% if (redis) { %>@Cacheable("date-now")<% } %>
	public String localDate() {
		return LocalDate.now().toString();
	}

	public String hello() {
		return "Hello";
	}

	<% if (rabbit) { %>public void sendMessageToRabbit(String content) {
		rabbitSender.sendMessage(content);
	} <% } %>

}