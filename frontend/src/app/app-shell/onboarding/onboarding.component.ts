import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/toast.service';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaLink: string;
  previewLabel: string;
  tips: string[];
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
  slides: OnboardingSlide[] = [
    {
      title: 'Brand & defaults',
      subtitle: 'Step 1',
      description: 'Add your company profile, currency, numbering, and email templates so drafts are pre‑filled correctly.',
      ctaLabel: 'Open Invoice Settings',
      ctaLink: '/settings/invoice-settings',
      previewLabel: 'Invoice template preview',
      tips: [
        'Upload logo and legal name',
        'Choose default currency and date format',
        'Set invoice numbering (prefix + counter)'
      ]
    },
    {
      title: 'Add clients',
      subtitle: 'Step 2',
      description: 'Create client records with name, billing emails, currency, and contact details.',
      ctaLabel: 'Go to Clients',
      ctaLink: '/clients',
      previewLabel: 'Clients list snapshot',
      tips: [
        'Add key clients you bill often',
        'Set client currency for accurate invoices',
        'Optionally add tax IDs and addresses'
      ]
    },
    {
      title: 'Create and send invoice',
      subtitle: 'Step 3',
      description: 'Select a client, add line items (qty, price), choose applicable taxes/discounts, generate PDF, and send by email.',
      ctaLabel: 'Create New Invoice',
      ctaLink: '/new-invoice',
      previewLabel: 'Invoice detail + PDF',
      tips: [
        'Pick client → set issue & due dates',
        'Add items → set tax rate globally',
        'Preview → download or email the PDF'
      ]
    },
    {
      title: 'Track KPIs & reminders',
      subtitle: 'Step 4',
      description: 'See collections over time, status breakdowns, and let reminders chase unpaid invoices automatically.',
      ctaLabel: 'Open Dashboard',
      ctaLink: '/dashboard',
      previewLabel: 'Dashboard KPIs + chart',
      tips: [
        'Monitor open, overdue, and collected',
        'Top clients by exposure',
        'Enable email reminders to reduce churn'
      ]
    }
  ];

  activeIndex = 0;

  get isFirst() { return this.activeIndex === 0; }
  get isLast() { return this.activeIndex === this.slides.length - 1; }

  goTo(index: number) {
    if (index >= 0 && index < this.slides.length) {
      this.activeIndex = index;
    }
  }

  next() {
    if (!this.isLast) this.activeIndex += 1;
  }

  prev() {
    if (!this.isFirst) this.activeIndex -= 1;
  }

  constructor(private router: Router, private toast: ToastService) {}

  get progressPct() {
    return ((this.activeIndex + 1) / this.slides.length) * 100;
  }

  skip() {
    this.router.navigateByUrl('/dashboard');
  }

  startTrial() {
    this.toast.success('14‑day Pro trial started');
    this.router.navigateByUrl('/settings/subscription');
  }

  upgrade() {
    this.router.navigateByUrl('/settings/subscription');
  }
}
