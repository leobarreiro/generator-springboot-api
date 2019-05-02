package <%= packageConfig %>;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

@EnableCaching
@Configuration
public class CacheConfig extends CachingConfigurerSupport {

	@Bean
	public RedisCacheManager redisCacheManager(LettuceConnectionFactory lettuceConnectionFactory) {
		RedisCacheConfiguration confDefaults = RedisCacheConfiguration.defaultCacheConfig().disableCachingNullValues()
				.entryTtl(Duration.ofSeconds(60)).serializeValuesWith(
						RedisSerializationContext.SerializationPair.fromSerializer(RedisSerializer.json()));
		RedisCacheConfiguration confDateNow = RedisCacheConfiguration.defaultCacheConfig().disableCachingNullValues()
				.entryTtl(Duration.ofHours(1)).serializeValuesWith(
						RedisSerializationContext.SerializationPair.fromSerializer(RedisSerializer.json()));
		confDateNow.usePrefix();
		Map<String, RedisCacheConfiguration> cacheMapConf = new HashMap<>();
		cacheMapConf.put("date-now", confDateNow);
		return RedisCacheManager.RedisCacheManagerBuilder.fromConnectionFactory(lettuceConnectionFactory)
				.cacheDefaults(confDefaults).withInitialCacheConfigurations(cacheMapConf).build();
	}

	@Bean
	@Override
	public KeyGenerator keyGenerator() {
		return new CacheKeyGenerator();
	}
}
