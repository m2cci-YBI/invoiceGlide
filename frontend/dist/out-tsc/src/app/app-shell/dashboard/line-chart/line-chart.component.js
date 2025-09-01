import { __decorate } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
export let LineChartComponent = class LineChartComponent {
    constructor() {
        this.chartData = []; // Changed to any[] to accept Chart.js dataset format
        this.chartLabels = [];
        this.ctx = null;
    }
    ngOnChanges() {
        if (this.chart) {
            this.chart.data.labels = this.chartLabels;
            this.chart.data.datasets = this.chartData.map(dataset => this.mapDataset(dataset));
            this.chart.update();
        }
    }
    ngAfterViewInit() {
        this.createChart();
    }
    createChart() {
        this.ctx = this.chartCanvas.nativeElement.getContext('2d');
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: this.chartData.map(dataset => this.mapDataset(dataset)),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        intersect: false,
                        callbacks: {
                            label: (ctx) => {
                                const label = ctx.dataset.label ? ctx.dataset.label + ': ' : '';
                                return label + (ctx.parsed.y ?? '');
                            }
                        }
                    },
                },
                scales: {
                    x: {
                        display: true,
                        grid: { display: false },
                        ticks: { color: '#6B7280' }
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        grid: { color: '#E5E7EB' },
                        ticks: { color: '#6B7280' }
                    },
                },
                interaction: { mode: 'index', intersect: false },
            },
        });
    }
    mapDataset(dataset) {
        const baseColor = dataset.borderColor || '#0f172a';
        const ctx = this.ctx;
        let bg = baseColor;
        if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, 0, this.chartCanvas.nativeElement.height);
            gradient.addColorStop(0, this.hexToRgba(baseColor, 0.25));
            gradient.addColorStop(1, this.hexToRgba(baseColor, 0));
            bg = gradient;
        }
        return {
            ...dataset,
            borderColor: baseColor,
            backgroundColor: bg,
            fill: true,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: baseColor,
            tension: 0.4,
        };
    }
    hexToRgba(hex, alpha) {
        // Accepts #RGB, #RRGGBB or already rgba/hsla strings
        if (!hex.startsWith('#'))
            return hex;
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
};
__decorate([
    Input()
], LineChartComponent.prototype, "chartData", void 0);
__decorate([
    Input()
], LineChartComponent.prototype, "chartLabels", void 0);
__decorate([
    ViewChild('chartCanvas')
], LineChartComponent.prototype, "chartCanvas", void 0);
LineChartComponent = __decorate([
    Component({
        selector: 'app-line-chart',
        templateUrl: './line-chart.component.html',
        styleUrls: ['./line-chart.component.css']
    })
], LineChartComponent);
//# sourceMappingURL=line-chart.component.js.map