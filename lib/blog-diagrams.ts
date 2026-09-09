type BlogDiagramDefinition = {
  title: string
  caption: string
  svg: string
}

const BLOG_DIAGRAMS: Record<string, BlogDiagramDefinition> = {
  "sweater-basic": {
    title: "Базова схема светра",
    caption: "Схема базового светра: корпус, рукави, горловина, ширина та довжина виробу.",
    svg: `<svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-sweater-basic-title" xmlns="http://www.w3.org/2000/svg">
  <title id="diagram-sweater-basic-title">Базова схема светра</title>
  <rect x="225" y="92" width="190" height="245" rx="20" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5"/>
  <path d="M225 126 L126 190 L158 262 L225 206Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M415 126 L514 190 L482 262 L415 206Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M282 92 Q320 126 358 92" fill="none" stroke="#d97060" stroke-width="5" stroke-linecap="round"/>
  <line x1="225" y1="360" x2="415" y2="360" stroke="#2f3430" stroke-width="2"/>
  <path d="M225 352 L225 368 M415 352 L415 368" stroke="#2f3430" stroke-width="2"/>
  <text x="320" y="392" text-anchor="middle" font-size="22" fill="#2f3430">ширина виробу</text>
  <line x1="445" y1="92" x2="445" y2="337" stroke="#2f3430" stroke-width="2"/>
  <path d="M437 92 L453 92 M437 337 L453 337" stroke="#2f3430" stroke-width="2"/>
  <text x="474" y="222" font-size="22" fill="#2f3430">довжина</text>
</svg>`,
  },
  "raglan-lines": {
    title: "Схема регланних ліній",
    caption: "Схема реглану зверху: горловина, перед, спинка, рукави та 4 регланні лінії для прибавок.",
    svg: `<svg viewBox="0 0 680 420" role="img" aria-labelledby="diagram-raglan-lines-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-raglan-lines-title">Схема реглану зверху: розподіл деталей та 4 регланні лінії</title>
  <!-- Тіло виробу -->
  <circle cx="340" cy="200" r="155" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <!-- Горловина -->
  <circle cx="340" cy="200" r="46" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1"/>

  <!-- 4 регланні лінії (від горловини до краю, по діагоналях) -->
  <line x1="372.5" y1="167.5" x2="449.6" y2="90.4" stroke="#D85A30" stroke-width="2"/>
  <line x1="307.5" y1="167.5" x2="230.4" y2="90.4" stroke="#D85A30" stroke-width="2"/>
  <line x1="307.5" y1="232.5" x2="230.4" y2="309.6" stroke="#D85A30" stroke-width="2"/>
  <line x1="372.5" y1="232.5" x2="449.6" y2="309.6" stroke="#D85A30" stroke-width="2"/>

  <!-- Підписи деталей -->
  <g fill="#2F3430" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">
    <text x="340" y="200">горловина</text>
    <text x="340" y="95">спинка</text>
    <text x="340" y="305">перед</text>
    <text x="245" y="200">рукав</text>
    <text x="435" y="200">рукав</text>
  </g>

  <!-- Прибавки: по одній з кожного боку кожної лінії -->
  <g fill="#993C1D" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central">
    <text x="425" y="118">+</text><text x="400" y="143">+</text>
    <text x="255" y="118">+</text><text x="280" y="143">+</text>
    <text x="255" y="282">+</text><text x="280" y="257">+</text>
    <text x="425" y="282">+</text><text x="400" y="257">+</text>
  </g>

  <!-- Легенда -->
  <line x1="60" y1="390" x2="90" y2="390" stroke="#D85A30" stroke-width="2"/>
  <text x="98" y="390" dominant-baseline="central" font-size="13" fill="#5F5E5A">регланна лінія (4 шт.)</text>
  <text x="330" y="390" dominant-baseline="central" font-size="13" fill="#993C1D" font-weight="700">+</text>
  <text x="342" y="390" dominant-baseline="central" font-size="13" fill="#5F5E5A">прибавка з обох боків лінії, 8 п. за ряд</text>
</svg>`,
  },
  "raglan-unwrapped": {
    title: "Розгортка реглану зверху по ряду",
    caption: "Схема розподілу петель горловини по круговому ряду: спинка, рукави, перед та регланні лінії з прибавками.",
    svg: `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-raglan-unwrapped-title diagram-raglan-unwrapped-desc">
  <title id="diagram-raglan-unwrapped-title">Розгортка реглану зверху по ряду (76 п.)</title>
  <desc id="diagram-raglan-unwrapped-desc">Круговий ряд на 76 петель: ½ спинки (11 п.), РЛ 1 (2 п.), рукав (11 п.), РЛ 2 (2 п.), перед (23 п.), РЛ 3 (2 п.), рукав (11 п.), РЛ 4 (2 п.), ½ спинки (12 п.). Прибавки з обох боків кожної лінії.</desc>
  <defs>
    <marker id="rgl-unwrapped-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="30" text-anchor="middle" font-size="12" fill="#5F5E5A">Напрямок в'язання ряду</text>
  <line x1="36" y1="48" x2="644" y2="48" stroke="#5F5E5A" stroke-width="1" marker-end="url(#rgl-unwrapped-arrow)"/>
  <rect x="36" y="90" width="88" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="80" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">½ спинки</text>
  <text x="80" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">11 п.</text>
  <rect x="124" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="132" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 1</text>
  <text x="117" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="147" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="140" y="90" width="88" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="184" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">рукав</text>
  <text x="184" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">11 п.</text>
  <rect x="228" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="236" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 2</text>
  <text x="221" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="251" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="244" y="90" width="184" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="336" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">перед</text>
  <text x="336" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">23 п.</text>
  <rect x="428" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="436" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 3</text>
  <text x="421" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="451" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="444" y="90" width="88" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="488" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">рукав</text>
  <text x="488" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">11 п.</text>
  <rect x="532" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="540" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 4</text>
  <text x="525" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="555" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="548" y="90" width="96" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="596" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">½ спинки</text>
  <text x="596" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">12 п.</text>
  <circle cx="36" cy="90" r="5" fill="#0F6E56"/>
  <line x1="36" y1="95" x2="36" y2="232" stroke="#0F6E56" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="44" y="240" font-size="12" fill="#0F6E56">Початок кругового ряду (маркер)</text>
  <rect x="36" y="268" width="16" height="12" fill="#D85A30"/>
  <text x="60" y="278" font-size="12" fill="#5F5E5A">РЛ — регланна лінія (по 2 п.)</text>
  <text x="36" y="302" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="50" y="302" font-size="12" fill="#5F5E5A">прибавка з обох боків лінії (8 п. за ряд) · разом 76 п.</text>
</svg>`,
  },
  "round-yoke": {
    title: "Схема круглої кокетки",
    caption: "Схема круглої кокетки: горловина, ряди прибавок, висота кокетки, корпус і рукави після розподілу, підрізи.",
    svg: `<svg width="100%" viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-round-yoke-title diagram-round-yoke-desc">
  <title id="diagram-round-yoke-title">Схема круглої кокетки</title>
  <desc id="diagram-round-yoke-desc">Горловина зверху, від неї кокетка розширюється дугами з рядами прибавок до нижнього краю; після розподілу корпус посередині та два рукави з боків звисають донизу, між ними підрізи.</desc>

  <!-- Кокетка: кільце між горловиною (r=50) і нижнім краєм (r=170), центр (340,60) -->
  <path d="M170 60 A170 170 0 0 0 510 60 L390 60 A50 50 0 0 1 290 60 Z"
        fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2"/>

  <!-- Горловина -->
  <path d="M290 60 A50 20 0 0 1 390 60" fill="none" stroke="#0F6E56" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M290 60 A50 50 0 0 0 390 60" fill="none" stroke="#0F6E56" stroke-width="1.6"/>
  <text x="340" y="38" text-anchor="middle" font-size="12" fill="#0F6E56">горловина</text>

  <!-- Ряди прибавок (концентричні дуги) -->
  <g fill="none" stroke="#D85A30" stroke-width="1.6" stroke-dasharray="6 4">
    <path d="M255 60 A85 85 0 0 0 425 60"/>
    <path d="M220 60 A120 120 0 0 0 460 60"/>
    <path d="M185 60 A155 155 0 0 0 495 60"/>
  </g>
  <text x="340" y="127" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">кокетка</text>
  <text x="340" y="164" text-anchor="middle" font-size="11" fill="#993C1D">ряди прибавок</text>

  <!-- Корпус -->
  <path d="M250 204 A170 170 0 0 0 430 204 L436 380 L244 380 Z"
        fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="340" y="300" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">корпус</text>

  <!-- Рукави -->
  <path d="M180 117 A170 170 0 0 0 235 194 L205 340 L130 320 Z"
        fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="185" y="265" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">рукав</text>
  <path d="M500 117 A170 170 0 0 1 445 194 L475 340 L550 320 Z"
        fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="495" y="265" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">рукав</text>

  <!-- Підрізи (пахва) -->
  <g stroke="#0F6E56" stroke-width="2" stroke-linecap="round">
    <line x1="235" y1="200" x2="250" y2="207"/>
    <line x1="445" y1="200" x2="430" y2="207"/>
  </g>
  <line x1="242" y1="204" x2="242" y2="395" stroke="#0F6E56" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="438" y1="204" x2="438" y2="395" stroke="#0F6E56" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="340" y="412" text-anchor="middle" font-size="12" fill="#0F6E56">підрізи — петлі під пахвою між корпусом і рукавом</text>

  <!-- Висота кокетки: від горловини до нижнього краю -->
  <line x1="580" y1="60" x2="580" y2="230" stroke="#5F5E5A" stroke-width="1"/>
  <line x1="573" y1="60" x2="587" y2="60" stroke="#5F5E5A" stroke-width="1"/>
  <line x1="573" y1="230" x2="587" y2="230" stroke="#5F5E5A" stroke-width="1"/>
  <line x1="510" y1="60" x2="573" y2="60" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="510" y1="230" x2="573" y2="230" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <text x="592" y="140" font-size="12" fill="#5F5E5A">висота</text>
  <text x="592" y="156" font-size="12" fill="#5F5E5A">кокетки</text>
</svg>`,
  },
    "sleeve": {
    title: "Схема формування рукава",
    caption: "Схема рукава: верхня ширина, манжета, довжина та точки убавок або прибавок по бокових лініях.",
    svg: `<svg width="680" height="450" viewBox="0 0 680 450" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="t d">
  <title id="t">Схема рукава</title>
  <desc id="d">Рукав у вигляді трапеції: широкий верх, вузька манжета знизу. По бокових лініях відмічено точки прибавок (при в'язанні знизу вгору) або убавок (зверху вниз). Показано верхню ширину, ширину й висоту манжети та довжину рукава.</desc>
  <defs>
    <marker id="slv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- Рукав -->
  <path d="M190 70 L490 70 L400 350 L280 350 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2" stroke-linejoin="round"/>
  <text x="340" y="215" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">рукав</text>

  <!-- Манжета -->
  <rect x="280" y="350" width="120" height="40" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.2"/>
  <g stroke="#0F6E56" stroke-width="0.8" opacity="0.6">
    <line x1="292" y1="352" x2="292" y2="388"/><line x1="304" y1="352" x2="304" y2="388"/><line x1="316" y1="352" x2="316" y2="388"/>
    <line x1="364" y1="352" x2="364" y2="388"/><line x1="376" y1="352" x2="376" y2="388"/><line x1="388" y1="352" x2="388" y2="388"/>
  </g>
  <text x="340" y="374" text-anchor="middle" font-size="12" fill="#0F6E56">манжета</text>

  <!-- Бокові лінії з точками прибавок / убавок -->
  <g stroke="#D85A30" stroke-width="2.4">
    <line x1="190" y1="70" x2="280" y2="350"/>
    <line x1="490" y1="70" x2="400" y2="350"/>
  </g>
  <g fill="#D85A30">
    <circle cx="203" cy="110" r="4"/><circle cx="216" cy="150" r="4"/><circle cx="229" cy="190" r="4"/>
    <circle cx="241" cy="230" r="4"/><circle cx="254" cy="270" r="4"/><circle cx="267" cy="310" r="4"/>
    <circle cx="477" cy="110" r="4"/><circle cx="464" cy="150" r="4"/><circle cx="451" cy="190" r="4"/>
    <circle cx="439" cy="230" r="4"/><circle cx="426" cy="270" r="4"/><circle cx="413" cy="310" r="4"/>
  </g>
  <text x="140" y="200" text-anchor="middle" font-size="12" fill="#993C1D">точки</text>
  <text x="140" y="216" text-anchor="middle" font-size="12" fill="#993C1D">прибавок</text>
  <text x="140" y="232" text-anchor="middle" font-size="11" fill="#993C1D">(або убавок)</text>
  <text x="540" y="200" text-anchor="middle" font-size="12" fill="#993C1D">точки</text>
  <text x="540" y="216" text-anchor="middle" font-size="12" fill="#993C1D">прибавок</text>
  <text x="540" y="232" text-anchor="middle" font-size="11" fill="#993C1D">(або убавок)</text>

  <!-- Напрямок в'язання -->
  <line x1="340" y1="330" x2="340" y2="240" stroke="#5F5E5A" stroke-width="1" marker-end="url(#slv-arrow)"/>
  <text x="340" y="262" text-anchor="middle" font-size="11" fill="#5F5E5A">знизу вгору</text>
  <text x="340" y="276" text-anchor="middle" font-size="11" fill="#5F5E5A">→ прибавки</text>

  <!-- Верхня ширина -->
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="190" y1="48" x2="490" y2="48"/><line x1="190" y1="43" x2="190" y2="53"/><line x1="490" y1="43" x2="490" y2="53"/>
  </g>
  <text x="340" y="36" text-anchor="middle" font-size="12" fill="#5F5E5A">верхня ширина рукава</text>

  <!-- Ширина манжети -->
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="280" y1="412" x2="400" y2="412"/><line x1="280" y1="407" x2="280" y2="417"/><line x1="400" y1="407" x2="400" y2="417"/>
  </g>
  <text x="340" y="430" text-anchor="middle" font-size="12" fill="#5F5E5A">ширина манжети</text>

  <!-- Висота манжети -->
  <g stroke="#0F6E56" stroke-width="1">
    <line x1="420" y1="350" x2="420" y2="390"/><line x1="415" y1="350" x2="425" y2="350"/><line x1="415" y1="390" x2="425" y2="390"/>
  </g>
  <text x="428" y="374" font-size="11" fill="#0F6E56">висота манжети</text>

  <!-- Довжина рукава -->
  <line x1="490" y1="70" x2="600" y2="70" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="400" y1="390" x2="600" y2="390" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="600" y1="70" x2="600" y2="390"/><line x1="595" y1="70" x2="605" y2="70"/><line x1="595" y1="390" x2="605" y2="390"/>
  </g>
  <text x="608" y="226" font-size="12" fill="#5F5E5A">довжина</text>
  <text x="608" y="242" font-size="12" fill="#5F5E5A">рукава</text>

  <!-- Легенда -->
  <circle cx="60" cy="440" r="4" fill="#D85A30"/>
  <text x="70" y="444" font-size="11" fill="#5F5E5A">прибавка/убавка по 1 п. з кожного боку; знизу вгору — прибавки, зверху вниз — убавки</text>
</svg>`,
  },
  "sleeve-shaping": {
    title: "Схема формування рукава",
    caption: "Схема рукава: верхня ширина, манжета, довжина та точки убавок або прибавок по бокових лініях.",
    svg: `<svg width="680" height="450" viewBox="0 0 680 450" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="t d">
  <title id="t">Схема рукава</title>
  <desc id="d">Рукав у вигляді трапеції: широкий верх, вузька манжета знизу. По бокових лініях відмічено точки прибавок (при в'язанні знизу вгору) або убавок (зверху вниз). Показано верхню ширину, ширину й висоту манжети та довжину рукава.</desc>
  <defs>
    <marker id="slv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- Рукав -->
  <path d="M190 70 L490 70 L400 350 L280 350 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2" stroke-linejoin="round"/>
  <text x="340" y="215" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">рукав</text>

  <!-- Манжета -->
  <rect x="280" y="350" width="120" height="40" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.2"/>
  <g stroke="#0F6E56" stroke-width="0.8" opacity="0.6">
    <line x1="292" y1="352" x2="292" y2="388"/><line x1="304" y1="352" x2="304" y2="388"/><line x1="316" y1="352" x2="316" y2="388"/>
    <line x1="364" y1="352" x2="364" y2="388"/><line x1="376" y1="352" x2="376" y2="388"/><line x1="388" y1="352" x2="388" y2="388"/>
  </g>
  <text x="340" y="374" text-anchor="middle" font-size="12" fill="#0F6E56">манжета</text>

  <!-- Бокові лінії з точками прибавок / убавок -->
  <g stroke="#D85A30" stroke-width="2.4">
    <line x1="190" y1="70" x2="280" y2="350"/>
    <line x1="490" y1="70" x2="400" y2="350"/>
  </g>
  <g fill="#D85A30">
    <circle cx="203" cy="110" r="4"/><circle cx="216" cy="150" r="4"/><circle cx="229" cy="190" r="4"/>
    <circle cx="241" cy="230" r="4"/><circle cx="254" cy="270" r="4"/><circle cx="267" cy="310" r="4"/>
    <circle cx="477" cy="110" r="4"/><circle cx="464" cy="150" r="4"/><circle cx="451" cy="190" r="4"/>
    <circle cx="439" cy="230" r="4"/><circle cx="426" cy="270" r="4"/><circle cx="413" cy="310" r="4"/>
  </g>
  <text x="140" y="200" text-anchor="middle" font-size="12" fill="#993C1D">точки</text>
  <text x="140" y="216" text-anchor="middle" font-size="12" fill="#993C1D">прибавок</text>
  <text x="140" y="232" text-anchor="middle" font-size="11" fill="#993C1D">(або убавок)</text>
  <text x="540" y="200" text-anchor="middle" font-size="12" fill="#993C1D">точки</text>
  <text x="540" y="216" text-anchor="middle" font-size="12" fill="#993C1D">прибавок</text>
  <text x="540" y="232" text-anchor="middle" font-size="11" fill="#993C1D">(або убавок)</text>

  <!-- Напрямок в'язання -->
  <line x1="340" y1="330" x2="340" y2="240" stroke="#5F5E5A" stroke-width="1" marker-end="url(#slv-arrow)"/>
  <text x="340" y="262" text-anchor="middle" font-size="11" fill="#5F5E5A">знизу вгору</text>
  <text x="340" y="276" text-anchor="middle" font-size="11" fill="#5F5E5A">→ прибавки</text>

  <!-- Верхня ширина -->
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="190" y1="48" x2="490" y2="48"/><line x1="190" y1="43" x2="190" y2="53"/><line x1="490" y1="43" x2="490" y2="53"/>
  </g>
  <text x="340" y="36" text-anchor="middle" font-size="12" fill="#5F5E5A">верхня ширина рукава</text>

  <!-- Ширина манжети -->
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="280" y1="412" x2="400" y2="412"/><line x1="280" y1="407" x2="280" y2="417"/><line x1="400" y1="407" x2="400" y2="417"/>
  </g>
  <text x="340" y="430" text-anchor="middle" font-size="12" fill="#5F5E5A">ширина манжети</text>

  <!-- Висота манжети -->
  <g stroke="#0F6E56" stroke-width="1">
    <line x1="420" y1="350" x2="420" y2="390"/><line x1="415" y1="350" x2="425" y2="350"/><line x1="415" y1="390" x2="425" y2="390"/>
  </g>
  <text x="428" y="374" font-size="11" fill="#0F6E56">висота манжети</text>

  <!-- Довжина рукава -->
  <line x1="490" y1="70" x2="600" y2="70" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="400" y1="390" x2="600" y2="390" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="600" y1="70" x2="600" y2="390"/><line x1="595" y1="70" x2="605" y2="70"/><line x1="595" y1="390" x2="605" y2="390"/>
  </g>
  <text x="608" y="226" font-size="12" fill="#5F5E5A">довжина</text>
  <text x="608" y="242" font-size="12" fill="#5F5E5A">рукава</text>

  <!-- Легенда -->
  <circle cx="60" cy="440" r="4" fill="#D85A30"/>
  <text x="70" y="444" font-size="11" fill="#5F5E5A">прибавка/убавка по 1 п. з кожного боку; знизу вгору — прибавки, зверху вниз — убавки</text>
</svg>`,
  },
  "neckline-basic": {
    title: "Схема округлого вирізу горловини",
    caption: "Схема горловини: плечі, виріз, центральні петлі та зони убавок для формування округлої форми.",
    svg: `<svg viewBox="0 0 680 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-neckline-round-title diagram-neckline-round-desc">
  <title id="diagram-neckline-round-title">Схема округлого вирізу горловини</title>
  <desc id="diagram-neckline-round-desc">Деталь переду або спинки; зверху плечі з обох боків, між ними виріз: центральні петлі закривають одразу, далі сходинками йдуть зони убавок до плечей. Показано ширину горловини та глибину вирізу.</desc>
  <path d="M120 120 L250 120 L250 140 L262.5 140 L262.5 160 L275 160 L275 180 L287.5 180 L287.5 200 L300 200 L380 200 L392.5 200 L392.5 180 L405 180 L405 160 L417.5 160 L417.5 140 L430 140 L430 120 L560 120 L560 400 L120 400 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2" stroke-linejoin="round"/>
  <text x="340" y="330" text-anchor="middle" font-size="13" fill="#5F5E5A">перед / спинка</text>
  <path d="M250 120 Q265 190 300 200 L380 200 Q415 190 430 120" fill="none" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g fill="none" stroke="#D85A30" stroke-width="2.4" stroke-linejoin="round">
    <path d="M250 120 L250 140 L262.5 140 L262.5 160 L275 160 L275 180 L287.5 180 L287.5 200 L300 200"/>
    <path d="M430 120 L430 140 L417.5 140 L417.5 160 L405 160 L405 180 L392.5 180 L392.5 200 L380 200"/>
  </g>
  <text x="200" y="168" text-anchor="middle" font-size="12" fill="#993C1D">зона</text>
  <text x="200" y="184" text-anchor="middle" font-size="12" fill="#993C1D">убавок</text>
  <text x="480" y="168" text-anchor="middle" font-size="12" fill="#993C1D">зона</text>
  <text x="480" y="184" text-anchor="middle" font-size="12" fill="#993C1D">убавок</text>
  <line x1="300" y1="200" x2="380" y2="200" stroke="#0F6E56" stroke-width="3" stroke-linecap="round"/>
  <text x="340" y="222" text-anchor="middle" font-size="12" fill="#0F6E56">центральні петлі</text>
  <text x="340" y="237" text-anchor="middle" font-size="11" fill="#0F6E56">(закрити за один раз)</text>
  <text x="340" y="160" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">виріз</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="120" y1="104" x2="250" y2="104"/><line x1="120" y1="99" x2="120" y2="109"/><line x1="250" y1="99" x2="250" y2="109"/>
    <line x1="430" y1="104" x2="560" y2="104"/><line x1="430" y1="99" x2="430" y2="109"/><line x1="560" y1="99" x2="560" y2="109"/>
  </g>
  <text x="185" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <text x="495" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="250" y1="62" x2="430" y2="62"/><line x1="250" y1="57" x2="250" y2="67"/><line x1="430" y1="57" x2="430" y2="67"/>
  </g>
  <text x="340" y="50" text-anchor="middle" font-size="12" fill="#5F5E5A">ширина горловини</text>
  <line x1="430" y1="120" x2="590" y2="120" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="380" y1="200" x2="590" y2="200" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="590" y1="120" x2="590" y2="200"/><line x1="585" y1="120" x2="595" y2="120"/><line x1="585" y1="200" x2="595" y2="200"/>
  </g>
  <text x="600" y="156" font-size="12" fill="#5F5E5A">глибина</text>
  <text x="600" y="172" font-size="12" fill="#5F5E5A">вирізу</text>
  <line x1="120" y1="422" x2="150" y2="422" stroke="#0F6E56" stroke-width="3" stroke-linecap="round"/>
  <text x="158" y="426" font-size="11" fill="#5F5E5A">центральні петлі — закриваються одразу</text>
  <line x1="390" y1="422" x2="420" y2="422" stroke="#D85A30" stroke-width="2.4"/>
  <text x="428" y="426" font-size="11" fill="#5F5E5A">убавки сходинками з обох боків</text>
</svg>`,
  },
  "neckline-round": {
    title: "Схема округлого вирізу горловини",
    caption: "Схема горловини: плечі, виріз, центральні петлі та зони убавок для формування округлої форми.",
    svg: `<svg viewBox="0 0 680 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-neckline-round-title diagram-neckline-round-desc">
  <title id="diagram-neckline-round-title">Схема округлого вирізу горловини</title>
  <desc id="diagram-neckline-round-desc">Деталь переду або спинки; зверху плечі з обох боків, між ними виріз: центральні петлі закривають одразу, далі сходинками йдуть зони убавок до плечей. Показано ширину горловини та глибину вирізу.</desc>
  <path d="M120 120 L250 120 L250 140 L262.5 140 L262.5 160 L275 160 L275 180 L287.5 180 L287.5 200 L300 200 L380 200 L392.5 200 L392.5 180 L405 180 L405 160 L417.5 160 L417.5 140 L430 140 L430 120 L560 120 L560 400 L120 400 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2" stroke-linejoin="round"/>
  <text x="340" y="330" text-anchor="middle" font-size="13" fill="#5F5E5A">перед / спинка</text>
  <path d="M250 120 Q265 190 300 200 L380 200 Q415 190 430 120" fill="none" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g fill="none" stroke="#D85A30" stroke-width="2.4" stroke-linejoin="round">
    <path d="M250 120 L250 140 L262.5 140 L262.5 160 L275 160 L275 180 L287.5 180 L287.5 200 L300 200"/>
    <path d="M430 120 L430 140 L417.5 140 L417.5 160 L405 160 L405 180 L392.5 180 L392.5 200 L380 200"/>
  </g>
  <text x="200" y="168" text-anchor="middle" font-size="12" fill="#993C1D">зона</text>
  <text x="200" y="184" text-anchor="middle" font-size="12" fill="#993C1D">убавок</text>
  <text x="480" y="168" text-anchor="middle" font-size="12" fill="#993C1D">зона</text>
  <text x="480" y="184" text-anchor="middle" font-size="12" fill="#993C1D">убавок</text>
  <line x1="300" y1="200" x2="380" y2="200" stroke="#0F6E56" stroke-width="3" stroke-linecap="round"/>
  <text x="340" y="222" text-anchor="middle" font-size="12" fill="#0F6E56">центральні петлі</text>
  <text x="340" y="237" text-anchor="middle" font-size="11" fill="#0F6E56">(закрити за один раз)</text>
  <text x="340" y="160" text-anchor="middle" font-size="13" font-weight="500" fill="#2C2C2A">виріз</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="120" y1="104" x2="250" y2="104"/><line x1="120" y1="99" x2="120" y2="109"/><line x1="250" y1="99" x2="250" y2="109"/>
    <line x1="430" y1="104" x2="560" y2="104"/><line x1="430" y1="99" x2="430" y2="109"/><line x1="560" y1="99" x2="560" y2="109"/>
  </g>
  <text x="185" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <text x="495" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="250" y1="62" x2="430" y2="62"/><line x1="250" y1="57" x2="250" y2="67"/><line x1="430" y1="57" x2="430" y2="67"/>
  </g>
  <text x="340" y="50" text-anchor="middle" font-size="12" fill="#5F5E5A">ширина горловини</text>
  <line x1="430" y1="120" x2="590" y2="120" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="380" y1="200" x2="590" y2="200" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="590" y1="120" x2="590" y2="200"/><line x1="585" y1="120" x2="595" y2="120"/><line x1="585" y1="200" x2="595" y2="200"/>
  </g>
  <text x="600" y="156" font-size="12" fill="#5F5E5A">глибина</text>
  <text x="600" y="172" font-size="12" fill="#5F5E5A">вирізу</text>
  <line x1="120" y1="422" x2="150" y2="422" stroke="#0F6E56" stroke-width="3" stroke-linecap="round"/>
  <text x="158" y="426" font-size="11" fill="#5F5E5A">центральні петлі — закриваються одразу</text>
  <line x1="390" y1="422" x2="420" y2="422" stroke="#D85A30" stroke-width="2.4"/>
  <text x="428" y="426" font-size="11" fill="#5F5E5A">убавки сходинками з обох боків</text>
</svg>`,
  },
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function normalizeDiagramId(id: string) {
  const normalized = id.trim().toLowerCase()
  return /^[a-z0-9][a-z0-9-]*$/.test(normalized) ? normalized : null
}

function renderMissingDiagram(id: string) {
  const safeId = escapeHtml(id)

  return `
<aside class="blog-diagram blog-diagram--missing" role="note" aria-label="Схема ще не додана">
  <p>Схему “${safeId}” ще не додано до бібліотеки блогу.</p>
</aside>`
}

export type RaglanUnwrappedParams = {
  backLeft?: number
  sleeveRight?: number
  front?: number
  sleeveLeft?: number
  backRight?: number
  line?: number
}

export function renderRaglanUnwrappedSvg(params?: RaglanUnwrappedParams): string {
  const backLeft = params?.backLeft ?? 11
  const sleeveRight = params?.sleeveRight ?? 11
  const front = params?.front ?? 23
  const sleeveLeft = params?.sleeveLeft ?? 11
  const backRight = params?.backRight ?? 12
  const line = params?.line ?? 2

  const blocks: Array<{ label?: string; n?: number; rl?: number }> = [
    { label: "½ спинки", n: backLeft },
    { rl: 1 },
    { label: "рукав", n: sleeveRight },
    { rl: 2 },
    { label: "перед", n: front },
    { rl: 3 },
    { label: "рукав", n: sleeveLeft },
    { rl: 4 },
    { label: "½ спинки", n: backRight },
  ]

  let total = 0
  blocks.forEach((b) => {
    total += b.rl ? line : (b.n ?? 0)
  })

  const W = 680
  const X0 = 36
  const X1 = 644
  const scale = (X1 - X0) / total
  const y = 90
  const h = 100
  let x = X0

  const COLOR_LINE = "#D85A30"
  const COLOR_PLUS = "#993C1D"
  const COLOR_TEXT = "#2C2C2A"
  const COLOR_MUTED = "#5F5E5A"
  const COLOR_FILL = "#F1EFE8"
  const COLOR_MARK = "#0F6E56"

  const out: string[] = []
  out.push(`<svg viewBox="0 0 ${W} 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-raglan-unwrapped-title diagram-raglan-unwrapped-desc">`)
  out.push(`  <title id="diagram-raglan-unwrapped-title">Розгортка реглану зверху по ряду (${total} п.)</title>`)
  out.push(`  <desc id="diagram-raglan-unwrapped-desc">Круговий ряд на ${total} петель: ½ спинки (${backLeft} п.), РЛ 1 (${line} п.), рукав (${sleeveRight} п.), РЛ 2 (${line} п.), перед (${front} п.), РЛ 3 (${line} п.), рукав (${sleeveLeft} п.), РЛ 4 (${line} п.), ½ спинки (${backRight} п.). Прибавки з обох боків кожної лінії.</desc>`)
  out.push(`  <defs>`)
  out.push(`    <marker id="rgl-unwrapped-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">`)
  out.push(`      <path d="M2 1L8 5L2 9" fill="none" stroke="${COLOR_MUTED}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`)
  out.push(`    </marker>`)
  out.push(`  </defs>`)
  out.push(`  <text x="340" y="30" text-anchor="middle" font-size="12" fill="${COLOR_MUTED}">Напрямок в'язання ряду</text>`)
  out.push(`  <line x1="${X0}" y1="48" x2="${X1}" y2="48" stroke="${COLOR_MUTED}" stroke-width="1" marker-end="url(#rgl-unwrapped-arrow)"/>`)

  blocks.forEach((b) => {
    const w = (b.rl ? line : (b.n ?? 0)) * scale
    const cx = x + w / 2
    if (b.rl) {
      out.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLOR_LINE}"/>`)
      out.push(`  <text x="${cx}" y="78" text-anchor="middle" font-size="12" fill="${COLOR_PLUS}">РЛ ${b.rl}</text>`)
      out.push(`  <text x="${x - 7}" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="${COLOR_PLUS}">+</text>`)
      out.push(`  <text x="${x + w + 7}" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="${COLOR_PLUS}">+</text>`)
    } else {
      out.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLOR_FILL}" stroke="${COLOR_MUTED}" stroke-width="1"/>`)
      out.push(`  <text x="${cx}" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="${COLOR_TEXT}">${b.label}</text>`)
      out.push(`  <text x="${cx}" y="152" text-anchor="middle" font-size="12" fill="${COLOR_MUTED}">${b.n} п.</text>`)
    }
    x += w
  })

  out.push(`  <circle cx="${X0}" cy="${y}" r="5" fill="${COLOR_MARK}"/>`)
  out.push(`  <line x1="${X0}" y1="95" x2="${X0}" y2="232" stroke="${COLOR_MARK}" stroke-width="1" stroke-dasharray="3 3"/>`)
  out.push(`  <text x="44" y="240" font-size="12" fill="${COLOR_MARK}">Початок кругового ряду (маркер)</text>`)
  out.push(`  <rect x="36" y="268" width="16" height="12" fill="${COLOR_LINE}"/>`)
  out.push(`  <text x="60" y="278" font-size="12" fill="${COLOR_MUTED}">РЛ — регланна лінія (по ${line} п.)</text>`)
  out.push(`  <text x="36" y="302" font-size="14" font-weight="700" fill="${COLOR_PLUS}">+</text>`)
  out.push(`  <text x="50" y="302" font-size="12" fill="${COLOR_MUTED}">прибавка з обох боків лінії (8 п. за ряд) · разом ${total} п.</text>`)
  out.push(`</svg>`)

  return out.join("\n")
}

