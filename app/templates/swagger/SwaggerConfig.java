package <%=packageConfig%>;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableSwagger2
@Configuration
public class SwaggerConfig {

	@Bean
	public Docket customImplementation(
		@Value("${springfox.documentation.info.title}") String title,
		@Value("${springfox.documentation.info.version}") String version,
		@Value("${springfox.documentation.info.description}") String description,
		@Value("${springfox.documentation.base-package}") String basePackage) {
		return new Docket(DocumentationType.SWAGGER_2)
			.apiInfo(apiInfo(title, description, version))
			.directModelSubstitute(LocalDate.class, String.class)
			.useDefaultResponseMessages(false).select()
			.apis(RequestHandlerSelectors
				.basePackage(basePackage))
			.paths(PathSelectors.any()).build();
	}

	ApiInfo apiInfo(String title, String description, String version) {
		return new ApiInfoBuilder().title(title).description(description).version(version)
			.build();
	}

}