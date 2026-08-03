const spanishTrackingAssignments = [
  {
    title: 'Configurar ubicaciones',
    slug: 'setting-up-locations',
    locale: 'es',
    category: 'Seguimiento y escaneo', categorySortOrder: 3, sortOrder: 0,
    excerpt: 'Puntos de control, direcciones, y el mapa en vivo.',
    bodyHtml: `
      <p>Las ubicaciones son los puntos de control donde sus activos se escanean para registrar
      entrada y salida \u2014 un almacén, una sucursal, un sitio de trabajo. Agregue una desde
      <strong>Ubicaciones \u2192 Agregar ubicación</strong> con un nombre y, opcionalmente, una
      dirección y coordenadas.</p>

      <h3>Establecer coordenadas</h3>
      <p>Puede escribir latitud/longitud directamente, o hacer clic en el mapa interactivo en el
      formulario para colocar un pin \u2014 no se necesita un servicio de geocodificación separado ni
      clave API. Una vez que una ubicación tiene coordenadas, aparece en el mapa en vivo junto a la
      lista de ubicaciones, que muestra por defecto una vista mundial ya que TraceHub no hace
      ninguna suposición sobre dónde están sus operaciones.</p>

      <h3>Editar y eliminar</h3>
      <p>Use el ícono de lápiz en cualquier ubicación para actualizar sus detalles, o el ícono de
      papelera para eliminarla. Eliminar una ubicación no elimina el historial de activos que alguna
      vez se escanearon allí \u2014 solo la elimina como destino de escaneo futuro.</p>
    `,
  },
  {
    title: 'Escanear activos',
    slug: 'scanning-assets',
    locale: 'es',
    category: 'Seguimiento y escaneo', categorySortOrder: 3, sortOrder: 1,
    excerpt: 'Dos formas de escanear, y qué sucede realmente cuando lo hace.',
    bodyHtml: `
      <p>Hay dos formas de escanear un activo para registrar entrada o salida de una ubicación:</p>
      <ol>
        <li><strong>Escanee una etiqueta QR física con cualquier cámara de teléfono.</strong> Esto
        abre la URL real codificada en la etiqueta, inicia sesión si es necesario, y lo lleva al
        escáner integrado en la aplicación con ese activo ya buscado.</li>
        <li><strong>Use directamente el escáner integrado en la aplicación.</strong> Vaya a
        <strong>Escanear</strong>, y ya sea use la cámara de su dispositivo en vivo (funciona en
        teléfono o laptop con cámara web) o escriba manualmente un token si no tiene acceso a una
        cámara.</li>
      </ol>

      <p>Una vez que se encuentra un activo, elija la ubicación del menú desplegable y confirme \u2014
      esto actualiza inmediatamente la <strong>ubicación actual</strong> del activo y registra un
      evento de ubicación real y con marca de tiempo.</p>

      <h3>Importante: esto es seguimiento por punto de control, no GPS</h3>
      <p>La «ubicación actual» de un activo es donde fue <em>escaneado por última vez</em> \u2014 no
      se actualiza continuamente y no hay hardware GPS involucrado. Si nadie escanea un activo
      durante tres semanas, seguirá mostrando la ubicación de hace tres semanas. Esta es una
      decisión de diseño deliberada y rentable (sin hardware que instalar o mantener), no una
      limitación que evitar \u2014 vea <strong>Historial de ubicación y la línea de tiempo del
      activo</strong> para saber cómo ver el historial completo de escaneos de cualquier activo.</p>
    `,
  },
  {
    title: 'Historial de ubicación y la línea de tiempo del activo',
    slug: 'location-history-and-timeline',
    locale: 'es',
    category: 'Seguimiento y escaneo', categorySortOrder: 3, sortOrder: 2,
    excerpt: 'Dónde ver todos los lugares en los que ha estado un activo.',
    bodyHtml: `
      <p>La propia página de cada activo tiene una <strong>línea de tiempo</strong> real \u2014 un
      único historial cronológico fusionado de cada registro fechado que realmente existe para él:
      fecha de compra, historial de asignación/devolución, escaneos de ubicación, inspecciones, y
      cambios de etapa del flujo de baja. Nada aquí está inventado \u2014 si un activo no tiene fecha
      de compra registrada, la línea de tiempo omite correctamente esa entrada en lugar de
      adivinar una.</p>

      <p>Para una vista a nivel de empresa en todos los activos, vaya a
      <strong>Informes \u2192 Actividad por ubicación</strong>, que enumera cada evento de escaneo en
      toda su flota con filtros de ubicación y tipo de evento, exportable a CSV, PDF, o PowerPoint.</p>
    `,
  },
  {
    title: 'Asignar activos a personas',
    slug: 'assigning-assets-to-people',
    locale: 'es',
    category: 'Asignaciones', categorySortOrder: 4, sortOrder: 0,
    excerpt: 'Personal interno y contactos externos, fechas de devolución esperadas, y tarifas de alquiler.',
    bodyHtml: `
      <p>Vaya a <strong>Asignaciones \u2192 Nueva asignación</strong>. Puede asignar un activo a un
      compañero de equipo ya en su espacio de trabajo, o a un contacto externo por nombre (con
      correo electrónico y teléfono opcionales) si está prestando equipo a alguien fuera de su
      organización \u2014 un contratista, un arrendatario.</p>

      <h3>Fecha de devolución esperada</h3>
      <p>Establecer una fecha de devolución esperada es lo que activa el sistema de recordatorios \u2014
      vea <strong>Recordatorios de devolución y alertas de vencimiento</strong>. Dejarla en blanco
      significa que el activo está asignado indefinidamente sin seguimiento de recordatorios.</p>

      <h3>Tarifas de alquiler</h3>
      <p>Si está alquilando equipo por una tarifa (común para maquinaria, generadores, vehículos),
      establezca un monto y moneda de tarifa de alquiler en la asignación. Aparece en la lista de
      asignaciones con un interruptor Pagado/No pagado que un Gerente o Administrador de la empresa
      puede hacer clic para marcar el pago recibido.</p>
    `,
  },
  {
    title: 'Recordatorios de devolución y alertas de vencimiento',
    slug: 'return-reminders-and-overdue-alerts',
    locale: 'es',
    category: 'Asignaciones', categorySortOrder: 4, sortOrder: 1,
    excerpt: 'Exactamente cuándo se envían los correos electrónicos, y a quién.',
    bodyHtml: `
      <p>TraceHub envía recordatorios reales y automáticos por correo electrónico vinculados a la
      fecha de devolución esperada de una asignación \u2014 nada aquí requiere que usted recuerde
      perseguir a alguien manualmente.</p>
      <ol>
        <li><strong>3 días antes</strong> de la fecha de devolución esperada: un recordatorio a la
        persona que tiene el activo.</li>
        <li><strong>En la fecha de vencimiento misma</strong>: otro recordatorio, y el estado de la
        asignación cambia a «vencido» si no se ha devuelto.</li>
        <li><strong>Cada día que permanece vencido</strong>: se envía una nueva alerta \u2014 no solo
        una vez \u2014 tanto a la persona que tiene el activo como a <em>cada</em> Administrador de la
        empresa en su espacio de trabajo, con un conteo de días real en curso («Vencido hace 4
        días») en lugar de un vago recordatorio.</li>
      </ol>
      <p>En la lista de asignaciones y el panel «Activos actualmente asignados» del tablero, un
      elemento vencido se muestra en rojo negrita con el número exacto de días retenidos y días
      vencidos \u2014 no necesita hacer el cálculo usted mismo.</p>
    `,
  },
  {
    title: 'Marcar un activo como devuelto',
    slug: 'marking-an-asset-returned',
    locale: 'es',
    category: 'Asignaciones', categorySortOrder: 4, sortOrder: 2,
    excerpt: 'Cerrar una asignación y qué sucede automáticamente.',
    bodyHtml: `
      <p>Desde la lista de asignaciones, haga clic en <strong>Marcar como devuelto</strong> en
      cualquier asignación activa o vencida. Esto realiza inmediatamente: establece el estado de la
      asignación a «devuelto», restablece el estado del activo a «disponible», detiene cualquier
      alerta adicional de vencimiento para esa asignación, y registra una entrada real y con marca
      de tiempo de «Devuelto» en la línea de tiempo del activo.</p>
    `,
  },
];

module.exports = spanishTrackingAssignments;
