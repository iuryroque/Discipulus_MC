package com.os.unirios.entities;

import java.util.HashSet;
import java.util.Set;

import com.os.unirios.event.AuditEventListener;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@EntityListeners(AuditEventListener.class)
@Table(name = "users", uniqueConstraints = {
		@UniqueConstraint(columnNames = "username")
})
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 20)
	private String username;

	@NotBlank
	@Size(max = 120)
	private String password;

	private boolean admin;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_profile", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "profile_id"))
	private Set<Profile> profiles = new HashSet<>();

	public User() {
	}

	public User(String username, String password, boolean admin) {

		this.username = username;
		this.password = password;
		this.admin = admin;
	}

}
