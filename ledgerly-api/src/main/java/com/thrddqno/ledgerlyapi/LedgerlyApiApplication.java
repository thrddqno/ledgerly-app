package com.thrddqno.ledgerlyapi;

import com.thrddqno.ledgerlyapi.common.config.TokenProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(TokenProperties.class)
public class LedgerlyApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(LedgerlyApiApplication.class, args);
    }

}
