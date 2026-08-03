const spanishReportsBilling = [
  {
    title: 'El tablero, explicado',
    slug: 'the-dashboard-explained',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 0,
    excerpt: 'Cada panel del tablero y lo que realmente muestra.',
    bodyHtml: `
      <p>De arriba a abajo, el tablero muestra:</p>
      <ul>
        <li><strong>Tarjetas KPI</strong> \u2014 total de activos, asignaciones activas, devoluciones
        vencidas, y activos pendientes de baja dentro de 90 días.</li>
        <li><strong>Desglose del estado de los activos</strong> \u2014 conteos Disponible/Asignado/
        Mantenimiento/Dado de baja.</li>
        <li><strong>Valor de la flota</strong> \u2014 valor total de compra frente al valor actual
        estimado por IA.</li>
        <li><strong>Chips KPI de inteligencia</strong> \u2014 conteos Saludable/Crítico/Próximo a
        baja/Mantenimiento pendiente/Garantía por vencer/Activo inactivo.</li>
        <li><strong>Proyecciones de depreciación y reemplazo</strong> \u2014 depreciación de hoy,
        pérdida mensual de activos, presupuesto de reemplazo necesario ahora, costo de baja
        proyectado, y un costo de reemplazo proyectado a 12 meses genuinamente distinto.</li>
        <li><strong>Listas clasificadas</strong> \u2014 activos más valiosos, más reparados, y más
        costosos de mantener.</li>
        <li><strong>Activos actualmente asignados</strong> \u2014 quién tiene qué, fechas de
        emisión/vencimiento, días retenidos (en rojo una vez vencido), e información de contacto,
        exportable a CSV/PDF/PowerPoint.</li>
        <li><strong>Panel de inteligencia de la flota</strong> \u2014 agregados a nivel de cartera:
        Salud de la cartera, Disponibilidad de activos, Riesgo de capital, Riesgo financiero/
        operacional, una Calificación de flota general de A a F, y un Mapa de calor ejecutivo
        cliqueable (haga clic en cualquier nivel de salud para saltar a una lista de activos
        filtrada).</li>
        <li><strong>Panel de información de IA</strong> \u2014 patrones basados en reglas detectados
        en su flota (una categoría depreciándose más rápido de lo esperado, un activo que ha
        superado su presupuesto de mantenimiento), cada uno una oración real y calculada, no
        contenido genérico prerredactado.</li>
        <li><strong>Panel de bucle de aprendizaje de IA</strong> \u2014 la propia tasa de
        confiabilidad de recomendaciones de su empresa, una vez que existe suficiente historial para
        calcular una.</li>
      </ul>
      <p>Cada número aquí se remonta a datos reales por activo \u2014 vea <strong>Fórmulas de
      inteligencia de la flota explicadas</strong> para saber exactamente cómo se calculan las
      cifras a nivel de cartera.</p>
    `,
  },
  {
    title: 'Fórmulas de inteligencia de la flota explicadas',
    slug: 'fleet-intelligence-formulas-explained',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 1,
    excerpt: 'Las matemáticas exactas y documentadas detrás de la Salud de la cartera, el Riesgo de capital, y la Calificación de la flota.',
    bodyHtml: `
      <p>Ninguna de las cifras del panel de Inteligencia de la flota es una métrica estándar de la
      industria con una definición universalmente acordada, así que aquí está exactamente cómo
      TraceHub calcula cada una:</p>
      <ul>
        <li><strong>Salud de la cartera</strong> \u2014 un promedio ponderado a través de los niveles
        de salud de su flota (Excelente/Saludable/Necesita atención/Alto riesgo/Crítico), no un
        simple promedio de puntajes brutos.</li>
        <li><strong>Disponibilidad de activos</strong> \u2014 el % de activos actualmente en estado
        «Disponible».</li>
        <li><strong>Riesgo de capital</strong> \u2014 el % del <em>valor</em> total de su flota (no
        solo el conteo de activos) que se encuentra en activos de nivel de salud Alto riesgo o
        Crítico. Esto pondera deliberadamente por dinero, no por cantidad \u2014 diez herramientas
        baratas en mal estado importan menos que un vehículo de alto valor en mal estado.</li>
        <li><strong>Ahorros proyectados</strong> \u2014 el gasto real de mantenimiento y reparación
        hasta ahora en este ciclo en activos ya recomendados para reemplazo, desguace, o venta \u2014
        dinero que dejaría de gastar al actuar sobre la recomendación, no una cifra especulativa
        «predicha por la IA».</li>
        <li><strong>Riesgo financiero/operacional</strong> (Bajo/Medio/Alto) \u2014 nuestros propios
        umbrales documentados sobre el Riesgo de capital y la proporción de activos de Alto riesgo/
        Crítico, respectivamente.</li>
        <li><strong>Calificación general de la flota (A-F)</strong> \u2014 un compuesto de la Salud
        de la cartera (peso del 60%), la Disponibilidad de activos (20%), y el inverso del Riesgo de
        capital (20%), convertido en una calificación con letra.</li>
      </ul>
      <p>Haga clic en cualquier segmento no nulo del Mapa de calor ejecutivo para saltar directamente
      a la lista de activos, pre-filtrada exactamente a ese nivel de salud.</p>
    `,
  },
  {
    title: 'Página de informes y análisis',
    slug: 'reports-and-analytics-page',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 2,
    excerpt: 'Desglose por categoría, depreciación, y actividad por ubicación.',
    bodyHtml: `
      <p>La página de <strong>Informes</strong> tiene tres informes reales: un gráfico de desglose
      de activos por categoría, un informe completo de depreciación (precio de compra frente al
      valor actual estimado por IA por activo, filtrable por categoría), y un registro de actividad
      por ubicación a nivel de empresa (cada evento de escaneo, filtrable por ubicación y tipo de
      evento).</p>
    `,
  },
  {
    title: 'Exportar a CSV, PDF, y PowerPoint',
    slug: 'exporting-csv-pdf-powerpoint',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 3,
    excerpt: 'Dónde se encuentran los botones de exportación, y qué construye realmente la opción de PowerPoint.',
    bodyHtml: `
      <p>La exportación a CSV, PDF, y PowerPoint está disponible en la página de Informes, el panel
      «Activos actualmente asignados» del tablero, y (Super Admin) el registro de auditoría y los
      gráficos de crecimiento a nivel de plataforma.</p>
      <p>La <strong>exportación a PowerPoint</strong> merece mención específica: no solo vuelca una
      hoja de cálculo en diapositivas. Construye una presentación real, lista para usar \u2014 una
      diapositiva de título de marca seguida de diapositivas de tablas limpias y formateadas \u2014
      algo que puede entregar directamente a la dirección sin reformatear nada usted mismo.</p>
      <p>Todas las exportaciones se ejecutan completamente en su navegador \u2014 ningún dato se
      envía a un servicio de exportación de terceros para generar el archivo.</p>
    `,
  },
  {
    title: 'La exportación PDF en detalle',
    slug: 'pdf-export-in-detail',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 4,
    excerpt: 'Lo que realmente contiene un PDF generado.',
    bodyHtml: `
      <p>Las exportaciones PDF tienen marca, múltiples secciones, y están paginadas \u2014 un título
      y subtítulo (el nombre de su empresa y la fecha de generación), seguido de una tabla formateada
      por sección de informe. Se generan completamente en su navegador, por lo que ningún dato sale
      de su máquina hacia un servicio de renderizado de terceros para producir el archivo.</p>
    `,
  },
  {
    title: 'La exportación PowerPoint en detalle',
    slug: 'powerpoint-export-in-detail',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 5,
    excerpt: 'Una presentación real, no una hoja de cálculo volcada en diapositivas.',
    bodyHtml: `
      <p>La opción de PowerPoint construye una presentación real: una diapositiva de título de marca,
      seguida de una diapositiva por sección de informe con una tabla correctamente formateada (no
      una imagen de una) \u2014 construida para ser entregada directamente a la dirección sin que
      usted tenga que reformatear nada. Las tablas de más de 14 filas se truncan en la diapositiva
      con una nota que apunta a la exportación CSV completa para los datos completos.</p>
    `,
  },
  {
    title: 'La exportación CSV en detalle',
    slug: 'csv-export-in-detail',
    locale: 'es',
    category: 'Informes y exportación', categorySortOrder: 7, sortOrder: 6,
    excerpt: 'El formato de exportación más completo y más portátil.',
    bodyHtml: `
      <p>La exportación CSV es el formato más completo \u2014 a diferencia de PDF/PowerPoint, nunca
      se trunca por longitud, lo que la convierte en la elección correcta cuando necesita cada fila
      de un informe grande (por ejemplo, un registro de actividad por ubicación de un año completo)
      en lugar de un resumen listo para presentación.</p>
    `,
  },
  {
    title: 'Planes y su prueba',
    slug: 'plans-and-your-trial',
    locale: 'es',
    category: 'Facturación y suscripciones', categorySortOrder: 8, sortOrder: 0,
    excerpt: 'Prueba, Basic, Pro, y Enterprise, y qué cambia entre ellos.',
    bodyHtml: `
      <p>Cada espacio de trabajo comienza con una prueba gratuita de 30 días con un límite de 10
      activos y acceso completo a las funciones \u2014 nada sobre el Motor de inteligencia, el
      escaneo, o el flujo de baja está restringido durante la prueba. Los niveles pagos (Basic, Pro,
      Enterprise) aumentan sus límites de activos y usuarios; compárelos desde
      <strong>Facturación</strong>.</p>
      <p>Si alcanza el límite de activos de su plan, la creación de activos se bloquea con un mensaje
      claro en lugar de fallar silenciosamente \u2014 actualice desde Facturación para aumentarlo.</p>
    `,
  },
  {
    title: 'Gestionar su suscripción',
    slug: 'managing-your-subscription',
    locale: 'es',
    category: 'Facturación y suscripciones', categorySortOrder: 8, sortOrder: 1,
    excerpt: 'Actualización, renovación automática, y cancelación.',
    bodyHtml: `
      <p>Las suscripciones se facturan en USD y se procesan a través de Flutterwave. A menos que se
      cancele, una suscripción paga se <strong>renueva automáticamente</strong> al final de cada
      ciclo de facturación. Puede cancelar la renovación automática en cualquier momento desde
      <strong>Facturación</strong> \u2014 su plan permanece completamente activo hasta el final del
      período que ya ha pagado; nada se corta de inmediato.</p>
      <p>Su historial de facturas está disponible en la misma página.</p>
    `,
  },
  {
    title: 'Qué sucede si un pago falla',
    slug: 'what-happens-if-payment-fails',
    locale: 'es',
    category: 'Facturación y suscripciones', categorySortOrder: 8, sortOrder: 2,
    excerpt: 'Sus datos nunca se eliminan por un cobro fallido.',
    bodyHtml: `
      <p>Si un pago de renovación automática falla, TraceHub intenta notificarle y puede restringir
      temporalmente el acceso a las funciones de nivel pago hasta que se resuelva \u2014 pero sus
      datos nunca se eliminan como resultado de un pago fallido. Actualice su método de pago y
      reintente desde <strong>Facturación</strong>.</p>
    `,
  },
];

module.exports = spanishReportsBilling;
