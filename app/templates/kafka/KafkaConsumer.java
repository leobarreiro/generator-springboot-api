package <%= packageKafka %>;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class KafkaConsumer {

	@KafkaListener(topics = "<%= kafkaTopic %>", groupId = "<%= kafkaGroupId %>")
	public void consume(String message) {
		log.info(String.format("$$ -> Consumed Message -> %s", message));
	}

}
