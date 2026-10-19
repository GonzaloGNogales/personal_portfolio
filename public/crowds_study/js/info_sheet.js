// Participant information sheet (document-accept), in the four study languages, shown
// after the language choice. The participant must scroll to the end and tick a box to
// continue. Spanish is the original document; English, French and Chinese are
// translations to be reviewed.
//
// Blocks: { h } heading, { sub } section label (bullet), { p } paragraph,
// { ul: [...] } bullet list, { contacts: [...] } contact lines. **text** marks bold.

export const INFO_SHEET_VERSION = 'EPC-SIMB3D info sheet v2 (2026-10-19)';
const LOGO_URL = 'img/urjc_logo.png';

export const INFO_SHEET = {
  es: {
    title: 'HOJA DE INFORMACIÓN PARA PARTICIPANTES',
    project: 'EPC-SIMB3D: Evaluación perceptual y cuantitativa de un nuevo sistema de simulación bidimensional de multitudes con restricciones biomecánicas en entornos tridimensionales',
    pi: 'INVESTIGADOR PRINCIPAL: GONZALO GÓMEZ NOGALES',
    blocks: [
      { p: 'Le agradecemos su interés en este estudio. Para que pueda participar en él es necesario que quede informado adecuadamente con este escrito, por lo que le solicitamos que tome el tiempo necesario para leer con detenimiento la siguiente información, y que plantee cuantas preguntas considere necesarias al investigador cuyos datos de contacto figuran arriba, a fin de que pueda considerarse verdaderamente informado.' },
      { p: 'Sepa que, en todo caso, su decisión de participación es enteramente voluntaria y que, aún en el caso de haber decidido participar, podrá decidir dejar de hacerlo en cualquier momento, sin ningún tipo de consecuencia para usted.' },
      { h: '¿Qué es y qué persigue este estudio?' },
      { p: 'Este estudio busca entender cómo influye la incorporación de restricciones físicas y biomecánicas en la simulación de multitudes virtuales sobre la percepción de realismo y naturalidad de las personas que las observan.' },
      { p: 'El objetivo principal es mejorar la calidad y credibilidad de los personajes virtuales interactuando en espacios densamente poblados, especialmente en aquellas aplicaciones que combinan simulación masiva y contacto físico para áreas como los videojuegos, la realidad virtual, los efectos visuales o la simulación arquitectónica.' },
      { h: '¿Quién realiza este estudio?' },
      { p: 'El estudio se llevará a cabo por Gonzalo Gómez, como Investigador Principal y en el marco de su tesis doctoral, y por Marc Comino como tutor de la misma.' },
      { contacts: ['Marc Comino  marc.comino@urjc.es', 'Gonzalo Gómez  gonzalo.gomez@urjc.es'] },
      { h: '¿Cuánto tiempo durará el estudio?' },
      { sub: 'Participantes en Línea' },
      { p: 'La toma de datos se llevará a cabo durante la segunda mitad del año 2026. Extraordinariamente, se podría considerar recopilar datos durante los primeros meses de 2027.' },
      { p: 'Los participantes en línea realizarán únicamente la primera fase del estudio, consistente en la evaluación perceptual de vídeos mediante una plataforma web. Esta fase tendrá una duración estimada de entre 25 y 30 minutos y se completará en una única sesión.' },
      { sub: 'Participantes Presenciales' },
      { p: 'La toma de datos se llevará a cabo durante la segunda mitad del año 2026. Excepcionalmente, se podrá considerar la recogida de datos durante los primeros meses de 2027.' },
      { p: 'Los participantes presenciales realizarán una primera fase de evaluación perceptual de vídeos, con una duración estimada de entre 25 y 30 minutos. También podrán realizar una segunda fase, consistente en una prueba de control interactivo, con una duración estimada de entre 5 y 10 minutos.' },
      { p: 'Ambas fases podrán completarse consecutivamente en una única sesión o realizarse en dos sesiones independientes, con el fin de reducir la posible fatiga atencional.' },
      { h: '¿Cómo se realizará el estudio? ¿En qué consistirá mi participación y qué riesgos conlleva?' },
      { sub: 'Participantes en Línea' },
      { p: 'El participante accederá de forma remota a la plataforma web de evaluación desde un ordenador. Antes de comenzar, deberá leer la hoja informativa disponible en la plataforma y marcar una casilla para confirmar que ha leído y comprendido su contenido.' },
      { p: 'Seguidamente, la plataforma mostrará las instrucciones de uso, cuatro vídeos de ejemplo no evaluados y dos ensayos de práctica cuyas respuestas no se registrarán. A continuación, el participante visualizará de forma secuencial, frente a un monitor de ordenador estándar, una serie de vídeos de multitudes virtuales. Tras finalizar la reproducción de cada escenario, se le pedirá que evalúe aspectos como el realismo de los contactos físicos, la conciencia espacial de los personajes y la naturalidad global del movimiento colectivo mediante cuestionarios estructurados.' },
      { sub: 'Participantes Presenciales' },
      { p: 'En la primera fase, el participante accederá a la plataforma web de evaluación desde uno de los equipos habilitados en los despachos del sótano del Aulario II de la Universidad Rey Juan Carlos. Antes de comenzar, deberá leer la hoja informativa disponible en la plataforma y marcar una casilla para confirmar que ha leído y comprendido su contenido.' },
      { p: 'Seguidamente, la plataforma mostrará las instrucciones de uso, cuatro vídeos de ejemplo no evaluados y dos ensayos de práctica cuyas respuestas no se registrarán. Durante esta sesión, el participante visualizará de forma secuencial, frente a un monitor de ordenador estándar, una serie de vídeos de multitudes virtuales. Tras finalizar la reproducción de cada escenario, se le pedirá que evalúe aspectos como el realismo de los contactos físicos, la conciencia espacial de los personajes y la naturalidad global del movimiento colectivo mediante cuestionarios estructurados.' },
      { p: 'En la segunda fase, disponible exclusivamente para los participantes de la modalidad presencial, el participante realizará una exploración cualitativa interactiva en los despachos del Sótano del Aulario II. Esta fase podrá realizarse inmediatamente después de la primera o en una sesión independiente, a la hora previamente acordada. El participante tomará el mando en tiempo real de un avatar virtual utilizando las teclas de dirección convencionales de un teclado para navegar físicamente a través de una multitud simulada. Al finalizar esta interacción, se solicitará al participante que complete un cuestionario breve y responda a un par de preguntas abiertas para evaluar su experiencia con la interacción virtual, centrándose en aspectos como la coherencia en la transferencia de fuerzas, la reactividad del sistema ante los empujes y la credibilidad general.' },
      { sub: 'Riesgos (ambas modalidades)' },
      { p: 'Este estudio no conlleva riesgos significativos. Las tareas se realizan en un entorno seguro, sin manipulación de objetos peligrosos ni necesidad de esfuerzo físico. El uso continuado de un monitor de ordenador para observar animaciones dinámicas puede causar ligeras molestias visuales o fatiga atencional en algunas personas, especialmente si se utilizan durante períodos prolongados. En caso de incomodidad o frustración durante el control interactivo, el participante podrá interrumpir su participación en cualquier momento, sin ningún tipo de penalización. Además, para minimizar cualquier carga cognitiva, el diseño del experimento permite realizar breves pausas de descanso entre los distintos bloques de evaluación.' },
      { h: '¿Qué información se recabará para la realización de este estudio?' },
      { p: 'Para la realización de este estudio, no se recogerán datos demográficos ni datos personales identificables.' },
      { p: 'Se recogerán exclusivamente datos derivados de la participación en el estudio. Estos datos se recogen durante el desarrollo de las tareas y cuestionarios:' },
      { ul: [
        'Valoraciones mediante escalas estructuradas sobre el realismo de los contactos físicos.',
        'Puntuaciones relativas a la conciencia espacial percibida en los personajes.',
        'Evaluación de la naturalidad global del movimiento colectivo.',
        'Respuestas a una métrica estandarizada de facilidad de uso tras la exploración interactiva en tiempo real.',
        'Respuestas a preguntas abiertas orientadas a documentar la coherencia en la transferencia de fuerzas, la reactividad del sistema ante empujes y cualquier anomalía detectada durante la navegación.',
        'Métricas de rendimiento.'
      ] },
      { p: 'Todos los datos serán **anonimizados**: no se vincularán con nombres ni información personal identificable.' }
    ]
  },

  en: {
    title: 'PARTICIPANT INFORMATION SHEET',
    project: 'EPC-SIMB3D: Perceptual and quantitative evaluation of a new two-dimensional crowd simulation system with biomechanical constraints in three-dimensional environments',
    pi: 'PRINCIPAL INVESTIGATOR: GONZALO GÓMEZ NOGALES',
    blocks: [
      { p: 'Thank you for your interest in this study. To take part in it, you need to be properly informed by this document, so we ask you to take the time you need to read the following information carefully, and to ask the researcher whose contact details appear above as many questions as you consider necessary, so that you can consider yourself truly informed.' },
      { p: 'Please note that, in any case, your decision to participate is entirely voluntary and that, even if you have decided to take part, you may decide to stop at any time, without any consequence for you.' },
      { h: 'What is this study and what does it aim to do?' },
      { p: 'This study seeks to understand how adding physical and biomechanical constraints to the simulation of virtual crowds influences the perception of realism and naturalness of the people who watch them.' },
      { p: 'The main goal is to improve the quality and credibility of virtual characters interacting in densely populated spaces, especially in applications that combine large-scale simulation and physical contact, in areas such as video games, virtual reality, visual effects or architectural simulation.' },
      { h: 'Who is carrying out this study?' },
      { p: 'The study will be carried out by Gonzalo Gómez, as Principal Investigator and as part of his doctoral thesis, and by Marc Comino as his thesis supervisor.' },
      { contacts: ['Marc Comino  marc.comino@urjc.es', 'Gonzalo Gómez  gonzalo.gomez@urjc.es'] },
      { h: 'How long will the study last?' },
      { sub: 'Online participants' },
      { p: 'Data will be collected during the second half of 2026. Exceptionally, data collection may continue during the first months of 2027.' },
      { p: 'Online participants will only take part in the first phase of the study, which consists of the perceptual evaluation of videos through a web platform. This phase is expected to last between 25 and 30 minutes and will be completed in a single session.' },
      { sub: 'In-person participants' },
      { p: 'Data will be collected during the second half of 2026. Exceptionally, data collection may continue during the first months of 2027.' },
      { p: 'In-person participants will take part in a first phase of perceptual evaluation of videos, expected to last between 25 and 30 minutes. They may also take part in a second phase, an interactive control test, expected to last between 5 and 10 minutes.' },
      { p: 'Both phases may be completed consecutively in a single session or in two separate sessions, in order to reduce possible attentional fatigue.' },
      { h: 'How will the study be carried out? What will my participation involve, and what are the risks?' },
      { sub: 'Online participants' },
      { p: 'The participant will access the web evaluation platform remotely from a computer. Before starting, they must read the information sheet available on the platform and tick a box to confirm that they have read and understood its content.' },
      { p: 'The platform will then show the instructions, four example videos that are not rated and two practice trials whose answers are not recorded. Next, in front of a standard computer monitor, the participant will watch a series of videos of virtual crowds, one after another. After each scenario has been played, the participant will be asked to rate aspects such as the realism of physical contacts, the spatial awareness of the characters and the overall naturalness of the collective movement, using structured questionnaires.' },
      { sub: 'In-person participants' },
      { p: 'In the first phase, the participant will access the web evaluation platform from one of the computers provided in the offices in the basement of Aulario II at Universidad Rey Juan Carlos. Before starting, they must read the information sheet available on the platform and tick a box to confirm that they have read and understood its content.' },
      { p: 'The platform will then show the instructions, four example videos that are not rated and two practice trials whose answers are not recorded. During this session, in front of a standard computer monitor, the participant will watch a series of videos of virtual crowds, one after another. After each scenario has been played, the participant will be asked to rate aspects such as the realism of physical contacts, the spatial awareness of the characters and the overall naturalness of the collective movement, using structured questionnaires.' },
      { p: 'In the second phase, available only to in-person participants, the participant will carry out an interactive qualitative exploration in the offices in the basement of Aulario II. This phase may take place immediately after the first one or in a separate session, at a previously agreed time. The participant will take control of a virtual avatar in real time, using the usual arrow keys of a keyboard to physically navigate through a simulated crowd. After this interaction, the participant will be asked to complete a short questionnaire and answer a couple of open questions to evaluate their experience of the virtual interaction, focusing on aspects such as the consistency of force transfer, the responsiveness of the system to pushes and its overall credibility.' },
      { sub: 'Risks (both modalities)' },
      { p: 'This study does not involve significant risks. The tasks take place in a safe environment, without handling dangerous objects and without physical effort. Continued use of a computer monitor to watch dynamic animations may cause slight visual discomfort or attentional fatigue in some people, especially over long periods. In case of discomfort or frustration during the interactive control, the participant may stop at any time, without any penalty. In addition, to minimise cognitive load, the design of the experiment allows short rest breaks between the different evaluation blocks.' },
      { h: 'What information will be collected for this study?' },
      { p: 'For this study, no demographic data and no personally identifiable data will be collected.' },
      { p: 'Only data derived from participation in the study will be collected. These data are collected while the tasks and questionnaires are carried out:' },
      { ul: [
        'Ratings on structured scales about the realism of physical contacts.',
        'Scores on the perceived spatial awareness of the characters.',
        'Evaluation of the overall naturalness of the collective movement.',
        'Answers to a standardised usability measure after the real-time interactive exploration.',
        'Answers to open questions intended to document the consistency of force transfer, the responsiveness of the system to pushes and any anomaly detected during navigation.',
        'Performance metrics.'
      ] },
      { p: 'All data will be **anonymised**: they will not be linked to names or to personally identifiable information.' }
    ]
  },

  fr: {
    title: 'FICHE D’INFORMATION POUR LES PARTICIPANTS',
    project: 'EPC-SIMB3D : Évaluation perceptive et quantitative d’un nouveau système de simulation bidimensionnelle de foules avec contraintes biomécaniques dans des environnements tridimensionnels',
    pi: 'CHERCHEUR PRINCIPAL : GONZALO GÓMEZ NOGALES',
    blocks: [
      { p: 'Nous vous remercions de l’intérêt que vous portez à cette étude. Pour y participer, vous devez être correctement informé(e) par ce document ; nous vous demandons donc de prendre le temps nécessaire pour lire attentivement les informations suivantes, et de poser au chercheur dont les coordonnées figurent ci-dessus toutes les questions que vous jugerez utiles, afin de pouvoir vous considérer réellement informé(e).' },
      { p: 'Sachez que, dans tous les cas, votre décision de participer est entièrement volontaire et que, même si vous avez décidé de participer, vous pourrez décider d’arrêter à tout moment, sans aucune conséquence pour vous.' },
      { h: 'Qu’est-ce que cette étude et quel est son objectif ?' },
      { p: 'Cette étude cherche à comprendre comment l’ajout de contraintes physiques et biomécaniques dans la simulation de foules virtuelles influence la perception du réalisme et du naturel chez les personnes qui les observent.' },
      { p: 'L’objectif principal est d’améliorer la qualité et la crédibilité des personnages virtuels qui interagissent dans des espaces densément peuplés, en particulier dans les applications qui combinent simulation à grande échelle et contact physique, dans des domaines tels que les jeux vidéo, la réalité virtuelle, les effets visuels ou la simulation architecturale.' },
      { h: 'Qui réalise cette étude ?' },
      { p: 'L’étude sera réalisée par Gonzalo Gómez, en tant que chercheur principal et dans le cadre de sa thèse de doctorat, et par Marc Comino en tant que directeur de cette thèse.' },
      { contacts: ['Marc Comino  marc.comino@urjc.es', 'Gonzalo Gómez  gonzalo.gomez@urjc.es'] },
      { h: 'Combien de temps durera l’étude ?' },
      { sub: 'Participants en ligne' },
      { p: 'La collecte des données aura lieu au cours du second semestre 2026. Exceptionnellement, elle pourrait se poursuivre durant les premiers mois de 2027.' },
      { p: 'Les participants en ligne réaliseront uniquement la première phase de l’étude, qui consiste en l’évaluation perceptive de vidéos au moyen d’une plateforme web. Cette phase durera entre 25 et 30 minutes environ et sera réalisée en une seule session.' },
      { sub: 'Participants sur place' },
      { p: 'La collecte des données aura lieu au cours du second semestre 2026. Exceptionnellement, elle pourra se poursuivre durant les premiers mois de 2027.' },
      { p: 'Les participants sur place réaliseront une première phase d’évaluation perceptive de vidéos, d’une durée estimée entre 25 et 30 minutes. Ils pourront également réaliser une seconde phase, consistant en une épreuve de contrôle interactif, d’une durée estimée entre 5 et 10 minutes.' },
      { p: 'Les deux phases pourront être réalisées à la suite lors d’une seule session ou lors de deux sessions distinctes, afin de limiter la fatigue attentionnelle.' },
      { h: 'Comment l’étude se déroulera-t-elle ? En quoi consistera ma participation et quels en sont les risques ?' },
      { sub: 'Participants en ligne' },
      { p: 'Le participant accédera à distance à la plateforme web d’évaluation depuis un ordinateur. Avant de commencer, il devra lire la fiche d’information disponible sur la plateforme et cocher une case pour confirmer qu’il en a lu et compris le contenu.' },
      { p: 'La plateforme affichera ensuite les instructions, quatre vidéos d’exemple non évaluées et deux essais d’entraînement dont les réponses ne seront pas enregistrées. Le participant regardera ensuite successivement, devant un écran d’ordinateur standard, une série de vidéos de foules virtuelles. Après la lecture de chaque scénario, il lui sera demandé d’évaluer, au moyen de questionnaires structurés, des aspects tels que le réalisme des contacts physiques, la conscience spatiale des personnages et le naturel global du mouvement collectif.' },
      { sub: 'Participants sur place' },
      { p: 'Lors de la première phase, le participant accédera à la plateforme web d’évaluation depuis l’un des ordinateurs mis à disposition dans les bureaux du sous-sol de l’Aulario II de l’Universidad Rey Juan Carlos. Avant de commencer, il devra lire la fiche d’information disponible sur la plateforme et cocher une case pour confirmer qu’il en a lu et compris le contenu.' },
      { p: 'La plateforme affichera ensuite les instructions, quatre vidéos d’exemple non évaluées et deux essais d’entraînement dont les réponses ne seront pas enregistrées. Pendant cette session, le participant regardera successivement, devant un écran d’ordinateur standard, une série de vidéos de foules virtuelles. Après la lecture de chaque scénario, il lui sera demandé d’évaluer, au moyen de questionnaires structurés, des aspects tels que le réalisme des contacts physiques, la conscience spatiale des personnages et le naturel global du mouvement collectif.' },
      { p: 'Lors de la seconde phase, réservée aux participants sur place, le participant réalisera une exploration qualitative interactive dans les bureaux du sous-sol de l’Aulario II. Cette phase pourra avoir lieu juste après la première ou lors d’une session distincte, à l’heure convenue au préalable. Le participant prendra le contrôle en temps réel d’un avatar virtuel à l’aide des touches fléchées habituelles d’un clavier pour se déplacer physiquement à travers une foule simulée. À l’issue de cette interaction, il lui sera demandé de remplir un bref questionnaire et de répondre à quelques questions ouvertes afin d’évaluer son expérience de l’interaction virtuelle, en particulier la cohérence du transfert des forces, la réactivité du système face aux poussées et sa crédibilité générale.' },
      { sub: 'Risques (les deux modalités)' },
      { p: 'Cette étude ne comporte pas de risques significatifs. Les tâches se déroulent dans un environnement sûr, sans manipulation d’objets dangereux ni effort physique. L’utilisation prolongée d’un écran d’ordinateur pour observer des animations dynamiques peut provoquer une légère gêne visuelle ou une fatigue attentionnelle chez certaines personnes, en particulier sur de longues périodes. En cas d’inconfort ou de frustration pendant le contrôle interactif, le participant pourra interrompre sa participation à tout moment, sans aucune pénalité. De plus, afin de réduire la charge cognitive, le déroulement de l’expérience permet de courtes pauses entre les différents blocs d’évaluation.' },
      { h: 'Quelles informations seront recueillies dans le cadre de cette étude ?' },
      { p: 'Dans le cadre de cette étude, aucune donnée démographique ni aucune donnée personnelle permettant de vous identifier ne sera recueillie.' },
      { p: 'Seules des données issues de la participation à l’étude seront recueillies. Ces données sont recueillies pendant la réalisation des tâches et des questionnaires :' },
      { ul: [
        'Évaluations sur des échelles structurées concernant le réalisme des contacts physiques.',
        'Scores relatifs à la conscience spatiale perçue des personnages.',
        'Évaluation du naturel global du mouvement collectif.',
        'Réponses à une mesure standardisée de facilité d’utilisation après l’exploration interactive en temps réel.',
        'Réponses à des questions ouvertes visant à documenter la cohérence du transfert des forces, la réactivité du système face aux poussées et toute anomalie détectée pendant la navigation.',
        'Mesures de performance.'
      ] },
      { p: 'Toutes les données seront **anonymisées** : elles ne seront associées à aucun nom ni à aucune information permettant d’identifier une personne.' }
    ]
  },

  zh: {
    title: '参与者信息说明',
    project: 'EPC-SIMB3D：在三维环境中具有生物力学约束的新型二维人群模拟系统的感知与定量评估',
    pi: '首席研究员：GONZALO GÓMEZ NOGALES',
    blocks: [
      { p: '感谢您对本研究的关注。参与本研究前，您需要通过本文件充分了解相关信息，因此请您花必要的时间仔细阅读以下内容，并向上方列出联系方式的研究人员提出您认为必要的任何问题，以确保您真正充分知情。' },
      { p: '请您知悉，在任何情况下，您是否参与完全出于自愿；即使您已决定参与，也可以随时决定退出，且不会对您产生任何后果。' },
      { h: '本研究是什么？目的是什么？' },
      { p: '本研究旨在了解：在虚拟人群模拟中加入物理和生物力学约束，会如何影响观看者对其真实感和自然度的感知。' },
      { p: '主要目标是提高虚拟角色在人员密集空间中互动时的质量和可信度，尤其适用于结合大规模模拟与身体接触的应用领域，例如电子游戏、虚拟现实、视觉特效或建筑模拟。' },
      { h: '谁在开展本研究？' },
      { p: '本研究由 Gonzalo Gómez 作为首席研究员、在其博士论文框架内开展，并由其论文导师 Marc Comino 共同参与。' },
      { contacts: ['Marc Comino  marc.comino@urjc.es', 'Gonzalo Gómez  gonzalo.gomez@urjc.es'] },
      { h: '研究将持续多长时间？' },
      { sub: '线上参与者' },
      { p: '数据收集将在 2026 年下半年进行。特殊情况下，可能会在 2027 年最初几个月继续收集数据。' },
      { p: '线上参与者仅参加研究的第一阶段，即通过网络平台对视频进行感知评估。该阶段预计持续 25 至 30 分钟，并在一次会话中完成。' },
      { sub: '现场参与者' },
      { p: '数据收集将在 2026 年下半年进行。特殊情况下，可能会在 2027 年最初几个月继续收集数据。' },
      { p: '现场参与者将参加第一阶段的视频感知评估，预计持续 25 至 30 分钟。他们还可以参加第二阶段，即一项交互控制测试，预计持续 5 至 10 分钟。' },
      { p: '两个阶段可以在一次会话中连续完成，也可以分两次进行，以减轻可能的注意力疲劳。' },
      { h: '研究将如何进行？我的参与包括哪些内容？有哪些风险？' },
      { sub: '线上参与者' },
      { p: '参与者将通过电脑远程访问网络评估平台。开始之前，参与者需要阅读平台上提供的信息说明，并勾选一个方框，确认已阅读并理解其内容。' },
      { p: '随后，平台将显示使用说明、四个不评分的示例视频，以及两次不记录答案的练习。接着，参与者将坐在一台普通电脑显示器前，依次观看一系列虚拟人群视频。每个场景播放结束后，参与者需要通过结构化问卷评估身体接触的真实感、角色的空间意识以及集体运动的整体自然度等方面。' },
      { sub: '现场参与者' },
      { p: '在第一阶段，参与者将使用胡安·卡洛斯国王大学（Universidad Rey Juan Carlos）Aulario II 地下室办公室中提供的电脑访问网络评估平台。开始之前，参与者需要阅读平台上提供的信息说明，并勾选一个方框，确认已阅读并理解其内容。' },
      { p: '随后，平台将显示使用说明、四个不评分的示例视频，以及两次不记录答案的练习。在本次会话中，参与者将坐在一台普通电脑显示器前，依次观看一系列虚拟人群视频。每个场景播放结束后，参与者需要通过结构化问卷评估身体接触的真实感、角色的空间意识以及集体运动的整体自然度等方面。' },
      { p: '第二阶段仅面向现场参与者，参与者将在 Aulario II 地下室的办公室进行一项交互式定性探索。该阶段可以紧接第一阶段进行，也可以在事先约定的时间另行安排。参与者将使用键盘上常用的方向键实时控制一个虚拟化身，在模拟人群中穿行。交互结束后，参与者需要填写一份简短问卷，并回答几个开放性问题，以评估其虚拟交互体验，重点关注力传递的一致性、系统对推挤的响应以及整体可信度等方面。' },
      { sub: '风险（两种参与方式）' },
      { p: '本研究不涉及重大风险。任务在安全的环境中进行，不涉及危险物品的操作，也不需要体力消耗。长时间使用电脑显示器观看动态动画，可能会使部分人产生轻微的视觉不适或注意力疲劳。如在交互控制过程中感到不适或受挫，参与者可以随时中止参与，不会受到任何惩罚。此外，为尽量减轻认知负担，实验设计允许在各评估部分之间进行短暂休息。' },
      { h: '本研究将收集哪些信息？' },
      { p: '本研究不会收集任何人口统计数据或可识别个人身份的数据。' },
      { p: '本研究仅收集参与过程中产生的数据。这些数据在完成任务和问卷的过程中收集：' },
      { ul: [
        '通过结构化量表对身体接触真实感的评分。',
        '对角色感知到的空间意识的评分。',
        '对集体运动整体自然度的评估。',
        '实时交互探索后，对一项标准化易用性量表的回答。',
        '对开放性问题的回答，用于记录力传递的一致性、系统对推挤的响应以及在穿行过程中发现的任何异常。',
        '性能指标。'
      ] },
      { p: '所有数据都将进行**匿名化**处理：不会与姓名或任何可识别个人身份的信息相关联。' }
    ]
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function richHtml(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function infoSheetHtml(lang) {
  const doc = INFO_SHEET[lang];
  const parts = [
    `<img class="consent-logo" src="${LOGO_URL}" alt="Universidad Rey Juan Carlos">`,
    `<h3 class="consent-title">${escapeHtml(doc.title)}</h3>`,
    `<p class="consent-project"><strong>${escapeHtml(doc.project)}</strong></p>`,
    `<p class="consent-project"><strong>${escapeHtml(doc.pi)}</strong></p>`
  ];
  doc.blocks.forEach(block => {
    if (block.h) parts.push(`<h4>${escapeHtml(block.h)}</h4>`);
    else if (block.sub) parts.push(`<h5>• ${escapeHtml(block.sub)}</h5>`);
    else if (block.p) parts.push(`<p>${richHtml(block.p)}</p>`);
    else if (block.ul) parts.push(`<ul>${block.ul.map(item => `<li>${richHtml(item)}</li>`).join('')}</ul>`);
    else if (block.contacts) parts.push(`<p class="consent-contacts">${block.contacts.map(escapeHtml).join('<br>')}</p>`);
  });
  return parts.join('');
}
