module.exports = [
  {
    title: 'Política de privacidad',
    slug: 'privacy-policy',
    locale: 'es',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Última actualización: 2 de agosto de 2026</p>

      <p>TraceHub Inventory (\u00abTraceHub\u00bb, \u00abnosotros\u00bb, \u00abnuestro\u00bb) proporciona un
      software multiempresa de gestión de activos e inventario a organizaciones (\u00abClientes\u00bb,
      \u00abusted\u00bb) y sus usuarios autorizados. Esta Política de privacidad explica qué información
      recopilamos, por qué la recopilamos, cómo se usa, y las opciones que usted tiene \u2014 en
      lenguaje sencillo, sin relleno legal.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Información que recopilamos</h3>
        <p><strong>Información de cuenta y perfil.</strong> Nombre, correo electrónico, número de
        teléfono, rol, y contraseña (almacenada como un hash salado \u2014 nunca vemos ni almacenamos
        su contraseña en texto plano) cuando usted o su Administrador de la empresa crean una
        cuenta.</p>
        <p><strong>Información de la empresa/espacio de trabajo.</strong> El nombre de su
        organización, industria, moneda, y detalles de facturación ingresados al crear un espacio de
        trabajo.</p>
        <p><strong>Datos de activos y operativos.</strong> Todo lo que registra sobre su
        equipo \u2014 nombres, categorías, precios de compra, historial de mantenimiento, fotos,
        campos personalizados \u2014 y los escaneos de puntos de control, asignaciones, y registros de
        baja que su equipo crea al usar la plataforma.</p>
        <p><strong>Datos de puntos de control de ubicación.</strong> Cuando un miembro del equipo
        escanea el código QR de un activo, registramos en qué punto de control (almacén, sucursal,
        sitio) se escaneó y cuándo.</p>
        <div class="th-legal-callout"><strong>Importante:</strong> TraceHub no usa rastreo GPS
        continuo ni instala hardware de rastreo \u2014 los datos de ubicación solo se actualizan
        cuando ocurre un escaneo deliberado.</div>
        <p style="margin-top:0.9rem;"><strong>Registros de uso y seguridad.</strong> Marcas de
        tiempo de inicio de sesión, dirección IP, y un registro de auditoría de acciones
        significativas (quién creó, editó, o eliminó qué) \u2014 conservados para la seguridad de la
        cuenta, la prevención de abusos, y para que su Administrador de la empresa pueda responder
        \u00abquién cambió esto\u00bb.</p>
        <p><strong>Información de pago.</strong> Los pagos de suscripción son procesados por
        <strong>Flutterwave</strong>. TraceHub no recibe ni almacena su número de tarjeta
        completo \u2014 Flutterwave gestiona directamente el cobro y solo comparte lo necesario para
        confirmar un cargo exitoso (monto, plan, referencia de transacción).</p>
        <p><strong>Datos de autenticación de dos factores.</strong> Si activa 2FA, almacenamos el
        secreto de autenticación necesario para verificar sus códigos. No tenemos acceso a su propia
        aplicación de autenticación.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Cómo usamos su información</h3>
        <ul>
          <li>Para operar su espacio de trabajo y proporcionar las funciones que está usando
          activamente \u2014 cálculos de depreciación, puntuación de salud, recomendaciones de baja,
          seguimiento de asignaciones, e informes.</li>
          <li>Para enviar correos transaccionales: restablecimientos de contraseña, configuración
          de 2FA, invitaciones de personal, recordatorios de devolución de asignaciones, y alertas
          de activos vencidos.</li>
          <li>Para detectar y prevenir fraude, abuso, o acceso no autorizado a su espacio de
          trabajo.</li>
          <li>Para generar resúmenes e información asistidos por IA. Cuando las funciones de IA de
          la plataforma llaman a un proveedor externo de modelo de lenguaje, solo enviamos las
          estadísticas agregadas o los datos de activos específicos necesarios para responder la
          solicitud \u2014 no toda su base de datos, ni datos de otros clientes.</li>
          <li>Para mejorar la plataforma según patrones de uso agregados y anonimizados.</li>
        </ul>
        <div class="th-legal-callout"><strong>No vendemos sus datos</strong>, y no los usamos para
        entrenar perfiles publicitarios de terceros.</div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Sus datos permanecen aislados a su empresa</h3>
        <p>TraceHub es multiempresa: cada activo, usuario, y registro está delimitado a una sola
        empresa a nivel de base de datos. Los usuarios y administradores de una empresa no pueden
        ver los datos de otra empresa. El propio rol de Super Admin de TraceHub puede acceder a
        datos operativos a nivel de plataforma (estado de suscripción, conteos de uso) para operar
        el servicio, pero no usa sus datos operativos de activos para ningún propósito más allá del
        soporte y la operación de la plataforma.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Retención y eliminación de datos</h3>
        <p>Conservamos sus datos mientras su espacio de trabajo esté activo. Si cancela su
        suscripción, sus datos permanecen accesibles durante un período de gracia razonable en caso
        de que desee reactivar, después del cual pueden ser eliminados. Los Administradores de la
        empresa pueden solicitar la exportación o eliminación de los datos de su espacio de trabajo
        en cualquier momento contactándonos.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Sus derechos</h3>
        <p>Dependiendo de dónde se encuentre, puede tener derechos de acceso, corrección,
        exportación, o solicitud de eliminación de su información personal. Para ejercer estos
        derechos, contacte a su Administrador de la empresa (para datos que su organización
        controla) o contáctenos directamente usando los datos de contacto en nuestro sitio web.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Privacidad de los menores</h3>
        <p>TraceHub es una herramienta empresarial y no está dirigida a, ni es usada
        conscientemente por, menores de 16 años. No recopilamos conscientemente información
        personal de menores.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Cambios a esta política</h3>
        <p>Actualizaremos la fecha de \u00abÚltima actualización\u00bb anterior cada vez que esta
        política cambie, y publicaremos la versión revisada aquí. Los cambios sustanciales se
        comunicarán a los Administradores de la empresa por correo electrónico.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Contáctenos</h3>
        <p>Las preguntas sobre esta política o sus datos pueden dirigirse al Administrador de la
        empresa de su espacio de trabajo o al soporte de TraceHub a través de los canales listados
        en nuestro sitio web.</p>
      </div>

      <p class="th-legal-disclaimer">Esta política pretende describir con precisión cómo TraceHub
      Inventory realmente maneja los datos a la fecha anterior. No sustituye el asesoramiento
      legal \u2014 si opera en una jurisdicción con requisitos regulatorios específicos (RGPD, la Ley
      de Protección de Datos de Ghana, CCPA, o similar), haga que un asesor legal calificado revise
      esta política antes de confiar en ella para fines de cumplimiento.</p>
    `,
  },
  {
    title: 'Términos de servicio',
    slug: 'terms-of-service',
    locale: 'es',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Última actualización: 2 de agosto de 2026</p>

      <p>Estos Términos de servicio (los \u00abTérminos\u00bb) rigen el acceso y uso de TraceHub
      Inventory (el \u00abServicio\u00bb). Al crear un espacio de trabajo o aceptar una invitación para
      unirse a uno, usted acepta estos Términos en su propio nombre y, si corresponde, en nombre de
      su organización.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Cuentas y elegibilidad</h3>
        <p>Debe proporcionar información precisa al crear una cuenta y mantener confidenciales sus
        credenciales de inicio de sesión \u2014 incluida cualquier contraseña temporal emitida al ser
        invitado. Usted es responsable de toda actividad que ocurra bajo su cuenta. Los
        Administradores de la empresa son responsables de gestionar quién tiene acceso a su espacio
        de trabajo y con qué nivel de permiso.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Planes de suscripción y facturación</h3>
        <p>TraceHub ofrece una prueba gratuita y niveles de suscripción pagos (Básico, Pro,
        Empresarial), cada uno con sus propios límites de activos y usuarios. Los planes pagos se
        facturan en USD y se procesan a través de Flutterwave.</p>
        <div class="th-legal-callout"><strong>Renovación automática:</strong> a menos que se
        cancele, las suscripciones se renuevan automáticamente al final de cada ciclo de
        facturación. Puede cancelar la renovación automática en cualquier momento desde la página de
        Facturación de su espacio de trabajo \u2014 su plan permanece activo y totalmente funcional
        hasta el final del período que ya pagó.</div>
        <p style="margin-top:0.9rem;">Si un pago falla, intentaremos notificarle y podemos
        restringir temporalmente el acceso a las funciones pagas hasta que se resuelva el problema,
        sin eliminar sus datos.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Sus datos y contenido</h3>
        <p><strong>Usted (o su organización) es propietario</strong> de los datos de activos,
        inventario, y operativos que ingresa en TraceHub. No reclamamos propiedad sobre ellos, y no
        los usamos para ningún propósito más allá de proporcionar y mejorar el Servicio como se
        describe en nuestra Política de privacidad. Usted es responsable de la precisión de los
        datos que ingresa \u2014 incluidas las entradas de depreciación, los precios de compra, y
        cualquier cifra usada en los cálculos automatizados de la plataforma.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Uso aceptable</h3>
        <p>Usted acepta no:</p>
        <ul>
          <li>Usar el Servicio para almacenar, rastrear, o procesar algo ilegal.</li>
          <li>Intentar acceder a los datos del espacio de trabajo de otra empresa, o eludir los
          controles de acceso multiempresa que mantienen los espacios de trabajo aislados.</li>
          <li>Realizar ingeniería inversa, extraer datos (scraping), o intentar extraer el software
          subyacente, o usar medios automatizados para sobrecargar el Servicio.</li>
          <li>Usar el Servicio para enviar spam, malware, o contenido que infrinja la propiedad
          intelectual de terceros.</li>
          <li>Hacer mal uso de las funciones de escaneo QR o asignación para tergiversar la
          ubicación, custodia, o condición de un activo.</li>
        </ul>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Contenido generado por IA</h3>
        <p>Las funciones de IA de TraceHub (recomendaciones ejecutivas, sugerencias de baja, el
        asistente de chat, información del tablero) se generan a partir de sus propios datos usando
        modelos de puntuación deterministas y, en algunos casos, un modelo de lenguaje de un
        tercero.</p>
        <div class="th-legal-callout">Estos resultados son herramientas de apoyo a la decisión,
        <strong>no garantías</strong> \u2014 usted sigue siendo responsable de las decisiones
        comerciales que tome basándose en ellos, incluidas las decisiones de baja, reparación, y
        financieras de los activos.</div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Disponibilidad del servicio</h3>
        <p>Buscamos mantener TraceHub disponible y confiable, pero el Servicio se proporciona
        \u00abtal cual\u00bb sin un compromiso de tiempo de actividad garantizado, a menos que exista un
        acuerdo de nivel de servicio por escrito por separado entre usted y TraceHub. Podemos
        realizar mantenimiento programado y haremos esfuerzos razonables para minimizar
        interrupciones.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Limitación de responsabilidad</h3>
        <p>En la máxima medida permitida por la ley, TraceHub no es responsable de daños
        indirectos, incidentales, o consecuentes que surjan del uso del Servicio, incluidas las
        decisiones tomadas basándose en estimaciones de depreciación, puntajes de salud, o
        recomendaciones de baja que genera la plataforma. Nuestra responsabilidad total por
        cualquier reclamo relacionado con el Servicio se limita al monto que nos pagó en los doce
        meses anteriores al reclamo.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Terminación</h3>
        <p>Puede cancelar su suscripción en cualquier momento. Podemos suspender o terminar el
        acceso al Servicio para cuentas que violen estos Términos, incluidas las disposiciones de
        uso aceptable anteriores, tras un aviso razonable cuando sea posible.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">9</span> Ley aplicable</h3>
        <p>Estos Términos se rigen por las leyes de la República de Ghana, sin considerar los
        principios de conflicto de leyes, a menos que un acuerdo firmado por separado entre usted y
        TraceHub especifique lo contrario.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">10</span> Cambios a estos Términos</h3>
        <p>Actualizaremos la fecha de \u00abÚltima actualización\u00bb anterior cuando estos Términos
        cambien, y notificaremos a los Administradores de la empresa sobre cambios sustanciales por
        correo electrónico. El uso continuado del Servicio después de que un cambio entre en vigor
        constituye la aceptación de los Términos revisados.</p>
      </div>

      <p class="th-legal-disclaimer">Este es un borrador genuino y completo, redactado para reflejar
      con precisión cómo TraceHub Inventory realmente opera a la fecha anterior \u2014 no un texto de
      relleno. No sustituye el asesoramiento legal específico de su jurisdicción; haga que un
      asesor legal calificado lo revise antes de confiar en él para un lanzamiento público.</p>
    `,
  },
  {
    title: 'Política de cookies',
    slug: 'cookie-policy',
    locale: 'es',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Última actualización: 2 de agosto de 2026</p>

      <p>Esta política explica, con precisión, qué es lo que TraceHub Inventory realmente almacena
      en su navegador \u2014 no una plantilla genérica.</p>

      <div class="th-legal-callout">A la fecha anterior, TraceHub no coloca ninguna cookie HTTP
      tradicional. En su lugar, usa el <strong>almacenamiento local</strong> de su navegador, un
      mecanismo de almacenamiento del lado del navegador similar, para un conjunto pequeño y
      específico de propósitos.</div>

      <div class="th-legal-section" style="margin-top:1.1rem;">
        <h3><span class="th-legal-badge">1</span> Qué almacenamos, y por qué</h3>
        <ul>
          <li><strong>Tokens de sesión.</strong> Cuando inicia sesión, un token de acceso y un token
          de actualización se almacenan en el almacenamiento local para que permanezca conectado
          mientras navega por la aplicación, sin volver a ingresar su contraseña en cada página.</li>
          <li><strong>Preferencias de interfaz.</strong> El tema que eligió (Claro, Oscuro, o
          Esmeralda) se recuerda para que la aplicación se vea como la dejó la próxima vez que la
          visite.</li>
        </ul>
        <p>Esa es la lista completa. No colocamos cookies publicitarias, no usamos rastreadores de
        análisis de terceros, y no compartimos datos de almacenamiento del navegador con redes
        publicitarias \u2014 porque no tenemos ninguna.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Por qué almacenamiento local en vez de cookies</h3>
        <p>El almacenamiento local mantiene estos datos en su dispositivo y solo se envían a los
        propios servidores de TraceHub cuando la aplicación los necesita (por ejemplo, para adjuntar
        su token de sesión a una solicitud de API) \u2014 no se transmiten automáticamente con cada
        solicitud como sí lo hacen las cookies tradicionales, y no son accesibles para otros sitios
        web.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Gestionar o borrar estos datos</h3>
        <p>Puede borrar el almacenamiento local en cualquier momento a través de la configuración de
        su navegador (generalmente bajo \u00abBorrar datos de navegación\u00bb o \u00abConfiguración del
        sitio\u00bb). Hacerlo cerrará su sesión y restablecerá su preferencia de tema al valor
        predeterminado, pero no afectará ningún dato almacenado en su propio espacio de trabajo de
        TraceHub.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Servicios de terceros</h3>
        <p>El procesamiento de pagos (Flutterwave) y, cuando está habilitada, la entrega de correo
        electrónico ocurren a través de servicios de terceros separados que pueden colocar sus
        propias cookies durante el pago o en correos transaccionales, regidos por sus propias
        políticas de privacidad y cookies en lugar de esta.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Cambios a esta política</h3>
        <p>Si TraceHub alguna vez comienza a usar cookies o mecanismos de almacenamiento
        adicionales \u2014 para análisis o de otro modo \u2014 actualizaremos esta página y la fecha de
        \u00abÚltima actualización\u00bb anterior en lugar de cambiar silenciosamente lo que se divulga
        aquí.</p>
      </div>

      <p class="th-legal-disclaimer">Esta política describe la implementación técnica real de
      TraceHub a la fecha anterior, no un texto genérico estándar. No sustituye el asesoramiento
      legal específico de los requisitos de cookies/consentimiento de su jurisdicción (como las
      reglas de ePrivacy de la UE) \u2014 haga que un asesor legal calificado lo revise antes de
      confiar en él para fines de cumplimiento.</p>
    `,
  },
];
