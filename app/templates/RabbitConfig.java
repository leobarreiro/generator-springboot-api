package <%= packageConfig %>;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfig {

	@Value("${spring.rabbitmq.writeQueue}")
	private String writeQueueName;

	@Value("${spring.rabbitmq.readQueue}")
	private String readQueueName;

	@Value("${spring.rabbitmq.exchange}")
	private String exchangeName;

	@Bean
	Queue writeQueue() {
		return QueueBuilder.durable(writeQueueName).build();
	}

	@Bean
	Queue readQueue() {
		return QueueBuilder.durable(readQueueName).build();
	}

	@Bean
	Exchange exchange() {
		return ExchangeBuilder.topicExchange(exchangeName).build();
	}

	@Bean
	Binding binding(Queue writeQueue, TopicExchange exchange) {
		return BindingBuilder.bind(writeQueue).to(exchange).with(writeQueueName);
	}

	@Bean
	public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
		final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
		rabbitTemplate.setExchange(exchangeName);
		rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());
		return rabbitTemplate;
	}

	@Bean
	public Jackson2JsonMessageConverter producerJackson2MessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

}