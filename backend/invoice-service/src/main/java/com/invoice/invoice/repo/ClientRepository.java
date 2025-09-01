package com.invoice.invoice.repo;

import com.invoice.invoice.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {
    List<ClientEntity> findByUserIdAndArchivedOrderByNameAsc(UUID userId, boolean archived);
    List<ClientEntity> findByUserIdOrderByNameAsc(UUID userId);
}

