import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
export let MiniLineChartComponent = class MiniLineChartComponent {
    constructor() {
        this.chartData = [];
        this.chartLabels = [];
        this.lineChartData = {
            datasets: [
                {
                    data: [],
                    label: 'Collected',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: 'rgba(75,192,192,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75,192,192,0.8)',
                    fill: 'origin',
                },
            ],
            labels: [],
        };
        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: { display: false },
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
            },
        };
        this.lineChartType = 'line';
    }
    ngOnChanges(changes) {
        if (changes['chartData'] || changes['chartLabels']) {
            this.lineChartData.datasets[0].data = this.chartData;
            this.lineChartData.labels = this.chartLabels;
        }
    }
};
__decorate([
    Input()
], MiniLineChartComponent.prototype, "chartData", void 0);
__decorate([
    Input()
], MiniLineChartComponent.prototype, "chartLabels", void 0);
MiniLineChartComponent = __decorate([
    Component({
        selector: 'app-mini-line-chart',
        templateUrl: './mini-line-chart.component.html',
        styleUrls: ['./mini-line-chart.component.css']
    })
], MiniLineChartComponent);
//# sourceMappingURL=mini-line-chart.component.js.map