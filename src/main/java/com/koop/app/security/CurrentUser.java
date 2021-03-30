package com.koop.app.security;

import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CurrentUser implements UserDetails {

    private String firstName;
    private String lastName;
    private Long tenant;

    private final String password;

    private final String username;

    private final Boolean enabled;

    private final Boolean accountNonExpired;

    private final Boolean accountNonLocked;

    private final boolean credentialsNonExpired;

    private final String email;

    private final String displayName;

    private final Collection<? extends GrantedAuthority> authorities;

    public CurrentUser(String username, String password, Collection<? extends GrantedAuthority> authorities, Long tenant) {
        this(username, username, username, password, true, authorities, tenant);
    }

    public CurrentUser(
        String email,
        String displayName,
        String username,
        String password,
        Boolean enabled,
        Collection<? extends GrantedAuthority> authorities,
        Long tenant
    ) {
        this.email = email;
        this.displayName = displayName;
        this.enabled = enabled;
        this.username = username;
        this.password = password;
        this.accountNonExpired = true;
        this.accountNonLocked = true;
        this.credentialsNonExpired = true;
        this.authorities = authorities;
        this.tenant = tenant;
    }

    public CurrentUser(
        String email,
        String displayName,
        String password,
        String username,
        Boolean enabled,
        Boolean accountNonExpired,
        Boolean accountNonLocked,
        boolean credentialsNonExpired,
        Collection<? extends GrantedAuthority> authorities
    ) {
        this.authorities = authorities;
        this.email = email;
        this.displayName = displayName;
        this.password = password;
        this.username = username;
        this.enabled = enabled;
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Long getTenant() {
        return tenant;
    }

    public void setTenant(Long tenant) {
        this.tenant = tenant;
    }
}
