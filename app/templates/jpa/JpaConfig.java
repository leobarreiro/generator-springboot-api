package <%=packageConfig%>;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import <%=packageDomain%>.Registry;
import <%=packageRepository%>.RegistryRepository;

@Configuration
@EnableJpaRepositories(basePackageClasses = RegistryRepository.class)
@EntityScan(basePackageClasses = Registry.class)
public class JpaConfig {

}
