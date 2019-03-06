package <%= packageEndpoint %>;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

}
