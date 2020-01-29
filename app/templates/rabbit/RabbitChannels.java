package <%= packageRabbit %>;


import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface RabbitChannels {

	public static final String RABBIT_OUTPUT = "<%=artifact%>_output";

	public static final String RABBIT_INPUT = "<%=artifact%>_input";

	@Input(RABBIT_INPUT)
	SubscribableChannel messageInputChannel();

	@Output(RABBIT_OUTPUT)
	MessageChannel messageOutputChannel();

}
