package com.ecommerce.closetculture.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.ecommerce.closetculture.config.keygenerator.GenerateKeys;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

//----- password Encoder --------------------------------------------------------------------------------------------------------

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

//----- Authentication Manager --------------------------------------------------------------------------------------------------

    @Bean
    public AuthenticationManager authManager(UserDetailsService userDetailsService){

        // AuthenticationProvider checker = new DaoAuthenticationProvider(userDetailsService);
        // ((DaoAuthenticationProvider) checker).setPasswordEncoder(passwordEncoder());
        // return new ProviderManager(checker);

        var checker = new DaoAuthenticationProvider(userDetailsService);
        checker.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(checker);
    }


//----- Encoder & Decoder --------------------------------------------------------------------------------------------------------
    @Autowired
    GenerateKeys generateKey;

    @Bean
    public JWKSource<SecurityContext> jwkSet(RSAKey rsaKey){

        return new ImmutableJWKSet<>(new JWKSet(rsaKey));
    }

    @Bean
    public JwtEncoder jwtEncoder(JWKSource<SecurityContext> keySet){

        return new NimbusJwtEncoder(keySet);
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        return NimbusJwtDecoder.withPublicKey(generateKey.rsaPublicKey).build(); 
    }

//----- Config for CORS using WebMvcConfig interface -----------------------------------------------------------------------------

    @Bean
    public WebMvcConfigurer corsConfig(){

        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry){
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000","https://closetculture.netlify.app")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .maxAge(3600);
            }
        };
    }

//----- Security Config -----------------------------------------------------------------------------------------------------------
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/swagger-ui/**", "/v3/api-docs/**",
                        "/auth/**", "/account/register", "/account/forget-password",
                        "/collection/view-all", "/collection/get-coll-img/**","/collection/pagination","/collection/filter-pagination",
                        "/product/view-all",
                        "/uploads/**").permitAll()

                .requestMatchers("/account/view-by-id/{accId}",
                "/collection/view-by-prdId/**","/collection/view-by-collId/**","/collection/filter-pagination-prod/**",
                 "/stock/view-all","/stock/view-by-collId/**", "/stock/get-stock-img/**","/stock/view-by-stkId/**").hasAnyAuthority("SCOPE_USER","SCOPE_ADMIN")

                .requestMatchers("/product/**", "/collection/**", "/stock/**", 
                "/account/view-all","/account/delete-by-id/{accId}"
                ).hasAuthority("SCOPE_ADMIN")

                .anyRequest().authenticated())

                .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))

                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .cors(Customizer.withDefaults());

        return http.build();
    }
}