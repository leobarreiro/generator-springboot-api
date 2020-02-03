package <%=packageDomain%>;

<% if (mongo) { %>
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
<% } %>
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
<% if (mongo) { %>@Document(collection = "person")<% } %>
public class Person {

	<% if (mongo) { %>@Id<% } %>
	private String id;

	private String name;
	<% if (mongo) { %>@Indexed(unique = false)<% } %>
	private String surname;

}