package com.invoice.invoice.repo;

import com.invoice.invoice.entity.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {
    List<InvoiceEntity> findByUserIdOrderByIssueDateDesc(UUID userId);
    List<InvoiceEntity> findByUserIdAndStatusOrderByIssueDateDesc(UUID userId, String status);
    List<InvoiceEntity> findByUserIdAndIssueDateBetween(UUID userId, LocalDate from, LocalDate to);
    boolean existsByNumber(String number);
    java.util.Optional<InvoiceEntity> findByIdAndUserId(UUID id, UUID userId);
}
