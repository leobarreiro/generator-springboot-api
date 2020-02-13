package <%= packageService %>;

import java.util.Calendar;
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

	public Registry save(Registry registry) {
		repo.save(registry);
		return registry;
	}

	public Registry update(Registry registry) {
		Optional<Registry> opt = repo.findById(registry.getId());
		if (opt.isPresent()) {
			Registry reg = opt.get();
			reg.setDescription(registry.getDescription());
			reg.setInstantTime(Calendar.getInstance().getTime());
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
