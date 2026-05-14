#!/bin/bash

# =============================================================
#  CFE Dashboard — Módulo + tabs horizontales (CoreUI)
#  Ejecutar desde raíz del proyecto:  bash ia-scripts/setup-cfe-module.sh
# =============================================================

set -e
echo ""
echo "========================================"
echo "  Creando módulo CFE con tabs CoreUI"
echo "========================================"

# ── Directorios ───────────────────────────────────────────────
CFE_ROOT="src/app/views/pages/cfe"
TABS=(mapa comparativa historicos)

mkdir -p "$CFE_ROOT"
for TAB in "${TABS[@]}"; do
  mkdir -p "$CFE_ROOT/$TAB"
done

echo "[1/6] Directorios creados"

# ── Componente MAPA ───────────────────────────────────────────
cat > "$CFE_ROOT/mapa/cfe-mapa.component.ts" << 'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-cfe-mapa',
  templateUrl: './cfe-mapa.component.html',
})
export class CfeMapaComponent {}
EOF

cat > "$CFE_ROOT/mapa/cfe-mapa.component.html" << 'EOF'
<c-card class="mb-4">
  <c-card-header>
    <strong>Mapa de contratos</strong>
    <small class="text-medium-emphasis ms-2">28 ubicaciones CFE — Coto La Reserva</small>
  </c-card-header>
  <c-card-body>

    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <c-widget-stat-a color="primary">
          <ng-container ngProjectAs="c-widget-stat-a-value">84,320 kWh</ng-container>
          <ng-container ngProjectAs="c-widget-stat-a-title">Consumo total bimestre</ng-container>
        </c-widget-stat-a>
      </div>
      <div class="col-sm-6 col-xl-3">
        <c-widget-stat-a color="info">
          <ng-container ngProjectAs="c-widget-stat-a-value">$142,800</ng-container>
          <ng-container ngProjectAs="c-widget-stat-a-title">Gasto total bimestre</ng-container>
        </c-widget-stat-a>
      </div>
      <div class="col-sm-6 col-xl-3">
        <c-widget-stat-a color="success">
          <ng-container ngProjectAs="c-widget-stat-a-value">$1.69 / kWh</ng-container>
          <ng-container ngProjectAs="c-widget-stat-a-title">Costo promedio</ng-container>
        </c-widget-stat-a>
      </div>
      <div class="col-sm-6 col-xl-3">
        <c-widget-stat-a color="warning">
          <ng-container ngProjectAs="c-widget-stat-a-value">28 contratos</ng-container>
          <ng-container ngProjectAs="c-widget-stat-a-title">Activos este período</ng-container>
        </c-widget-stat-a>
      </div>
    </div>

    <!-- Placeholder mapa SVG interactivo -->
    <div class="cfe-map-placeholder d-flex flex-column align-items-center justify-content-center"
         style="background:#f0f4f8; border:2px dashed #b0bec5; border-radius:8px; min-height:380px;">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="28" fill="#e3eaf3"/>
        <path d="M28 14C22.477 14 18 18.477 18 24C18 31.5 28 42 28 42C28 42 38 31.5 38 24C38 18.477 33.523 14 28 14ZM28 28C25.791 28 24 26.209 24 24C24 21.791 25.791 20 28 20C30.209 20 32 21.791 32 24C32 26.209 30.209 28 28 28Z" fill="#5b7fa6"/>
      </svg>
      <p class="mt-3 mb-1 fw-semibold text-secondary">Mapa SVG interactivo</p>
      <p class="text-medium-emphasis small text-center px-4">
        Aquí se renderizará el mapa del fraccionamiento con un pin por cada contrato CFE.<br>
        <span class="badge bg-primary me-1">Azul</span> Luminarias &nbsp;
        <span class="badge bg-success me-1">Verde</span> Áreas comunes &nbsp;
        <span class="badge bg-danger">Rojo</span> Oficinas
      </p>
      <p class="text-medium-emphasis small mt-2">
        Clic en pin → detalle del recibo (No., periodo, kWh, importe, tarifa)
      </p>
    </div>

    <div class="row mt-3">
      <div class="col">
        <div class="d-flex gap-3 flex-wrap">
          <span><span class="badge bg-primary">14</span> Luminarias de calle</span>
          <span><span class="badge bg-success">8</span> Áreas comunes</span>
          <span><span class="badge bg-danger">6</span> Oficinas / administración</span>
        </div>
      </div>
    </div>

  </c-card-body>
</c-card>
EOF

# ── Componente COMPARATIVA ────────────────────────────────────
cat > "$CFE_ROOT/comparativa/cfe-comparativa.component.ts" << 'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-cfe-comparativa',
  templateUrl: './cfe-comparativa.component.html',
})
export class CfeComparativaComponent {}
EOF

