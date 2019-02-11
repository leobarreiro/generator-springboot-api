package <%= packageConfig %>;

import static java.util.Objects.isNull;

import java.lang.reflect.Method;
import java.util.Arrays;

import org.springframework.cache.interceptor.KeyGenerator;

public class CacheKeyGenerator implements KeyGenerator {

	@Override
	public String generate(final Object target, final Method method, final Object... params) {
		final StringBuilder key = new StringBuilder();
		if (isNull(params) || params.length <= 0) {
			key.append(target.getClass().getName());
			key.append("#");
			key.append(method.getName());
		} else {
			final String[] stringParams = Arrays.stream(params).map(String::valueOf).toArray(String[]::new);
			key.append(String.join(",", stringParams));
		}
		return key.toString();
	}
}
