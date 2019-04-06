package <%= packageRabbit %>;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class RabbitConverter<T> {

	/**
	 * This converter works better with a simple Object as parameter, which
	 * attributes are formed by primitive types or basic wrappers.
	 * 
	 * @param Object obj
	 * @return map of String
	 */
	public Map<String, String> convert(T obj) {
		Map<String, String> map = new HashMap<>();
		List<Field> fields = Arrays.asList(obj.getClass().getDeclaredFields());
		fields.forEach(f -> {
			try {
				f.setAccessible(true);
				map.put(f.getName(), f.get(obj).toString());
			} catch (SecurityException | IllegalArgumentException | IllegalAccessException e) {
				log.warn(e.getMessage(), e);
			}
		});
		return map;
	}

}