#!/bin/bash

# --- Configuración ---
PROJECT_ROOT=$(pwd) # Asume que el script se ejecuta desde la raíz del proyecto Angular
APP_DIR="$PROJECT_ROOT/src/app"
VIEWS_PORTAL_DIR="$APP_DIR/views/pages/portal"
AVANZA_COMPONENTS_DIR="$APP_DIR/avanza/components"

echo "Iniciando script de reestructuración de roles y vistas en: $PROJECT_ROOT"
echo "-------------------------------------------------------------------"

# --- 1. Mover componentes existentes a views/pages/portal ---
echo "Moviendo casas-list y cfe-list a $VIEWS_PORTAL_DIR..."

# Houses List
if [ -d "$AVANZA_COMPONENTS_DIR/houses-list" ]; then
    mv "$AVANZA_COMPONENTS_DIR/houses-list" "$VIEWS_PORTAL_DIR/"
    echo "  - houses-list movido."
else
    echo "  - houses-list no encontrado en $AVANZA_COMPONENTS_DIR. Asumiendo que ya está en $VIEWS_PORTAL_DIR o no existe."
fi

# CFE List
if [ -d "$AVANZA_COMPONENTS_DIR/cfe-list" ]; then
    mv "$AVANZA_COMPONENTS_DIR/cfe-list" "$VIEWS_PORTAL_DIR/"
    echo "  - cfe-list movido."
else
    echo "  - cfe-list no encontrado en $AVANZA_COMPONENTS_DIR. Asumiendo que ya está en $VIEWS_PORTAL_DIR o no existe."
fi

echo "---"

# --- 2. Crear las nuevas carpetas y componentes base para los Boards ---
echo "Creando componentes base para los nuevos Boards en $VIEWS_PORTAL_DIR..."

# Board Admin
ADMIN_BOARD_DIR="$VIEWS_PORTAL_DIR/board-admin"
if [ ! -d "$ADMIN_BOARD_DIR" ]; then
    mkdir -p "$ADMIN_BOARD_DIR"
    echo "  - Carpeta board-admin creada."
    cat <<EOF > "$ADMIN_BOARD_DIR/board-admin.component.ts"
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
EOF
    cat <<EOF > "$ADMIN_BOARD_DIR/board-admin.component.html"
<div>
  <h2>Panel de Administrador</h2>
  <p>Bienvenido al panel exclusivo para administradores.</p>
  <router-outlet></router-outlet> </div>
EOF
    touch "$ADMIN_BOARD_DIR/board-admin.component.scss"
    echo "  - Archivos base para board-admin creados."
else
    echo "  - Carpeta board-admin ya existe. Omitiendo creación."
fi

# Board User
USER_BOARD_DIR="$VIEWS_PORTAL_DIR/board-user"
if [ ! -d "$USER_BOARD_DIR" ]; then
    mkdir -p "$USER_BOARD_DIR"
    echo "  - Carpeta board-user creada."
    cat <<EOF > "$USER_BOARD_DIR/board-user.component.ts"
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.scss']
})
export class BoardUserComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
EOF
    cat <<EOF > "$USER_BOARD_DIR/board-user.component.html"
<div>
  <h2>Bienvenido Usuario</h2>
  <p>Esta es la vista general para todos los usuarios autenticados.</p>
</div>
EOF
    touch "$USER_BOARD_DIR/board-user.component.scss"
    echo "  - Archivos base para board-user creados."
else
    echo "  - Carpeta board-user ya existe. Omitiendo creación."
fi

echo "-------------------------------------------------------------------"
echo "Script de reestructuración inicial completado."
echo "¡Recuerda que los cambios en el contenido de los archivos (.ts, .html, .module.ts, .routing.ts) son MANUALES y deben seguir la guía del README!"
echo "Pasos pendientes: Modificar imports, declarations, routes, y lógica de navegación."