const spanishGettingStarted = [
  {
    title: '¿Qué es TraceHub Inventory?',
    slug: 'what-is-tracehub-inventory',
    locale: 'es',
    category: 'Primeros pasos', categorySortOrder: 0, sortOrder: 0,
    excerpt: 'Un recorrido rápido por lo que hace TraceHub y a quién está dirigido.',
    bodyHtml: `
      <p>TraceHub Inventory es una plataforma multiempresa de gestión de activos e inventario,
      diseñada para organizaciones con equipos físicos \u2014 laptops, vehículos, generadores,
      herramientas, mobiliario, cualquier cosa con un precio de compra y una vida útil \u2014 que
      necesitan saber dónde están, cuánto valen, quién los tiene, y cuándo requieren atención.</p>

      <p>Lo que lo distingue de una hoja de cálculo o un registro básico de activos es el
      <strong>motor de inteligencia de activos</strong>: seis motores de puntuación reales y
      deterministas que funcionan continuamente en segundo plano sobre cada activo registrado,
      calculando la depreciación, un puntaje de salud, el riesgo de falla, un calendario de
      mantenimiento y una recomendación de baja \u2014 todo sin que usted tenga que hacer nada más
      allá de la entrada inicial de datos.</p>

      <h3>Para quién es esto</h3>
      <ul>
        <li><strong>Los equipos operativos</strong> que rastrean equipos en almacenes, sucursales o
        sitios de trabajo.</li>
        <li><strong>Los equipos financieros</strong> que necesitan depreciación precisa y automática
        en lugar de una hoja de cálculo mantenida manualmente.</li>
        <li><strong>Los gerentes de TI/activos</strong> que deciden, activo por activo, si reparar o
        reemplazar.</li>
        <li><strong>Los ejecutivos</strong> que quieren una vista general de la cartera \u2014 salud
        de la flota, capital en riesgo, ahorros proyectados \u2014 sin tener que buscar en registros
        individuales.</li>
      </ul>

      <h3>Cómo está organizado</h3>
      <p>Todo en TraceHub está delimitado al espacio de trabajo de su empresa. Dentro de ese
      espacio:</p>
      <ul>
        <li><strong>Los activos</strong> son las piezas individuales de equipo que usted registra.</li>
        <li><strong>Las ubicaciones</strong> son puntos de control (un almacén, una sucursal) donde
        los activos se escanean para registrar entrada y salida.</li>
        <li><strong>Las asignaciones</strong> registran qué miembro del personal o contacto externo
        tiene actualmente un activo.</li>
        <li><strong>Los casos de baja</strong> siguen un flujo de aprobación formal de seis etapas
        cuando el tiempo de un activo se ha agotado.</li>
        <li><strong>El equipo</strong> es donde invita a colegas y define su rol (Administrador de la
        empresa, Gerente, o Personal).</li>
      </ul>

      <p>Cada una de estas áreas está potenciada por el motor de inteligencia \u2014 verá puntajes de
      salud en la lista de activos, un panel de inteligencia de la flota en el tablero, y
      recomendaciones de baja guiando el flujo de baja.</p>
    `,
  },
  {
    title: 'Creación de su espacio de trabajo',
    slug: 'creating-your-workspace',
    locale: 'es',
    category: 'Primeros pasos', categorySortOrder: 0, sortOrder: 1,
    excerpt: 'Registrarse, su prueba gratuita, y qué sucede el primer día.',
    bodyHtml: `
      <p>Haga clic en <strong>«Comenzar gratis»</strong> en la página de inicio para crear su
      espacio de trabajo. Proporcionará su nombre, correo electrónico, una contraseña, y el nombre
      de su empresa \u2014 eso es todo. No se requiere tarjeta, y usted se convierte automáticamente
      en el primer <strong>Administrador de la empresa</strong> de su nuevo espacio de trabajo.</p>

      <h3>Su prueba</h3>
      <p>Cada nuevo espacio de trabajo comienza con una prueba de 30 días con un límite de 10
      activos. Puede registrar hasta 10 activos y usar cada función en profundidad \u2014 el motor de
      inteligencia, el escaneo, las asignaciones, el flujo de baja, los informes \u2014 nada está
      restringido durante la prueba. Cuando esté listo para agregar más de 10 activos o necesite más
      cupos de equipo, actualice a un plan pago (Basic, Pro o Enterprise) desde
      <strong>Facturación</strong>.</p>

      <h3>Qué hacer primero</h3>
      <ol>
        <li>Vaya a <strong>Activos \u2192 Agregar activo</strong> y registre su primer equipo.
        Ingrese un precio de compra y una categoría, y el motor de depreciación estima
        inmediatamente su valor actual, vida útil, y valor de rescate.</li>
        <li>Vaya a <strong>Ubicaciones</strong> y agregue su primer punto de control (un almacén, una
        oficina) \u2014 ahí es donde su equipo escaneará los activos.</li>
        <li>Vaya a <strong>Equipo</strong> e invite a su primer colega si no trabaja solo.</li>
      </ol>

      <p>Consulte la <strong>Lista de inicio rápido</strong> para el camino más rápido desde cero
      hasta un espacio de trabajo completamente configurado.</p>
    `,
  },
  {
    title: 'Lista de inicio rápido',
    slug: 'quick-start-checklist',
    locale: 'es',
    category: 'Primeros pasos', categorySortOrder: 0, sortOrder: 2,
    excerpt: 'El camino más rápido entre registrarse y tener un espacio de trabajo totalmente funcional.',
    bodyHtml: `
      <p>Si prefiere avanzar rápido en lugar de leer cada artículo primero, aquí está el camino real
      más corto hacia una configuración funcional.</p>

      <h3>1. Configure sus categorías y ubicaciones (5 minutos)</h3>
      <p>Consulte <strong>Activos \u2192 Categorías</strong> para ver las categorías por defecto
      (Laptops, Vehículos, Mobiliario de oficina, etc.) y ajuste el perfil de vida útil/valor de
      rescate para cada una si su equipo envejece de manera diferente a lo que suponen los valores
      predeterminados. Luego agregue sus verdaderos puntos de control bajo
      <strong>Ubicaciones</strong> \u2014 un almacén, cada sucursal, cada sitio de trabajo.</p>

      <h3>2. Registre sus activos reales (sea cual sea la longitud de su lista)</h3>
      <p>Para cada activo: nombre, categoría, precio de compra, fecha de compra. Eso es lo mínimo
      para que funcione el motor de depreciación. Si desea una puntuación de salud/falla más rica de
      inmediato, abra también la sección «Datos del motor de inteligencia de activos» del formulario
      y complete la intensidad de uso, el historial de mantenimiento, y el entorno \u2014 cuanto más
      proporcione, más confiables serán los puntajes de la IA desde el primer día.</p>

      <h3>3. Imprima o muestre sus códigos QR</h3>
      <p>Cada activo recibe un código QR en el momento de su creación \u2014 abra el activo y haga
      clic en <strong>Descargar QR</strong>. Imprímalo en una etiqueta y péguelo al equipo, o
      simplemente muéstrelo en una pantalla cerca del equipo por ahora.</p>

      <h3>4. Invite a su equipo</h3>
      <p>Vaya a <strong>Equipo \u2192 Agregar miembro</strong>. Cada persona invitada recibe una
      contraseña temporal por correo electrónico y debe establecer su propia contraseña (con
      configuración opcional de 2FA) antes de poder acceder a cualquier otra cosa.</p>

      <h3>5. Realice un escaneo real</h3>
      <p>Desde <strong>Escanear</strong>, use la cámara de su teléfono para escanear el código QR de
      un activo y registrarlo en una ubicación. Esto confirma que todo su flujo \u2014 generación de
      QR, escaneo, seguimiento de ubicación \u2014 funciona de extremo a extremo.</p>

      <p>Eso es todo \u2014 todo lo demás (asignaciones, flujo de baja, informes) se basa en esta
      misma base y puede aprovecharlo según lo necesite.</p>
    `,
  },
  {
    title: 'Roles y permisos',
    slug: 'roles-and-permissions',
    locale: 'es',
    category: 'Primeros pasos', categorySortOrder: 0, sortOrder: 3,
    excerpt: 'Lo que pueden hacer respectivamente el Administrador de la empresa, el Gerente y el Personal.',
    bodyHtml: `
      <p>Cada persona en su espacio de trabajo tiene uno de tres roles. No existe un sistema de
      permisos personalizado/granular más allá de estos tres roles \u2014 están diseñados para
      alinearse claramente con la forma en que la mayoría de los equipos operativos están realmente
      estructurados.</p>

      <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
        <thead><tr style="text-align:left;border-bottom:2px solid #E2E8F0;">
          <th style="padding:0.5rem;">Rol</th><th style="padding:0.5rem;">Puede hacer</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #EDF2F7;">
            <td style="padding:0.5rem;vertical-align:top;"><strong>Administrador de la empresa</strong></td>
            <td style="padding:0.5rem;">Todo \u2014 incluida la facturación, invitar/retirar miembros
            del equipo, y la aprobación final en el flujo de baja. La persona que se registra primero
            se convierte automáticamente en Administrador de la empresa; puede tener varios.</td>
          </tr>
          <tr style="border-bottom:1px solid #EDF2F7;">
            <td style="padding:0.5rem;vertical-align:top;"><strong>Gerente</strong></td>
            <td style="padding:0.5rem;">Activos, asignaciones, el flujo de baja (etapa de revisión del
            gerente), ubicaciones, e informes. No puede acceder a Facturación ni a la gestión de
            Equipo.</td>
          </tr>
          <tr>
            <td style="padding:0.5rem;vertical-align:top;"><strong>Personal</strong></td>
            <td style="padding:0.5rem;">Acceso operativo diario: registrar y escanear activos, ver y
            crear asignaciones. No puede aprobar bajas, gestionar el equipo, ni ver la
            facturación.</td>
          </tr>
        </tbody>
      </table>

      <p>Los roles se definen cuando invita a alguien desde <strong>Equipo \u2192 Agregar
      miembro</strong>, y un Administrador de la empresa puede cambiar el rol de cualquiera más tarde
      desde la misma página.</p>
    `,
  },
];

module.exports = spanishGettingStarted;