cat > "$CFE_ROOT/comparativa/cfe-comparativa.component.html" << 'EOF'
<c-card class="mb-4">
  <c-card-header>
    <strong>Comparativa de consumo</strong>
    <small class="text-medium-emphasis ms-2">Contratos del mismo tipo</small>
  </c-card-header>
  <c-card-body>

    <!-- Selector de categoría — funcional en fase 2 -->
    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label small text-medium-emphasis">Filtrar por categoría</label>
        <select class="form-select form-select-sm">
          <option selected>Todas las categorías</option>
          <option>Luminarias de calle</option>
          <option>Áreas comunes</option>
          <option>Oficinas / administración</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label small text-medium-emphasis">Ver en</label>
        <select class="form-select form-select-sm">
          <option selected>kWh consumidos</option>
          <option>Pesos pagados ($)</option>
        </select>
      </div>
    </div>

    <!-- Placeholder gráfica de barras comparativas -->
    <div class="cfe-chart-placeholder d-flex flex-column align-items-center justify-content-center"
         style="background:#f0f4f8; border:2px dashed #b0bec5; border-radius:8px; min-height:300px;">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="28" fill="#e3eaf3"/>
        <rect x="12" y="30" width="8" height="14" rx="2" fill="#5b7fa6"/>
        <rect x="24" y="20" width="8" height="24" rx="2" fill="#378ADD"/>
        <rect x="36" y="25" width="8" height="19" rx="2" fill="#5b7fa6"/>
      </svg>
      <p class="mt-3 mb-1 fw-semibold text-secondary">Gráfica de barras comparativa</p>
      <p class="text-medium-emphasis small text-center px-4">
        Barras horizontales agrupadas por categoría.<br>
        Muestra cada contrato vs. el promedio de su grupo.<br>
        Contratos fuera del rango se destacan en color.
      </p>
    </div>

    <!-- Tabla resumen placeholder -->
    <div class="mt-4">
      <p class="small text-medium-emphasis mb-2">Vista tabular — resumen por categoría</p>
      <table class="table table-sm table-hover">
        <thead class="table-light">
          <tr>
            <th>Categoría</th>
            <th class="text-end">Contratos</th>
            <th class="text-end">kWh promedio</th>
            <th class="text-end">$ promedio</th>
            <th class="text-end">Máximo</th>
            <th class="text-end">Mínimo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge bg-primary me-1">●</span>Luminarias</td>
            <td class="text-end">14</td>
            <td class="text-end">3,734 kWh</td>
            <td class="text-end">$5,900</td>
            <td class="text-end text-danger">5,490</td>
            <td class="text-end text-success">3,240</td>
          </tr>
          <tr>
            <td><span class="badge bg-success me-1">●</span>Áreas comunes</td>
            <td class="text-end">8</td>
            <td class="text-end">2,951 kWh</td>
            <td class="text-end">$5,130</td>
            <td class="text-end text-danger">4,210</td>
            <td class="text-end text-success">1,890</td>
          </tr>
          <tr>
            <td><span class="badge bg-danger me-1">●</span>Oficinas</td>
            <td class="text-end">6</td>
            <td class="text-end">1,405 kWh</td>
            <td class="text-end">$2,820</td>
            <td class="text-end text-danger">2,100</td>
            <td class="text-end text-success">980</td>
          </tr>
        </tbody>
      </table>
    </div>

  </c-card-body>
</c-card>
EOF

# ── Componente HISTÓRICOS ─────────────────────────────────────
cat > "$CFE_ROOT/historicos/cfe-historicos.component.ts" << 'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-cfe-historicos',
  templateUrl: './cfe-historicos.component.html',
})
export class CfeHistoricosComponent {}
EOF

