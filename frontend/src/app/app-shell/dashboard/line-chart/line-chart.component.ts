import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges, AfterViewInit {
  @Input() chartData: any[] = []; // Changed to any[] to accept Chart.js dataset format
  @Input() chartLabels: string[] = [];

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;
  private ctx: CanvasRenderingContext2D | null = null;

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.data.labels = this.chartLabels;
      this.chart.data.datasets = this.chartData.map(dataset => this.mapDataset(dataset));
      this.chart.update();
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart(): void {
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
              label: (ctx: any) => {
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

  private mapDataset(dataset: any) {
    const baseColor = dataset.borderColor || '#0f172a';
    const ctx = this.ctx;
    let bg = baseColor;
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.chartCanvas.nativeElement.height);
      gradient.addColorStop(0, this.hexToRgba(baseColor, 0.25));
      gradient.addColorStop(1, this.hexToRgba(baseColor, 0));
      bg = gradient as unknown as string;
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

  private hexToRgba(hex: string, alpha: number) {
    // Accepts #RGB, #RRGGBB or already rgba/hsla strings
    if (!hex.startsWith('#')) return hex;
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
