const spanishTeamSecurity = [
  {
    title: 'Invitar a miembros del equipo',
    slug: 'inviting-team-members',
    locale: 'es',
    category: 'Equipo y seguridad', categorySortOrder: 6, sortOrder: 0,
    excerpt: 'Cómo funcionan las invitaciones, y qué ve la nueva persona.',
    bodyHtml: `
      <p>Desde <strong>Equipo \u2192 Agregar miembro</strong>, ingrese su nombre, correo
      electrónico, y rol (Gerente o Personal \u2014 Administrador de la empresa se establece por
      separado si es necesario). Reciben un correo electrónico con una contraseña temporal generada
      por el sistema.</p>
      <p>La página Equipo también muestra, para cada miembro: teléfono, último acceso, fecha de
      ingreso, estado de 2FA, y una insignia de <strong>«Primer inicio de sesión pendiente»</strong>
      para cualquiera que aún no haya completado la configuración obligatoria de contraseña (vea el
      siguiente artículo) \u2014 útil para saber quién todavía necesita un recordatorio.</p>
    `,
  },
  {
    title: 'La configuración obligatoria de contraseña en el primer inicio de sesión',
    slug: 'mandatory-first-login-password-setup',
    locale: 'es',
    category: 'Equipo y seguridad', categorySortOrder: 6, sortOrder: 1,
    excerpt: 'Por qué un nuevo miembro del equipo no puede simplemente empezar a usar su contraseña temporal.',
    bodyHtml: `
      <p>Una contraseña temporal solo está pensada para hacer que alguien entre una vez. Cuando una
      persona recién invitada inicia sesión con ella, TraceHub bloquea el acceso a todo lo demás en
      la aplicación hasta que establezca su propia contraseña \u2014 esto lo aplica el propio
      servidor, no solo una pantalla frontal que alguien podría evitar.</p>
      <p>Justo después de establecer una nueva contraseña, se le ofrece una configuración de
      autenticación de dos factores de un minuto (escanear un código QR con cualquier aplicación de
      autenticación estándar, ingresar el código de 6 dígitos) \u2014 opcional pero fuertemente
      recomendada, y omitible si prefiere hacerlo más tarde desde Configuración.</p>
    `,
  },
  {
    title: 'Autenticación de dos factores',
    slug: 'two-factor-authentication',
    locale: 'es',
    category: 'Equipo y seguridad', categorySortOrder: 6, sortOrder: 2,
    excerpt: 'Activar o desactivar 2FA en cualquier momento.',
    bodyHtml: `
      <p>Más allá de la solicitud del primer inicio de sesión, cualquiera puede activar o desactivar
      la autenticación de dos factores en cualquier momento desde <strong>Configuración</strong>.
      Activarla lo guía a través de escanear un código QR con cualquier aplicación de autenticación
      estándar (Google Authenticator, Authy, 1Password, y similares) y confirmar con un código de 6
      dígitos. Desactivarla requiere volver a ingresar su contraseña, para que un atacante que haya
      comprometido solo su sesión no pueda simplemente desactivarla.</p>
    `,
  },
  {
    title: 'El registro de auditoría',
    slug: 'the-audit-log',
    locale: 'es',
    category: 'Equipo y seguridad', categorySortOrder: 6, sortOrder: 3,
    excerpt: 'Qué se registra, y dónde encontrarlo.',
    bodyHtml: `
      <p>Cada acción significativa en su espacio de trabajo \u2014 quién creó, editó, o eliminó qué,
      actividad de inicio de sesión, transiciones de casos de baja \u2014 se registra con una marca
      de tiempo real y el usuario que actúa. Los Super Admins pueden ver un registro de auditoría
      global en toda la plataforma; dentro de su propia empresa, este historial también aparece de
      forma contextual en las líneas de tiempo de activos individuales en lugar de como un único
      registro gigante e indiferenciado para buscar.</p>
    `,
  },
  {
    title: 'Desactivar o retirar a un miembro del equipo',
    slug: 'disabling-removing-team-member',
    locale: 'es',
    category: 'Equipo y seguridad', categorySortOrder: 6, sortOrder: 4,
    excerpt: 'La diferencia entre desactivar y retirar permanentemente el acceso.',
    bodyHtml: `
      <p>Desde <strong>Equipo</strong>, un Administrador de la empresa puede <strong>desactivar</strong>
      a un miembro \u2014 bloqueando su inicio de sesión de inmediato mientras preserva su historial
      (quién era, qué hizo, asignaciones pasadas) \u2014 o <strong>retirarlo</strong> por completo.
      Desactivar es la opción correcta para alguien que se va temporalmente o está bajo revisión;
      retirar es para alguien que genuinamente se ha ido y no regresará.</p>
    `,
  },
  {
    title: 'Cómo funcionan el inicio de sesión y las sesiones',
    slug: 'how-login-and-sessions-work',
    locale: 'es',
    category: 'Equipo y seguridad', categorySortOrder: 6, sortOrder: 5,
    excerpt: 'Tokens de acceso, tokens de actualización, y qué significa realmente «permanecer conectado».',
    bodyHtml: `
      <p>Cuando inicia sesión, TraceHub emite dos tokens almacenados en el almacenamiento local de su
      navegador: un token de acceso de corta duración usado para cada solicitud, y un token de
      actualización de mayor duración usado para obtener silenciosamente un nuevo token de acceso
      cuando el primero expira \u2014 por eso generalmente permanece conectado entre visitas sin
      volver a ingresar su contraseña constantemente. Cerrar sesión, o borrar el almacenamiento local
      de su navegador, termina la sesión. Vea la <strong>Política de cookies</strong> para saber
      exactamente qué se almacena y por qué.</p>
    `,
  },
];

module.exports = spanishTeamSecurity;
