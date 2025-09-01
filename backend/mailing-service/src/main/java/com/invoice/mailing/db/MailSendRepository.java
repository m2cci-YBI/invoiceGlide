package com.invoice.mailing.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;

public interface MailSendRepository extends JpaRepository<MailSendEntity, java.util.UUID> {
    @Query("select count(m) from MailSendEntity m where m.templateType = 'REMINDER' and m.status = 'SENT' and m.createdAt >= :since")
    long countRemindersSentSince(@Param("since") OffsetDateTime since);

    @Query("select count(m) from MailSendEntity m where m.templateType = 'REMINDER' and m.status = 'SENT' and m.createdAt >= :since and m.invoiceId in :invoiceIds")
    long countRemindersSentSinceForInvoices(@Param("since") OffsetDateTime since, @Param("invoiceIds") java.util.List<java.util.UUID> invoiceIds);

    @Query("select count(m) from MailSendEntity m where m.invoiceId = :invoiceId and m.templateType = 'REMINDER' and m.eventDate = :eventDate and m.status = 'SENT'")
    long countReminderSentFor(@Param("invoiceId") java.util.UUID invoiceId, @Param("eventDate") java.time.LocalDate eventDate);

    java.util.List<MailSendEntity> findTop50ByInvoiceIdOrderByCreatedAtDesc(java.util.UUID invoiceId);

    java.util.List<MailSendEntity> findTop50ByOrderByCreatedAtDesc();
}
