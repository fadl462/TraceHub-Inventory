const spanishIntelligenceEngine = [
  {
    title: 'Resumen de los seis motores',
    slug: 'ai-engine-overview',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 0,
    excerpt: 'Qué se ejecuta automáticamente en cada activo, y cómo encajan las piezas.',
    bodyHtml: `
      <p>El Motor de Inteligencia de Activos (a veces llamado TAIE internamente) son seis motores de
      puntuación reales y deterministas que se recalculan automáticamente cada vez que un activo se
      crea, actualiza, o inspecciona. «Determinista» importa aquí: son fórmulas ponderadas
      documentadas, no un modelo de aprendizaje automático entrenado que produce un número
      inexplicable \u2014 cada puntaje se puede rastrear hasta las entradas reales que lo produjeron.</p>

      <ol>
        <li><strong>Motor de depreciación inteligente</strong> \u2014 nueve métodos, desde línea recta
        hasta una fórmula personalizada que usted mismo escribe.</li>
        <li><strong>Puntaje de salud del activo (0-100)</strong> \u2014 un compuesto ponderado de
        edad, mantenimiento, reparaciones, uso, inspección, y entorno.</li>
        <li><strong>Motor de predicción de fallas</strong> \u2014 probabilidad de falla a 30/60/90/180
        días.</li>
        <li><strong>Motor de programación de mantenimiento</strong> \u2014 una fecha de próximo
        servicio predicha real.</li>
        <li><strong>Motor de inteligencia de baja</strong> \u2014 una recomendación
        MANTENER/REPARAR/VENDER/DESGUAZAR/REEMPLAZAR con un resumen ejecutivo en lenguaje sencillo.</li>
        <li><strong>Puntaje de confianza IA</strong> \u2014 cuánta evidencia real respalda todo lo
        anterior, para este activo específico.</li>
      </ol>

      <p>Además de esto, un <strong>Bucle de aprendizaje de IA</strong> rastrea si ignorar una
      recomendación de baja fue seguido posteriormente por una falla real, y retroalimenta eso en los
      puntajes de confianza futuros \u2014 específico del propio historial de su empresa, no una
      cifra genérica de la industria.</p>

      <p>Cada uno de estos puntajes es visible en tres lugares: en la página de <strong>Detalle del
      activo</strong> (desglose completo, por activo), en la <strong>lista de activos</strong>
      (columnas de Salud/Riesgo de falla/Recomendación, para revisar toda su flota de una vez), y
      agregado en el <strong>panel de Inteligencia de la flota del tablero</strong> (nivel de
      cartera: salud promedio, capital en riesgo, una calificación de flota de A a F).</p>
    `,
  },
  {
    title: 'Motor de depreciación inteligente',
    slug: 'smart-depreciation-engine',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 1,
    excerpt: 'Los nueve métodos, incluyendo cómo escribir su propia fórmula personalizada.',
    bodyHtml: `
      <p>Establezca el método de depreciación de un activo en la sección «Datos del motor de
      inteligencia de activos» del formulario de agregar/editar activo. Si no elige uno, se usa
      <strong>Línea recta</strong> de forma predeterminada.</p>

      <table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.9rem;">
        <thead><tr style="text-align:left;border-bottom:2px solid #E2E8F0;">
          <th style="padding:0.5rem;">Método</th><th style="padding:0.5rem;">Cómo funciona</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Línea recta</strong></td><td style="padding:0.5rem;">Depreciación igual cada año a lo largo de la vida útil.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Saldo decreciente</strong></td><td style="padding:0.5rem;">Un porcentaje fijo del valor en libros restante cada año \u2014 depreciación más rápida al principio.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Doble saldo decreciente</strong></td><td style="padding:0.5rem;">Una versión acelerada del saldo decreciente, común para equipos que pierden la mayor parte de su valor en sus primeros años.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Suma de dígitos de los años</strong></td><td style="padding:0.5rem;">Otro método acelerado, ponderando más fuertemente los primeros años usando una fórmula de suma de dígitos.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Unidades de producción</strong></td><td style="padding:0.5rem;">Deprecia según el uso real (unidades producidas) en lugar del tiempo \u2014 establezca la capacidad total esperada del activo.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Horas máquina</strong></td><td style="padding:0.5rem;">La misma idea, basada en horas operativas en lugar de unidades.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Basado en kilometraje</strong></td><td style="padding:0.5rem;">Para vehículos \u2014 deprecia según el kilometraje del odómetro frente al kilometraje total esperado.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Adaptativo IA</strong></td><td style="padding:0.5rem;">Un modelo multiplicativo que combina la intensidad de uso, el historial de mantenimiento, el entorno, las condiciones del mercado, y la confiabilidad en una tasa de depreciación ajustada \u2014 el método más exigente en datos, y el más receptivo a la condición real de un activo en lugar de solo su edad.</td></tr>
          <tr><td style="padding:0.5rem;"><strong>Fórmula personalizada</strong></td><td style="padding:0.5rem;">Escriba su propia expresión aritmética \u2014 vea abajo.</td></tr>
        </tbody>
      </table>

      <h3>Escribir una fórmula personalizada</h3>
      <p>Solo aritmética básica (<code>+ - * / ^</code> y paréntesis, sin funciones). Variables
      disponibles: <code>cost, residual, lifeYears, age, hoursUsed, mileage, operatingCycles,
      repairCount, maintenanceCount, maintenanceCostTotal, repairCostTotal</code>.</p>
      <p><strong>Ejemplo:</strong> <code>cost - (repairCount * 25) - (age * 100)</code> \u2014
      comienza en el costo total, resta $25 por reparación y $100 por año de edad. Una fórmula
      inválida vuelve de forma segura a línea recta en lugar de romper el registro del activo.</p>
    `,
  },
  {
    title: 'Puntaje de salud del activo',
    slug: 'asset-health-score',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 2,
    excerpt: 'Las ponderaciones exactas detrás del puntaje de 0 a 100, y qué significa cada nivel.',
    bodyHtml: `
      <p>Cada activo obtiene un Puntaje de salud de 0 a 100, recalculado automáticamente a medida que
      llegan nuevos datos. Es un compuesto ponderado de seis factores:</p>
      <ul>
        <li><strong>Edad</strong> relativa a la vida útil esperada \u2014 20%</li>
        <li><strong>Mantenimiento</strong>, cumplimiento e historial \u2014 25%</li>
        <li><strong>Reparaciones</strong> (frecuencia y costo) \u2014 15%</li>
        <li><strong>Uso</strong>, intensidad \u2014 15%</li>
        <li><strong>Inspección</strong>, puntaje más reciente \u2014 15%</li>
        <li><strong>Entorno</strong> (riesgo de corrosión, exposición al polvo, condiciones
        operativas) \u2014 10%</li>
      </ul>

      <h3>Niveles</h3>
      <p>Las mismas cinco bandas se usan consistentemente en toda la aplicación \u2014 la lista de
      activos, el Mapa de calor ejecutivo del tablero, y el puntaje mismo:</p>
      <ul>
        <li><strong>Excelente</strong> \u2014 90-100</li>
        <li><strong>Saludable</strong> \u2014 75-89</li>
        <li><strong>Necesita atención</strong> \u2014 60-74</li>
        <li><strong>Alto riesgo</strong> \u2014 40-59</li>
        <li><strong>Crítico</strong> \u2014 por debajo de 40</li>
      </ul>

      <p>En la página de detalle del activo, verá el desglose completo \u2014 no solo el número
      final \u2014 como un conjunto de barras de puntaje individuales para cada uno de los seis
      factores, para que pueda ver exactamente qué está arrastrando un puntaje hacia abajo (por
      ejemplo, un activo con excelente mantenimiento pero una posición pobre ajustada por edad
      mostrará eso claramente en lugar de ocultarlo detrás de un número compuesto).</p>
    `,
  },
  {
    title: 'Motor de predicción de fallas',
    slug: 'failure-prediction-engine',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 3,
    excerpt: 'Cómo se calculan las probabilidades de 30/60/90/180 días.',
    bodyHtml: `
      <p>Junto con el Puntaje de salud, cada activo obtiene una probabilidad de falla en cuatro
      horizontes: 30, 60, 90, y 180 días. Se derivan de los mismos factores de riesgo subyacentes
      que el Puntaje de salud (edad, brechas de mantenimiento, frecuencia de reparación, intensidad
      de uso) pero se expresan como una curva de probabilidad genuina en lugar de un único puntaje
      en un momento dado \u2014 un activo puede tener un Puntaje de salud actual razonable mientras
      aún muestra una probabilidad de falla creciente en los próximos seis meses si su mantenimiento
      se está retrasando.</p>

      <p>Cada activo también muestra sus <strong>razones de falla</strong> específicas \u2014
      explicaciones en lenguaje sencillo como «acercándose o superando su vida útil esperada» o
      «mantenimiento vencido» \u2014 para que el número de probabilidad nunca sea solo una cifra
      desnuda sin explicación detrás.</p>

      <p>Un número relacionado, almacenado por separado, es el <strong>Puntaje de riesgo</strong>,
      visible en la página de detalle del activo \u2014 el índice de riesgo general que el Motor de
      predicción de fallas calcula internamente para derivar las cuatro probabilidades anteriores.</p>
    `,
  },
  {
    title: 'Motor de programación de mantenimiento',
    slug: 'maintenance-scheduling-engine',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 4,
    excerpt: 'Cómo TraceHub predice cuándo un activo realmente necesita servicio.',
    bodyHtml: `
      <p>Cada activo obtiene una <strong>fecha de próximo servicio</strong> predicha real, mostrada
      en su página de detalle con el razonamiento detrás \u2014 no un recordatorio genérico de
      «servicio anual».</p>

      <h3>Cómo se calcula</h3>
      <p>El intervalo base proviene de la intensidad de uso: Uso ligero por defecto a un intervalo
      de 365 días, Normal a 180 días, Intenso a 90 días, y Extremo a 45 días. Puede anular esto con
      un intervalo específico para un activo que no encaje en esos valores predeterminados.</p>
      <p>Ese intervalo luego se <strong>adelanta a medida que la salud declina</strong> \u2014 un
      activo con un Puntaje de salud más bajo obtiene una fecha de servicio predicha más pronto que
      un activo idéntico en excelente condición en el mismo calendario nominal, con un tope para que
      nunca recomiende servicio más del doble de frecuente que el intervalo base.</p>
      <p>El calendario se ancla desde la última fecha de mantenimiento registrada del activo, o su
      fecha de compra si nunca se ha registrado mantenimiento. <strong>Importante:</strong> si un
      activo nunca ha tenido mantenimiento registrado a pesar de haber sido comprado hace años, su
      fecha de próximo servicio predicha mostrará correctamente que está significativamente vencida \u2014
      esto es preciso, no un error, y es exactamente el tipo de brecha que el conteo de
      «Mantenimiento pendiente» del tablero está diseñado para revelar.</p>
    `,
  },
  {
    title: 'Motor de inteligencia de baja',
    slug: 'disposal-intelligence-engine',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 5,
    excerpt: 'Cómo se hacen las recomendaciones MANTENER/REPARAR/VENDER/DESGUAZAR/REEMPLAZAR.',
    bodyHtml: `
      <p>Cada activo obtiene un Puntaje de preparación para baja (0-100) y una recomendación
      específica \u2014 MANTENER, REPARAR, VENDER, DESGUAZAR, o REEMPLAZAR \u2014 ponderada en siete
      factores reales:</p>
      <ul>
        <li>Edad relativa a la vida útil \u2014 25%</li>
        <li>Costo de mantenimiento relativo al valor de reemplazo \u2014 20%</li>
        <li>Depreciación \u2014 15%</li>
        <li>Frecuencia de reparación \u2014 15%</li>
        <li>Puntaje de salud \u2014 10%</li>
        <li>Valor de mercado actual \u2014 10%</li>
        <li>Criticidad para el negocio \u2014 5%</li>
      </ul>

      <p>El mayor peso está deliberadamente en el <strong>costo de mantenimiento relativo al valor de
      reemplazo</strong>, no el precio de compra original \u2014 comparar lo que ha gastado
      manteniendo un activo en funcionamiento contra lo que cuesta un equivalente nuevo <em>hoy</em>
      es una señal mucho más honesta que compararlo con un precio pagado hace años.</p>

      <h3>La recomendación ejecutiva</h3>
      <p>Junto con el puntaje, cada activo obtiene un resumen en lenguaje sencillo sobre el cual
      puede actuar de inmediato \u2014 por ejemplo, <em>«El costo de reparación excede el beneficio
      operativo esperado; reemplazar dentro de 3 meses.»</em> Esto se genera a partir de los mismos
      datos reales que el puntaje mismo, no una suposición separada.</p>

      <h3>Marcar un activo</h3>
      <p>Cuando el motor recomienda REPARAR, VENDER, DESGUAZAR, o REEMPLAZAR, aparece un botón
      <strong>«Marcar para baja»</strong> en la página de detalle del activo, que abre un caso de
      baja formal \u2014 vea <strong>El flujo de baja de seis etapas</strong>.</p>
    `,
  },
  {
    title: 'Puntaje de confianza IA y el bucle de aprendizaje',
    slug: 'ai-confidence-score-and-learning-loop',
    locale: 'es',
    category: 'El motor de inteligencia de activos', categorySortOrder: 2, sortOrder: 6,
    excerpt: 'Cuánto confiar en un puntaje dado, y cómo el sistema realmente aprende.',
    bodyHtml: `
      <p>Cada recomendación viene con un Puntaje de confianza \u2014 no un vago «confíe en mí», sino
      un desglose transparente de exactamente en qué se basa: cuántos de los campos de datos
      relevantes están completos para este activo, cuántos registros de mantenimiento existen, si
      hay datos de valor de mercado actual disponibles, y (vea abajo) un ajuste acotado del propio
      historial de baja de su empresa.</p>
      <p>Un activo con casi ningún dato completado \u2014 sin historial de mantenimiento, sin
      inspecciones, sin valor de mercado ingresado \u2014 honestamente mostrará un puntaje de
      confianza más bajo, porque genuinamente hay menos evidencia detrás de sus números. Completar
      más de los campos de «Datos del motor de inteligencia de activos» al registrar o editar un
      activo eleva esto directamente con el tiempo.</p>

      <h3>El bucle de aprendizaje de IA</h3>
      <p>Esta es la parte que hace que las recomendaciones de TraceHub sean más confiables
      específicamente para <em>su</em> empresa con el tiempo, no solo en abstracto. Así es
      exactamente como funciona:</p>
      <ol>
        <li>Cuando se <strong>rechaza</strong> una recomendación de baja (el caso se abre pero un
        gerente decide no proceder), el sistema anota discretamente el conteo de incidentes del
        activo (fallas + accidentes) en ese momento.</li>
        <li>30 días después, verifica: ¿ocurrió una falla real desde entonces?</li>
        <li>Con el tiempo, esto construye una <strong>tasa de confiabilidad</strong> real y
        auditable \u2014 de las recomendaciones que su empresa ha elegido ignorar, qué fracción fue
        seguida posteriormente por una falla real.</li>
        <li>Esa tasa retroalimenta los puntajes de confianza futuros como un ajuste pequeño y
        acotado (\u00b110) \u2014 si su historial muestra que ignorar señales aquí usualmente conduce a
        fallas reales, la confianza futura sube ligeramente; si las señales ignoradas usualmente
        resultan bien, se ajusta hacia abajo.</li>
      </ol>
      <p>Esto solo se activa una vez que hay un tamaño de muestra real (al menos 5 rechazos
      evaluados) \u2014 antes de eso, el ajuste permanece en cero en lugar de adivinar con muy pocos
      datos. Esto no es una afirmación de marketing sobre «IA que aprende» \u2014 es un número
      específico, acotado, y auditable calculado a partir de las decisiones reales de su propia
      empresa y sus resultados reales.</p>
    `,
  },
];

module.exports = spanishIntelligenceEngine;
