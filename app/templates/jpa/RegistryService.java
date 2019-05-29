package <%= packageService %>;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import <%=packageDomain%>.Registry;
import <%=packageRepository%>.RegistryRepository;

@Service
public class RegistryService {

	@Autowired
	private RegistryRepository repo;
	
	public List<Registry> findAll() {
		return repo.findAll();
	}

	public Registry save(String description) {
		Registry reg = Registry.builder().description(description).build();
		repo.save(reg);
		return reg;
	}

	public Registry update(Long id, String description) {
		Optional<Registry> opt = repo.findById(id);
		if (opt.isPresent()) {
			Registry reg = opt.get();
			reg.setDescription(description);
			repo.save(reg);
			return reg;
		} else {
			throw new RuntimeException("Error when trying to recover a Registry to update");
		}
	}
	
	public void delete(Long id) {
		repo.deleteById(id);
	}
	
}
