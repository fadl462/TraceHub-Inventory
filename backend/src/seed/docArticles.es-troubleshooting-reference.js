const spanishTroubleshootingReference = [
  {
    title: 'No puedo iniciar sesión',
    slug: 'troubleshoot-cant-log-in',
    locale: 'es',
    category: 'Solución de problemas y FAQ', categorySortOrder: 10, sortOrder: 0,
    excerpt: 'Las causas más comunes y qué verificar.',
    bodyHtml: `
      <ul>
        <li><strong>«Correo electrónico o contraseña inválidos»</strong> \u2014 verifique dos veces
        si hay espacios adicionales, y recuerde que las contraseñas distinguen entre mayúsculas y
        minúsculas. Use <strong>Olvidé mi contraseña</strong> si no está seguro.</li>
        <li><strong>No pasa nada / aparece una pantalla bloqueada</strong> \u2014 si fue invitado
        recientemente a un espacio de trabajo, puede estar en la pantalla de configuración
        obligatoria de contraseña del primer inicio de sesión; debe establecer su propia contraseña
        (y opcionalmente 2FA) antes de que cualquier otra cosa se vuelva accesible. Esto se aplica
        por diseño, no es un error.</li>
        <li><strong>Código 2FA rechazado</strong> \u2014 los códigos de la aplicación de
        autenticación están basados en el tiempo; asegúrese de que el reloj de su dispositivo sea
        preciso. Si ha perdido el acceso a su aplicación de autenticación por completo, contacte a su
        Administrador de la empresa, ya que el restablecimiento de 2FA para una cuenta bloqueada es
        una acción administrativa.</li>
      </ul>
    `,
  },
  {
    title: 'Mi compañero invitado nunca recibió su correo electrónico',
    slug: 'troubleshoot-invite-email-not-received',
    locale: 'es',
    category: 'Solución de problemas y FAQ', categorySortOrder: 10, sortOrder: 1,
    excerpt: 'Casi siempre un problema de configuración SMTP, no un error en la invitación misma.',
    bodyHtml: `
      <p>Si un miembro del equipo recién invitado nunca recibe su correo electrónico de contraseña
      temporal, la causa más común con diferencia es que el proveedor SMTP de su plataforma aún no
      ha sido configurado por un Super Admin \u2014 sin eso, TraceHub no falla ruidosamente, registra
      silenciosamente el correo en lugar de enviarlo. Verifique con quien gestiona su implementación
      de TraceHub que el SMTP esté realmente configurado, o revise las carpetas de spam/correo no
      deseado como segunda posibilidad.</p>
    `,
  },
  {
    title: 'El puntaje de salud, riesgo de falla, o recomendación de un activo no muestra nada',
    slug: 'troubleshoot-blank-intelligence-scores',
    locale: 'es',
    category: 'Solución de problemas y FAQ', categorySortOrder: 10, sortOrder: 2,
    excerpt: 'Por qué un activo recién creado podría mostrar brevemente puntajes en blanco.',
    bodyHtml: `
      <p>El Motor de inteligencia se recalcula cada vez que un activo se crea o actualiza \u2014 si ve
      puntajes en blanco inmediatamente después de crear un activo, actualice la página; el cálculo
      se ejecuta de forma sincrónica como parte de guardar el activo, por lo que un puntaje en blanco
      después de una actualización es inusual y vale la pena verificar que el activo realmente tenga
      un precio de compra y categoría establecidos, ya que esas son las entradas mínimas que el motor
      necesita para producir algo en absoluto.</p>
    `,
  },
  {
    title: 'Al escanear un código QR dice que el activo no fue encontrado',
    slug: 'troubleshoot-scan-asset-not-found',
    locale: 'es',
    category: 'Solución de problemas y FAQ', categorySortOrder: 10, sortOrder: 3,
    excerpt: 'Causas comunes: códigos impresos obsoletos, espacio de trabajo incorrecto, o un activo archivado.',
    bodyHtml: `
      <ul>
        <li><strong>El activo fue archivado o eliminado</strong> desde que se imprimió la
        etiqueta \u2014 su token QR ya no corresponde a un activo activo.</li>
        <li><strong>Ha iniciado sesión en el espacio de trabajo de una empresa diferente</strong> a
        la que registró el activo \u2014 los tokens QR están delimitados a la empresa que los creó.</li>
        <li><strong>Un código impreso dañado o de baja calidad</strong> \u2014 intente la opción de
        entrada manual de token en la página Escanear en lugar de la cámara si una etiqueta física se
        ha vuelto difícil de leer.</li>
      </ul>
    `,
  },
  {
    title: '¿Qué monedas se admiten para el precio de compra?',
    slug: 'faq-supported-currencies',
    locale: 'es',
    category: 'Solución de problemas y FAQ', categorySortOrder: 10, sortOrder: 4,
    excerpt: 'USD es el estándar; la conversión GHS está activa; se planean más.',
    bodyHtml: `
      <p>El precio de compra siempre se almacena en USD en toda la plataforma, para informes y
      comparaciones consistentes. Si pagó en cedis ghaneses (GHS), use el asistente de conversión de
      moneda integrado en el formulario de agregar/editar activo para convertir automáticamente su
      monto local a USD. La conversión de yuan chino, euro, y libra esterlina está planeada pero aún
      no activa \u2014 se muestra como «próximamente» en el selector de moneda.</p>
    `,
  },
  {
    title: '¿TraceHub rastrea la ubicación GPS?',
    slug: 'faq-does-tracehub-track-gps',
    locale: 'es',
    category: 'Solución de problemas y FAQ', categorySortOrder: 10, sortOrder: 5,
    excerpt: 'No \u2014 y aquí está por qué es una elección deliberada, no una limitación.',
    bodyHtml: `
      <p>No. TraceHub deliberadamente no usa hardware de rastreo GPS o IoT. La ubicación se rastrea
      mediante el <strong>escaneo de puntos de control</strong> \u2014 la ubicación de un activo se
      actualiza cuando alguien realmente escanea su código QR en una ubicación, usando nada más que
      una cámara de teléfono. Esta es una decisión de diseño rentable, solo de software: sin
      hardware que comprar, instalar, o mantener. El compromiso es honesto y vale la pena
      entenderlo: la ubicación mostrada de un activo es donde fue <em>escaneado por última
      vez</em>, no una posición en vivo que se actualiza continuamente.</p>
    `,
  },
  {
    title: 'Glosario de términos',
    slug: 'glossary-of-terms',
    locale: 'es',
    category: 'Referencia', categorySortOrder: 11, sortOrder: 0,
    excerpt: 'Cada término específico de TraceHub en un solo lugar \u2014 actualizado a medida que la plataforma crece.',
    bodyHtml: `
      <div class="th-legal-callout">Este glosario se mantiene preciso según la versión actual, no
      congelado en el lanzamiento \u2014 a medida que se agregan nuevas funciones y términos a
      TraceHub, esta página se actualiza junto con ellos.</div>

      <h3 style="margin-top:1.5rem;">Puntajes y motores</h3>
      <dl>
        <dt><strong>Puntaje de salud</strong></dt><dd>Compuesto ponderado de 0 a 100 de edad, mantenimiento, reparaciones, uso, inspección, y entorno. Vea <strong>Puntaje de salud del activo</strong>.</dd>
        <dt><strong>Niveles de salud</strong></dt><dd>Las cinco bandas en las que cae un Puntaje de salud: Excelente (90-100), Saludable (75-89), Necesita atención (60-74), Alto riesgo (40-59), Crítico (por debajo de 40).</dd>
        <dt><strong>Puntaje de riesgo</strong></dt><dd>Índice de riesgo general de 0 a 100 detrás de los cuatro horizontes de probabilidad de falla (30/60/90/180 días).</dd>
        <dt><strong>Puntaje de preparación para baja</strong></dt><dd>Puntaje de 0 a 100 detrás de la recomendación MANTENER/REPARAR/VENDER/DESGUAZAR/REEMPLAZAR.</dd>
        <dt><strong>Puntaje de confianza IA</strong></dt><dd>Cuánta evidencia real respalda los puntajes de un activo dado \u2014 campos completados, registros de mantenimiento, datos de inspección, valor de mercado.</dd>
        <dt><strong>Bucle de aprendizaje de IA</strong></dt><dd>Rastrea si ignorar una recomendación de baja fue seguido posteriormente por una falla real, retroalimentando un ajuste acotado en la confianza futura.</dd>
        <dt><strong>Panel de información de IA</strong></dt><dd>Cinco detectores de patrones basados en reglas en el tablero \u2014 vea <strong>el desglose completo</strong>.</dd>
        <dt><strong>Motor de programación de mantenimiento / Fecha de próximo servicio</strong></dt><dd>Una fecha predicha real en la que un activo es el próximo debido para servicio, basada en la intensidad de uso y la salud actual.</dd>
        <dt><strong>Fórmula personalizada</strong></dt><dd>Una fórmula de depreciación escrita por el usuario usando un analizador aritmético seguro y restringido \u2014 sin ejecución de código.</dd>
      </dl>

      <h3>Nivel de cartera (panel de inteligencia de la flota)</h3>
      <dl>
        <dt><strong>Salud de la cartera</strong></dt><dd>Promedio ponderado a nivel de flota a través de los niveles de salud.</dd>
        <dt><strong>Riesgo de capital</strong></dt><dd>% del <em>valor</em> total de la flota (no el conteo de activos) que se encuentra en activos de nivel de salud Alto riesgo/Crítico.</dd>
        <dt><strong>Disponibilidad de activos</strong></dt><dd>% de su flota actualmente en estado «Disponible».</dd>
        <dt><strong>Calificación de la flota</strong></dt><dd>Calificación compuesta con letra de A a F a partir de la Salud de la cartera, la Disponibilidad de activos, y el Riesgo de capital.</dd>
        <dt><strong>Mapa de calor ejecutivo</strong></dt><dd>Desglose cliqueable por nivel de salud en el tablero, enlazando a una lista de activos filtrada.</dd>
        <dt><strong>Ahorros proyectados</strong></dt><dd>Gasto real de mantenimiento/reparación hasta ahora en activos ya recomendados para reemplazo, desguace, o venta.</dd>
      </dl>

      <h3>Estado de los activos</h3>
      <dl>
        <dt><strong>Disponible / Asignado / En mantenimiento / Reservado / Dado de baja / Perdido</strong></dt>
        <dd>Los seis estados posibles que puede tener un activo \u2014 vea <strong>Comprender el estado de un activo</strong>.</dd>
        <dt><strong>Activo inactivo</strong></dt><dd>Un activo en estado «Disponible» que ha registrado más de 200 horas inactivas \u2014 un candidato para reasignación o venta.</dd>
      </dl>

      <h3>Seguimiento y flujo de trabajo</h3>
      <dl>
        <dt><strong>Punto de control</strong></dt><dd>Una ubicación \u2014 un almacén, sucursal, o sitio \u2014 donde los activos se escanean para registrar entrada y salida.</dd>
        <dt><strong>Caso de baja</strong></dt><dd>Un registro formal que sigue a un activo a través del flujo de baja de seis etapas.</dd>
        <dt><strong>Etapas de baja</strong></dt><dd>Marcado \u2192 Revisión del gerente \u2192 Revisión financiera \u2192 Aprobado \u2192 (Subasta/Venta/Donación/Desguace/Reciclaje) \u2192 Dado de baja. Un caso también puede ser Rechazado en cualquier etapa.</dd>
        <dt><strong>Estado de asignación</strong></dt><dd>Activo, Vencido, Devuelto, o Cancelado.</dd>
        <dt><strong>Tarifa de alquiler</strong></dt><dd>Un cargo opcional rastreado en una asignación cuando el equipo se alquila, con un interruptor Pagado/No pagado.</dd>
        <dt><strong>Registro de auditoría</strong></dt><dd>Un registro real y con marca de tiempo de cada acción significativa en su espacio de trabajo.</dd>
      </dl>

      <h3>Roles y seguridad</h3>
      <dl>
        <dt><strong>Administrador de la empresa / Gerente / Personal</strong></dt><dd>Los tres roles \u2014 vea <strong>Roles y permisos</strong>.</dd>
        <dt><strong>Autenticación de dos factores (2FA)</strong></dt><dd>Un paso de inicio de sesión adicional opcional a través de cualquier aplicación de autenticación.</dd>
        <dt><strong>Primer inicio de sesión pendiente</strong></dt><dd>Un estado de miembro del equipo mostrado hasta que complete la configuración obligatoria de contraseña temporal.</dd>
      </dl>

      <h3>Facturación</h3>
      <dl>
        <dt><strong>Prueba / Basic / Pro / Enterprise</strong></dt><dd>Los niveles de suscripción, cada uno con sus propios límites de activos y usuarios.</dd>
        <dt><strong>Estado de suscripción</strong></dt><dd>En prueba, Activo, Pago atrasado, Cancelado, o Expirado.</dd>
        <dt><strong>Cupón</strong></dt><dd>Un código de descuento (porcentaje o monto fijo) que un Super Admin puede crear para nuevos registros.</dd>
      </dl>

      <p style="margin-top:1.5rem;font-size:0.85rem;color:#6B7280;">¿Falta un término que esperaba ver aquí? Pregúntele al asistente de IA, o infórmele al Administrador de la empresa de su espacio de trabajo para que pueda ser agregado.</p>
    `,
  },
];

module.exports = spanishTroubleshootingReference;
