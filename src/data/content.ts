export const DIMENSIONS = [
  {
    id: 'estrategia',
    label: 'Estrategia',
    score: 7.5,
    icon: '🎯',
    motivo: 'Piensas en grande y tienes claridad de visión. El trabajo en KPIs, monetización de la galera y la transición de liderazgo muestra pensamiento estratégico real. Sin embargo, la brecha entre visión y ejecución cotidiana sigue siendo el punto crítico.',
    riesgo: 'Sin mejorar la conexión entre estrategia y ejecución cotidiana, los planes quedan en frameworks elegantes sin impacto medible. El riesgo es construir arquitectura sin ladrillos.',
    acciones: [
      'Definir 3 prioridades estratégicas del trimestre, no más — y decirle no a todo lo demás',
      'Crear un "mapa de apuestas": qué decisiones tomé, qué espero, cuándo mido',
      'Revisar el progreso estratégico en reunión mensual de 2 horas (no la semanal operativa)',
    ],
    habitos: [
      'Cada viernes: ¿avancé en mis 3 prioridades estratégicas? ¿qué desbloqueé?',
      'Cada mes: leer un caso de empresa similar para inspiración externa',
    ],
  },
  {
    id: 'ejecucion',
    label: 'Ejecución',
    score: 6.0,
    icon: '⚡',
    motivo: 'Este es tu mayor punto de desarrollo. Tienes la filosofía correcta ("lo que no se mide no mejora") pero la evidencia sugiere que los sistemas existen más en papel que en práctica. La partida del Operations Manager expuso esta brecha.',
    riesgo: 'Sin mejorar la ejecución disciplinada, acumularás un cementerio de iniciativas brillantes. Tu equipo perderá fe en que los planes se convierten en realidad.',
    acciones: [
      'Implementar el Weekly Accountability Tracker: cada lunes, 5 compromisos con estado verde/rojo y causa raíz si rojo',
      'Crear un "commitments dashboard" visible para todo el equipo de liderazgo',
      'Revisar el % de cumplimiento de compromisos como KPI cultural #1',
    ],
    habitos: [
      'Cada lunes: revisar compromisos de la semana anterior antes de aceptar nuevos',
      'Nunca cerrar una reunión sin responsable, fecha y entregable específico',
    ],
  },
  {
    id: 'liderazgo',
    label: 'Liderazgo',
    score: 7.0,
    icon: '👥',
    motivo: 'Tienes presencia de liderazgo y capacidad para activar a las personas. La decisión de elevar estándares tras la salida del Operations Manager es un movimiento inteligente. El área de desarrollo es la velocidad para tomar decisiones difíciles.',
    riesgo: 'Los líderes que evitan decisiones difíciles crean vacíos que llena la cultura informal. Tu equipo empieza a resolver problemas sin ti — pero no siempre en la dirección correcta.',
    acciones: [
      'Adoptar el principio "decide en 48 horas o escala": ninguna decisión estratégica duerme más de 2 días',
      'Hacer 1:1s mensuales con cada líder directo enfocados en carrera, no en tareas',
      'Desarrollar a alguien de tu equipo como tu sucesor operativo en los próximos 6 meses',
    ],
    habitos: [
      'Cada semana: identificar UNA decisión que has estado evitando y tomarla',
      'Cada mes: dar retroalimentación directa y específica a cada miembro del equipo de liderazgo',
    ],
  },
  {
    id: 'cultura',
    label: 'Cultura',
    score: 6.5,
    icon: '🏛',
    motivo: 'Tienes la filosofía correcta: accountability, responsables nombrados, revisión semanal. El riesgo está en la implementación. La cultura se forma más por lo que toleras que por lo que proclamas.',
    riesgo: 'Si los sistemas de accountability existen pero no tienen consecuencias reales, el equipo aprende que son decorativos. Esto crea una cultura de compliance superficial, no de alto desempeño.',
    acciones: [
      'Definir qué comportamientos son innegociables y qué consecuencias tienen — y aplicarlas consistentemente',
      'Crear un ritual de reconocimiento público semanal con un ejemplo concreto',
      'Tener la conversación difícil pendiente que llevas posponiendo — este mes',
    ],
    habitos: [
      'Cada viernes: reconocer públicamente a alguien (mensaje, reunión, mención)',
      'Cada trimestre: evaluar el desempeño de cada líder con conversación directa',
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    score: 6.5,
    icon: '📊',
    motivo: 'Entiendes los drivers del negocio y estás construyendo KPIs financieros. El área de desarrollo es la profundidad: ¿puedes explicar de memoria el margen operativo por línea de servicio? ¿Sabes qué academias son rentables y cuáles no?',
    riesgo: 'Un gerente general que no domina los números deja espacio para que las decisiones se tomen por intuición o por lo que parece bien operativamente, no por lo que maximiza valor.',
    acciones: [
      'Crear un P&L por línea de negocio (gym, academias, eventos, alquiler) — no solo total',
      'Revisar el estado de resultados completo cada semana, no solo ingresos',
      'Definir el EBITDA objetivo del año y trabajar hacia atrás para identificar las 3 palancas más importantes',
    ],
    habitos: [
      'Cada lunes: revisar ingresos vs. presupuesto y 2 métricas de costo',
      'Cada mes: 30 minutos revisando rentabilidad por academia/servicio',
    ],
  },
  {
    id: 'operaciones',
    label: 'Operaciones',
    score: 7.0,
    icon: '⚙️',
    motivo: 'Las operaciones de Sporta funcionan — llevan 20 años. El reto no es arreglar lo roto sino elevar la eficiencia para crecer sin aumentar costos proporcionalmente. La ausencia del Ops Manager te mostró dónde hay dependencias no documentadas.',
    riesgo: 'Sin documentación de procesos clave y sin un número dos operativo, eres un punto único de fallo. Si te vas una semana, ¿qué se cae?',
    acciones: [
      'Mapear los 10 procesos más críticos y tener un manual para cada uno',
      'Identificar a la persona que puede cubrir el 70% de tu rol operativo — y desarrollarla activamente',
      'Crear un "business continuity test": ausentarte 3 días y medir qué necesitó tu intervención',
    ],
    habitos: [
      'Cada semana: revisar utilización de espacios y detectar ineficiencias',
      'Cada trimestre: auditar qué procesos puedes eliminar o automatizar',
    ],
  },
  {
    id: 'cliente',
    label: 'Cliente',
    score: 6.5,
    icon: '🤝',
    motivo: 'Tienes orientación al cliente pero probablemente basada en intuición e interacciones casuales más que en datos sistemáticos. ¿Cuándo fue la última vez que entrevistaste formalmente a 10 miembros sobre su experiencia?',
    riesgo: 'En el fitness, el cliente no se queja — se va. El churn silencioso es letal. Sin un sistema de voz del cliente, eres reactiva en lugar de predictiva.',
    acciones: [
      'Implementar encuesta de retención mensual con seguimiento a miembros en riesgo en 48 horas',
      'Crear un "panel de miembros": 8-10 personas que se reúnen contigo cada 2 meses',
      'Revisar las razones de cancelación con análisis de causa raíz mensual',
    ],
    habitos: [
      'Cada martes: ronda de instalaciones hablando con 3-5 miembros sin agenda',
      'Cada mes: revisar tasa de retención y razones de cancelación con el equipo',
    ],
  },
  {
    id: 'innovacion',
    label: 'Innovación',
    score: 7.5,
    icon: '💡',
    motivo: 'Este es uno de tus puntos más fuertes. La exploración de simuladores, wellness cognitivo, y el análisis de la galera muestran una mente que busca activamente oportunidades no obvias. El reto es pasar del análisis a la validación con mercado real.',
    riesgo: 'La innovación sin validación rápida se convierte en análisis paralítico. El mundo del fitness cambia en 18-24 meses. La ventana se cierra.',
    acciones: [
      'Elegir una sola apuesta para la galera y definir un piloto de 90 días con inversión mínima',
      'Crear un "innovation budget": un % fijo de presupuesto reservado para experimentos',
      'Hablar con 20 clientes potenciales del concepto elegido antes de invertir un dólar en infraestructura',
    ],
    habitos: [
      'Cada mes: visitar un negocio fuera del sector fitness para traer ideas',
      'Cada trimestre: revisar si los experimentos actuales merecen escalar o cerrar',
    ],
  },
  {
    id: 'tiempo',
    label: 'Gestión del tiempo',
    score: 6.0,
    icon: '⏱',
    motivo: 'Este es el punto ciego más común en líderes inteligentes que ascienden. La capacidad de hacer se convierte en trampa: sigues haciendo lo que eres buena en lugar de hacer lo que la organización necesita que hagas.',
    riesgo: 'Si no proteges tu tiempo estratégico, el día a día te consume. En 6 meses seguirás siendo una excelente operadora, no una gerente general de clase mundial.',
    acciones: [
      'Auditar el calendario de las últimas 2 semanas: clasificar cada bloque como estratégico/operativo/reactivo',
      'Bloquear 2 horas los lunes y jueves como tiempo estratégico intocable',
      'Decir "no" a al menos una solicitud esta semana que otros pueden resolver',
    ],
    habitos: [
      'Cada domingo noche: planificar la semana con bloques protegidos primero, reuniones después',
      'Cada viernes: ¿qué % de mi tiempo fue estratégico? Meta: al menos 40%',
    ],
  },
  {
    id: 'desarrollo',
    label: 'Desarrollo personal',
    score: 7.5,
    icon: '🌱',
    motivo: 'El hecho de que estés haciendo este ejercicio es una señal positiva. Aprendes activamente, buscas frameworks y te exiges estándares altos. El área de mejora es la aplicación sistemática del aprendizaje, no solo la acumulación.',
    riesgo: 'El aprendizaje sin práctica deliberada no cambia el comportamiento. Puedes saber mucho sobre liderazgo y seguir repitiendo los mismos patrones.',
    acciones: [
      'Adoptar un principio de aprendizaje por trimestre — uno solo — y aplicarlo conscientemente',
      'Buscar un mentor externo que haya sido CEO o GM de empresa similar',
      'Llevar un diario de liderazgo: 5 minutos al día escribiendo qué aprendiste y qué harías diferente',
    ],
    habitos: [
      '30 minutos diarios de lectura o contenido de liderazgo (no social media)',
      'Un retiro de reflexión de medio día cada trimestre para revisar tu crecimiento',
    ],
  },
]

export const KPIS = [
  { num: 1, kpi: 'Churn de membresías', dimension: 'Retención', frecuencia: 'Semanal', porque: 'Predictor #1 de salud del negocio' },
  { num: 2, kpi: 'Nuevas membresías activas', dimension: 'Adquisición', frecuencia: 'Semanal', porque: 'Crecimiento neto de base' },
  { num: 3, kpi: 'Tasa de retención de clientes', dimension: 'Experiencia', frecuencia: 'Mensual', porque: 'Indicador líder de churn futuro' },
  { num: 4, kpi: 'Utilización de espacios clave (%)', dimension: 'Operaciones', frecuencia: 'Mensual', porque: 'Rentabilidad por metro cuadrado' },
  { num: 5, kpi: 'Ingresos totales vs. presupuesto', dimension: 'Finanzas', frecuencia: 'Semanal', porque: 'Pulso financiero inmediato' },
  { num: 6, kpi: 'EBITDA / Margen operativo', dimension: 'Rentabilidad', frecuencia: 'Mensual', porque: 'Verdadera salud del negocio' },
  { num: 7, kpi: 'Tasa de conversión de prospectos', dimension: 'Ventas', frecuencia: 'Semanal', porque: 'Eficiencia del funnel de adquisición' },
  { num: 8, kpi: 'Tasa de conversión de visitas', dimension: 'Ventas', frecuencia: 'Semanal', porque: 'Cierre efectivo en el punto de contacto' },
  { num: 9, kpi: 'Cumplimiento de compromisos del equipo', dimension: 'Cultura', frecuencia: 'Semanal', porque: 'Accountability en acción' },
  { num: 10, kpi: 'Ingresos por eventos / alquileres', dimension: 'Diversificación', frecuencia: 'Mensual', porque: 'Revenue de baja inversión marginal' },
]

export const ROUTINE = {
  Lunes: {
    subtitle: 'Ritmo y dirección',
    blocks: [
      { time: '8:00–9:00', task: 'Arranque estratégico — prioridades de la semana. Intocable.', cat: 'Estrategia' },
      { time: '9:00–10:00', task: 'Revisión CEO Scorecard. Estado vs. semana anterior.', cat: 'Estrategia' },
      { time: '10:00–11:00', task: '1:1 jefe de área (quincenal · rotativo)', cat: 'Personas' },
      { time: '11:00–12:00', task: 'Proyectos estratégicos — galera, simuladores, etc.', cat: 'Estrategia' },
    ],
  },
  Martes: {
    subtitle: 'Clientes y mercado',
    blocks: [
      { time: '8:00–9:00', task: 'Recorrido club — operación visible', cat: 'Operaciones' },
      { time: '9:00–10:00', task: 'Disponible equipo — desbloqueos rápidos', cat: 'Personas' },
      { time: '10:00–11:00', task: 'Gestión operativa — correos, decisiones, visitas', cat: 'Operaciones' },
      { time: '11:00–12:00', task: 'Buffer — imprevistos del día', cat: 'Operaciones' },
    ],
  },
  Miércoles: {
    subtitle: 'Proyectos y profundidad',
    blocks: [
      { time: '8:00–9:00', task: 'Trabajo profundo — sin reuniones', cat: 'Estrategia' },
      { time: '9:00–10:00', task: 'Disponible equipo — desbloqueos rápidos', cat: 'Personas' },
      { time: '10:00–11:00', task: '1:1 jefe de área (quincenal · rotativo)', cat: 'Personas' },
      { time: '11:00–12:00', task: 'Proyectos estratégicos — análisis, decisiones', cat: 'Estrategia' },
    ],
  },
  Jueves: {
    subtitle: 'Ejecución y equipo',
    blocks: [
      { time: '8:00–9:00', task: 'Recorrido club — operación visible', cat: 'Operaciones' },
      { time: '9:00–10:00', task: 'Disponible equipo — desbloqueos rápidos', cat: 'Personas' },
      { time: '10:00–11:00', task: 'Gestión operativa — visitas, proveedores', cat: 'Operaciones' },
      { time: '11:00–12:00', task: 'Buffer — imprevistos del día', cat: 'Operaciones' },
    ],
  },
  Viernes: {
    subtitle: 'Reflexión y cierre',
    blocks: [
      { time: '8:00–9:00', task: 'Cierre semanal — revisión de pendientes', cat: 'Estrategia' },
      { time: '9:00–10:00', task: 'Preparación reunión KPIs — revisión de métricas', cat: 'Estrategia' },
      { time: '10:00–11:00', task: 'Reunión KPIs semanal — todos los jefes de área', cat: 'Personas' },
      { time: '11:00–12:00', task: 'Buffer post-reunión — seguimientos y acuerdos', cat: 'Operaciones' },
    ],
  },
}

export const CHECKLIST_ITEMS = {
  'Foco estratégico': [
    '¿Cuál es mi prioridad #1 hoy? (Una sola)',
    '¿Esta prioridad contribuye a alguna de mis 3 metas del trimestre?',
    '¿Hay una decisión que he estado posponiendo que debería tomar HOY?',
  ],
  'KPIs (lunes)': [
    'Revisé el CEO Scorecard semanal — todos los 10 indicadores con semáforo',
    'Identifiqué al menos un KPI en rojo o amarillo con causa raíz y responsable',
    'Revisé ingresos vs. presupuesto de la semana anterior',
  ],
  'Personas y cultura': [
    '¿Hay alguien en el equipo que merece reconocimiento hoy?',
    '¿Hay una conversación difícil que he estado evitando?',
    '¿El equipo tiene todo lo que necesita para ejecutar sin mí hoy?',
  ],
  'Cliente y operaciones': [
    '¿Revisé algún feedback de clientes hoy (retención, quejas, cancelaciones)?',
    '¿Hay un cuello de botella operativo esperando mi intervención?',
    '¿Hablé con al menos un miembro o cliente hoy?',
  ],
  'Cierre del día': [
    '¿Cumplí mi prioridad #1 del día?',
    '¿Los compromisos adquiridos hoy están registrados con responsable y fecha?',
    '¿Qué aprendí hoy que cambiaría algo en cómo opero?',
    '¿Dediqué al menos el 40% de mi tiempo a actividades estratégicas?',
    '¿Hay algo que debería haber delegado y no lo hice?',
  ],
}

export const PLAN_90 = [
  {
    mes: 'Mes 1 · Días 1–30',
    foco: 'Autoconciencia y baseline',
    color: 'accent',
    items: [
      'Completar assessment de liderazgo 360° con el equipo directo',
      'Identificar mi "zona de operación": dónde gasto el tiempo vs. dónde debería',
      'Leer: The Hard Thing About Hard Things (Horowitz) o Measure What Matters (Doerr)',
      'Tener conversación de desarrollo con cada líder directo sobre sus metas personales',
      'Establecer mentor externo o peer CEO — reunión 1x/mes mínimo',
      'Definir mi scorecard personal: 3 compromisos no negociables como GM',
    ],
  },
  {
    mes: 'Mes 2 · Días 31–60',
    foco: 'Sistemas y delegación activa',
    color: 'amber',
    items: [
      'Auditar el calendario: eliminar/delegar 30% de reuniones donde no soy esencial',
      'Implementar el CEO Scorecard con revisión semanal sin excepción',
      'Crear el "manual de liderazgo Sporta": qué espero, cómo decidimos, qué premiamos',
      'Tomar curso online de finanzas para no financieros o análisis de rentabilidad',
      'Visitar 2 competidores o referentes del mercado como cliente incógnito',
      'Tomar UNA decisión estratégica pendiente: galera, precio, nueva academia',
    ],
  },
  {
    mes: 'Mes 3 · Días 61–90',
    foco: 'Impacto medible y escalabilidad',
    color: 'navy',
    items: [
      'Medir: ¿cuánto mejoró el churn, la conversión y el EBITDA en 90 días?',
      'Hacer segundo 360° para detectar cambios en percepción del equipo',
      'Presentar al Board un plan estratégico para los próximos 12 meses',
      'Identificar mi sucesor operativo: ¿quién puede cubrir el 70% de mi rol operativo?',
      'Leer: Good to Great (Collins) o The CEO Next Door (Botelho)',
      'Definir mi propósito de liderazgo en 2 líneas: ¿por qué lidero? ¿qué construyo?',
    ],
  },
]

export const START_STOP_CONTINUE = {
  start: [
    '2h semanales de pensamiento estratégico puro',
    'Revisar P&L completo, no solo ingresos',
    'Conversaciones de carrera con cada líder',
    'Ronda de cliente 1x/semana sin agenda',
    'Métricas del equipo visibles para todos',
    'Benchmarks externos 1x/mes',
  ],
  stop: [
    'Resolver problemas con dueño asignado',
    'Aprobar decisiones de bajo impacto',
    'Asistir a reuniones donde solo escucho',
    'Tolerar bajo desempeño sin consecuencias',
    'Crear sistemas sin validar adopción',
    'Priorizar armonía sobre resultados',
  ],
  continue: [
    'Frameworks de medición (KPIs, semáforos)',
    'Monetización de espacios subutilizados',
    'Responsables nombrados por iniciativa',
    'Aprender activamente sobre gestión',
    'Reunión semanal de liderazgo estructurada',
  ],
  evitar: [
    { decision: 'Conversaciones de bajo desempeño', razon: 'Cada día sin abordarlas le comunica al equipo de alto desempeño que el estándar es más bajo de lo que dices.' },
    { decision: 'Decisiones de precio y rentabilidad', razon: 'La inacción aquí erosiona márgenes silenciosamente. Ajustar precios no es opcional.' },
    { decision: 'Activar la galera de CrossFit/Hyrox', razon: 'Ya tienes el análisis. Una decisión imperfecta ejecutada supera siempre la inacción perfecta.' },
  ],
}

export const BLIND_SPOTS = [
  { titulo: 'Confundir actividad con progreso', desc: '¿Los KPIs reales mejoran o solo los frameworks se sofistican? Pregunta semanal: ¿qué mejoró esta semana en números concretos?' },
  { titulo: 'El equipo te dice lo que quieres escuchar', desc: 'A medida que asciendes, menos personas te dan retroalimentación negativa honesta. Implementa sistemas formales de escucha.' },
  { titulo: 'Tolerancia invisible al bajo desempeño', desc: 'Cada día que no se aborda a un colaborador con bajo rendimiento, le dices al equipo de alto desempeño que el estándar es más bajo.' },
  { titulo: 'Subestimar el poder del churn', desc: 'Un 5% de churn mensual significa reemplazar el 60% de tu base en un año. ¿Tienes churn por cohorte y por razón de salida?' },
  { titulo: 'Innovar sin validar demanda real', desc: '¿Entrevistaste a 20 clientes potenciales antes de invertir? ¿Tienes cartas de intención de compra?' },
]

export const CULTURA_SIGNALS = {
  debil: [
    'Las personas evitan dar malas noticias',
    'Los buenos se van, los mediocres se quedan',
    'Las reuniones producen acuerdos que nadie ejecuta',
    'El equipo espera instrucciones en vez de tomar iniciativa',
    'Los plazos se incumplen sin que nadie los señale',
    'El chisme es el canal de comunicación real',
  ],
  fuerte: [
    'Las personas traen soluciones, no solo problemas',
    'Los compromisos se cumplen sin necesidad de recordar',
    'El equipo señala sus propios errores antes de que los veas',
    'Las personas se retroalimentan entre sí sin que lo pidas',
    'La rotación es baja entre los de alto desempeño',
    'Tu ausencia de un día no crea caos',
  ],
}
