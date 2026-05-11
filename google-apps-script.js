/**
 * Google Apps Script — Receptor de cotizaciones Artigas Import Export
 *
 * PASOS:
 * 1) Abrir https://sheets.google.com con la cuenta fabricio@artigasimportexport.com
 * 2) Crear hoja nueva llamada "Cotizaciones Artigas"
 * 3) Poner encabezados en fila 1:
 *    timestamp | nombre | telefono | email | producto | mensaje
 * 4) Menú: Extensiones → Apps Script
 * 5) Borrar el código que aparece y pegar TODO este archivo
 * 6) Reemplazar la línea SHEET_ID con el ID de tu hoja
 *    (está en la URL: docs.google.com/spreadsheets/d/SHEET_ID/edit)
 * 7) Guardar (ícono disquete)
 * 8) Click "Implementar" (arriba a la derecha) → "Nueva implementación"
 * 9) Tipo: Aplicación web
 *    - Descripción: "Artigas cotizaciones v1"
 *    - Ejecutar como: Yo (fabricio@artigasimportexport.com)
 *    - Quién tiene acceso: Cualquier persona
 * 10) Click "Implementar" → autorizar permisos
 * 11) Copiar URL del Web App (termina en /exec)
 * 12) Pegar esa URL en Landing.html en la constante SHEETS_ENDPOINT
 */

const SHEET_ID = 'PEGAR_AQUI_EL_ID_DE_TU_HOJA_DE_CALCULO';
const NOTIFY_EMAIL = 'fabricio@artigasimportexport.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.nombre   || '',
      data.telefono || '',
      data.email    || '',
      data.producto || '',
      data.mensaje  || ''
    ]);

    // Email de notificación al dueño
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'Nueva cotización — ' + (data.producto || 'consulta'),
      htmlBody:
        '<h2>Nueva solicitud de cotización</h2>' +
        '<p><b>Cliente:</b> ' + data.nombre + '</p>' +
        '<p><b>Teléfono / WhatsApp:</b> ' + data.telefono + '</p>' +
        '<p><b>Email:</b> ' + data.email + '</p>' +
        '<p><b>Producto:</b> ' + data.producto + '</p>' +
        '<p><b>Detalle:</b><br>' + (data.mensaje || '').replace(/\n/g, '<br>') + '</p>' +
        '<hr><p style="color:#888;font-size:12px">artigasimportexport.com</p>'
    });

    // Constancia automática al cliente (si dejó email)
    if (data.email) {
      MailApp.sendEmail({
        to: data.email,
        subject: 'Constancia de solicitud — Artigas Import Export',
        htmlBody:
          '<h2>Hola ' + data.nombre + ',</h2>' +
          '<p>Recibimos tu solicitud de cotización. Estos son los datos registrados:</p>' +
          '<ul>' +
          '<li><b>Producto:</b> ' + data.producto + '</li>' +
          '<li><b>Detalle:</b> ' + data.mensaje + '</li>' +
          '</ul>' +
          '<p>Nuestro equipo te contactará en menos de 24h hábiles.</p>' +
          '<p>— Artigas Import Export<br>WhatsApp: +591 736 40039<br>Web: artigasimportexport.com</p>'
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Artigas Import Export — endpoint OK');
}
