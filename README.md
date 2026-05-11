# Artigas Import Export — Landing

Sitio web para Artigas Import Export. Importadores y distribuidores de papel, cartones y materiales gráficos en Bolivia.

## Archivos

- `Landing.html` — Página principal (HTML + React inline)
- `tweaks-panel.jsx` — Componente del panel de tweaks
- `img/` — Fotos del almacén

## Despliegue en Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. `Add New Project` → `Import Project` → arrastrar esta carpeta
3. Framework Preset: **Other**
4. Build Command: vacío
5. Output Directory: `./`
6. Deploy
7. Vercel asigna un subdominio temporal `xxxxx.vercel.app`

## Conectar dominio (Namecheap → Vercel)

En Vercel → Project Settings → Domains → Add `artigasimportexport.com` y `www.artigasimportexport.com`.

En Namecheap → Domain List → Manage → Advanced DNS:

| Type   | Host | Value                     |
|--------|------|---------------------------|
| A      | @    | 76.76.21.21               |
| CNAME  | www  | cname.vercel-dns.com.     |

## Configurar Google Sheets para guardar cotizaciones

1. Abrir [sheets.google.com](https://sheets.google.com) con `fabricio@artigasimportexport.com`
2. Crear hoja nueva: **"Cotizaciones Artigas"**
3. Fila 1 con encabezados: `timestamp | nombre | telefono | email | producto | mensaje`
4. `Extensiones → Apps Script`
5. Pegar este código (reemplazar `SHEET_ID` con el ID de tu hoja, está en la URL):

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('SHEET_ID').getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.nombre,
    data.telefono,
    data.email,
    data.producto,
    data.mensaje
  ]);
  // (opcional) notificación email
  MailApp.sendEmail({
    to: 'fabricio@artigasimportexport.com',
    subject: 'Nueva cotización — ' + data.producto,
    body: `Cliente: ${data.nombre}\nTel: ${data.telefono}\nEmail: ${data.email}\nProducto: ${data.producto}\n\nDetalle:\n${data.mensaje}`
  });
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
```

6. `Implementar → Nueva implementación → Aplicación web`
7. Ejecutar como: **Mi cuenta** · Acceso: **Cualquier persona**
8. Copiar URL que termina en `/exec`
9. Pegar en `Landing.html` línea ~743: `const SHEETS_ENDPOINT = 'TU_URL_AQUI';`

Listo — cada cotización se guarda en la hoja y envía email automático.

## Contacto técnico

WhatsApp: +591 736 40039
Email: fabricio@artigasimportexport.com
