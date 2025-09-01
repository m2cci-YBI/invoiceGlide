package com.invoice.mailing.db;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MailTemplateRepository extends JpaRepository<MailTemplateEntity, String> {
}

