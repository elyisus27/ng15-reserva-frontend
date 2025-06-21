#Forma personalizada. hacer 
#ng build
#docker build . -t jesus2787/ng15-reservafrac:latest

FROM nginx:alpine
# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu archivo de configuración personalizado de Nginx (reverse proxy para alcanzar api)
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY /dist/ng15-reserva-frontend/ /usr/share/nginx/html

# El comando por defecto de Nginx ya sirve los archivos
CMD ["nginx", "-g", "daemon off;"]