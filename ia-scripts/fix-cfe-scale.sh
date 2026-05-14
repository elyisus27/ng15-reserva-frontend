#!/usr/bin/env bash
# ia-scripts/fix-cfe-y-scale.sh
# Escala fija por métrica en eje Y bimestral:
#   kWh  → max: 700
#   Pesos → max: 1100
# Solo toca TS.

set -e

echo "🔧 Fix escala fija por métrica..."

python3 - << 'PYEOF'
import re

with open("src/app/views/pages/cfe/cfe-dashboard.component.ts", "r") as f:
    src = f.read()

# Caso A: todavía tiene max: 600
old_600 = """          y: {
            min: 0,
            max: 600,

            title: {"""

# Caso B: ya se quitó el max (script anterior)
old_no_max = """          y: {
            min: 0,

            title: {"""

new_dynamic = """          y: {
            min: 0,
            max: this.metric === 'kwh' ? 700 : 1100,

            title: {"""

if old_600 in src:
    src = src.replace(old_600, new_dynamic)
    print("  ✅ TS: max:600 → max dinámico (700 kWh / 1100 pesos)")
elif old_no_max in src:
    src = src.replace(old_no_max, new_dynamic)
    print("  ✅ TS: max dinámico agregado (700 kWh / 1100 pesos)")
else:
    # Regex fallback
    new_src = re.sub(r'(y:\s*\{[\s\S]*?min:\s*0,)(\s*(?:max:\s*\d+,\s*)?\n\s*title:)', 
                     r'            y: {\n            min: 0,\n            max: this.metric === \'kwh\' ? 700 : 1100,\n\n            title:', 
                     src, count=1)
    if new_src != src:
        src = new_src
        print("  ✅ TS: max dinámico via regex")
    else:
        print("  ⚠️  TS: no se encontró el bloque — busca manualmente 'min: 0' en buildBimonthlyChart y agrega:")
        print("         max: this.metric === 'kwh' ? 700 : 1100,")

with open("src/app/views/pages/cfe/cfe-dashboard.component.ts", "w") as f:
    f.write(src)
PYEOF

echo ""
echo "✅ Listo."
echo "   kWh  → eje Y fijo 0–700"
echo "   Pesos → eje Y fijo 0–1100"
echo "   Al hacer toggle se redibuja con la escala correcta."