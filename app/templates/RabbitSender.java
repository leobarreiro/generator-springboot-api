package <%= packageRabbit %>;

import java.util.Map;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class RabbitSender {

	@Value("${spring.rabbitmq.writeQueue}")
	private String writeQueue;

	@Value("${spring.rabbitmq.exchange}")
	private String exchange;

	@Autowired
	private RabbitTemplate rabbitTemplate;

	@Autowired
	private RabbitConverter<RabbitSamplePojo> converter;

	public void sendMessage(String content) {
		RabbitSamplePojo sample = RabbitSamplePojo.builder().content(content).build();
		Map<String, String> mapContent = converter.convert(sample);
		rabbitTemplate.convertAndSend(writeQueue, mapContent);
		log.info("Message sent through Rabbit AMQP");
	}

}