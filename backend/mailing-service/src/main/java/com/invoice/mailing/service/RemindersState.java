package com.invoice.mailing.service;

import com.invoice.mailing.api.RemindersController.ReminderRule;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RemindersState {
    private volatile List<ReminderRule> rules;
    public List<ReminderRule> getRules() { return rules; }
    public void setRules(List<ReminderRule> rules) { this.rules = rules; }
}

