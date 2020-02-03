package <%=packageAmqp%>;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface KafkaChannels {

	public static final String OUTPUT_BINDING = "<%=artifact%>_output";

	public static final String INPUT_BINDING = "<%=artifact%>_input";

	@Input(INPUT_BINDING)
	SubscribableChannel messageInputChannel();

	@Output(OUTPUT_BINDING)
	MessageChannel messageOutputChannel();

}
