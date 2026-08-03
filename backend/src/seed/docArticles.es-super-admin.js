const spanishSuperAdmin = [
  {
    title: 'Gestionar empresas inquilinas',
    slug: 'managing-tenant-companies',
    locale: 'es',
    category: 'Para Super Admins', categorySortOrder: 9, sortOrder: 0,
    excerpt: 'La vista a nivel de plataforma en todas las empresas que usan TraceHub.',
    bodyHtml: `
      <p>Los Super Admins tienen un portal completamente separado (<code>/admin</code>) de la
      aplicación a nivel de empresa, cubriendo la plataforma en su conjunto en lugar de los datos de
      un solo espacio de trabajo. Desde <strong>Empresas</strong>, puede ver cada empresa inquilina,
      su plan, conteos de activos/usuarios, y estado de suscripción, y cambiar el estado de una
      empresa (activa/suspendida) directamente.</p>
      <p>Abrir una empresa individual muestra su propia página de detalle \u2014 cifras de uso,
      usuarios, e historial de suscripción \u2014 sin exponerle a usted, como Super Admin, los
      registros de activos reales de esa empresa; los propios datos operativos de la plataforma
      están separados de los datos de clientes por diseño, según la política de privacidad.</p>
    `,
  },
  {
    title: 'Gestión de contenido CMS',
    slug: 'cms-content-management',
    locale: 'es',
    category: 'Para Super Admins', categorySortOrder: 9, sortOrder: 1,
    excerpt: 'Editar la página de inicio, testimonios, preguntas frecuentes, y páginas legales/documentación.',
    bodyHtml: `
      <p>Todo en el sitio de marketing público es editable desde el portal Super Admin sin cambio de
      código:</p>
      <ul>
        <li><strong>Contenido de inicio y de inicio de sesión</strong> \u2014 el titular y subtítulo
        de la página de inicio.</li>
        <li><strong>Testimonios</strong> \u2014 las citas desplazables en la página de inicio.</li>
        <li><strong>Preguntas frecuentes</strong> \u2014 también funciona como la base de
        conocimiento del asistente de IA en modo marketing.</li>
        <li><strong>Enlaces del pie de página</strong> \u2014 agregue, elimine, o reordene cualquier
        enlace del pie de página.</li>
        <li><strong>Páginas personalizadas</strong> \u2014 la política de privacidad, los términos de
        servicio, y la política de cookies son todas editables aquí, junto con cualquier página
        adicional que cree.</li>
        <li><strong>Blog / actualizaciones</strong> \u2014 escriba y publique nuevas entradas, modere
        comentarios.</li>
      </ul>
      <p>Todo el contenido CMS se autorrepara en un nuevo reensemillado para un pequeño conjunto de
      páginas «gestionadas» (las páginas legales y esta documentación) \u2014 lo que significa que
      las actualizaciones de contenido proporcionadas por la plataforma llegan automáticamente a una
      instalación ya en ejecución, mientras que las ediciones personalizadas a páginas no relacionadas
      nunca se sobrescriben silenciosamente.</p>
    `,
  },
  {
    title: 'Configuración de correo electrónico / SMTP',
    slug: 'email-smtp-configuration',
    locale: 'es',
    category: 'Para Super Admins', categorySortOrder: 9, sortOrder: 2,
    excerpt: 'Por qué esto debe configurarse antes de que clientes reales dependan de la plataforma.',
    bodyHtml: `
      <p>Los restablecimientos de contraseña, las invitaciones de personal, y las alertas de activos
      vencidos dependen todos de la entrega real de correo electrónico. Configure su proveedor SMTP
      desde <strong>Correo electrónico/SMTP</strong> en el portal Super Admin \u2014 host, puerto,
      nombre de usuario, contraseña, y nombre del remitente.</p>
      <div class="th-legal-callout"><strong>Importante:</strong> sin un proveedor SMTP configurado,
      TraceHub no falla ruidosamente \u2014 registra silenciosamente lo que «habría enviado» en lugar
      de entregarlo realmente. Una empresa real que se registre haría clic en «olvidé mi contraseña»
      y no recibiría nada, sin error visible. Configure esto antes de abrir la plataforma a usuarios
      reales.</div>
    `,
  },
  {
    title: 'Configuración de pagos / Flutterwave',
    slug: 'payment-flutterwave-configuration',
    locale: 'es',
    category: 'Para Super Admins', categorySortOrder: 9, sortOrder: 3,
    excerpt: 'Configurar la facturación de suscripción real.',
    bodyHtml: `
      <p>La facturación de suscripciones se ejecuta a través de Flutterwave. Configure sus claves
      API de Flutterwave desde <strong>Pagos</strong> en el portal Super Admin. El webhook que
      confirma los cobros exitosos y fallidos (y impulsa la renovación automática) es real y está
      verificado por firma \u2014 no una simulación \u2014 pero debería probarse contra sus
      credenciales reales de producción de Flutterwave antes de confiar en él para la facturación
      real de clientes, ya que el comportamiento en sandbox/modo de prueba puede diferir de la
      producción.</p>
    `,
  },
  {
    title: 'Gestionar planes y cupones',
    slug: 'managing-plans-and-coupons',
    locale: 'es',
    category: 'Para Super Admins', categorySortOrder: 9, sortOrder: 4,
    excerpt: 'Definir niveles de suscripción y códigos de descuento.',
    bodyHtml: `
      <p>Desde <strong>Planes</strong>, defina el precio, ciclo de facturación, y límites de
      activos/usuarios de cada nivel de suscripción \u2014 estos son los que las empresas ven y
      eligen en su propia página de Facturación. Desde <strong>Cupones</strong>, cree códigos de
      descuento con un descuento porcentual o de monto fijo, una fecha de expiración opcional, y un
      límite de uso.</p>
    `,
  },
  {
    title: 'Registro de auditoría global y seguridad',
    slug: 'global-audit-log-and-security',
    locale: 'es',
    category: 'Para Super Admins', categorySortOrder: 9, sortOrder: 5,
    excerpt: 'Monitoreo de actividad a nivel de plataforma.',
    bodyHtml: `
      <p>El <strong>Registro de auditoría</strong> del Super Admin muestra acciones significativas
      en cada empresa de la plataforma \u2014 inicios de sesión, transiciones de casos de baja,
      cambios de plan \u2014 cada una con una marca de tiempo real y el usuario que actúa, exportable
      a CSV o PDF. La página de <strong>Seguridad</strong> cubre la configuración de cuenta y
      seguridad a nivel de plataforma para la propia cuenta Super Admin.</p>
    `,
  },
];

module.exports = spanishSuperAdmin;
