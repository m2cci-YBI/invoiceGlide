package com.invoice.admin.service;

import com.invoice.admin.entity.PlanEntity;
import com.invoice.admin.repo.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {
    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<PlanEntity> listActive() {
        return planRepository.findAll();
    }

    public PlanEntity save(PlanEntity plan) { return planRepository.save(plan); }

    public Optional<PlanEntity> findByCode(String code) { return planRepository.findByCode(code); }
}

