package <%= groupId %>;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"<%= groupId %>"})
public class <%= applicationName %> {

	public static void main(String[] args) {
		SpringApplication.run(<%= applicationName %>.class, args);
	}
}