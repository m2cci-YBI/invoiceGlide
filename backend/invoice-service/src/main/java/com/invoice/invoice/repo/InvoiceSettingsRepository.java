package com.invoice.invoice.repo;

import com.invoice.invoice.entity.InvoiceSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InvoiceSettingsRepository extends JpaRepository<InvoiceSettingsEntity, UUID> {
    Optional<InvoiceSettingsEntity> findByUserId(UUID userId);
}

