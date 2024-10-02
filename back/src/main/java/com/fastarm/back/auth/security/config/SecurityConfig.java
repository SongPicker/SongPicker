package com.fastarm.back.auth.security.config;

import com.fastarm.back.auth.security.filter.AuthenticationFilter;
import com.fastarm.back.auth.security.filter.AuthorizationFilter;
import com.fastarm.back.auth.security.filter.CustomLogoutFilter;
import com.fastarm.back.auth.security.service.JwtService;
import com.fastarm.back.basedata.repository.BaseDataRepository;
import com.fastarm.back.common.service.RedisService;
import com.fastarm.back.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final BaseDataRepository baseDataRepository;
    private final MemberRepository memberRepository;
    private final RedisService redisService;
    private final JwtService jwtService;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(AuthenticationConfiguration configuration) {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((auth) -> auth.disable());
        http
                .csrf((song) -> song.disable());
        http
                .formLogin((auth) -> auth.disable());
        http
                .httpBasic((auth) -> auth.disable());
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/auths/login", "/members").permitAll()
                        .requestMatchers("/auths/refresh").permitAll()
                        .requestMatchers("/auths/phone/*", "/members/check-nickname", "/members/check-phone", "/members/check-id", "/members/find-id", "/members/find-password").permitAll()
                        .anyRequest().authenticated());

        http
                .addFilterBefore(new CustomLogoutFilter(redisService), LogoutFilter.class);
        http
                .addFilterBefore(new AuthorizationFilter(memberRepository), AuthenticationFilter.class);
        http
                .addFilterAt(new AuthenticationFilter(authenticationManager(authenticationConfiguration), jwtService, baseDataRepository), UsernamePasswordAuthenticationFilter.class);
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
