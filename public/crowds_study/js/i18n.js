// UI text in every study language. {placeholders} are filled in by app.js.
// The statements (s1-s3) and scale labels must stay identical across trials; any
// change here changes the measurement, so get translations checked by native speakers.

export const LANGUAGE_NAMES = {
  en: '🇬🇧 English',
  fr: '🇫🇷 Français',
  es: '🇪🇸 Español',
  zh: '🇨🇳 中文'
};

export const TEXT = {
  en: {
    pageTitle: 'Crowd Motion Study',
    languageLabel: 'Language',
    startTitle: 'Welcome to the Crowd Motion Study',
    startSubtitle: 'You will watch short videos of animated crowds and rate each one. It takes about {minutes} minutes.',
    startHelp: 'We recommend a computer with the window in full screen. On a phone, hold it upright.',
    continueBtn: 'Continue',
    backBtn: 'Back',
    beginBtn: 'Start',
    creatingSession: 'Preparing your session...',
    loading: 'Loading video...',
    loadError: 'The video could not be loaded. Please check your connection; retrying...',
    saveError: 'Your answer could not be saved. Please check your connection and click Next again.',
    finishError: 'The study ended, but the completion could not be recorded automatically.',
    smallWindow: 'Your window is too small to show the videos properly. Please enlarge it or switch to full screen.',
    rotatePhone: 'Please turn your phone upright (portrait orientation) to continue.',
    leaveWarning: 'If you leave now, the study will stop and your progress will be lost.',

    instructionsHtml: `
      <h2>Instructions</h2>
      <p>In this study you will watch short videos of <strong>animated crowds</strong> in four different situations. After each video you will rate how much you agree with three statements about it.</p>
      <p class="notice">We strongly recommend using a <strong>desktop computer</strong> (not a phone or tablet) with the browser in <strong>full screen</strong> (F11 key).</p>

      <h3>1. Each trial</h3>
      <ul>
        <li>The counter in the <strong>top-left corner</strong> of the screen shows which video you are watching and the total number of videos (for example “{counterExample}”).</li>
        <li>A short description of the situation is shown above the video.</li>
        <li>The video plays automatically and <strong>repeats in a loop</strong>. It cannot be paused or skipped.</li>
        <li>The rating buttons unlock once you have watched the whole video at least once. You can keep watching it while you answer.</li>
        <li>Rate each video <strong>on its own</strong>: there are no right or wrong answers, we are interested in your impression.</li>
      </ul>

      <h3>2. The three statements</h3>
      <ol>
        <li>{s1}</li>
        <li>{s2}</li>
        <li>{s3}</li>
      </ol>
      <p>For each statement choose a value from <strong>1 (strongly disagree)</strong> to <strong>6 (strongly agree)</strong>. There is no middle value: lean to the side that best matches your impression. You must answer all three statements before you can click <strong>Next</strong>.</p>

      <h3>3. How the study is organised</h3>
      <ul>
        <li>First you will see a few <strong>examples</strong> and do <strong>{practice} practice trials</strong>. These are not recorded.</li>
        <li>Then the study runs in <strong>{parts} parts</strong>, one per situation, with <strong>{total} videos</strong> in total (about {minutes} minutes).</li>
        <li>Your answers are saved automatically after each video. Please do not reload or close the page until the end.</li>
      </ul>
      <p><strong>Thank you very much for your help!</strong></p>
    `,

    anchorTitle: 'Examples',
    anchorText: 'Here are four examples of the kind of motion you will see. Some look more natural than others. Just watch them; you do not need to rate them. You can continue once all four have played at least once.',
    anchorLabel: 'Example {letter}',

    practiceIntroTitle: 'Practice',
    practiceIntroText: 'You will now do {practice} practice trials to get used to the interface. These answers are not recorded.',
    practiceBadge: 'Practice {n} / {total}',

    mainIntroTitle: 'Practice finished',
    mainIntroText: 'The study now begins and your answers will be recorded. It has {parts} parts, one per situation.',

    blockTitle: 'Part {n} of {parts}: {scenario}',
    blockStartBtn: 'Begin this part',

    counter: 'Video {n} / {total}',
    watchPrompt: 'Watch the whole video to unlock the ratings.',
    ratePrompt: 'You can now rate the video. It keeps playing in a loop.',
    statementHeader: 'Statement',
    nextBtn: 'Next',

    endTitle: 'Study complete!',
    endText: 'Thank you for your participation. Your responses have been saved.',
    offlineNote: 'Offline mode: responses were not sent to a server.',
    downloadBtn: 'Download responses (JSON)',

    s1: 'The crowd moves like a real crowd (overall motion, trajectories, distribution of individuals, interpersonal distances, etc.).',
    s2: "The movement of individuals affects their neighbors' reactions.",
    s3: 'Such contacts between individuals could be observed in real situations.',
    scale: {
      1: 'Strongly disagree',
      2: 'Disagree',
      3: 'Somewhat disagree',
      4: 'Somewhat agree',
      5: 'Agree',
      6: 'Strongly agree'
    },
    scenarios: {
      BOT: { name: 'Bottleneck', description: 'A hundred people rush to evacuate through a narrow passage.' },
      BIF: { name: 'Bidirectional flow', description: 'Two opposing groups are rushing to reach the other end of a corridor.' },
      CTG: { name: 'Crossing through a group', description: 'A person is trying to make their way through a group. The camera follows this person.' },
      PUG: { name: 'Pushed group', description: 'A group is pushed from behind.' }
    }
  },

  fr: {
    pageTitle: 'Étude sur le mouvement des foules',
    languageLabel: 'Langue',
    startTitle: 'Bienvenue dans l’étude sur le mouvement des foules',
    startSubtitle: 'Vous allez regarder de courtes vidéos de foules animées et évaluer chacune d’elles. L’étude dure environ {minutes} minutes.',
    startHelp: 'Nous recommandons un ordinateur avec la fenêtre en plein écran. Sur un téléphone, tenez-le à la verticale.',
    continueBtn: 'Continuer',
    backBtn: 'Retour',
    beginBtn: 'Commencer',
    creatingSession: 'Préparation de votre session...',
    loading: 'Chargement de la vidéo...',
    loadError: 'La vidéo n’a pas pu être chargée. Vérifiez votre connexion ; nouvelle tentative...',
    saveError: 'Votre réponse n’a pas pu être enregistrée. Vérifiez votre connexion et cliquez à nouveau sur Suivant.',
    finishError: 'L’étude est terminée, mais la fin n’a pas pu être enregistrée automatiquement.',
    smallWindow: 'Votre fenêtre est trop petite pour afficher correctement les vidéos. Agrandissez-la ou passez en plein écran.',
    rotatePhone: 'Veuillez tenir votre téléphone à la verticale (mode portrait) pour continuer.',
    leaveWarning: 'Si vous quittez maintenant, l’étude s’arrêtera et votre progression sera perdue.',

    instructionsHtml: `
      <h2>Instructions</h2>
      <p>Dans cette étude, vous allez regarder de courtes vidéos de <strong>foules animées</strong> dans quatre situations différentes. Après chaque vidéo, vous indiquerez dans quelle mesure vous êtes d’accord avec trois affirmations à son sujet.</p>
      <p class="notice">Nous vous recommandons vivement d’utiliser un <strong>ordinateur de bureau</strong> (pas un téléphone ni une tablette), avec le navigateur en <strong>plein écran</strong> (touche F11).</p>

      <h3>1. Chaque essai</h3>
      <ul>
        <li>Le compteur en <strong>haut à gauche</strong> de l’écran indique la vidéo que vous regardez et le nombre total de vidéos (par exemple « {counterExample} »).</li>
        <li>Une courte description de la situation est affichée au-dessus de la vidéo.</li>
        <li>La vidéo démarre automatiquement et <strong>se répète en boucle</strong>. Elle ne peut être ni mise en pause ni passée.</li>
        <li>Les boutons de réponse se débloquent une fois que vous avez regardé la vidéo en entier au moins une fois. Vous pouvez continuer à la regarder pendant que vous répondez.</li>
        <li>Évaluez chaque vidéo <strong>indépendamment</strong> : il n’y a pas de bonne ou de mauvaise réponse, c’est votre impression qui nous intéresse.</li>
      </ul>

      <h3>2. Les trois affirmations</h3>
      <ol>
        <li>{s1}</li>
        <li>{s2}</li>
        <li>{s3}</li>
      </ol>
      <p>Pour chaque affirmation, choisissez une valeur de <strong>1 (pas du tout d’accord)</strong> à <strong>6 (tout à fait d’accord)</strong>. Il n’y a pas de valeur centrale : penchez du côté qui correspond le mieux à votre impression. Vous devez répondre aux trois affirmations avant de pouvoir cliquer sur <strong>Suivant</strong>.</p>

      <h3>3. Déroulement de l’étude</h3>
      <ul>
        <li>Vous verrez d’abord quelques <strong>exemples</strong>, puis vous ferez <strong>{practice} essais d’entraînement</strong>. Ils ne sont pas enregistrés.</li>
        <li>L’étude comporte ensuite <strong>{parts} parties</strong>, une par situation, avec <strong>{total} vidéos</strong> au total (environ {minutes} minutes).</li>
        <li>Vos réponses sont enregistrées automatiquement après chaque vidéo. Ne rechargez pas et ne fermez pas la page avant la fin.</li>
      </ul>
      <p><strong>Merci beaucoup pour votre aide !</strong></p>
    `,

    anchorTitle: 'Exemples',
    anchorText: 'Voici quatre exemples du type de mouvement que vous allez voir. Certains paraissent plus naturels que d’autres. Regardez-les simplement ; vous n’avez pas à les évaluer. Vous pourrez continuer une fois que les quatre auront été lus au moins une fois.',
    anchorLabel: 'Exemple {letter}',

    practiceIntroTitle: 'Entraînement',
    practiceIntroText: 'Vous allez maintenant faire {practice} essais d’entraînement pour vous familiariser avec l’interface. Ces réponses ne sont pas enregistrées.',
    practiceBadge: 'Entraînement {n} / {total}',

    mainIntroTitle: 'Entraînement terminé',
    mainIntroText: 'L’étude commence maintenant et vos réponses seront enregistrées. Elle comporte {parts} parties, une par situation.',

    blockTitle: 'Partie {n} sur {parts} : {scenario}',
    blockStartBtn: 'Commencer cette partie',

    counter: 'Vidéo {n} / {total}',
    watchPrompt: 'Regardez la vidéo en entier pour débloquer les réponses.',
    ratePrompt: 'Vous pouvez maintenant évaluer la vidéo. Elle continue en boucle.',
    statementHeader: 'Affirmation',
    nextBtn: 'Suivant',

    endTitle: 'Étude terminée !',
    endText: 'Merci pour votre participation. Vos réponses ont été enregistrées.',
    offlineNote: 'Mode hors ligne : les réponses n’ont pas été envoyées à un serveur.',
    downloadBtn: 'Télécharger les réponses (JSON)',

    s1: 'La foule se déplace comme une vraie foule (mouvement général, trajectoires, répartition des individus, distances interpersonnelles, etc.).',
    s2: 'Le mouvement des individus influence les réactions de leurs voisins.',
    s3: 'De tels contacts entre individus pourraient être observés dans des situations réelles.',
    scale: {
      1: 'Pas du tout d’accord',
      2: 'Pas d’accord',
      3: 'Plutôt pas d’accord',
      4: 'Plutôt d’accord',
      5: 'D’accord',
      6: 'Tout à fait d’accord'
    },
    scenarios: {
      BOT: { name: 'Goulot d’étranglement', description: 'Une centaine de personnes se précipitent pour évacuer par un passage étroit.' },
      BIF: { name: 'Flux bidirectionnel', description: 'Deux groupes venant en sens opposés se pressent pour atteindre l’autre bout d’un couloir.' },
      CTG: { name: 'Traverser un groupe', description: 'Une personne essaie de se frayer un chemin à travers un groupe. La caméra suit cette personne.' },
      PUG: { name: 'Groupe poussé', description: 'Un groupe est poussé par l’arrière.' }
    }
  },

  es: {
    pageTitle: 'Estudio sobre el movimiento de multitudes',
    languageLabel: 'Idioma',
    startTitle: 'Bienvenido al estudio sobre el movimiento de multitudes',
    startSubtitle: 'Verás vídeos cortos de multitudes animadas y valorarás cada uno. El estudio dura unos {minutes} minutos.',
    startHelp: 'Recomendamos usar un ordenador con la ventana en pantalla completa. En un móvil, sostenlo en vertical.',
    continueBtn: 'Continuar',
    backBtn: 'Volver',
    beginBtn: 'Comenzar',
    creatingSession: 'Preparando tu sesión...',
    loading: 'Cargando vídeo...',
    loadError: 'No se pudo cargar el vídeo. Comprueba tu conexión; reintentando...',
    saveError: 'No se pudo guardar tu respuesta. Comprueba tu conexión y pulsa Siguiente de nuevo.',
    finishError: 'El estudio terminó, pero no se pudo registrar automáticamente la finalización.',
    smallWindow: 'Tu ventana es demasiado pequeña para mostrar bien los vídeos. Por favor, amplíala o usa pantalla completa.',
    rotatePhone: 'Por favor, gira tu móvil en vertical para continuar.',
    leaveWarning: 'Si sales ahora, el estudio se detendrá y perderás tu progreso.',

    instructionsHtml: `
      <h2>Instrucciones</h2>
      <p>En este estudio verás vídeos cortos de <strong>multitudes animadas</strong> en cuatro situaciones diferentes. Después de cada vídeo indicarás tu grado de acuerdo con tres afirmaciones sobre él.</p>
      <p class="notice">Recomendamos encarecidamente usar un <strong>ordenador de sobremesa</strong> (no un móvil ni una tableta), con el navegador en <strong>pantalla completa</strong> (tecla F11).</p>

      <h3>1. Cada ensayo</h3>
      <ul>
        <li>El contador de la <strong>esquina superior izquierda</strong> de la pantalla indica qué vídeo estás viendo y el número total de vídeos (por ejemplo, «{counterExample}»).</li>
        <li>Encima del vídeo se muestra una breve descripción de la situación.</li>
        <li>El vídeo se reproduce automáticamente y <strong>se repite en bucle</strong>. No se puede pausar ni saltar.</li>
        <li>Los botones de valoración se desbloquean cuando hayas visto el vídeo completo al menos una vez. Puedes seguir viéndolo mientras respondes.</li>
        <li>Valora cada vídeo <strong>por sí mismo</strong>: no hay respuestas correctas ni incorrectas, nos interesa tu impresión.</li>
      </ul>

      <h3>2. Las tres afirmaciones</h3>
      <ol>
        <li>{s1}</li>
        <li>{s2}</li>
        <li>{s3}</li>
      </ol>
      <p>Para cada afirmación elige un valor de <strong>1 (totalmente en desacuerdo)</strong> a <strong>6 (totalmente de acuerdo)</strong>. No hay valor intermedio: inclínate hacia el lado que mejor refleje tu impresión. Debes responder las tres afirmaciones antes de poder pulsar <strong>Siguiente</strong>.</p>

      <h3>3. Organización del estudio</h3>
      <ul>
        <li>Primero verás algunos <strong>ejemplos</strong> y harás <strong>{practice} ensayos de práctica</strong>. No se registran.</li>
        <li>Después el estudio tiene <strong>{parts} partes</strong>, una por situación, con <strong>{total} vídeos</strong> en total (unos {minutes} minutos).</li>
        <li>Tus respuestas se guardan automáticamente después de cada vídeo. Por favor, no recargues ni cierres la página hasta el final.</li>
      </ul>
      <p><strong>¡Muchas gracias por tu ayuda!</strong></p>
    `,

    anchorTitle: 'Ejemplos',
    anchorText: 'Aquí tienes cuatro ejemplos del tipo de movimiento que vas a ver. Algunos parecen más naturales que otros. Simplemente obsérvalos; no tienes que valorarlos. Podrás continuar cuando los cuatro se hayan reproducido al menos una vez.',
    anchorLabel: 'Ejemplo {letter}',

    practiceIntroTitle: 'Práctica',
    practiceIntroText: 'Ahora harás {practice} ensayos de práctica para familiarizarte con la interfaz. Estas respuestas no se registran.',
    practiceBadge: 'Práctica {n} / {total}',

    mainIntroTitle: 'Práctica terminada',
    mainIntroText: 'Ahora comienza el estudio y tus respuestas se registrarán. Tiene {parts} partes, una por situación.',

    blockTitle: 'Parte {n} de {parts}: {scenario}',
    blockStartBtn: 'Empezar esta parte',

    counter: 'Vídeo {n} / {total}',
    watchPrompt: 'Mira el vídeo completo para desbloquear las valoraciones.',
    ratePrompt: 'Ya puedes valorar el vídeo. Sigue reproduciéndose en bucle.',
    statementHeader: 'Afirmación',
    nextBtn: 'Siguiente',

    endTitle: '¡Estudio completado!',
    endText: 'Gracias por tu participación. Tus respuestas se han guardado.',
    offlineNote: 'Modo sin conexión: las respuestas no se enviaron a ningún servidor.',
    downloadBtn: 'Descargar respuestas (JSON)',

    s1: 'La multitud se mueve como una multitud real (movimiento general, trayectorias, distribución de los individuos, distancias interpersonales, etc.).',
    s2: 'El movimiento de los individuos afecta a las reacciones de sus vecinos.',
    s3: 'Este tipo de contactos entre individuos podría observarse en situaciones reales.',
    scale: {
      1: 'Totalmente en desacuerdo',
      2: 'En desacuerdo',
      3: 'Algo en desacuerdo',
      4: 'Algo de acuerdo',
      5: 'De acuerdo',
      6: 'Totalmente de acuerdo'
    },
    scenarios: {
      BOT: { name: 'Cuello de botella', description: 'Un centenar de personas se apresuran a evacuar por un paso estrecho.' },
      BIF: { name: 'Flujo bidireccional', description: 'Dos grupos en sentidos opuestos se apresuran para llegar al otro extremo de un pasillo.' },
      CTG: { name: 'Cruzar un grupo', description: 'Una persona intenta abrirse paso a través de un grupo. La cámara sigue a esta persona.' },
      PUG: { name: 'Grupo empujado', description: 'Un grupo es empujado desde atrás.' }
    }
  },

  zh: {
    pageTitle: '人群运动研究',
    languageLabel: '语言',
    startTitle: '欢迎参加人群运动研究',
    startSubtitle: '你将观看一些动画人群的短视频，并对每个视频进行评分。整个研究大约需要 {minutes} 分钟。',
    startHelp: '建议使用电脑并将窗口全屏显示。如使用手机，请竖屏持握。',
    continueBtn: '继续',
    backBtn: '返回',
    beginBtn: '开始',
    creatingSession: '正在准备你的会话...',
    loading: '正在加载视频...',
    loadError: '视频加载失败。请检查网络连接，正在重试...',
    saveError: '你的回答未能保存。请检查网络连接后再次点击“下一个”。',
    finishError: '研究已结束，但未能自动记录完成状态。',
    smallWindow: '窗口太小，无法正常显示视频。请放大窗口或切换到全屏。',
    rotatePhone: '请将手机竖屏（纵向）持握以继续。',
    leaveWarning: '如果现在离开，研究将中止，你的进度将会丢失。',

    instructionsHtml: `
      <h2>说明</h2>
      <p>在本研究中，你将观看四种不同情境下<strong>动画人群</strong>的短视频。每看完一个视频，你需要对关于该视频的三条陈述表明你的同意程度。</p>
      <p class="notice">我们强烈建议使用<strong>台式电脑</strong>（而不是手机或平板）完成本研究，并将浏览器设为<strong>全屏</strong>（按 F11 键）。</p>

      <h3>1. 每一轮</h3>
      <ul>
        <li>屏幕<strong>左上角</strong>的计数器会显示你正在观看的是第几个视频以及视频总数（例如“{counterExample}”）。</li>
        <li>视频上方会显示对该情境的简短描述。</li>
        <li>视频会自动播放并<strong>循环重复</strong>，无法暂停或跳过。</li>
        <li>至少完整观看一遍视频后，评分按钮才会解锁。回答时你可以继续观看。</li>
        <li>请<strong>单独</strong>评价每个视频：答案没有对错之分，我们关心的是你的直观感受。</li>
      </ul>

      <h3>2. 三条陈述</h3>
      <ol>
        <li>{s1}</li>
        <li>{s2}</li>
        <li>{s3}</li>
      </ol>
      <p>对每条陈述，请从 <strong>1（非常不同意）</strong>到 <strong>6（非常同意）</strong>中选择一个数值。量表没有中间值：请选择更符合你感受的一侧。三条陈述全部回答后才能点击<strong>“下一个”</strong>。</p>

      <h3>3. 研究流程</h3>
      <ul>
        <li>首先你会看到几个<strong>示例</strong>，并进行 <strong>{practice} 次练习</strong>。这些不会被记录。</li>
        <li>之后研究分为 <strong>{parts} 个部分</strong>，每个部分对应一种情境，共 <strong>{total} 个视频</strong>（大约 {minutes} 分钟）。</li>
        <li>每个视频的回答都会自动保存。在结束之前请不要刷新或关闭页面。</li>
      </ul>
      <p><strong>非常感谢你的帮助！</strong></p>
    `,

    anchorTitle: '示例',
    anchorText: '下面是你将看到的几种运动的四个示例，其中一些看起来比另一些更自然。只需观看，无需评分。四个视频都至少播放一遍后即可继续。',
    anchorLabel: '示例 {letter}',

    practiceIntroTitle: '练习',
    practiceIntroText: '接下来你将进行 {practice} 次练习，以熟悉界面。这些回答不会被记录。',
    practiceBadge: '练习 {n} / {total}',

    mainIntroTitle: '练习结束',
    mainIntroText: '正式研究现在开始，你的回答将被记录。研究共有 {parts} 个部分，每个部分对应一种情境。',

    blockTitle: '第 {n} 部分（共 {parts} 部分）：{scenario}',
    blockStartBtn: '开始这一部分',

    counter: '视频 {n} / {total}',
    watchPrompt: '请完整观看视频以解锁评分。',
    ratePrompt: '现在可以为视频评分了。视频会继续循环播放。',
    statementHeader: '陈述',
    nextBtn: '下一个',

    endTitle: '研究完成！',
    endText: '感谢你的参与。你的回答已保存。',
    offlineNote: '离线模式：回答未发送到服务器。',
    downloadBtn: '下载回答（JSON）',

    s1: '人群的移动方式像真实的人群（整体运动、行进轨迹、个体分布、人际距离等）。',
    s2: '个体的移动会影响其周围人的反应。',
    s3: '个体之间的这种接触在真实情境中也可能出现。',
    scale: {
      1: '非常不同意',
      2: '不同意',
      3: '有点不同意',
      4: '有点同意',
      5: '同意',
      6: '非常同意'
    },
    scenarios: {
      BOT: { name: '瓶颈通道', description: '约一百人争先恐后地通过一条狭窄通道撤离。' },
      BIF: { name: '双向人流', description: '两组相向而行的人群正匆忙赶往走廊的另一端。' },
      CTG: { name: '穿过人群', description: '一个人正试图从一群人中穿过。镜头会跟随这个人。' },
      PUG: { name: '被推挤的人群', description: '一群人从后方被推挤。' }
    }
  }
};

export function fill(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
}
