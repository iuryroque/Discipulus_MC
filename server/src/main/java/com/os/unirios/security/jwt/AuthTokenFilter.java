package com.os.unirios.security.jwt;

import java.io.IOException;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.os.unirios.entities.Permission;
import com.os.unirios.entities.Profile;
import com.os.unirios.entities.User;
import com.os.unirios.repositories.UserRepository;
import com.os.unirios.security.exceptions.UnAuthenticated;
import com.os.unirios.security.exceptions.UnAuthorized;
import com.os.unirios.security.services.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Autowired
	private UserRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String requestURI = request.getRequestURI();

		// Lista de URIs públicas que não precisam de autenticação
		String[] urisPublics = { 
			"/api/auth/", 
			"/api/test/",
			"/v3/api-docs",
			"/swagger-ui/",
			"/swagger-ui.html", 
			"/redoc", 
			"/redoc/", 
			"/culto-recorrente/"
		};
		
		// Verifica se a URI atual é pública
		for (String uri : urisPublics) {
			if (requestURI.startsWith(uri)) {
				// Para endpoints públicos, passa direto sem verificar JWT
				filterChain.doFilter(request, response);
				return;
			}
		}

		// Para endpoints que não são públicos, verifica o token JWT
		String jwt = parseJwt(request);
		
		if (jwt == null || !jwtUtils.validateJwtToken(jwt)) {
			throw new UnAuthenticated("Invalid or missing JWT token.");
		}

		String username = jwtUtils.getUserNameFromJwtToken(jwt);

		UserDetails userDetails = userDetailsService.loadUserByUsername(username);
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
				userDetails, null, null);
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);

		User user = userRepository.findByUsername(username).orElseThrow(() -> new UnAuthenticated("Invalid or missing JWT token for User."));

		if (!user.isAdmin()) {
			if (!hasAccess(user.getProfiles(), requestURI, request.getMethod())) {
				throw new UnAuthorized("User does not have access to the resource.");
			}
		}
		// Permite o acesso
		filterChain.doFilter(request, response);
	}

	private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");

		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7, headerAuth.length());
		}

		return null;
	}

	private boolean hasAccess(Set<Profile> profiles, String uri, String httpMethod) {
		for (Profile profile : profiles) {
			for (Permission permission : profile.getPermissions()) {
				// Verifica se a URI da permissão é compatível
				if (uri.startsWith(permission.getResource().getPath())) {
					// Verifica o método HTTP com base no atributo correspondente
					switch (httpMethod.toUpperCase()) {
						case "GET":
							if (permission.isCanGet()) {
								return true;
							}
							break;
						case "POST":
							if (permission.isCanPost()) {
								return true;
							}
							break;
						case "PUT":
							if (permission.isCanPut()) {
								return true;
							}
							break;
						case "DELETE":
							if (permission.isCanDelete()) {
								return true;
							}
							break;
						default:
							// Caso um método HTTP inválido seja passado
							throw new IllegalArgumentException("Método HTTP não suportado: " + httpMethod);
					}
				}
			}
		}
		return false;
	}
}
