const spanishIntelligenceEngineExpanded = [
  {
    title: 'El asistente de IA',
    slug: 'the-ai-assistant',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 7,
    excerpt: 'Lo que el widget de chat puede y no puede responder.',
    bodyHtml: `
      <p>La burbuja de chat en la esquina inferior derecha es un asistente de IA real, no un bot de
      preguntas frecuentes con guión. En el sitio de marketing público, responde preguntas sobre
      TraceHub mismo \u2014 precios, funciones, cómo funcionan las cosas \u2014 basándose en el
      contenido de FAQ publicado.</p>

      <p>Cuando ha iniciado sesión, obtiene datos reales y actuales sobre <em>su propia</em> empresa:
      su Salud de la cartera, Riesgo de capital, y Calificación de la flota; los activos específicos
      actualmente marcados para reparación o reemplazo (por nombre, con sus puntajes de salud y
      costos de mantenimiento reales); activos que se acercan a su fecha de baja sugerida; conteos de
      asignaciones vencidas; y la misma información de flota basada en reglas mostrada en su
      tablero. Intente preguntar algo como <em>«¿qué activos necesitan ser reemplazados?»</em> o
      <em>«¿cuál es nuestro mayor riesgo de mantenimiento en este momento?»</em> y responderá con sus
      datos reales, no una respuesta genérica.</p>

      <p>Es honesto sobre sus límites: los datos que tiene son un resumen acotado (sus ~10
      principales activos marcados, conteos agregados), no literalmente cada activo de su flota. Si
      pregunta sobre un activo específico que no está en ese resumen, lo dirá y lo dirigirá a la
      propia página de ese activo en lugar de adivinar.</p>
    `,
  },
  {
    title: 'Métodos de depreciación basados en el tiempo explicados',
    slug: 'time-based-depreciation-methods',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 8,
    excerpt: 'Línea recta, Saldo decreciente, Doble saldo decreciente, y Suma de dígitos de los años, con números concretos.',
    bodyHtml: `
      <p>Cuatro de los nueve métodos de depreciación se basan puramente en el tiempo (edad), no en el
      uso. Aquí está lo que hace realmente cada uno con un ejemplo concreto: un activo de $10,000,
      vida útil de 5 años, valor de rescate de $500.</p>

      <h3>Línea recta</h3>
      <p>Deprecia una cantidad igual cada año: <code>(cost - scrap) / lifeYears</code> = $1,900 por
      año. Después de 2 años, valor en libros = $10,000 - (2 \u00d7 $1,900) = $6,200.</p>

      <h3>Saldo decreciente</h3>
      <p>Aplica un porcentaje fijo a lo que sea el valor en libros <em>restante</em> cada año, en
      lugar del costo original \u2014 por lo que la depreciación es mayor en los primeros años y
      disminuye. La tasa se deriva para que el activo alcance su valor de rescate al final de su
      vida útil.</p>

      <h3>Doble saldo decreciente</h3>
      <p>Una versión acelerada del saldo decreciente, usando el doble de la tasa lineal
      (<code>2 / lifeYears</code>) aplicada al saldo restante cada año. Para un activo de 5 años, eso
      es una tasa del 40%: valor en libros año 1 = $10,000 \u00d7 0.6 = $6,000; año 2 = $6,000 \u00d7
      0.6 = $3,600. Nunca se deprecia por debajo del valor de rescate. TraceHub prorratea esto sin
      problemas para años parciales \u2014 un activo de 2.5 años se valora entre sus cifras de 2 años
      y 3 años, no idéntico a ninguno de los dos.</p>

      <h3>Suma de dígitos de los años</h3>
      <p>También acelerado, pero usando una ponderación de suma de dígitos: para un activo de 5
      años, los dígitos 5+4+3+2+1 = 15. El año 1 deprecia 5/15 de la base depreciable, el año 2
      deprecia 4/15, y así sucesivamente \u2014 cargado hacia adelante, pero menos agresivamente que
      el doble saldo decreciente. Al igual que este último, TraceHub prorratea esto para años
      parciales en lugar de saltar en pasos de año completo.</p>

      <h3>Cuál elegir</h3>
      <p>Línea recta es la opción predeterminada correcta para la mayoría del equipo de oficina y
      mobiliario que pierde valor de manera constante. Los métodos acelerados (Saldo decreciente,
      DDB, SYD) son adecuados para equipos que genuinamente pierden la mayor parte de su valor en el
      primer año o dos \u2014 los vehículos y algunas máquinas son candidatos comunes.</p>
    `,
  },
  {
    title: 'Métodos de depreciación basados en el uso explicados',
    slug: 'usage-based-depreciation-methods',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 9,
    excerpt: 'Unidades de producción, Horas máquina, y Basado en kilometraje \u2014 para equipos que se desgastan por el uso, no por el tiempo.',
    bodyHtml: `
      <p>Tres métodos deprecian según cuánto se ha usado realmente un activo, no cuánto tiempo lo ha
      tenido \u2014 apropiado para equipos donde el uso varía enormemente entre unidades de la misma
      edad.</p>
      <ul>
        <li><strong>Unidades de producción</strong> \u2014 establezca la capacidad total de
        producción esperada del activo (por ejemplo, una impresora clasificada para 500,000
        páginas). La depreciación se acumula proporcionalmente a las unidades realmente producidas
        frente a esa capacidad.</li>
        <li><strong>Horas máquina</strong> \u2014 la misma idea, usando horas operativas en lugar de
        un conteo de producción. Un generador clasificado para 20,000 horas que ha registrado 5,000
        horas ha usado el 25% de su vida depreciable, independientemente de su edad calendario.</li>
        <li><strong>Basado en kilometraje</strong> \u2014 para vehículos: establezca el kilometraje
        total esperado, y la depreciación sigue el odómetro.</li>
      </ul>
      <p>Los tres requieren que mantenga actualizada la cifra de uso relevante (unidades, horas, o
      kilometraje) en el activo \u2014 ya sea manualmente a través del formulario de editar activo, o
      registrándola cada vez que registra una inspección o evento de mantenimiento. Un activo en uno
      de estos métodos con una cifra de uso obsoleta mostrará un valor basado en un uso desactualizado,
      la misma limitación honesta que tiene cualquier sistema basado en uso.</p>
    `,
  },
  {
    title: 'Depreciación adaptativa IA en profundidad',
    slug: 'ai-adaptive-depreciation-in-depth',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 10,
    excerpt: 'El modelo multiplicativo detrás del método más receptivo a los datos de TraceHub.',
    bodyHtml: `
      <p>Adaptativo IA es el método integrado más sofisticado: en lugar de una única curva temporal o
      de uso, multiplica cinco factores de ajuste reales sobre una base de línea recta:</p>
      <ul>
        <li><strong>Factor de uso</strong> \u2014 más alto para intensidad de uso Intensa/Extrema,
        más bajo para Ligera.</li>
        <li><strong>Factor de mantenimiento</strong> \u2014 los activos bien mantenidos se deprecian
        más lentamente de lo que sugeriría de otro modo su historial de mantenimiento.</li>
        <li><strong>Factor de entorno</strong> \u2014 condiciones más duras (alto riesgo de
        corrosión, fuerte exposición al polvo) aceleran la depreciación.</li>
        <li><strong>Factor de mercado</strong> \u2014 si ha ingresado un valor de mercado actual,
        acerca la estimación a la realidad de reventa del mundo real en lugar de una fórmula pura.</li>
        <li><strong>Factor de confiabilidad</strong> \u2014 informado por la frecuencia de reparación
        y el historial de fallas.</li>
      </ul>
      <p>Debido a que se basa en tantas entradas, Adaptativo IA es también el método más afectado por
      cuántos «Datos del motor de inteligencia de activos» ha completado \u2014 un activo con
      intensidad de uso, entorno, e historial de mantenimiento todos completados obtiene una curva
      genuinamente adaptada; uno sin ninguno de esos datos efectivamente vuelve a un comportamiento
      de línea recta. Esto también se refleja honestamente en el Puntaje de confianza IA de ese
      activo.</p>
    `,
  },
  {
    title: 'Escribir fórmulas de depreciación personalizadas',
    slug: 'writing-custom-depreciation-formulas',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 11,
    excerpt: 'Reglas de sintaxis, variables disponibles, y varios ejemplos concretos.',
    bodyHtml: `
      <p>Si ninguno de los ocho métodos integrados coincide con cómo su organización realmente
      valora un activo, escriba su propia fórmula \u2014 evaluada por un analizador aritmético seguro
      y restringido (sin ejecución de código, solo números y operadores), de modo que una fórmula
      inválida nunca pueda romper el registro del activo; en su lugar vuelve de forma segura a línea
      recta.</p>

      <h3>Sintaxis</h3>
      <p>Solo aritmética básica: <code>+ - * / ^</code> y paréntesis. Sin llamadas de función, sin
      comparaciones, sin texto. Variables disponibles:</p>
      <table style="width:100%;border-collapse:collapse;margin:0.75rem 0;font-size:0.88rem;">
        <tbody>
          <tr><td style="padding:0.3rem;"><code>cost</code></td><td style="padding:0.3rem;">Precio de compra</td></tr>
          <tr><td style="padding:0.3rem;"><code>residual</code></td><td style="padding:0.3rem;">Valor de rescate</td></tr>
          <tr><td style="padding:0.3rem;"><code>lifeYears</code></td><td style="padding:0.3rem;">Vida útil en años</td></tr>
          <tr><td style="padding:0.3rem;"><code>age</code></td><td style="padding:0.3rem;">Edad actual en años (fraccionaria)</td></tr>
          <tr><td style="padding:0.3rem;"><code>hoursUsed / mileage / operatingCycles</code></td><td style="padding:0.3rem;">Cifras de uso</td></tr>
          <tr><td style="padding:0.3rem;"><code>repairCount / maintenanceCount</code></td><td style="padding:0.3rem;">Conteos de eventos</td></tr>
          <tr><td style="padding:0.3rem;"><code>maintenanceCostTotal / repairCostTotal</code></td><td style="padding:0.3rem;">Gasto acumulado</td></tr>
        </tbody>
      </table>

      <h3>Ejemplos prácticos</h3>
      <p><strong>Penalizar reparaciones y edad juntas:</strong><br/>
      <code>cost - (repairCount * 25) - (age * 100)</code><br/>
      Comienza en el costo total, pierde $25 por reparación y $100 por año de edad.</p>

      <p><strong>Un piso en el valor de rescate:</strong> el analizador no limita automáticamente a su
      valor de rescate como lo hacen los métodos integrados \u2014 si quiere esa garantía,
      constrúyala en la lógica de la fórmula manteniendo los términos suficientemente pequeños en
      relación con el costo, o simplemente monitoree el resultado y ajuste; una fórmula extrema
      podría teóricamente producir un número negativo, que TraceHub aún almacenará, así que pruebe
      su fórmula contra un activo real antes de confiar en ella ampliamente.</p>
    `,
  },
  {
    title: 'Comprender el puntaje de riesgo',
    slug: 'understanding-risk-score',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 12,
    excerpt: 'El índice de 0 a 100 detrás de los cuatro horizontes de probabilidad de falla.',
    bodyHtml: `
      <p>Junto con las probabilidades de falla de 30/60/90/180 días, cada activo tiene un único
      <strong>Puntaje de riesgo</strong> (0-100) \u2014 el índice de riesgo general que el Motor de
      predicción de fallas calcula internamente, del cual se derivan las cuatro probabilidades por
      horizonte temporal como diferentes puntos a lo largo de la misma curva de riesgo. Un Puntaje de
      riesgo más alto significa una curva de probabilidad más pronunciada en los cuatro horizontes,
      no solo un número más alto en un momento específico.</p>
      <p>Se muestra directamente en la página de detalle del activo junto a la sección de Riesgo de
      falla, para que pueda ver el único número subyacente que impulsa los cuatro porcentajes
      anteriores, en lugar de tratarlos como cuatro cifras no relacionadas.</p>
    `,
  },
  {
    title: 'El panel de información de IA: los cinco detectores de patrones explicados',
    slug: 'ai-insights-panel-detectors-explained',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 13,
    excerpt: 'Exactamente qué activa cada información mostrada en su tablero.',
    bodyHtml: `
      <p>El Panel de información de IA del tablero ejecuta cinco detectores de patrones
      independientes y basados en reglas en toda su flota cada vez que lo carga. Cada uno es
      determinista \u2014 con los mismos datos, siempre produce la misma oración \u2014 y un detector
      que no encuentra nada simplemente no contribuye con nada, en lugar de forzar una oración de la
      nada.</p>
      <ol>
        <li><strong>Depreciación acelerada por uso intensivo</strong> \u2014 marca una categoría
        donde varios activos fuertemente usados están perdiendo valor notablemente más rápido que el
        promedio de esa categoría. Ejemplo: <em>«3 activos en Vehículos se están depreciando más
        rápido que el promedio de la categoría debido al uso intensivo.»</em></li>
        <li><strong>Presupuesto de mantenimiento excedido</strong> \u2014 marca el único activo cuyo
        gasto acumulado de mantenimiento y reparación ha excedido más un supuesto de presupuesto
        documentado (un porcentaje de su costo de reemplazo). Ejemplo: <em>«Montacargas 02 ha
        excedido su presupuesto de mantenimiento proyectado en 49%; el reemplazo probablemente sea
        más económico que continuar reparando.»</em></li>
        <li><strong>Acercándose al fin de vida útil</strong> \u2014 marca categorías con activos cuya
        fecha de baja sugerida cae dentro de los próximos seis meses.</li>
        <li><strong>Activos inactivos</strong> \u2014 marca categorías con activos sin usar (estado
        disponible) durante un período prolongado, que valdría la pena reasignar o vender.</li>
        <li><strong>Alarma de mantenimiento a nivel de categoría</strong> \u2014 marca una categoría
        entera (no un solo activo) donde el gasto de mantenimiento acumulado en todos sus activos ha
        cruzado un umbral alto en relación con su valor de reemplazo combinado.</li>
      </ol>
      <p>Ninguna de estas es una suposición \u2014 cada número en cada oración se remonta a una
      consulta real contra sus propios datos de activos en el momento en que se carga el tablero.</p>
    `,
  },
];

module.exports = spanishIntelligenceEngineExpanded;
