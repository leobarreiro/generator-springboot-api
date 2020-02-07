package <%=packageDomain%>;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "REGISTRY")
@SequenceGenerator(name = "regSeq", sequenceName = "REGISTRY_SEQ", allocationSize = 1, initialValue = 1)
public class Registry implements Serializable {

	private static final long serialVersionUID = -5181572986790243162L;

	@Id
	@Column(name = "registry_id")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "regSeq")
	private Long id;

	@Column(name = "description")
	private String description;

	@Column(name = "instant_time")
	@Temporal(TemporalType.TIMESTAMP)
	@Default
	private Date instantTime = Calendar.getInstance().getTime();

}
