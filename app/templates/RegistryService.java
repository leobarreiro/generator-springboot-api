package <%= packageService %>;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import <%= packageDomain %>.Registry;
import <%= packageRepository %>.RegistryRepository;

@Service
public class RegistryService {

	@Autowired
	private RegistryRepository repo;
	
	public List<Registry> findAll() {
		return repo.findAll();
	}

	public void sendRecordToDatabase(String description) {
		repo.save(Registry.builder().description(description).build());
	}

	public void updateRecord(Long id, String description) {
		Registry reg = repo.getOne(id);
		reg.setDescription(description);
		repo.save(reg);
	}
	
	public void deleteRecord(Long id) {
		repo.deleteById(id);
	}
	
}