cat > "$CFE_ROOT/historicos/cfe-historicos.component.html" << 'EOF'
<c-card class="mb-4">
  <c-card-header>
    <strong>Histórico de consumo</strong>
    <small class="text-medium-emphasis ms-2">Tendencia por contrato o categoría</small>
  </c-card-header>
  <c-card-body>

    <!-- Selectores — funcionales en fase 2 -->
    <div class="row mb-4 g-3">
      <div class="col-md-5">
        <label class="form-label small text-medium-emphasis">Seleccionar contratos a mostrar</label>
        <select class="form-select form-select-sm" multiple style="height:90px;">
          <option selected>C.972 — Luminaria</option>
          <option selected>C.1052 — Luminaria</option>
          <option>C.1172 — Luminaria</option>
          <option>C.1332 — Luminaria</option>
          <option>Parque Coto — Área común</option>
          <option>Alberca Sector A — Área común</option>
        </select>
        <div class="form-text">Ctrl+clic para selección múltiple</div>
      </div>
      <div class="col-md-3">
        <label class="form-label small text-medium-emphasis">Unidad del eje Y</label>
        <select class="form-select form-select-sm">
          <option selected>kWh consumidos</option>
          <option>Pesos pagados ($)</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label small text-medium-emphasis">Período</label>
        <select class="form-select form-select-sm">
          <option>Últimos 3 bimestres</option>
          <option selected>Últimos 6 bimestres</option>
          <option>Último año</option>
          <option>Todo el historial</option>
        </select>
      </div>
    </div>

    <!-- Placeholder línea de tiempo -->
    <div class="cfe-chart-placeholder d-flex flex-column align-items-center justify-content-center"
         style="background:#f0f4f8; border:2px dashed #b0bec5; border-radius:8px; min-height:300px;">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="28" fill="#e3eaf3"/>
        <polyline points="10,38 18,28 26,32 34,18 44,24" stroke="#378ADD" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="10,42 18,36 26,38 34,30 44,34" stroke="#639922" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="mt-3 mb-1 fw-semibold text-secondary">Gráfica de líneas — histórico bimestral</p>
      <p class="text-medium-emphasis small text-center px-4">
        Una línea por cada contrato seleccionado.<br>
        Eje X: bimestres &nbsp;·&nbsp; Eje Y: kWh o $ según selector.<br>
        Hover sobre punto → tooltip con detalle del recibo.
      </p>
    </div>

    <!-- Mini tabla de variación -->
    <div class="mt-4">
      <p class="small text-medium-emphasis mb-2">Variación bimestre anterior vs. actual</p>
      <table class="table table-sm table-hover">
        <thead class="table-light">
          <tr>
            <th>Contrato</th>
            <th>Categoría</th>
            <th class="text-end">Bim. ant. kWh</th>
            <th class="text-end">Bim. actual kWh</th>
            <th class="text-end">Variación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>C.972</td>
            <td>Luminaria</td>
            <td class="text-end">3,380</td>
            <td class="text-end">3,420</td>
            <td class="text-end text-warning">+1.2%</td>
          </tr>
          <tr>
            <td>C.1052</td>
            <td>Luminaria</td>
            <td class="text-end">3,490</td>
            <td class="text-end">3,610</td>
            <td class="text-end text-warning">+3.4%</td>
          </tr>
          <tr>
            <td>C.1172</td>
            <td>Luminaria</td>
            <td class="text-end">3,820</td>
            <td class="text-end">5,490</td>
            <td class="text-end text-danger fw-semibold">+43.7% ⚑</td>
          </tr>
          <tr>
            <td>Parque Coto</td>
            <td>Área común</td>
            <td class="text-end">2,100</td>
            <td class="text-end">1,980</td>
            <td class="text-end text-success">-5.7%</td>
          </tr>
        </tbody>
      </table>
    </div>

  </c-card-body>
</c-card>
EOF

echo "[2/6] Componentes HTML + TS creados"

# ── Módulo CFE ────────────────────────────────────────────────
cat > "$CFE_ROOT/cfe.module.ts" << 'EOF'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  CardModule,
  TabsModule,
  NavModule,
  BadgeModule,
  GridModule,
} from '@coreui/angular';

import { CFE_ROUTES } from './cfe.routing';
import { CfeDashboardComponent } from './cfe-dashboard.component';
import { CfeMapaComponent } from './mapa/cfe-mapa.component';
import { CfeComparativaComponent } from './comparativa/cfe-comparativa.component';
import { CfeHistoricosComponent } from './historicos/cfe-historicos.component';

@NgModule({
  declarations: [
    CfeDashboardComponent,
    CfeMapaComponent,
    CfeComparativaComponent,
    CfeHistoricosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(CFE_ROUTES),
    CardModule,
    TabsModule,
    NavModule,
    BadgeModule,
    GridModule,
  ],
})
export class CfeModule {}
EOF

# ── Routing CFE ───────────────────────────────────────────────
cat > "$CFE_ROOT/cfe.routing.ts" << 'EOF'
import { Routes } from '@angular/router';
import { CfeDashboardComponent } from './cfe-dashboard.component';

export const CFE_ROUTES: Routes = [
  {
    path: '',
    component: CfeDashboardComponent,
  },
];
EOF

# ── Dashboard shell con tabs CoreUI ──────────────────────────
cat > "$CFE_ROOT/cfe-dashboard.component.ts" << 'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-cfe-dashboard',
  templateUrl: './cfe-dashboard.component.html',
})
export class CfeDashboardComponent {
  activeTab = 0;

  setTab(index: number) {
    this.activeTab = index;
  }
}
EOF

