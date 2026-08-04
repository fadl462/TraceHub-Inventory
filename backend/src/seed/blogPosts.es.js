const spanishPosts = [
  {
    title: 'Bienvenido a TraceHub Inventory',
    slug: 'welcome-to-tracehub-inventory',
    locale: 'es',
    excerpt: 'Por qué creamos una plataforma de gestión de activos alrededor de una idea simple: no debería necesitar hardware costoso ni una maratón de hojas de cálculo para saber lo que posee.',
    authorName: 'Equipo TraceHub',
    publishedAt: new Date('2026-08-01'),
    isPublished: true,
    coverImageUrl: '/blog/welcome-cover.svg',
    bodyHtml: `
      <p>Toda empresa que posee equipos físicos termina enfrentando el mismo problema: nadie puede
      afirmar con confianza qué posee exactamente, dónde está, ni cuánto vale. No por negligencia \u2014
      por acumulación. Una hoja de cálculo iniciada hace tres años con cuarenta filas crece
      silenciosamente hasta cuatro mil, la mitad sin verificar, algunas describiendo equipo que fue
      vendido, perdido o dado de baja hace un año sin que nadie actualizara la hoja.</p>

      <p>TraceHub Inventory existe porque creemos que ese problema se puede resolver sin comprar
      hardware, sin contratar un administrador de activos a tiempo completo, y sin tratar la
      depreciación como una tarea contable anual. Esta publicación es una introducción a cómo
      pensamos el problema, y una explicación en lenguaje sencillo de cómo funciona realmente la
      plataforma.</p>

      <h3>Los tres puntos de falla del seguimiento tradicional de activos</h3>
      <p>Casi todas las organizaciones con las que hemos hablado sobre el seguimiento de equipos
      chocan con los mismos tres muros, generalmente en este orden:</p>
      <p><strong>La visibilidad se degrada con el tiempo.</strong> Una hoja de cálculo o un registro
      en papel es preciso el día que se crea y cada vez menos preciso a partir de ahí. No hay ningún
      mecanismo que obligue a actualizarlo cuando un activo se mueve, se reasigna o se avería \u2014 así
      que el registro y la realidad se distancian hasta que alguien lo nota durante una auditoría,
      generalmente de la manera más difícil.</p>
      <p><strong>La depreciación se convierte en una suposición.</strong> Sin un sistema que haga el
      cálculo automáticamente, los valores en libros se ignoran por completo o se estiman una vez al
      año en una fórmula de hoja de cálculo apresurada en la que nadie confía del todo. Las decisiones
      de reparar o reemplazar terminan basándose en instinto en lugar de un número real.</p>
      <p><strong>El hardware de seguimiento es costoso de justificar.</strong> Los lectores RFID y
      los rastreadores GPS resuelven problemas reales, pero el costo inicial y el esfuerzo de
      instalación los ponen fuera del alcance de la mayoría de las operaciones pequeñas y medianas \u2014
      precisamente el segmento que más lucha con la visibilidad desde el principio.</p>

      <h3>Cómo aborda TraceHub cada uno de estos puntos</h3>
      <p>No nos propusimos crear una hoja de cálculo más inteligente. Construimos la plataforma
      alrededor de tres mecanismos específicos, cada uno dirigido directamente a uno de esos puntos
      de falla.</p>

      <img src="/blog/asset-lifecycle.svg" alt="Ciclo de vida del activo: Registrar, Rastrear, Depreciar, Dar de baja" style="width:100%;border-radius:16px;margin:1.5rem 0;" />

      <p><strong>Ubicación en tiempo real, desde la cámara de un teléfono.</strong> Cada activo recibe
      un código QR único en el momento de su registro. Defina sus puntos de control \u2014 un almacén,
      una sucursal, un sitio de trabajo \u2014 y cualquier miembro del equipo puede escanear un activo
      para registrar su entrada o salida usando la cámara que ya lleva consigo. Sin hardware lector,
      sin instalación, sin tarifa de seguimiento por unidad. El historial de ubicación se actualiza en
      el instante en que ocurre un escaneo, no cuando alguien recuerda actualizar una hoja.</p>

      <p><strong>Depreciación calculada automáticamente, no estimada una vez al año.</strong> Cada
      categoría de activo lleva un perfil de vida útil y valor de rescate. En el momento en que
      ingresa un precio de compra al registrar un activo, TraceHub calcula la depreciación lineal de
      inmediato: valor en libros actual, depreciación anual y una fecha de baja sugerida. Como ejemplo
      concreto: una laptop de $500 con una vida útil de 5 años y un valor de rescate del 10% se
      deprecia $90 al año \u2014 tres años después, su valor en libros se sitúa en $230, calculado en el
      instante en que consulta el activo, no reconstruido al final del año.</p>

      <p><strong>Una estructura que crece con la organización, no en su contra.</strong> Super Admin,
      Administrador de la empresa, Gerente y Personal ven exactamente lo que su rol necesita. Las
      asignaciones registran quién tiene actualmente un activo \u2014 ya sea un empleado o un contacto
      externo \u2014 con recordatorios automáticos tres días antes de que algo deba devolverse, y de
      nuevo el mismo día. Cada escaneo, edición y asignación queda registrado en un único historial de
      auditoría, de modo que "quién tuvo esto por última vez" deja de ser un misterio.</p>

      <h3>Para quién es realmente esto</h3>
      <p>Construimos TraceHub pensando en un tipo específico de organización: una con activos físicos
      reales \u2014 laptops, vehículos, generadores, herramientas, equipo de red \u2014 distribuidos en más
      de una ubicación, gestionados por más de una persona, donde el sistema informal (una hoja de
      cálculo compartida, un grupo de WhatsApp, la memoria institucional) ha comenzado a fallar. Las
      empresas de logística, los operadores de servicios de campo, los departamentos de TI, las
      consultoras con flotas de equipo, y las operaciones minoristas multi-sucursal tienden a sentir
      esto con más fuerza.</p>

      <p>Si actualmente rastrea su equipo en una sola hoja de cálculo que solo una persona realmente
      entiende, ese suele ser el momento en que vale la pena resolverlo en serio \u2014 antes de que un
      activo desaparezca, no después.</p>

      <h3>Lo que viene</h3>
      <p>Esta plataforma está en desarrollo activo. Los informes, las integraciones y la automatización
      son áreas que seguimos construyendo, y escribiremos aquí sobre cada adición significativa a
      medida que se lance \u2014 no como un ejercicio de marketing, sino como un relato honesto de lo que
      realmente es nuevo y por qué lo construimos de esa manera.</p>

      <p>Si está lidiando con alguno de los problemas anteriores, los primeros diez activos son
      gratuitos durante treinta días, sin necesidad de tarjeta para comenzar. Nos gustaría
      sinceramente saber qué opina.</p>
    `,
  },
  {
    title: '¿Reparar o reemplazar? Un marco práctico para la decisión que todo gestor de activos termina enfrentando',
    slug: 'repair-or-replace-decision-framework',
    locale: 'es',
    excerpt: 'La mayoría de las decisiones de "reparar o reemplazar" se toman por instinto y a favor de quien grita más fuerte en la reunión. Aquí hay un marco que reemplaza las suposiciones con números que realmente puede defender.',
    authorName: 'Equipo TraceHub',
    publishedAt: new Date('2026-08-02'),
    isPublished: true,
    coverImageUrl: '/blog/repair-replace-cover.svg',
    bodyHtml: `
      <p>En algún lugar de toda organización con equipo físico, hay ahora mismo un generador, un
      montacargas o un vehículo de flota esperando en una cola de reparación mientras alguien decide
      si vale la pena repararlo de nuevo. La decisión generalmente se toma de una de tres maneras:
      gana quien grita más fuerte en la reunión, el equipo de mantenimiento lo repara porque es su
      trabajo y nadie le dijo lo contrario, o se pospone otro trimestre porque nadie quiere asumir el
      gasto de capital. Ninguna de esas es realmente una decisión \u2014 son una opción por defecto.</p>

      <p>Este es un problema genuinamente difícil de razonar por instinto, porque la respuesta real
      depende de combinar números que viven en diferentes departamentos y rara vez terminan en la
      misma hoja de cálculo: cuánto vale realmente el activo hoy, cuánto le ha costado en reparaciones
      hasta ahora, qué tan probable es que vuelva a fallar pronto, y cuánto costaría un reemplazo. Esta
      publicación recorre un marco para combinar correctamente esos números \u2014 el mismo que terminamos
      integrando directamente en el motor de inteligencia de baja de TraceHub, porque seguíamos
      haciendo este cálculo a mano para nuestro propio equipo y nos cansamos de reconstruir la hoja de
      cálculo cada vez.</p>

      <h3>Por qué "todavía funciona" es la pregunta equivocada</h3>
      <p>El instinto con equipo envejecido es preguntar "¿todavía funciona?" y seguir reparando
      mientras la respuesta sea sí. Esa es la pregunta equivocada, por una razón simple: casi
      cualquier cosa se puede mantener funcionando con suficiente dinero y suficiente tiempo de
      inactividad. La pregunta correcta es si seguir reparándolo es un buen uso del dinero comparado
      con la alternativa \u2014 y eso requiere comparar números reales, no sensaciones.</p>

      <p>Hay cinco factores que realmente importan, y las decisiones por instinto típicamente solo
      consideran uno o dos:</p>

      <p><strong>1. La edad en relación con la vida útil esperada.</strong> Un montacargas de cinco
      años con una vida útil esperada de siete años está en una posición muy diferente al mismo
      montacargas en su noveno año. Esto suena obvio, pero se ignora con frecuencia en la práctica \u2014
      los equipos de mantenimiento a menudo no tienen acceso fácil a cuál es la "vida útil esperada"
      para una categoría de activo determinada, por lo que ese número nunca entra en la conversación.</p>

      <p><strong>2. El gasto acumulado de mantenimiento y reparación, medido contra el costo de
      reemplazo \u2014 no contra el precio de compra original.</strong> Este es el error más común que
      vemos. Un activo comprado por $8,000 hace cinco años podría costar $12,000 reemplazarlo hoy tras
      la inflación y el movimiento cambiario. Si ya ha gastado $6,000 manteniendo el antiguo en
      funcionamiento, comparar esos $6,000 con el precio original de $8,000 hace que parezca casi un
      punto de equilibrio. Compararlo con el costo de reemplazo real de $12,000 cuenta una historia
      muy diferente: está a mitad de camino del precio de una unidad nueva, en una máquina que ya es
      vieja.</p>

      <p><strong>3. La frecuencia de reparación, no solo el costo de reparación.</strong> Una máquina
      que ha necesitado tres reparaciones en los últimos seis meses le está diciendo algo que una
      cifra total en dólares no capta: está entrando en un patrón de fallas, no absorbiendo mala suerte
      puntual. La frecuencia es un indicador adelantado; el costo acumulado es uno rezagado. Para
      cuando el indicador rezagado se ve mal, el adelantado generalmente ya llevaba un tiempo
      parpadeando.</p>

      <p><strong>4. La salud y condición actuales</strong> \u2014 no solo la edad y el historial de
      reparaciones, sino una evaluación real del estado actual del equipo: puntuaciones de inspección,
      evaluaciones de técnicos, entorno operativo (un generador que funciona en un sitio costero
      polvoriento y de alta corrosión se desgasta más rápido que una unidad idéntica en un almacén con
      clima controlado, independientemente de la edad).</p>

      <p><strong>5. Qué tan crítico es el activo para las operaciones.</strong> Un generador de
      respaldo que rara vez se usa tolera una decisión de reparar o reemplazar más lenta que el único
      vehículo de reparto del que depende diariamente una pequeña operación logística. La criticidad
      no cambia la matemática del costo, pero cambia cuánto riesgo de ciclo de reparación puede
      tolerar mientras se toma la decisión.</p>

      <h3>Un ejemplo práctico</h3>
      <p>Tomemos una camioneta mediana usada para entregas de campo, comprada hace cuatro años por
      $28,000, con una vida útil típica de 8 años para esa clase de vehículo. Durante el último año
      ha necesitado tres reparaciones no programadas que suman $4,200. El costo de reemplazo actual
      para un vehículo nuevo equivalente es de $34,000 (los precios de esa clase han subido desde la
      compra original). Su valor en libros actual, tras cuatro años de depreciación, se sitúa
      alrededor de $14,000.</p>

      <p>Analicemos los cinco factores: está en el 50% de su vida útil esperada (aún no es una señal
      fuerte por sí sola), pero $4,200 en reparaciones en un solo año contra un costo de reemplazo de
      $34,000 es el 12% del valor de reemplazo gastado en doce meses \u2014 una cifra significativa por sí
      misma, y una tendencia preocupante si se repite. Tres reparaciones en seis meses son un patrón
      de frecuencia, no un hecho aislado. Si una inspección reciente también señaló una condición en
      declive, eso hace que cuatro de los cinco factores apunten en la misma dirección. La conclusión
      no es "todavía funciona, así que sigamos" \u2014 es "el patrón indica que este es el año para
      planificar el reemplazo, no esperar a que una falla en carretera fuerce la decisión".</p>

      <p>Note lo que hizo esto posible: no una sola señal de alarma dramática, sino varias señales
      moderadas que convergen. Ese es exactamente el tipo de patrón que las decisiones por instinto
      pasan por alto, porque ningún número por sí solo parece lo suficientemente alarmante como para
      plantearse.</p>

      <h3>Convertir esto en una puntuación repetible, no en un análisis puntual</h3>
      <img src="/blog/disposal-score-breakdown.svg" alt="Gráfico circular del desglose de la Puntuación de Preparación para Baja: Edad 25%, Costo de mantenimiento 20%, Depreciación 15%, Frecuencia de reparación 15%, Salud 10%, Valor de mercado 10%, Criticidad 5%" style="width:100%;border-radius:16px;margin:1.5rem 0;background:#fff;" />
      <p>El marco anterior funciona bien como ejercicio puntual para un solo activo. Se desmorona a
      escala \u2014 nadie vuelve a ejecutar un análisis manual de cinco factores cada vez que un activo
      necesita una reparación en una flota de 200 vehículos y máquinas. Esa es la razón real por la
      que construimos el motor de inteligencia de baja de TraceHub como una puntuación permanente en
      lugar de un informe que se genera bajo demanda: cada activo obtiene una Puntuación de
      Preparación para Baja en vivo (0-100), recalculada automáticamente a medida que llegan nuevos
      registros de mantenimiento, reparaciones e inspecciones, ponderada según la edad (25%), la
      depreciación (15%), el costo de mantenimiento relativo al valor de reemplazo (20%), la
      frecuencia de reparación (15%), la puntuación de salud (10%), el valor de mercado actual (10%) y
      la criticidad para el negocio (5%).</p>

      <p>Las ponderaciones no son arbitrarias \u2014 reflejan que el costo de mantenimiento relativo al
      valor de reemplazo y la edad son las dos señales más pesadas en la práctica, con la frecuencia de
      reparación muy cerca detrás, lo cual coincide con lo que realmente mostró el ejemplo práctico
      anterior. Cuando la puntuación cruza un umbral, el sistema no solo marca el activo \u2014 recomienda
      una acción específica (reparar, vender o desechar) y un plazo realista, y el resumen ejecutivo
      está escrito en lenguaje sencillo en lugar de una puntuación cruda: "El costo de reparación
      excede el beneficio operativo esperado; reemplazar dentro de 3 meses" es una frase con la que un
      gerente no técnico puede actuar de inmediato.</p>

      <h3>Lo que la mayoría de los marcos pasan por alto: ¿realmente se cumplió la recomendación?</h3>
      <p>Todo modelo de puntuación termina siendo ignorado alguna vez \u2014 un gerente decide seguir
      reparando un activo que el sistema marcó, por razones que pueden ser perfectamente válidas
      (calendario de flujo de caja, una renovación de flota planificada para el próximo trimestre, un
      vehículo genuinamente todavía confiable a pesar de los números). Esa es una decisión de negocio
      legítima, no un fallo del sistema. Pero vale la pena rastrear realmente qué sucede después: ¿el
      activo terminó fallando poco después de que se ignoró la recomendación, o siguió funcionando
      bien durante otro año?</p>

      <p>Construimos este bucle de retroalimentación directamente en TraceHub en lugar de dejarlo como
      una pregunta sin respuesta: cada vez que se rechaza una recomendación de baja, el sistema anota
      discretamente el conteo de incidentes del activo en ese momento, y verifica más tarde si siguió
      una falla real. Con el tiempo, esto construye una respuesta honesta y específica de la empresa
      a "qué tan confiables son estas recomendaciones para nosotros, específicamente" \u2014 no una
      afirmación de marketing sobre la precisión de la IA, sino un número real y auditable derivado de
      lo que realmente sucedió después de decisiones pasadas, que luego retroalimenta cuánto peso
      reciben las futuras recomendaciones.</p>

      <h3>La conclusión</h3>
      <p>No necesita un sistema sofisticado para tomar mejores decisiones de reparar o reemplazar \u2014
      necesita observar consistentemente juntos el costo de reemplazo (no el precio original), la
      frecuencia de reparación (no solo el gasto total) y la condición actual, en lugar de recurrir
      por defecto a "todavía funciona". El sistema simplemente hace que eso sea consistente y
      automático, en lugar de algo que alguien tiene que recordar hacer correctamente cada vez, para
      cada activo, en toda una flota.</p>
    `,
  },
  {
    title: 'La depreciación no tiene que ser un misterio: lo que su equipo realmente vale hoy',
    slug: 'understanding-asset-depreciation',
    locale: 'es',
    excerpt: 'Una guía en lenguaje sencillo sobre lo que realmente mide la depreciación, un ejemplo completo con números reales, y los cuatro errores que distorsionan silenciosamente el número en la mayoría de las empresas.',
    authorName: 'Equipo TraceHub',
    publishedAt: new Date('2026-08-04'),
    isPublished: true,
    coverImageUrl: '/blog/depreciation-explained-cover.svg',
    bodyHtml: `
      <p>Pregúntele a un gerente de instalaciones cuánto vale su generador de cinco años, y
      generalmente obtendrá una de dos respuestas. Un número confiado que resulta ser el precio de
      compra original sin ningún ajuste, o un honesto encogimiento de hombros. Ninguna es realmente
      su culpa \u2014 la depreciación tiene la reputación de ser una formalidad contable, algo que
      vive en una hoja de cálculo que nadie abre hasta que el auditor la pide. Esa reputación es
      incorrecta, y le está costando dinero real a las empresas.</p>

      <p>Este es un recorrido en lenguaje sencillo sobre qué es realmente la depreciación, por qué
      merece más atención de la que normalmente recibe, y cómo pensar en ella de una manera que se
      sostenga cuando alguien le pida que defienda el número.</p>

      <h3>Por qué esto no es solo un ejercicio contable</h3>
      <p>La depreciación se archiva bajo \u00abel problema de finanzas\u00bb, lo que subestima para
      qué realmente sirve. Un valor en libros actual y preciso alimenta directamente decisiones que
      no tienen nada que ver con la temporada de impuestos:</p>
      <ul>
        <li><strong>Presupuestación.</strong> Si no sabe cuánto vale realmente su flota hoy, no
        puede pronosticar el gasto de reemplazo del próximo año \u2014 está adivinando, y las
        suposiciones tienden a ser optimistas.</li>
        <li><strong>Seguros.</strong> Los reclamos y niveles de cobertura se negocian sobre el valor
        real en efectivo, no el valor sentimental ni el número de una factura de hace cinco años.</li>
        <li><strong>La decisión de reparar o reemplazar.</strong> Genuinamente no puede tomar esa
        decisión bien sin conocer el valor actual \u2014 es la otra mitad de la comparación, junto
        con el costo de reparación. Escribimos un marco completo para esa decisión
        <a href="/blog/repair-or-replace-decision-framework">aquí</a> si aún no lo ha visto.</li>
        <li><strong>Vender o entregar equipo a cambio de otro.</strong> Un valor en libros
        defendible es su posición de apertura en esa negociación, no una ocurrencia tardía una vez
        que un comprador lo pregunta.</li>
      </ul>
      <p>Trate la depreciación como un número vivo que cambia lo que haría hoy, y deja de ser
      papeleo.</p>

      <h3>La idea en una frase</h3>
      <p>La depreciación no es \u00abqué tan viejo es esto\u00bb. Es una estimación de cuánto valor
      económico de un activo ya se ha consumido, basada en la suposición de que el valor disminuye
      de manera predecible desde un precio de compra hasta un valor residual (de rescate) durante su
      vida útil.</p>

      <p>La versión más simple de esa estimación \u2014 la <strong>depreciación en línea
      recta</strong> \u2014 distribuye esa disminución de manera uniforme en cada año. Tome un
      generador de $12,000 con una vida útil de 8 años y un valor residual del 10% ($1,200 una vez
      completamente depreciado):</p>

      <div class="not-prose" style="background:#F4F7FA;border-radius:14px;padding:1.25rem 1.5rem;margin:1.5rem 0;font-family:ui-monospace,monospace;font-size:0.92rem;">
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #E2E8F0;"><span style="color:#64748B;">Base depreciable</span><span>$12,000 \u2212 $1,200 = $10,800</span></div>
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #E2E8F0;"><span style="color:#64748B;">Depreciación anual</span><span>$10,800 \u00f7 8 años = <strong>$1,350 / año</strong></span></div>
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;"><span style="color:#64748B;">Valor en libros después de 3 años</span><span style="color:#1A4D8F;font-weight:700;">$12,000 \u2212 ($1,350 \u00d7 3) = $7,950</span></div>
      </div>

      <p>Eso es todo \u2014 ese es el cálculo completo. No se necesita ninguna macro de hoja de
      cálculo. Si quiere probarlo con sus propios números ahora mismo en lugar de confiar en
      nuestra palabra sobre la aritmética, la documentación del
      <a href="/docs/smart-depreciation-engine">Motor de depreciación inteligente</a> tiene una
      calculadora en vivo integrada directamente en la página, usando exactamente esta fórmula.</p>

      <h3>Dónde la línea recta deja de ser honesta, silenciosamente</h3>
      <p>La suposición de la línea recta \u2014 desgaste idéntico cada año \u2014 es un punto de
      partida razonable y una descripción bastante pobre de cómo realmente envejece la mayoría del
      equipo. Dos generadores comprados el mismo día, mismo modelo, mismo precio, pueden valer
      cantidades muy diferentes tres años después dependiendo de lo que realmente les pasó:</p>

      <img src="/blog/depreciation-curves-diagram.svg" alt="Gráfico que compara la depreciación en línea recta con las curvas de uso real ligero e intensivo" style="width:100%;border-radius:16px;margin:1.5rem 0;" />

      <p>Una unidad usada ligeramente, mantenida según lo programado, guardada en un lugar seco y
      climatizado, conserva más valor del que predice la estimación en línea recta. Una unidad usada
      intensamente, expuesta al aire salino o al polvo, con un mantenimiento que falló algunas
      veces \u2014 pierde valor más rápido de lo que una línea recta admite. Ambas se describen de
      manera idéntica en una hoja de cálculo que solo conoce \u00abprecio de compra\u00bb y \u00abaños
      de propiedad\u00bb.</p>

      <p>Esta es exactamente la brecha que el <a href="/docs/ai-adaptive-depreciation-in-depth">
      método de depreciación Adaptativo IA</a> de TraceHub está diseñado para cerrar \u2014 ajusta la
      tasa de depreciación usando la intensidad de uso real, el historial de mantenimiento, las
      condiciones ambientales, y (cuando lo tiene) el valor de mercado actual, en lugar de suponer
      que cada activo de una categoría envejece de manera idéntica. Si tiene curiosidad sobre el menú
      completo de opciones, incluyendo los métodos basados en el tiempo (línea recta, saldo
      decreciente, doble saldo decreciente, suma de dígitos de los años) y los métodos basados en el
      uso (unidades de producción, horas máquina, kilometraje), hemos documentado las matemáticas
      detrás de <a href="/docs/time-based-depreciation-methods">cada método basado en el
      tiempo</a> y <a href="/docs/usage-based-depreciation-methods">cada método basado en el
      uso</a> en detalle. También hay una opción genuinamente útil si ninguno de los métodos
      integrados se ajusta a su situación: puede
      <a href="/docs/writing-custom-depreciation-formulas">escribir su propia fórmula de
      depreciación</a> usando las propias variables de su organización.</p>

      <h3>Cuatro errores que vemos constantemente</h3>
      <p>Ninguno es exótico \u2014 simplemente son fáciles de cometer una vez que la depreciación se
      convierte en una tarea anual en lugar de un número vivo.</p>
      <p><strong>1. Usar el precio de compra original para siempre.</strong> Si el valor de mercado
      real de un activo se ha movido significativamente \u2014 hacia arriba o hacia abajo \u2014 y
      nadie actualiza la entrada, cada cálculo posterior hereda silenciosamente una suposición
      obsoleta.</p>
      <p><strong>2. Ignorar el valor residual por completo.</strong> Suponer que un activo se
      deprecia a cero sobrestima la pérdida y puede distorsionar una comparación de
      reparar-versus-reemplazar en la dirección equivocada \u2014 la mayoría del equipo aún vale algo
      incluso completamente depreciado en papel.</p>
      <p><strong>3. Tratar \u00abdepreciado\u00bb y \u00absin valor\u00bb como lo mismo.</strong> Un
      activo completamente depreciado en los libros aún puede estar haciendo un trabajo real y
      valioso. El valor en libros y el valor operativo están relacionados, no son idénticos.</p>
      <p><strong>4. Pensarlo solo una vez al año.</strong> Para cuando una revisión anual revela un
      activo problemático, generalmente ya ha absorbido meses de una mala decisión \u2014 una
      reparación que no debería haberse aprobado, un reemplazo que se retrasó demasiado. Un número
      que se actualiza en el momento en que llegan nuevos datos detecta esto mientras todavía hay
      tiempo para actuar.</p>

      <h3>El panorama general: la depreciación alimenta todo lo demás</h3>
      <p>El valor en libros no es solo un número que descansa tranquilamente en un informe. En
      TraceHub, es una de las siete entradas detrás de la recomendación
      Mantener/Reparar/Vender/Desguazar/Reemplazar del
      <a href="/docs/disposal-intelligence-engine">Motor de inteligencia de baja</a>, y se acumula
      en la cifra general de <a href="/docs/fleet-intelligence-formulas-explained">Riesgo de
      capital</a> de su flota en el tablero \u2014 la exposición real en dólares que se encuentra en
      equipo que ya está en mal estado. Obtenga bien el número subyacente, y todo lo que se
      construye sobre él se vuelve más confiable junto con él.</p>

      <p>Si actualmente está estimando esto una vez al año en una hoja de cálculo, o no lo está
      estimando en absoluto, los primeros 10 activos son gratuitos para registrar y rastrear durante
      treinta días \u2014 sin necesidad de tarjeta. La depreciación se calcula sola en el momento en
      que ingresa un precio de compra.</p>
    `,
  },
];

module.exports = spanishPosts;
