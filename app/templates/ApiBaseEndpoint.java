package <%= packageEndpoint %>;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import <%= packageService %>.ApiBaseService;

@RestController
public class ApiBaseEndpoint {
	
	@Autowired
	private ApiBaseService service;
	
	@GetMapping("/hello")
	public ResponseEntity<String> helloWorld() {
		return new ResponseEntity<>(service.hello(), HttpStatus.OK);
	}

	@GetMapping(path = "/date-now")
	@ResponseBody
	public String localDateNow() {
		return service.localDate();
	}

	<% if (rabbit) {%>@GetMapping(path = "/rabbit-send")
	@ResponseBody
	public String sendMessageToRabbit(@PathVariable("msg") String msg) {
		service.sendMessageToRabbit(msg);
		return "Message sent to Rabbit.";
	}<%}%>

}
