#!/usr/bin/env bash
# ia-scripts/fix-cfe-visual-only.sh
# Solo mejoras visuales/CSS sobre la estructura raíz.
# NO toca el .ts, NO toca los atributos del canvas, NO toca Chart.js.
# Los tooltips siguen funcionando igual que en raíz.

set -e

HTML="src/app/views/pages/cfe/cfe-dashboard.component.html"
SCSS="src/app/views/pages/cfe/cfe-dashboard.component.scss"

echo "🎨 Aplicando mejoras visuales (solo HTML + SCSS)..."

# ─── HTML ────────────────────────────────────────────────────────────────────
cat > "$HTML" << 'HTML_EOF'
<div class="container-fluid cfe-dashboard">

  <!-- Filtros -->
  <c-card class="filters-card">
    <c-card-body class="filters-bar">
      <div class="date-field">
        <label for="dt1">Desde</label>
        <input id="dt1" type="date" [(ngModel)]="dt1" />
      </div>
      <div class="date-field">
        <label for="dt2">Hasta</label>
        <input id="dt2" type="date" [(ngModel)]="dt2" />
      </div>
      <span class="date-hint">Histórico por rango</span>
      <span class="date-hint loading" *ngIf="isLoadingContracts">Cargando contratos...</span>
      <span class="date-error" *ngIf="contractsError">{{ contractsError }}</span>
    </c-card-body>
  </c-card>

  <!-- Bimestrales -->
  <c-card class="chart-card">
    <c-card-header class="card-header-row">
      <strong>Recibos bimestrales</strong>
      <c-badge color="info">{{ bimonthlyContracts.length }} contratos</c-badge>
    </c-card-header>
    <c-card-body class="chart-card-body">
      <c-row class="g-2 h-100">

        <c-col lg="8" class="col-canvas">
          <div class="chart-placeholder">
            <canvas #bimonthlyCanvas width="700" height="260"></canvas>
          </div>
        </c-col>

        <c-col lg="4" class="col-selector">
          <div class="selector-panel">
            <div class="selector-header">
              <span class="selector-label">Mostrar en gráfico</span>
              <label class="toggle-all">
                <input type="checkbox"
                       [checked]="allBimonthlyChecked"
                       (change)="toggleAllBimonthly($event)" />
                <span>Todos</span>
              </label>
            </div>
            <div class="chips-grid">
              <label class="chip"
                     *ngFor="let contract of bimonthlyContracts; trackBy: trackByContractId">
                <input type="checkbox"
                       [(ngModel)]="contract.checked"
                       (change)="onCheckboxChange()" />
                <span class="chip-inner">
                  <strong>{{ contract.id }} · {{ contract.street }}</strong>
                  <small>{{ contract.serviceNumber }}</small>
                </span>
              </label>
            </div>
          </div>
        </c-col>

      </c-row>
    </c-card-body>
  </c-card>

  <!-- Mensuales -->
  <c-card class="chart-card">
    <c-card-header class="card-header-row">
      <strong>Recibos mensuales</strong>
      <c-badge color="success">{{ monthlyContracts.length }} contratos</c-badge>
    </c-card-header>
    <c-card-body class="chart-card-body">
      <c-row class="g-2 h-100">

        <c-col lg="8" class="col-canvas">
          <div class="chart-placeholder">
            <canvas #monthlyCanvas width="700" height="260"></canvas>
          </div>
        </c-col>

        <c-col lg="4" class="col-selector">
          <div class="selector-panel selector-panel--monthly">
            <div class="selector-header">
              <span class="selector-label">Mostrar en gráfico</span>
              <label class="toggle-all">
                <input type="checkbox"
                       [checked]="allMonthlyChecked"
                       (change)="toggleAllMonthly($event)" />
                <span>Todos</span>
              </label>
            </div>
            <div class="monthly-list">
              <label class="monthly-row"
                     *ngFor="let contract of monthlyContracts; trackBy: trackByContractId">
                <input type="checkbox"
                       [(ngModel)]="contract.checked"
                       (change)="onCheckboxChange()" />
                <span>
                  <strong>{{ contract.id }} · {{ contract.street }}</strong>
                  <small>{{ contract.serviceNumber }}</small>
                </span>
              </label>
            </div>
          </div>
        </c-col>

      </c-row>
    </c-card-body>
  </c-card>

</div>
HTML_EOF

echo "  ✅ HTML listo"

# ─── SCSS ────────────────────────────────────────────────────────────────────
cat > "$SCSS" << 'SCSS_EOF'
$border: #dfe5ec;
$text-muted: #667085;
$text-dark: #1f2937;
$text-label: #344054;

