import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CfeService } from '../../../_services/cfe.service';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';


interface CfeContractApi {
  contractId: number;
  street: string;
  receiptDate: string;
  receiptMonths: string;
  serviceNumber: string;
  billingPeriodType: number
}

interface CfeContractOption {
  id: number;
  street: string;
  serviceNumber: string;
  checked: boolean;
}
interface ChartDatasetCache {
  labels: string[];
  datasets: any[];
}

Chart.register(...registerables);

@Component({
  selector: 'app-cfe-dashboard',
  templateUrl: './cfe-dashboard.component.html',
  styleUrls: ['./cfe-dashboard.component.scss'],
})


export class CfeDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  // 2. Agrega las dos banderas
  private viewReady = false;


  activeTab = 0;
  metric: 'kwh' | 'pesos' = 'kwh';
  dt1 = '2024-05-11';
  dt2 = '2026-05-11';

  isLoadingContracts = false;
  contractsError = '';
  bimonthlyContracts: CfeContractOption[] = [];
  monthlyContracts: CfeContractOption[] = [];

  // Agrega en la clase:
  @ViewChild('bimonthlyCanvas') bimonthlyCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyCanvas') monthlyCanvas!: ElementRef<HTMLCanvasElement>;

  private bimonthlyChart?: Chart;
  private monthlyChart?: Chart;
  private destroy$ = new Subject<void>();
  private checkboxChange$ = new Subject<void>();

  // Almacena la data cruda agrupada por contractId
  private historyData: Record<number, any[]> = {};

  private bimonthlyCache: ChartDatasetCache = {
    labels: [],
    datasets: []
  };

  private monthlyCache: ChartDatasetCache = {
    labels: [],
    datasets: []
  };

  // Paleta de colores (25 colores para bimestrales, 3 para mensuales)
  private readonly COLORS = [
    '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
    '#166a8f', '#00a950', '#58595b', '#8549ba', '#e6194b',
    '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4',
    '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990',
    '#dcbeff', '#9a6324', '#800000', '#aaffc3', '#808000',
  ];

  constructor(private cfeService: CfeService) { }

  ngOnInit(): void {
    this.loadContracts();

    this.checkboxChange$.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.buildBimonthlyChart();
      this.buildMonthlyChart();
    });
  }

  // 3. Agrega este método
  ngAfterViewInit(): void {
    this.viewReady = true;
  }

  setTab(index: number) {
    this.activeTab = index;
  }

  trackByContractId(index: number, contract: CfeContractOption): number {
    return contract.id;
  }

  get allBimonthlyChecked(): boolean {
    return this.bimonthlyContracts.every(c => c.checked);
  }

  get allMonthlyChecked(): boolean {
    return this.monthlyContracts.every(c => c.checked);
  }

  private loadContracts(): void {
    this.isLoadingContracts = true;
    this.contractsError = '';

    this.cfeService.listContracts(50, 1, false).subscribe({
      next: response => {
        const items: CfeContractApi[] = response?.data?.items ?? [];
        const ordered = [...items].sort((a, b) => a.contractId - b.contractId);
        const bimonthly = ordered.filter(contract => !this.isMonthlyContract(contract));
        const monthly = ordered.filter(contract => this.isMonthlyContract(contract));

        this.bimonthlyContracts = bimonthly.map(contract =>
          this.toOption(contract, true)
        );

        this.monthlyContracts = monthly.map(contract =>
          this.toOption(contract, true)
        );

        this.loadChartHistory();
      },
      error: error => {
        console.error('Error cargando contratos CFE para dashboard:', error);
        this.contractsError = 'No se pudieron cargar los contratos CFE.';
        this.bimonthlyContracts = [];
        this.monthlyContracts = [];
      },
      complete: () => {
        this.isLoadingContracts = false;
      }
    });
  }

  private isMonthlyContract(contract: CfeContractApi): boolean {
    return contract.billingPeriodType === 2;
  }

  private toOption(contract: CfeContractApi, checked: boolean): CfeContractOption {
    return {
      id: contract.contractId,
      street: contract.street,
      serviceNumber: contract.serviceNumber,
      checked
    };
  }

  //#region  test new cosas
  loadChartHistory(): void {
    const allContracts = [...this.bimonthlyContracts, ...this.monthlyContracts];
    const ids = allContracts.map(c => c.id);
    console.log('>>> ids a enviar:', ids);         // ← esto sí
    console.log('>>> rango:', this.dt1, this.dt2);
    this.cfeService.getChartHistory(ids, this.dt1, this.dt2).subscribe({
      next: response => {
        console.log('>>> respuesta chartHistory:', response); // ← y esto
        if (response?.success) {
          this.historyData = response.data;
          this.preprocessChartData();
          // Solo dibuja si el canvas ya existe
          if (this.viewReady) {

            console.log('BUILDING CHARTS');

            this.buildMonthlyChart();
            this.buildBimonthlyChart();
          }
        }
      },
      error: err => console.error('Error cargando historial:', err)
    });
  }

  private preprocessChartData(): void {

    this.bimonthlyCache = this.buildCache(this.bimonthlyContracts);

    this.monthlyCache = this.buildCache(this.monthlyContracts);
  }

  private buildCache(contracts: CfeContractOption[]): ChartDatasetCache {

    const labelSet = new Set<string>();

    contracts.forEach(c => {
      (this.historyData[c.id] ?? []).forEach(row => {
        labelSet.add(
          `${row.periodYear}-${String(row.periodMonth).padStart(2, '0')}`
        );
      });
    });

    const labels = Array.from(labelSet).sort();

    const datasets = contracts.map((c, i) => {

      const rows = this.historyData[c.id] ?? [];

      const dataMap = Object.fromEntries(
        rows.map(r => [
          `${r.periodYear}-${String(r.periodMonth).padStart(2, '0')}`,
          this.metric === 'kwh' ? r.consumptionKwh : r.totalAmount
        ])
      );

      return {
        contractId: c.id,
        label: `${c.id} · ${c.street}`,
        data: labels.map(lbl => dataMap[lbl] ?? null),
        borderColor: this.COLORS[i % this.COLORS.length],
        backgroundColor: 'transparent',
        tension: 0.3,
        spanGaps: true,
      };
    });

    return {
      labels,
      datasets
    };
  }
  // private getLabels(contracts: CfeContractOption[]): string[] {
  //   const labelSet = new Set<string>();
  //   contracts.forEach(c => {
  //     (this.historyData[c.id] ?? []).forEach(row => {
  //       labelSet.add(`${row.periodYear}-${String(row.periodMonth).padStart(2, '0')}`);
  //     });
  //   });
  //   return Array.from(labelSet).sort();
  // }

  // private toDatasets(contracts: CfeContractOption[], labels: string[]): any[] {
  //   return contracts
  //     .filter(c => c.checked)
  //     .map((c, i) => {
  //       const rows = this.historyData[c.id] ?? [];
  //       const dataMap = Object.fromEntries(
  //         rows.map(r => [`${r.periodYear}-${String(r.periodMonth).padStart(2, '0')}`, r.consumptionKwh])
  //       );
  //       return {
  //         label: `${c.id} · ${c.street}`,
  //         data: labels.map(lbl => dataMap[lbl] ?? null),
  //         borderColor: this.COLORS[i % this.COLORS.length],
  //         backgroundColor: 'transparent',
  //         tension: 0.3,
  //         spanGaps: true,
  //       };
  //     });
  // }

  private buildBimonthlyChart(): void {

    const labels = this.bimonthlyCache.labels;

    const datasets = this.bimonthlyCache.datasets
      .filter(ds => {
        const contract = this.bimonthlyContracts.find(c => c.id === ds.contractId);
        return contract?.checked;
      })
      .map(ds => ({
        ...ds,
        borderWidth: 1.5,
        pointRadius: 0,

        pointHoverRadius: 4,

        tension: 0.25,
      }));

    if (this.bimonthlyChart) {
      this.bimonthlyChart.destroy();
    }

    const canvas = this.bimonthlyCanvas.nativeElement;
    canvas.width = 700;
    canvas.height = 260;

    this.bimonthlyChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: false,
        animation: false,
        maintainAspectRatio: false,
        devicePixelRatio: window.devicePixelRatio || 1,
        interaction: {
          mode: 'nearest',
          intersect: false
        },

        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        },

        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 12
            }
          },

          y: {
            min: 0,
            max: this.metric === 'kwh' ? 700 : 1500,

            title: {
              display: true,
              text: this.metric === 'kwh' ? 'kWh' : '$ MXN'
            }
          }
        },

        elements: {
          line: {
            borderJoinStyle: 'round'
          }
        }
      }
    });
  }

  private buildMonthlyChart(): void {

    const labels = this.monthlyCache.labels;

    const datasets = this.monthlyCache.datasets
      .filter(ds => {
        const contract = this.monthlyContracts.find(c => c.id === ds.contractId);
        return contract?.checked;
      })
      .map(ds => ({
        ...ds,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
      }));

    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    const canvas = this.monthlyCanvas.nativeElement;
    canvas.width = 700;
    canvas.height = 260;

    this.monthlyChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: false,
        animation: false,
        maintainAspectRatio: false,
        devicePixelRatio: window.devicePixelRatio || 1,

        plugins: {
          legend: {
            position: 'bottom'
          }
        },

        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            title: {
              display: true,
              text: this.metric === 'kwh' ? 'kWh' : '$ MXN'
            }
          }
        }
      }
    });
  }

  reloadChart(): void {
    // Destruir charts actuales para que se re-dibujen con datos frescos
    this.bimonthlyChart?.destroy();
    this.monthlyChart?.destroy();
    this.bimonthlyChart = undefined;
    this.monthlyChart = undefined;
    // Limpiar cache
    this.bimonthlyCache = { labels: [], datasets: [] };
    this.monthlyCache = { labels: [], datasets: [] };
    // Recargar datos con el nuevo rango dt1/dt2
    this.loadChartHistory();
  }

  setMetric(m: 'kwh' | 'pesos'): void {
    if (this.metric === m) return;
    this.metric = m;
    this.preprocessChartData();   // reconstruye datasets con el campo correcto
    this.buildBimonthlyChart();
    this.buildMonthlyChart();
  }

  onCheckboxChange(): void {
    this.checkboxChange$.next();
  }

  toggleAllBimonthly(event: Event): void {

    const checked = (event.target as HTMLInputElement).checked;

    this.bimonthlyContracts.forEach(c => {
      c.checked = checked;
    });

    this.buildBimonthlyChart();
  }

  toggleAllMonthly(event: Event): void {

    const checked = (event.target as HTMLInputElement).checked;

    this.monthlyContracts.forEach(c => {
      c.checked = checked;
    });

    this.buildMonthlyChart();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.bimonthlyChart?.destroy();
    this.monthlyChart?.destroy();
  }
  //#endregion
}
