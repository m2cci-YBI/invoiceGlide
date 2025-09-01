package com.invoice.invoice.repo;

import com.invoice.invoice.entity.InvoiceLineEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InvoiceLineRepository extends JpaRepository<InvoiceLineEntity, UUID> {
    List<InvoiceLineEntity> findByInvoiceId(UUID invoiceId);
}

