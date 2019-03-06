package <%= packageService %>;

import java.time.LocalDate;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ApiBaseService {
	<% if (redis) { %>@Cacheable("date-now")<% } %>
	public String localDate() {
		return LocalDate.now().toString();
	}

}