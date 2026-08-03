const spanishDisposalWorkflow = [
  {
    title: 'El flujo de baja de seis etapas',
    slug: 'six-stage-disposal-workflow',
    locale: 'es',
    category: 'Flujo de baja', categorySortOrder: 5, sortOrder: 0,
    excerpt: 'De Marcado a Dado de baja, con verdaderas puertas de aprobación y registro de auditoría.',
    bodyHtml: `
      <p>Cuando un activo llega al final de su vida útil, TraceHub sigue un flujo formal de seis
      etapas en lugar de un simple botón «marcar como dado de baja» \u2014 apropiado para
      organizaciones que necesitan un verdadero rastro de aprobación para las decisiones de bienes de
      capital.</p>
      <ol>
        <li><strong>Marcado</strong> \u2014 se abre un caso de baja, ya sea manualmente o al hacer
        clic en «Marcar para baja» cuando el Motor de baja lo recomienda.</li>
        <li><strong>Revisión del gerente</strong> \u2014 un Gerente o Administrador de la empresa
        revisa el caso.</li>
        <li><strong>Revisión financiera</strong> \u2014 una etapa de validación financiera.</li>
        <li><strong>Aprobado</strong> \u2014 autorizado para proceder.</li>
        <li><strong>Subasta / Venta / Donación / Desguace / Reciclaje</strong> \u2014 el método de
        baja real, registrado con un monto de venta final si aplica.</li>
        <li><strong>Dado de baja</strong> \u2014 etapa final; el estado del activo se actualiza
        automáticamente a «Dado de baja».</li>
      </ol>
      <p>Un caso también puede ser <strong>rechazado</strong> en cualquier etapa con un motivo
      requerido \u2014 esto alimenta directamente el Bucle de aprendizaje de IA (vea <strong>Puntaje
      de confianza IA y el bucle de aprendizaje</strong>), que verifica más tarde si una falla real
      siguió a la decisión de mantener el activo en servicio.</p>
      <p>Cada transición se registra en el rastro de auditoría con una marca de tiempo real, y
      también aparece en la propia línea de tiempo del activo.</p>
    `,
  },
  {
    title: 'Marcar un activo y las restricciones por rol',
    slug: 'flagging-and-role-gates',
    locale: 'es',
    category: 'Flujo de baja', categorySortOrder: 5, sortOrder: 1,
    excerpt: 'Quién puede hacer qué en cada etapa.',
    bodyHtml: `
      <p>Cualquier miembro del equipo con acceso de Personal o superior puede marcar un activo para
      baja desde su página de detalle. A partir de ahí, las transiciones de etapa requieren el rol
      apropiado: los Gerentes pueden avanzar un caso a través de la revisión del gerente; la
      validación a nivel financiero y la aprobación final requieren acceso de Administrador de la
      empresa. Esto asegura que una sola persona no pueda hacer pasar unilateralmente un equipo por
      la baja sin que las personas correctas opinen.</p>
      <p>Rastree todos los casos abiertos desde <strong>Casos de baja</strong>, filtrables por
      etapa.</p>
    `,
  },
  {
    title: 'Rechazar un caso de baja',
    slug: 'rejecting-a-disposal-case',
    locale: 'es',
    category: 'Flujo de baja', categorySortOrder: 5, sortOrder: 2,
    excerpt: 'Qué sucede cuando decide mantener un activo que el motor recomendó dar de baja.',
    bodyHtml: `
      <p>En cualquier etapa, un caso de baja puede ser rechazado con un motivo requerido \u2014 una
      decisión de negocio legítima, no una falla del sistema. Motivos comunes: calendario de flujo
      de caja, una renovación de flota planificada para el próximo trimestre, o confianza genuina de
      que el activo seguirá funcionando a pesar de los números.</p>
      <p>Rechazar un caso alimenta discretamente el <strong>Bucle de aprendizaje de IA</strong>:
      TraceHub anota el conteo de incidentes del activo en ese momento y verifica 30 días después si
      siguió una falla real. Con el tiempo, esto construye la propia tasa de confiabilidad de
      recomendaciones de su empresa, visible en el panel de Bucle de aprendizaje del tablero una vez
      que existe suficiente historial (al menos 5 rechazos evaluados) \u2014 vea <strong>Puntaje de
      confianza IA y el bucle de aprendizaje</strong>.</p>
    `,
  },
];

module.exports = spanishDisposalWorkflow;
