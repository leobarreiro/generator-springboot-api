package <%=packageAmqp%>;

import java.io.IOException;

import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import <%=packageDomain%>.Person;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@EnableBinding(KafkaChannels.class)
public class KafkaMessageListener {

	@StreamListener(KafkaChannels.INPUT_BINDING)
	public void receiveMessage(@Payload Person person) throws IOException {
		log.info("Message received from Kafka: {}", person.toString());
	}

}