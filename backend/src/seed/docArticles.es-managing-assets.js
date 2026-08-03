const spanishManagingAssets = [
  {
    title: 'Registrar un activo',
    slug: 'registering-an-asset',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 0,
    excerpt: 'Cada campo del formulario de agregar activo, y qué afecta realmente cada uno.',
    bodyHtml: `
      <p>Vaya a <strong>Activos \u2192 Agregar activo</strong>. Solo el <strong>nombre del
      activo</strong> es obligatorio \u2014 todo lo demás es opcional, pero cuanto más complete, más
      puede hacer el motor de inteligencia con ello.</p>

      <h3>Campos principales</h3>
      <ul>
        <li><strong>Categoría</strong> \u2014 determina los supuestos predeterminados de vida útil y
        valor de rescate usados para la depreciación. Puede anularlos por activo si es necesario.</li>
        <li><strong>Condición</strong> \u2014 una condición de partida simple (Excelente/Bueno/
        Regular/Malo), distinta del Puntaje de salud calculado por la IA, que se actualiza con el
        tiempo a medida que llegan datos reales.</li>
        <li><strong>Marca, Modelo, Color, Número de serie</strong> \u2014 detalles de identificación.
        El color es un campo buscable poblado desde una lista de colores real y completa \u2014
        comience a escribir y elija entre sugerencias, o escriba un color que no esté listado.</li>
        <li><strong>Año de fabricación / Fecha de compra / Precio de compra</strong> \u2014 la fecha y
        el precio de compra son de lo que realmente calcula el motor de depreciación; el año de
        fabricación se usa como referencia de edad de respaldo si falta la fecha de compra.</li>
        <li><strong>Ubicación actual</strong> \u2014 el punto de control donde comienza el activo.
        Se puede actualizar más tarde mediante escaneo.</li>
      </ul>

      <h3>Precio de compra y moneda</h3>
      <p>El precio de compra siempre se almacena en USD. Si pagó en una moneda diferente, use el
      asistente de conversión de moneda justo debajo del campo de precio: elija la moneda, ingrese el
      monto local, ya sea obtenga una tasa de cambio en vivo o escriba una usted mismo, y calcula el
      equivalente en USD por usted.</p>

      <h3>Datos del motor de inteligencia de activos (opcional, pero valioso)</h3>
      <p>Haga clic para expandir esta sección plegable para ver campos que alimentan directamente los
      motores de Puntaje de salud, Predicción de fallas, y Baja: historial operativo (horas usadas,
      número de mantenimientos, número de reparaciones, número de fallas, última puntuación de
      inspección), intensidad de uso, detalles financieros (valor de mercado actual, costo de
      reemplazo), y factores ambientales/de condición (riesgo de corrosión, exposición al polvo,
      entorno operativo). Nada de esto es requerido para registrar un activo, pero un activo sin
      ninguno de estos datos tendrá un Puntaje de confianza de IA más bajo simplemente porque hay
      menos con qué trabajar para el motor \u2014 ver <strong>Puntaje de confianza IA</strong>.</p>
    `,
  },
  {
    title: 'Categorías y campos personalizados',
    slug: 'categories-and-custom-fields',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 1,
    excerpt: 'Cómo las categorías impulsan la depreciación, y agregar sus propios campos.',
    bodyHtml: `
      <p>Cada activo pertenece a una categoría (Laptops y computadoras, Vehículos, Generadores,
      Mobiliario de oficina, etc.). Las categorías no son solo etiquetas \u2014 cada una lleva un
      <strong>perfil de depreciación</strong>: una vida útil supuesta en años y un porcentaje de
      valor de rescate, usados automáticamente cada vez que registra un activo en esa categoría sin
      anular manualmente esos números.</p>

      <p>Puede ajustar el perfil de una categoría desde <strong>Activos \u2192 Categorías</strong> si
      su equipo real envejece más rápido o más lento que el supuesto predeterminado \u2014 por
      ejemplo, si sus vehículos se usan en un entorno duro y genuinamente tienen una vida útil más
      corta que los 8 años predeterminados, redúzcala ahí en lugar de corregir manualmente cada
      vehículo individual.</p>

      <h3>Campos personalizados</h3>
      <p>Si su organización rastrea algo específico de su equipo que no es ya un campo integrado \u2014
      un código de proyecto, un formato de código de barras interno, un número de certificado de
      cumplimiento \u2014 un Administrador de la empresa puede agregar un campo personalizado desde
      Configuración. Los campos personalizados aparecen automáticamente en el formulario de agregar
      activo y se almacenan por activo.</p>
    `,
  },
  {
    title: 'Comprender el estado de un activo',
    slug: 'understanding-asset-status',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 2,
    excerpt: 'Disponible, Asignado, En mantenimiento, Reservado, Dado de baja, Perdido.',
    bodyHtml: `
      <p>Cada activo tiene un estado, mostrado en la lista de activos y en la página de detalle del
      activo:</p>
      <ul>
        <li><strong>Disponible</strong> \u2014 no asignado actualmente a nadie, ubicado en su
        ubicación actual.</li>
        <li><strong>Asignado</strong> \u2014 se establece automáticamente cuando crea una asignación
        activa para este activo, y se borra automáticamente cuando se marca como devuelto.</li>
        <li><strong>En mantenimiento</strong> \u2014 se establece manualmente cuando un activo se
        retira de servicio para reparación.</li>
        <li><strong>Reservado</strong> \u2014 retenido para un uso específico futuro sin estar
        formalmente asignado todavía.</li>
        <li><strong>Dado de baja</strong> \u2014 se establece automáticamente cuando un caso de baja
        para este activo alcanza la etapa final «Dado de baja».</li>
        <li><strong>Perdido</strong> \u2014 se establece manualmente si un activo genuinamente no se
        puede localizar.</li>
      </ul>
      <p>El estado alimenta directamente la métrica de Disponibilidad de activos del tablero (el % de
      su flota actualmente Disponible) y la vista a nivel de cartera del panel de Inteligencia de la
      flota.</p>
    `,
  },
  {
    title: 'Códigos QR e impresión de etiquetas',
    slug: 'qr-codes-and-printing-tags',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 3,
    excerpt: 'Cómo se genera el código QR, y la URL real que codifica.',
    bodyHtml: `
      <p>En el momento en que un activo se registra, TraceHub genera un código QR único para él \u2014
      visible en la página de detalle del activo con un botón <strong>Descargar QR</strong>.
      Imprímalo en una etiqueta y péguela al activo físico, o muéstrelo en una pantalla cercana si
      una etiqueta física aún no es práctica.</p>

      <h3>Lo que el código realmente codifica</h3>
      <p>El código QR es una URL real (<code>suapp.com/scan/&#123;token&#125;</code>), no un formato
      propietario \u2014 lo que significa que funciona con una aplicación de cámara de teléfono
      ordinaria, no solo con el propio escáner de TraceHub. Escanearlo con cualquier aplicación de
      cámara abre esa URL directamente: si no ha iniciado sesión, lo lleva primero a iniciar sesión y
      luego continúa automáticamente al lugar correcto; si ya inició sesión, va directamente al
      escáner integrado en la aplicación con ese activo ya cargado.</p>

      <h3>Usar el escáner integrado en la aplicación en su lugar</h3>
      <p>Desde <strong>Escanear</strong> dentro de la aplicación, puede usar un escáner en vivo
      basado en cámara (funciona en teléfono o laptop con cámara web) para escanear directamente el
      código de cualquier activo, o escribir/pegar manualmente un token si no tiene acceso a una
      cámara. Vea <strong>Escanear activos</strong> para el flujo completo de entrada/salida.</p>
    `,
  },
  {
    title: 'Archivar y eliminar activos',
    slug: 'archiving-and-deleting-assets',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 4,
    excerpt: 'La diferencia entre archivar y la eliminación permanente.',
    bodyHtml: `
      <p>Desde una página de detalle de activo, los Administradores de la empresa y los Gerentes
      pueden <strong>archivar</strong> un activo \u2014 esto lo elimina de la lista activa de activos
      y de todos los conteos del tablero, pero mantiene intacto y restaurable su historial completo
      (inspecciones, asignaciones, escaneos de ubicación, registros de baja). Archivar es la decisión
      correcta para equipos que ya no rastrea día a día pero de los que quiere conservar
      registros.</p>
      <p>La eliminación permanente no se ofrece como una acción de rutina \u2014 el historial de
      activos es valioso para auditoría y registros de depreciación, y archivar cubre el caso de uso
      «ya no necesito ver esto» sin perder nada.</p>
    `,
  },
  {
    title: 'Editar un activo existente',
    slug: 'editing-an-existing-asset',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 5,
    excerpt: 'Qué desencadena automáticamente una actualización.',
    bodyHtml: `
      <p>Abra cualquier activo y haga clic en Editar. Cualquier cambio \u2014 un nuevo conteo de
      mantenimiento, un valor de mercado actualizado, un precio de compra corregido \u2014
      desencadena un recálculo inmediato de todo el motor de inteligencia para ese activo:
      depreciación, salud, riesgo de falla, calendario de mantenimiento, y recomendación de baja se
      actualizan todos juntos, no de forma independiente.</p>
    `,
  },
  {
    title: 'Filtrado masivo de la lista de activos',
    slug: 'bulk-filtering-assets-list',
    locale: 'es',
    category: 'Gestionar activos', categorySortOrder: 1, sortOrder: 6,
    excerpt: 'Búsqueda, estado, categoría, ubicación, y filtros de nivel de salud juntos.',
    bodyHtml: `
      <p>La lista de activos permite combinar una búsqueda de texto (nombre, etiqueta, número de
      serie, marca) con filtros de estado, categoría, y ubicación simultáneamente \u2014 útil para
      una pregunta como «muéstrame todas las laptops disponibles en el almacén de Accra». Hacer clic
      en un segmento del Mapa de calor ejecutivo del tablero también lo lleva aquí, pre-filtrado a un
      nivel de salud específico.</p>
    `,
  },
];

module.exports = spanishManagingAssets;
