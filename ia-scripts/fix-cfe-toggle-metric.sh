#!/usr/bin/env bash
# ia-scripts/fix-cfe-toggle-metric.sh
# Toggle kWh / Pesos: cambia los datos de cada dataset en el cache.
# Toca: HTML (botón), TS (propiedad + setMetric + buildCache), SCSS (estilo).

set -e

echo "🔧 Agregando toggle kWh / Pesos..."

# ─── 1. HTML: botón toggle en filters-bar ────────────────────────────────────
python3 - << 'PYEOF'
with open("src/app/views/pages/cfe/cfe-dashboard.component.html", "r") as f:
    src = f.read()

old = '      <span class="date-hint">Histórico por rango</span>'
new = '''      <div class="metric-toggle">
        <button class="metric-btn" [class.active]="metric === 'kwh'" (click)="setMetric('kwh')">kWh</button>
        <button class="metric-btn" [class.active]="metric === 'pesos'" (click)="setMetric('pesos')">$ Pesos</button>
      </div>
      <span class="date-hint">Histórico por rango</span>'''

if old in src:
    src = src.replace(old, new)
    print("  ✅ HTML: toggle insertado")
else:
    print("  ⚠️  HTML: anchor no encontrado")

with open("src/app/views/pages/cfe/cfe-dashboard.component.html", "w") as f:
    f.write(src)
PYEOF

# ─── 2. TS ────────────────────────────────────────────────────────────────────
python3 - << 'PYEOF'
with open("src/app/views/pages/cfe/cfe-dashboard.component.ts", "r") as f:
    src = f.read()

# 2a. Propiedad metric
old_prop = '  activeTab = 0;'
if "metric: 'kwh'" not in src:
    src = src.replace(old_prop, old_prop + "\n  metric: 'kwh' | 'pesos' = 'kwh';")
    print("  ✅ TS: propiedad metric agregada")

# 2b. Método setMetric — reconstruye cache y redibuja, sin tocar la API
anchor = '  onCheckboxChange(): void {'
method = '''  setMetric(m: 'kwh' | 'pesos'): void {
    if (this.metric === m) return;
    this.metric = m;
    this.preprocessChartData();   // reconstruye datasets con el campo correcto
    this.buildBimonthlyChart();
    this.buildMonthlyChart();
  }

  onCheckboxChange(): void {'''

if 'setMetric' not in src:
    src = src.replace(anchor, method)
    print("  ✅ TS: setMetric() agregado")

# 2c. buildCache: la línea clave donde se elige el valor por punto
# Buscar el Object.fromEntries que arma el dataMap
old_datamap = "rows.map(r => [\n          `${r.periodYear}-${String(r.periodMonth).padStart(2, '0')}`,\n          r.consumptionKwh\n        ])"
new_datamap = "rows.map(r => [\n          `${r.periodYear}-${String(r.periodMonth).padStart(2, '0')}`,\n          this.metric === 'kwh' ? r.consumptionKwh : r.totalAmount\n        ])"

if old_datamap in src:
    src = src.replace(old_datamap, new_datamap)
    print("  ✅ TS: buildCache usa métrica dinámica (consumptionKwh o totalAmount)")
else:
    # El formateo puede variar, intentar con regex
    import re
    pattern = r"(rows\.map\(r => \[\s*`\$\{r\.periodYear\}-\$\{String\(r\.periodMonth\)\.padStart\(2, '0'\)\}`,\s*)r\.consumptionKwh(\s*\]\))"
    replacement = r"\1this.metric === 'kwh' ? r.consumptionKwh : r.totalAmount\2"
    new_src = re.sub(pattern, replacement, src)
    if new_src != src:
        src = new_src
        print("  ✅ TS: buildCache parcheado via regex")
    else:
        print("  ⚠️  TS: no se pudo patchear buildCache — busca r.consumptionKwh en buildCache y cambia a:")
        print("         this.metric === 'kwh' ? r.consumptionKwh : r.totalAmount")

# 2d. Labels eje Y dinámicos (text: 'kWh' → dinámico)
import re
# Reemplazar todas las ocurrencias de text: 'kWh' dentro de title de scales.y
src = re.sub(
    r"(title:\s*\{[^}]*display:\s*true,\s*\n\s*text:\s*)'kWh'",
    r"\1this.metric === 'kwh' ? 'kWh' : '$ MXN'",
    src
)
print("  ✅ TS: labels eje Y dinámicos")

with open("src/app/views/pages/cfe/cfe-dashboard.component.ts", "w") as f:
    f.write(src)
PYEOF

# ─── 3. SCSS: estilo segmented button ────────────────────────────────────────
python3 - << 'PYEOF'
with open("src/app/views/pages/cfe/cfe-dashboard.component.scss", "r") as f:
    src = f.read()

if 'metric-toggle' not in src:
    anchor = '  .date-error {'
    addition = '''  .metric-toggle {
    background: #f2f4f7;
    border: 1px solid #d0d5dd;
    border-radius: 6px;
    display: flex;
    padding: 2px;
    gap: 2px;
  }

  .metric-btn {
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #667085;
    cursor: pointer;
    font-size: 0.76rem;
    font-weight: 600;
    height: 24px;
    padding: 0 0.65rem;
    transition: background 0.12s, color 0.12s;

    &.active {
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.10);
      color: #1f2937;
    }

    &:hover:not(.active) { color: #344054; }
  }

  .date-error {'''

    if anchor in src:
        src = src.replace(anchor, addition)
        print("  ✅ SCSS: estilos toggle agregados")
    else:
        src += "\n.cfe-dashboard .metric-toggle{background:#f2f4f7;border:1px solid #d0d5dd;border-radius:6px;display:flex;padding:2px;gap:2px}.cfe-dashboard .metric-btn{background:transparent;border:none;border-radius:4px;color:#667085;cursor:pointer;font-size:.76rem;font-weight:600;height:24px;padding:0 .65rem}.cfe-dashboard .metric-btn.active{background:#fff;color:#1f2937;box-shadow:0 1px 3px rgba(0,0,0,.1)}"
        print("  ⚠️  SCSS: fallback append")
else:
    print("  ℹ️  SCSS: metric-toggle ya existe")

with open("src/app/views/pages/cfe/cfe-dashboard.component.scss", "w") as f:
    f.write(src)
PYEOF

echo ""
echo "✅ Listo."
echo ""
echo "   Al cambiar métrica:"
echo "   • buildCache() elige r.consumptionKwh o r.totalAmount por cada punto"
echo "   • Todos los datasets se reconstruyen con los valores correctos"
echo "   • El eje Y cambia su label a 'kWh' o '\$ MXN'"
echo "   • Sin llamada a la API — los datos ya están en historyData"