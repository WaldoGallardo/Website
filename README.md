# Sitio Corporativo — Starter

Este paquete es un punto de partida **estático** (HTML/CSS/JS) pensado para que puedas
ver cambios **en local** sin saber programación avanzada.

## ¿Qué contiene?
- Estructura de carpetas simple (`css/`, `js/`, `assets/`).
- Navegación responsiva, sección Héroe, Servicios, Sobre Nosotros, Clientes, Contacto y Pie.
- Estilos con variables CSS para cambiar colores corporativos en un solo lugar.
- Formulario con validación en el navegador (nota: en local no envía correo).
- Recomendación de extensión **Live Server** para previsualizar al instante.

## Cómo usar (Windows/Mac/Linux)
1) Instala **Visual Studio Code**.
2) Abre la carpeta `sitio_corporativo_base` en VS Code.
3) Si te lo ofrece, instala la extensión recomendada **Live Server**.
4) Abre `index.html` y haz clic derecho → **Open with Live Server**.
5) Edita textos e imágenes. Guarda y verás el cambio al instante.

## Personaliza colores
En `css/styles.css` busca la sección `:root` y cambia los valores de:
```
--brand: #0ea5e9;
--brand-dark: #0369a1;
--ink: #0f172a;
```
Guarda y observa el cambio en la previsualización.

## Nota sobre formularios
Por defecto el botón **Enviar** no manda correos en local. Para pruebas, se muestra
un aviso en pantalla. Para producción podrás conectar servicios como Formspree, Netlify
Forms o un backend propio.