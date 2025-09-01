package com.invoice.mailing.db;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReminderRuleRepository extends JpaRepository<ReminderRuleEntity, UUID> {
    List<ReminderRuleEntity> findByClientIdOrClientIdIsNullOrderByDaysAfterDueAsc(UUID clientId);
    List<ReminderRuleEntity> findByOrgIdAndClientIdOrClientIdIsNullOrderByDaysAfterDueAsc(UUID orgId, UUID clientId);
    List<ReminderRuleEntity> findByOrgIdAndClientIdOrderByDaysAfterDueAsc(UUID orgId, UUID clientId);
    List<ReminderRuleEntity> findByOrgIdAndClientIdIsNullOrderByDaysAfterDueAsc(UUID orgId);
    List<ReminderRuleEntity> findByOrgIdIsNullAndClientIdIsNullOrderByDaysAfterDueAsc();
}
