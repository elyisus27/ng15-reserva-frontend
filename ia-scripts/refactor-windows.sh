# 1. Generar el RoleGuard (sin especificar --flat=true para que cree su propia carpeta si no existe en la version 15)
ng generate guard src/app/_guards/role --skip-tests

# 2. Generar el UnauthorizedComponent
ng generate component src/app/views/pages/unauthorized --skip-tests

# 3. Generar el AdminDashboardModule (con enrutamiento)
ng generate module src/app/views/pages/admin-dashboard/admin-dashboard --routing --skip-tests

# 4. Generar el AdminDashboardComponent (dentro del AdminDashboardModule)
#    Nota: Angular CLI 15 puede generar esto en src/app/views/pages/admin-dashboard/admin-dashboard/admin-dashboard.component.ts
#    El script de WSL se encargará de ajustar la ruta de importación si es necesario.
ng generate component src/app/views/pages/admin-dashboard/admin-dashboard --skip-tests