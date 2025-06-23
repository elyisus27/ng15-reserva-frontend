#!/bin/bash

# Nombre del archivo de salida por defecto
OUTPUT_FILE="angular_project_info.txt"

# Función para imprimir la estructura de directorios
print_directory_structure() {
    echo "## 1. Estructura de Carpetas (src/app - Nivel 8):"
    echo "---------------------------------------------------------"
    if command -v tree &> /dev/null; then
        tree -L 8 src/app
    else
        echo "El comando 'tree' no está instalado. Por favor, instálalo (sudo apt install tree en Linux, brew install tree en macOS) o la estructura no se mostrará."
        echo "Alternativamente, puedes listar manualmente los directorios principales en src/app."
        ls -F src/app
    fi
    echo ""
}

# Función para imprimir el contenido de archivos relevantes
print_module_files() {
    echo "## 2. Contenido de Archivos de Enrutamiento (*routing.module.ts y *routing.ts):"
    echo "---------------------------------------------------------"
    # Modificación aquí: Añadir la condición -o -name "*routing.ts"
    find src -name "*-routing.module.ts" -o -name "*routing.ts" -exec sh -c '
        echo "### Archivo: {}"
        cat "{}"
        echo ""
    ' \;
    echo ""

    echo "## 3. Contenido de Archivos de Guardia (Guards - *.guard.ts):"
    echo "---------------------------------------------------------"
    find src -name "*.guard.ts" -exec sh -c '
        echo "### Archivo: {}"
        cat "{}"
        echo ""
    ' \;
    if ! find src -name "*.guard.ts" -print -quit | grep -q .; then
        echo "No se encontraron archivos .guard.ts. Esto es normal si aún no los has implementado."
        echo "Si tienes algún ejemplo o boceto de cómo te gustaría que fuera un guard, por favor, compártelo."
    fi
    echo ""

    echo "## 4. Contenido de Archivos de Módulo (*.module.ts):"
    echo "---------------------------------------------------------"
    find src -name "*.module.ts" -exec sh -c '
        echo "### Archivo: {}"
        cat "{}"
        echo ""
    ' \;
    echo ""

    echo "## 5. Posibles Archivos de Servicio de Autenticación (AuthService, LoginService, etc.):"
    echo "---------------------------------------------------------"
    AUTH_SERVICE_FILES=$(find src -name "*auth.service.ts" -o -name "*login.service.ts" -o -name "*user.service.ts" 2>/dev/null)
    if [ -n "$AUTH_SERVICE_FILES" ]; then
        for file in $AUTH_SERVICE_FILES; do
            echo "### Archivo: $file"
            cat "$file"
            echo ""
        done
    else
        echo "No se encontraron archivos de servicio de autenticación con nombres comunes. "
        echo "Si tu servicio tiene otro nombre, por favor indícalo y/o pega su contenido."
    fi
    echo ""
}

# --- Lógica Principal ---

echo "--- Recopilando Información del Proyecto Angular ---"
echo ""

echo "Selecciona una opción de salida:"
echo "1) Mostrar en pantalla"
echo "2) Guardar en archivo ($OUTPUT_FILE)"
read -p "Tu elección (1 o 2): " choice

if [ "$choice" == "1" ]; then
    print_directory_structure
    print_module_files
elif [ "$choice" == "2" ]; then
    echo "--- Recopilando Información del Proyecto Angular ---" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    print_directory_structure >> "$OUTPUT_FILE"
    print_module_files >> "$OUTPUT_FILE"
    echo -e "\nLa información ha sido guardada en: $OUTPUT_FILE"
else
    echo "Opción inválida. Saliendo del script."
    exit 1
fi

echo -e "\n--- Fin del Script ---"