cat > "$CFE_ROOT/cfe-dashboard.component.html" << 'EOF'
<div class="container-lg px-4 py-3">

  <!-- Encabezado del mini-sitio -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <div>
      <h4 class="mb-0">Monitor CFE</h4>
      <small class="text-medium-emphasis">Coto La Reserva · 28 contratos</small>
    </div>
    <div class="d-flex gap-2">
      <span class="badge bg-primary">14 luminarias</span>
      <span class="badge bg-success">8 áreas comunes</span>
      <span class="badge bg-danger">6 oficinas</span>
    </div>
  </div>

  <!-- Tabs horizontales CoreUI -->
  <c-tabs [(activeItemKey)]="activeTab">
    <c-nav variant="tabs" role="tablist">
      <c-nav-item>
        <button cNavLink [cNavLinkIdx]="0" role="tab">
          Mapa de contratos
        </button>
      </c-nav-item>
      <c-nav-item>
        <button cNavLink [cNavLinkIdx]="1" role="tab">
          Comparativa
        </button>
      </c-nav-item>
      <c-nav-item>
        <button cNavLink [cNavLinkIdx]="2" role="tab">
          Históricos
        </button>
      </c-nav-item>
    </c-nav>

    <c-tab-content>
      <c-tab-pane [itemKey]="0" role="tabpanel" class="pt-3">
        <app-cfe-mapa></app-cfe-mapa>
      </c-tab-pane>
      <c-tab-pane [itemKey]="1" role="tabpanel" class="pt-3">
        <app-cfe-comparativa></app-cfe-comparativa>
      </c-tab-pane>
      <c-tab-pane [itemKey]="2" role="tabpanel" class="pt-3">
        <app-cfe-historicos></app-cfe-historicos>
      </c-tab-pane>
    </c-tab-content>
  </c-tabs>

</div>
EOF

echo "[3/6] Módulo, routing y dashboard shell creados"

# ── Patch portal.routing.ts — agregar ruta lazy cfe ──────────
PORTAL_ROUTING="src/app/views/pages/portal/portal.routing.ts"

# Verificar que la ruta cfe no exista ya
if grep -q "cfe" "$PORTAL_ROUTING"; then
  echo "[4/6] Ruta 'cfe' ya existe en portal.routing.ts — omitiendo patch"
else
  # Insertar antes del cierre del array children
  python3 - << 'PYEOF'
import re, sys

path = "src/app/views/pages/portal/portal.routing.ts"
with open(path, "r") as f:
    content = f.read()

new_route = """        {
            path: 'cfe',
            loadChildren: () =>
                import('src/app/views/pages/cfe/cfe.module').then(m => m.CfeModule),
        },
"""

# Insertamos antes del cierre del array children "]"
content = content.replace(
    "    ]\n}];",
    new_route + "    ]\n}];"
)

with open(path, "w") as f:
    f.write(content)

print("[4/6] portal.routing.ts parcheado con ruta lazy /cfe")
PYEOF
fi

# ── Patch _nav.ts — agregar ítem de menú CFE ─────────────────
NAV_FILE="src/app/containers/default-layout/_nav.ts"

if grep -q "cfe" "$NAV_FILE"; then
  echo "[5/6] Ítem CFE ya existe en _nav.ts — omitiendo"
else
  python3 - << 'PYEOF'
path = "src/app/containers/default-layout/_nav.ts"
with open(path, "r") as f:
    content = f.read()

nav_item = """  {
    name: 'CFE Monitor',
    url: '/mod/cfe',
    iconComponent: { name: 'cil-bolt' },
    badge: {
      color: 'primary',
      text: '28',
    },
  },
"""

# Insertar al inicio del array (después del primer "[")
idx = content.find("[")
if idx != -1:
    insert_at = content.find("\n", idx) + 1
    content = content[:insert_at] + nav_item + content[insert_at:]

with open(path, "w") as f:
    f.write(content)

print("[5/6] _nav.ts actualizado con ítem CFE Monitor")
PYEOF
fi

echo "[6/6] Todo listo"
echo ""
echo "========================================"
echo "  Resumen de archivos generados"
echo "========================================"
echo "  src/app/views/pages/cfe/"
echo "  ├── cfe.module.ts"
echo "  ├── cfe.routing.ts"
echo "  ├── cfe-dashboard.component.ts  (tabs shell)"
echo "  ├── cfe-dashboard.component.html"
echo "  ├── mapa/cfe-mapa.component.*"
echo "  ├── comparativa/cfe-comparativa.component.*"
echo "  └── historicos/cfe-historicos.component.*"
echo ""
echo "  Archivos modificados:"
echo "  ├── src/app/views/pages/portal/portal.routing.ts  (+ruta lazy /cfe)"
echo "  └── src/app/containers/default-layout/_nav.ts     (+ítem menú)"
echo ""
echo "  URL de acceso tras login:  /#/mod/cfe"
echo ""
echo "  Siguiente paso:"
echo "  ng serve  (o tu comando habitual)"
echo "========================================"
