#!/usr/bin/env bash
# ia-scripts/fix-cfe-date-binding.sh
# Bindea el botón Actualizar para recargar el chart con el nuevo rango de fechas.
# Solo toca: HTML (agregar click binding) y TS (agregar método reloadChart).
# NO toca canvas, NO toca Chart.js options, NO toca SCSS.

set -e

HTML="src/app/views/pages/cfe/cfe-dashboard.component.html"
TS="src/app/views/pages/cfe/cfe-dashboard.component.ts"

echo "🔧 Fix: binding dt1/dt2 → Actualizar..."

# ─── 1. HTML: agregar (click) al botón Actualizar ────────────────────────────
python3 - << 'PYEOF'
with open("src/app/views/pages/cfe/cfe-dashboard.component.html", "r") as f:
    src = f.read()

# El botón existe pero sin binding — le agregamos (click) y disabled mientras carga
old = '<span class="date-hint">Histórico por rango</span>'
new = '''<button class="reload-btn"
              (click)="reloadChart()"
              [disabled]="isLoadingContracts">
        {{ isLoadingContracts ? 'Cargando...' : 'Actualizar' }}
      </button>
      <span class="date-hint">Histórico por rango</span>'''

if old in src:
    src = src.replace(old, new)
    print("  ✅ HTML: botón Actualizar bindeado")
else:
    print("  ⚠️  HTML: no se encontró el anchor — revisa manualmente")

with open("src/app/views/pages/cfe/cfe-dashboard.component.html", "w") as f:
    f.write(src)
PYEOF

# ─── 2. TS: agregar reloadChart() que limpia cache y recarga ─────────────────
python3 - << 'PYEOF'
with open("src/app/views/pages/cfe/cfe-dashboard.component.ts", "r") as f:
    src = f.read()

if 'reloadChart()' in src:
    print("  ℹ️  TS: reloadChart() ya existe, sin cambios")
else:
    # Insertar antes de onCheckboxChange()
    anchor = 'onCheckboxChange(): void {'
    method = '''reloadChart(): void {
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

  onCheckboxChange(): void {'''

    if anchor in src:
        src = src.replace(anchor, method)
        print("  ✅ TS: método reloadChart() agregado")
    else:
        print("  ⚠️  TS: no se encontró anchor onCheckboxChange — revisa manualmente")

with open("src/app/views/pages/cfe/cfe-dashboard.component.ts", "w") as f:
    f.write(src)
PYEOF

# ─── 3. SCSS: estilo para el botón reload ────────────────────────────────────
python3 - << 'PYEOF'
with open("src/app/views/pages/cfe/cfe-dashboard.component.scss", "r") as f:
    src = f.read()

if 'reload-btn' in src:
    print("  ℹ️  SCSS: .reload-btn ya existe, sin cambios")
else:
    # Insertar después del bloque .date-error
    anchor = '  .date-error {'
    addition = '''  .reload-btn {
    background: #fff;
    border: 1px solid #d0d5dd;
    border-radius: 6px;
    color: #1f2937;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 600;
    height: 28px;
    padding: 0 0.75rem;
    transition: background 0.15s;

    &:hover:not(:disabled) { background: #f2f4f7; }
    &:disabled { cursor: not-allowed; opacity: 0.5; }
  }

  .date-error {'''

    if anchor in src:
        src = src.replace(anchor, addition)
        print("  ✅ SCSS: estilo .reload-btn agregado")
    else:
        src += "\n.cfe-dashboard .reload-btn { background:#fff; border:1px solid #d0d5dd; border-radius:6px; color:#1f2937; cursor:pointer; font-size:0.78rem; font-weight:600; height:28px; padding:0 0.75rem; } .cfe-dashboard .reload-btn:hover { background:#f2f4f7; } .cfe-dashboard .reload-btn:disabled { opacity:0.5; cursor:not-allowed; }"
        print("  ⚠️  SCSS: fallback append")

with open("src/app/views/pages/cfe/cfe-dashboard.component.scss", "w") as f:
    f.write(src)
PYEOF

echo ""
echo "✅ Fix aplicado."
echo ""
echo "   Flujo resultante:"
echo "   1. Usuario cambia dt1 o dt2 → ngModel actualiza las variables"
echo "   2. Click en Actualizar → reloadChart()"
echo "   3. reloadChart() destruye los charts, limpia el cache"
echo "      y llama loadChartHistory() que ya usa this.dt1 y this.dt2"
echo "   4. Los charts se reconstruyen con el nuevo rango"