.cfe-dashboard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  // Todo en viewport, sin scroll de página
  height: calc(100vh - 8.5rem);
  min-height: 600px;
  overflow: hidden;
  padding: 0;

  // ── Filtros ──────────────────────────────────────────────────────────────
  .filters-card { flex: 0 0 auto; }

  .filters-bar {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0.45rem 0.9rem;
  }

  .date-field {
    align-items: center;
    display: flex;
    gap: 0.3rem;

    label {
      color: $text-muted;
      font-size: 0.78rem;
      font-weight: 600;
    }

    input {
      border: 1px solid #d0d5dd;
      border-radius: 6px;
      color: $text-dark;
      font-size: 0.8rem;
      height: 28px;
      padding: 0 0.4rem;
    }
  }

  .date-hint {
    color: $text-muted;
    font-size: 0.75rem;
    &.loading { font-style: italic; }
  }

  .date-error {
    color: #b42318;
    font-size: 0.75rem;
    font-weight: 600;
  }

  // ── Cards: las dos se reparten el espacio disponible ─────────────────────
  .chart-card {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  // coreui card-body ocupa el resto de la card
  .chart-card > .card-body { flex: 1 1 0; min-height: 0; }

  .card-header-row {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    padding: 0.4rem 0.9rem;
  }

  .chart-card-body {
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
    padding: 0.4rem 0.6rem 0.5rem;
  }

  // ── Columna del canvas ────────────────────────────────────────────────────
  .col-canvas {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .chart-placeholder {
    align-items: flex-start;
    background: #f8fafc;
    border: 1px solid $border;
    border-radius: 8px;
    display: flex;
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
    padding: 0.4rem 0.4rem 0;

    // El canvas mantiene sus dimensiones internas — NO se escala con CSS
    // Esto es intencional: evita el desfase de coordenadas en los tooltips
    canvas {
      display: block;
      flex: 0 0 auto;
    }
  }

  // ── Columna del selector ──────────────────────────────────────────────────
  .col-selector {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .selector-panel {
    border: 1px solid $border;
    border-radius: 8px;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding: 0.4rem 0.55rem 0.45rem;
  }

  .selector-header {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }

  .selector-label {
    color: $text-label;
    font-size: 0.76rem;
    font-weight: 700;
  }

  .toggle-all {
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 0.7rem;
    font-weight: 600;
    gap: 0.25rem;
    margin: 0;
  }

  // ── Chips bimestrales: grid 3 col, scroll interno ─────────────────────────
  .chips-grid {
    align-content: start;
    display: grid;
    gap: 3px;
    grid-template-columns: repeat(3, 1fr);
    overflow-y: auto;
    scrollbar-color: #c1cada transparent;
    scrollbar-width: thin;
  }

  .chip {
    align-items: center;
    border: 1px solid #edf0f4;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    gap: 4px;
    margin: 0;
    padding: 3px 5px;

    &:hover { background: #f2f4f7; }

    input[type="checkbox"] {
      flex: 0 0 auto;
      height: 11px;
      margin: 0;
      width: 11px;
    }
  }

  .chip-inner {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
    min-width: 0;

    strong {
      color: $text-dark;
      font-size: 0.64rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: $text-muted;
      font-size: 0.57rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // ── Lista mensuales (3 items, más holgados) ───────────────────────────────
  .selector-panel--monthly { justify-content: flex-start; }

  .monthly-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow-y: auto;
  }

  .monthly-row {
    align-items: center;
    border: 1px solid #edf0f4;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    flex: 0 0 auto;
    gap: 7px;
    margin: 0;
    padding: 6px 9px;

    &:hover { background: #f2f4f7; }

    input[type="checkbox"] {
      flex: 0 0 auto;
      height: 13px;
      margin: 0;
      width: 13px;
    }

    span {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
      min-width: 0;
    }

    strong {
      color: $text-dark;
      font-size: 0.76rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: $text-muted;
      font-size: 0.64rem;
    }
  }
}
SCSS_EOF

echo "  ✅ SCSS listo"
echo ""
echo "✅ Listo — tooltips intactos, layout mejorado."
echo ""
echo "   Qué cambió:"
echo "   • Canvas con width/height exactamente como en raíz (700×260)"
echo "   • CSS NO escala el canvas — cero desfase de coordenadas"
echo "   • Las dos cards se reparten el espacio vertical disponible"
echo "   • Todo cabe en la viewport sin scroll de página"
echo "   • 25 chips en grid 3col con scroll interno fino"
echo "   • Labels Desde/Hasta en filtros"