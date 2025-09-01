package com.invoice.mailing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class MailingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MailingServiceApplication.class, args);
    }
}
