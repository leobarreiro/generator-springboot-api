package <%=packageRepository%>;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import <%=packageDomain%>.Registry;

@Repository
public interface RegistryRepository extends JpaRepository<Registry, Long> {

}
