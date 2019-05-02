package <%=packageDomain%>;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@ToString
@AllArgsConstructor
@Document(collection = "person")
public class Person {

	@Id
	private String id;

	private String name;

	@Indexed(unique = false)
	private String surname;

}