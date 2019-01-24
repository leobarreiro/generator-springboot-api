package <%= packageConfig %>;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.core.RedisTemplate;

@EnableCaching
@Configuration
public class CacheConfig extends CachingConfigurerSupport {

	@Autowired
	private RedisTemplate<?, ?> redisTemplate;

	@Bean
	@Override
	public CacheManager cacheManager() {
		final RedisCacheManager manager = new RedisCacheManager(redisTemplate);
		manager.setUsePrefix(true);
		manager.setDefaultExpiration(90L);
		Map<String, Long> mapExpires = new HashMap<>();
		/* Create the entries to your cache set, as below:
		 * mapExpires.put("cache-group-1", 60L);
		 * mapExpires.put("cache-group-2", 300L); 
		 */
		manager.setExpires(mapExpires);
		return manager;
	}

	@Bean
	@Override
	public KeyGenerator keyGenerator() {
		return new CacheKeyGenerator();
	}
}
