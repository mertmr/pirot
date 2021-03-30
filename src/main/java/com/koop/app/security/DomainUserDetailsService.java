package com.koop.app.security;

import com.koop.app.domain.User;
import com.koop.app.repository.UserRepository;
import com.koop.app.repository.tenancy.UserSystemWideAuthRepository;
import com.koop.app.service.UserService;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    private final UserRepository userRepository;

    private final UserSystemWideAuthRepository userSystemWideAuthRepository;

    private final UserService userService;

    public DomainUserDetailsService(
        UserRepository userRepository,
        UserSystemWideAuthRepository userSystemWideAuthRepository,
        UserService userService
    ) {
        this.userRepository = userRepository;
        this.userSystemWideAuthRepository = userSystemWideAuthRepository;
        this.userService = userService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("Authenticating {}", login);

        if (new EmailValidator().isValid(login, null)) {
            return userSystemWideAuthRepository
                .findOneWithAuthoritiesByEmailIgnoreCase(login)
                .map(user -> createSpringSecurityUser(login, user))
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + login + " was not found in the database"));
        }

        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);
        return userSystemWideAuthRepository
            .findOneWithAuthoritiesByLogin(lowercaseLogin)
            .map(user -> createSpringSecurityUser(lowercaseLogin, user))
            .orElseThrow(() -> new UsernameNotFoundException("User " + lowercaseLogin + " was not found in the database"));
    }

    private CurrentUser createSpringSecurityUser(String lowercaseLogin, User user) {
        if (!user.isActivated()) {
            throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
        }
        List<GrantedAuthority> grantedAuthorities = user
            .getAuthorities()
            .stream()
            .map(authority -> new SimpleGrantedAuthority(authority.getName()))
            .collect(Collectors.toList());

        CurrentUser currentUser = new CurrentUser(
            user.getLogin(),
            user.getFirstName(),
            user.getPassword(),
            user.getLogin(),
            true,
            true,
            true,
            true,
            grantedAuthorities
        );
        currentUser.setTenant(user.getTenantId());
        return currentUser;
    }
}
