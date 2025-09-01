import { __decorate, __param } from "tslib";
import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
export let LandingComponent = class LandingComponent {
    constructor(title, meta, renderer, document, zone, subs) {
        this.title = title;
        this.meta = meta;
        this.renderer = renderer;
        this.document = document;
        this.zone = zone;
        this.subs = subs;
        this.BRAND = 'InvoiceGlide';
        this.DOMAIN = 'invoiceglide.com';
        this.currentYear = new Date().getFullYear();
        this.plans = [];
        this.defaultTilt = 'rotateY(-10deg) rotateX(2deg)';
        this.maxRotate = 10; // degrees
    }
    ngOnInit() {
        // Page title and meta
        const pageTitle = `${this.BRAND} — Invoicing, PDFs, email & reminders`;
        this.title.setTitle(pageTitle);
        this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
        this.meta.updateTag({ name: 'description', content: 'Create and send invoices with branded PDFs, automated reminders, client CRM, multi-currency, and a clean dashboard. Start your 7-day trial.' });
        this.meta.updateTag({ property: 'og:title', content: pageTitle });
        this.meta.updateTag({ property: 'og:description', content: 'Create invoices, export PDF, send by email, and automate reminders, plus multi-currency and KPIs.' });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: `https://${this.DOMAIN}/` });
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'robots', content: 'index,follow' });
        // Canonical link
        const existingCanonical = this.document.querySelector("link[rel='canonical']");
        if (!existingCanonical) {
            const linkEl = this.renderer.createElement('link');
            this.renderer.setAttribute(linkEl, 'rel', 'canonical');
            this.renderer.setAttribute(linkEl, 'href', `https://${this.DOMAIN}/`);
            this.renderer.appendChild(this.document.head, linkEl);
        }
        // Structured data (ld+json)
        const ldJson = {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: this.BRAND,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
            featureList: [
                'Create invoices with line items',
                'PDF export & download',
                'Invoice list & detail views',
                'Clients directory (CRUD)',
                'Dashboard KPIs & chart',
                'Multi-currency with live FX',
                'Invoice template styling & preview',
                'Email sending with templates',
                'Automated reminders & schedules',
            ],
        };
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'type', 'application/ld+json');
        script.text = JSON.stringify(ldJson);
        this.renderer.appendChild(this.document.head, script);
        // Load plans for pricing: order Free -> Basic -> Pro (by price asc)
        this.subs.getPlans().subscribe(p => {
            this.plans = (p || []).slice().sort((a, b) => (a.priceCents || 0) - (b.priceCents || 0));
        });
    }
    onTiltMove(ev) {
        if (!this.tiltCard || !this.tiltScene)
            return;
        if (!(window.matchMedia && window.matchMedia('(pointer: fine)').matches))
            return;
        const rect = this.tiltScene.nativeElement.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width; // 0..1
        const py = (ev.clientY - rect.top) / rect.height; // 0..1
        const rotX = (0.5 - py) * (this.maxRotate * 2); // invert Y for natural tilt
        const rotY = (px - 0.5) * (this.maxRotate * 2);
        const transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0) scale(1.01)`;
        this.scheduleTransform(transform, true);
    }
    onTiltLeave() {
        if (!this.tiltCard)
            return;
        this.scheduleTransform(this.defaultTilt, false);
    }
    scheduleTransform(t, elevateShadow) {
        if (this.raf)
            cancelAnimationFrame(this.raf);
        this.raf = requestAnimationFrame(() => {
            if (!this.tiltCard)
                return;
            const el = this.tiltCard.nativeElement;
            el.style.transform = t;
            el.style.boxShadow = elevateShadow
                ? '0 28px 56px -24px rgba(15,23,42,0.45)'
                : '0 20px 40px -20px rgba(15,23,42,0.35)';
        });
    }
    priceLabel(plan) {
        if (!plan.priceCents || plan.priceCents === 0)
            return '$0';
        const cur = plan.currency || 'USD';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format((plan.priceCents || 0) / 100);
    }
};
__decorate([
    ViewChild('tiltCard', { static: false })
], LandingComponent.prototype, "tiltCard", void 0);
__decorate([
    ViewChild('tiltScene', { static: false })
], LandingComponent.prototype, "tiltScene", void 0);
LandingComponent = __decorate([
    Component({
        selector: 'app-landing',
        templateUrl: './landing.component.html',
        styleUrls: ['./landing.component.css']
    }),
    __param(3, Inject(DOCUMENT))
], LandingComponent);
//# sourceMappingURL=landing.component.js.map