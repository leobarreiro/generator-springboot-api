package br.com.arlepton.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NettyPortCustom implements WebServerFactoryCustomizer<NettyReactiveWebServerFactory> {

	@Value("${server.port}")
	private Integer port;

	@Override
	public void customize(NettyReactiveWebServerFactory serverFactory) {
		serverFactory.setPort(port);
	}
}