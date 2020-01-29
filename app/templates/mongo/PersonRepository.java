package <%=packageRepository%>;

import java.util.List;

import <%=packageDomain%>.Person;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface PersonRepository extends MongoRepository<Person, String> {

	public Person findByNameAndSurname(String name, String surname);

	public List<Person> findBySurname(String surname);

}
