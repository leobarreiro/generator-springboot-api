package <%= packageRabbit %>;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class RabbitMessageListener {

	@Autowired
	private ObjectMapper mapper;

	/**
	 * This operation listen messages from queue setted in
	 * <spring.rabbitmq.readQueue>. Please configure the application.yml, section
	 * <spring.rabbitmq> with appropriate values.
	 * 
	 * @param message
	 */
	@RabbitListener(queues = { "${spring.rabbitmq.readQueue}" })
	public void receiveMessage(Message message) {
		Map<String, String> messageMap = new HashMap<>();
		try {
			messageMap = mapper.readValue(message.getBody(), new TypeReference<Map<String, String>>() {
			});
			log.info("Message received from Rabbit AMQP <{}>.", messageMap.get("content"));
		} catch (IOException e) {
			log.warn(e.getMessage(), e);
		}
	}

}