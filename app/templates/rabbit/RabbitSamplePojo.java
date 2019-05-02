package <%= packageRabbit %>;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class RabbitSamplePojo {

	@Default
	private LocalDateTime messageDateTime = LocalDateTime.now();
	private String content;

}