export function parseRaglanParams(paramsStr?: string): RaglanUnwrappedParams {
  if (!paramsStr) return {}
  const params: Record<string, number> = {}
  paramsStr.split(",").forEach((pair) => {
    const [rawKey, rawVal] = pair.split("=").map((s) => s.trim())
    if (rawKey && rawVal) {
      const num = parseInt(rawVal, 10)
      if (!isNaN(num)) {
        params[rawKey.toLowerCase()] = num
      }
    }
  })
  return {
    backLeft: params["backleft"] ?? params["back_left"],
    sleeveRight: params["sleeveright"] ?? params["sleeve_right"] ?? params["sleeve"],
    front: params["front"],
    sleeveLeft: params["sleeveleft"] ?? params["sleeve_left"] ?? params["sleeve"],
    backRight: params["backright"] ?? params["back_right"],
    line: params["line"] ?? params["rl"],
  }
}

export function renderBlogDiagram(id: string, paramsStr?: string) {
  const normalizedId = normalizeDiagramId(id)
  if (!normalizedId) return renderMissingDiagram(id)

  if (normalizedId === "raglan-unwrapped" && paramsStr) {
    const params = parseRaglanParams(paramsStr)
    const svg = renderRaglanUnwrappedSvg(params)
    const safeTitle = escapeHtml("Розгортка реглану зверху по ряду")
    const safeCaption = escapeHtml("Схема розподілу петель горловини по круговому ряду: спинка, рукави, перед та регланні лінії з прибавками.")
    return `
<figure class="blog-diagram" aria-label="${safeTitle}">
  <div class="blog-diagram__canvas">
    ${svg}
  </div>
  <figcaption>${safeCaption}</figcaption>
</figure>`
  }

  const diagram = BLOG_DIAGRAMS[normalizedId]
  if (!diagram) return renderMissingDiagram(normalizedId)

  const safeTitle = escapeHtml(diagram.title)
  const safeCaption = escapeHtml(diagram.caption)

  return `
<figure class="blog-diagram" aria-label="${safeTitle}">
  <div class="blog-diagram__canvas">
    ${diagram.svg}
  </div>
  <figcaption>${safeCaption}</figcaption>
</figure>`
}

export function getSupportedBlogDiagramIds() {
  return Object.keys(BLOG_DIAGRAMS)
}