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
  "neckline-v": {
    title: "Схема V-подібного вирізу горловини",
    caption: "Схема V-подібного вирізу: плечі, скісні лінії убавок, центральна петля та глибина вирізу.",
    svg: `<svg width="680" height="440" viewBox="0 0 680 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-neckline-v-title diagram-neckline-v-desc">
  <title id="diagram-neckline-v-title">Схема V-подібного вирізу горловини</title>
  <desc id="diagram-neckline-v-desc">Деталь переду светра: плечі з обох боків, по центру V-подібний виріз зі симетричними скісними лініями убавок до центральної точки. Показано ширину горловини та глибину V-вирізу.</desc>
  <path d="M120 120 L240 120 L240 152 L260 152 L260 184 L280 184 L280 216 L300 216 L300 248 L320 248 L320 280 L340 280 L360 280 L360 248 L380 248 L380 216 L400 216 L400 184 L420 184 L420 152 L440 152 L440 120 L560 120 L560 400 L120 400 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2" stroke-linejoin="round"/>
  <text x="340" y="355" text-anchor="middle" font-size="13" fill="#5F5E5A">перед светра / жилета</text>
  <path d="M240 120 L340 280 L440 120" fill="none" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g fill="none" stroke="#D85A30" stroke-width="2.4" stroke-linejoin="round">
    <path d="M240 120 L240 152 L260 152 L260 184 L280 184 L280 216 L300 216 L300 248 L320 248 L320 280 L340 280"/>
    <path d="M440 120 L440 152 L420 152 L420 184 L400 184 L400 216 L380 216 L380 248 L360 248 L360 280 L340 280"/>
  </g>
  <text x="210" y="215" text-anchor="middle" font-size="12" fill="#993C1D">зона убавок</text>
  <text x="210" y="231" text-anchor="middle" font-size="11" fill="#993C1D">(лівий скіс)</text>
  <text x="470" y="215" text-anchor="middle" font-size="12" fill="#993C1D">зона убавок</text>
  <text x="470" y="231" text-anchor="middle" font-size="11" fill="#993C1D">(правий скіс)</text>
  <circle cx="340" cy="280" r="5" fill="#0F6E56"/>
  <text x="340" y="302" text-anchor="middle" font-size="12" font-weight="600" fill="#0F6E56">1 центральна петля</text>
  <text x="340" y="318" text-anchor="middle" font-size="11" fill="#0F6E56">(зняти на шпильку для планки)</text>
  <text x="340" y="175" text-anchor="middle" font-size="14" font-weight="600" fill="#2C2C2A">V-подібний виріз</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="120" y1="104" x2="240" y2="104"/><line x1="120" y1="99" x2="120" y2="109"/><line x1="240" y1="99" x2="240" y2="109"/>
    <line x1="440" y1="104" x2="560" y2="104"/><line x1="440" y1="99" x2="440" y2="109"/><line x1="560" y1="99" x2="560" y2="109"/>
  </g>
  <text x="180" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <text x="500" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="240" y1="62" x2="440" y2="62"/><line x1="240" y1="57" x2="240" y2="67"/><line x1="440" y1="57" x2="440" y2="67"/>
  </g>
  <text x="340" y="50" text-anchor="middle" font-size="12" fill="#5F5E5A">ширина вирізу (відстань між плечима)</text>
  <line x1="440" y1="120" x2="590" y2="120" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="340" y1="280" x2="590" y2="280" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="590" y1="120" x2="590" y2="280"/><line x1="585" y1="120" x2="595" y2="120"/><line x1="585" y1="280" x2="595" y2="280"/>
  </g>
  <text x="600" y="196" font-size="12" fill="#5F5E5A">глибина</text>
  <text x="600" y="212" font-size="12" fill="#5F5E5A">V-вирізу</text>
  <circle cx="120" cy="424" r="5" fill="#0F6E56"/>
  <text x="132" y="428" font-size="11" fill="#5F5E5A">центральна петля — знімається на шпильку</text>
  <line x1="380" y1="424" x2="410" y2="424" stroke="#D85A30" stroke-width="2.4"/>
  <text x="418" y="428" font-size="11" fill="#5F5E5A">убавки скосу вирізу (кожен 4-й або 2-й і 4-й ряд)</text>
</svg>`,
  },
  "v-neck": {
    title: "Схема V-подібного вирізу горловини",
    caption: "Схема V-подібного вирізу: плечі, скісні лінії убавок, центральна петля та глибина вирізу.",
    svg: `<svg width="680" height="440" viewBox="0 0 680 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-neckline-v-title diagram-neckline-v-desc">
  <title id="diagram-neckline-v-title">Схема V-подібного вирізу горловини</title>
  <desc id="diagram-neckline-v-desc">Деталь переду светра: плечі з обох боків, по центру V-подібний виріз зі симетричними скісними лініями убавок до центральної точки. Показано ширину горловини та глибину V-вирізу.</desc>
  <path d="M120 120 L240 120 L240 152 L260 152 L260 184 L280 184 L280 216 L300 216 L300 248 L320 248 L320 280 L340 280 L360 280 L360 248 L380 248 L380 216 L400 216 L400 184 L420 184 L420 152 L440 152 L440 120 L560 120 L560 400 L120 400 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.2" stroke-linejoin="round"/>
  <text x="340" y="355" text-anchor="middle" font-size="13" fill="#5F5E5A">перед светра / жилета</text>
  <path d="M240 120 L340 280 L440 120" fill="none" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g fill="none" stroke="#D85A30" stroke-width="2.4" stroke-linejoin="round">
    <path d="M240 120 L240 152 L260 152 L260 184 L280 184 L280 216 L300 216 L300 248 L320 248 L320 280 L340 280"/>
    <path d="M440 120 L440 152 L420 152 L420 184 L400 184 L400 216 L380 216 L380 248 L360 248 L360 280 L340 280"/>
  </g>
  <text x="210" y="215" text-anchor="middle" font-size="12" fill="#993C1D">зона убавок</text>
  <text x="210" y="231" text-anchor="middle" font-size="11" fill="#993C1D">(лівий скіс)</text>
  <text x="470" y="215" text-anchor="middle" font-size="12" fill="#993C1D">зона убавок</text>
  <text x="470" y="231" text-anchor="middle" font-size="11" fill="#993C1D">(правий скіс)</text>
  <circle cx="340" cy="280" r="5" fill="#0F6E56"/>
  <text x="340" y="302" text-anchor="middle" font-size="12" font-weight="600" fill="#0F6E56">1 центральна петля</text>
  <text x="340" y="318" text-anchor="middle" font-size="11" fill="#0F6E56">(зняти на шпильку для планки)</text>
  <text x="340" y="175" text-anchor="middle" font-size="14" font-weight="600" fill="#2C2C2A">V-подібний виріз</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="120" y1="104" x2="240" y2="104"/><line x1="120" y1="99" x2="120" y2="109"/><line x1="240" y1="99" x2="240" y2="109"/>
    <line x1="440" y1="104" x2="560" y2="104"/><line x1="440" y1="99" x2="440" y2="109"/><line x1="560" y1="99" x2="560" y2="109"/>
  </g>
  <text x="180" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <text x="500" y="92" text-anchor="middle" font-size="12" fill="#5F5E5A">плече</text>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="240" y1="62" x2="440" y2="62"/><line x1="240" y1="57" x2="240" y2="67"/><line x1="440" y1="57" x2="440" y2="67"/>
  </g>
  <text x="340" y="50" text-anchor="middle" font-size="12" fill="#5F5E5A">ширина вирізу (відстань між плечима)</text>
  <line x1="440" y1="120" x2="590" y2="120" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="340" y1="280" x2="590" y2="280" stroke="#5F5E5A" stroke-width="0.8" stroke-dasharray="3 3"/>
  <g stroke="#5F5E5A" stroke-width="1">
    <line x1="590" y1="120" x2="590" y2="280"/><line x1="585" y1="120" x2="595" y2="120"/><line x1="585" y1="280" x2="595" y2="280"/>
  </g>
  <text x="600" y="196" font-size="12" fill="#5F5E5A">глибина</text>
  <text x="600" y="212" font-size="12" fill="#5F5E5A">V-вирізу</text>
  <circle cx="120" cy="424" r="5" fill="#0F6E56"/>
  <text x="132" y="428" font-size="11" fill="#5F5E5A">центральна петля — знімається на шпильку</text>
  <line x1="380" y1="424" x2="410" y2="424" stroke="#D85A30" stroke-width="2.4"/>
  <text x="418" y="428" font-size="11" fill="#5F5E5A">убавки скосу вирізу (кожен 4-й або 2-й і 4-й ряд)</text>
</svg>`,
  },
  "shaping-intervals": {
    title: "Схема рівномірного розподілу убавок та добавок",
    caption: "Схема розрахунку рівномірного кроку убавок або прибавок по ряду з компенсацією залишку петель.",
    svg: `<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-shaping-intervals-title diagram-shaping-intervals-desc">
  <title id="diagram-shaping-intervals-title">Схема рівномірного розподілу убавок та добавок по ряду</title>
  <desc id="diagram-shaping-intervals-desc">Схема ряду петель із позначенням відступів від краю, рівномірних інтервалів K та розширених інтервалів K+1 для симетричного розподілу залишку петель.</desc>
  <defs>
    <marker id="shp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="50" y="70" width="580" height="70" rx="12" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.4"/>
  <text x="340" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="#2C2C2A">Робочий ряд петель (N = початкова кількість)</text>
  <rect x="50" y="70" width="50" height="70" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="75" y="102" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">край</text>
  <text x="75" y="118" text-anchor="middle" font-size="10" fill="#7A7870">2-3 п.</text>
  <rect x="580" y="70" width="50" height="70" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="605" y="102" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">край</text>
  <text x="605" y="118" text-anchor="middle" font-size="10" fill="#7A7870">2-3 п.</text>
  <line x1="100" y1="70" x2="100" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="150" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#2C2C2A">інтервал K</text>
  <text x="150" y="120" text-anchor="middle" font-size="11" fill="#5F5E5A">(базовий крок)</text>
  <line x1="200" y1="70" x2="200" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="260" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#0F6E56">інтервал K+1</text>
  <text x="260" y="120" text-anchor="middle" font-size="11" fill="#0F6E56">(компенсація)</text>
  <line x1="320" y1="70" x2="320" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="370" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#2C2C2A">інтервал K</text>
  <text x="370" y="120" text-anchor="middle" font-size="11" fill="#5F5E5A">(базовий крок)</text>
  <line x1="420" y1="70" x2="420" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="480" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#0F6E56">інтервал K+1</text>
  <text x="480" y="120" text-anchor="middle" font-size="11" fill="#0F6E56">(компенсація)</text>
  <line x1="540" y1="70" x2="540" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <circle cx="200" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="200" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="200" y1="145" x2="200" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="200" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 1</text>
  <circle cx="320" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="320" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="320" y1="145" x2="320" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="320" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 2</text>
  <circle cx="420" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="420" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="420" y1="145" x2="420" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="420" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 3</text>
  <circle cx="540" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="540" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="540" y1="145" x2="540" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="540" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 4</text>
  <rect x="50" y="225" width="580" height="110" rx="14" fill="#F8F6F0" stroke="#E2DCD2" stroke-width="1.2"/>
  <text x="75" y="255" font-size="13" font-weight="700" fill="#2C2C2A">Математична формула рівномірного кроку:</text>
  <text x="75" y="280" font-size="13" font-family="monospace" fill="#0F6E56">N ÷ m = K (остача R)</text>
  <text x="75" y="302" font-size="12" fill="#5F5E5A">де N — петлі ряду, m — кількість потрібних убавок або прибавок.</text>
  <text x="75" y="322" font-size="12" fill="#5F5E5A">Правило симетрії: залишок R розподіляють по центру, чергуючи крок K та (K+1).</text>
  <g transform="translate(60, 360)">
    <circle cx="10" cy="15" r="7" fill="#D85A30"/>
    <text x="26" y="19" font-size="12" fill="#5F5E5A">Точка зміни: прибавка (M1L/M1R) або убавка (k2tog/ssk)</text>
    <rect x="360" y="8" width="16" height="14" rx="3" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1"/>
    <text x="386" y="19" font-size="12" fill="#5F5E5A">Крайовий захисний відступ без змін</text>
  </g>
</svg>`,
  },
  "ubavky": {
    title: "Схема рівномірного розподілу убавок та добавок",
    caption: "Схема розрахунку рівномірного кроку убавок або прибавок по ряду з компенсацією залишку петель.",
    svg: `<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-shaping-intervals-title diagram-shaping-intervals-desc">
  <title id="diagram-shaping-intervals-title">Схема рівномірного розподілу убавок та добавок по ряду</title>
  <desc id="diagram-shaping-intervals-desc">Схема ряду петель із позначенням відступів від краю, рівномірних інтервалів K та розширених інтервалів K+1 для симетричного розподілу залишку петель.</desc>
  <defs>
    <marker id="shp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="50" y="70" width="580" height="70" rx="12" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.4"/>
  <text x="340" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="#2C2C2A">Робочий ряд петель (N = початкова кількість)</text>
  <rect x="50" y="70" width="50" height="70" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="75" y="102" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">край</text>
  <text x="75" y="118" text-anchor="middle" font-size="10" fill="#7A7870">2-3 п.</text>
  <rect x="580" y="70" width="50" height="70" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="605" y="102" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">край</text>
  <text x="605" y="118" text-anchor="middle" font-size="10" fill="#7A7870">2-3 п.</text>
  <line x1="100" y1="70" x2="100" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="150" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#2C2C2A">інтервал K</text>
  <text x="150" y="120" text-anchor="middle" font-size="11" fill="#5F5E5A">(базовий крок)</text>
  <line x1="200" y1="70" x2="200" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="260" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#0F6E56">інтервал K+1</text>
  <text x="260" y="120" text-anchor="middle" font-size="11" fill="#0F6E56">(компенсація)</text>
  <line x1="320" y1="70" x2="320" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="370" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#2C2C2A">інтервал K</text>
  <text x="370" y="120" text-anchor="middle" font-size="11" fill="#5F5E5A">(базовий крок)</text>
  <line x1="420" y1="70" x2="420" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="480" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="#0F6E56">інтервал K+1</text>
  <text x="480" y="120" text-anchor="middle" font-size="11" fill="#0F6E56">(компенсація)</text>
  <line x1="540" y1="70" x2="540" y2="140" stroke="#5F5E5A" stroke-width="1" stroke-dasharray="3 3"/>
  <circle cx="200" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="200" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="200" y1="145" x2="200" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="200" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 1</text>
  <circle cx="320" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="320" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="320" y1="145" x2="320" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="320" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 2</text>
  <circle cx="420" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="420" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="420" y1="145" x2="420" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="420" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 3</text>
  <circle cx="540" cy="105" r="14" fill="#D85A30" stroke="#FFFFFF" stroke-width="2"/>
  <text x="540" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">±</text>
  <line x1="540" y1="145" x2="540" y2="185" stroke="#D85A30" stroke-width="1.5"/>
  <text x="540" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">точка 4</text>
  <rect x="50" y="225" width="580" height="110" rx="14" fill="#F8F6F0" stroke="#E2DCD2" stroke-width="1.2"/>
  <text x="75" y="255" font-size="13" font-weight="700" fill="#2C2C2A">Математична формула рівномірного кроку:</text>
  <text x="75" y="280" font-size="13" font-family="monospace" fill="#0F6E56">N ÷ m = K (остача R)</text>
  <text x="75" y="302" font-size="12" fill="#5F5E5A">де N — петлі ряду, m — кількість потрібних убавок або прибавок.</text>
  <text x="75" y="322" font-size="12" fill="#5F5E5A">Правило симетрії: залишок R розподіляють по центру, чергуючи крок K та (K+1).</text>
  <g transform="translate(60, 360)">
    <circle cx="10" cy="15" r="7" fill="#D85A30"/>
    <text x="26" y="19" font-size="12" fill="#5F5E5A">Точка зміни: прибавка (M1L/M1R) або убавка (k2tog/ssk)</text>
    <rect x="360" y="8" width="16" height="14" rx="3" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1"/>
    <text x="386" y="19" font-size="12" fill="#5F5E5A">Крайовий захисний відступ без змін</text>
  </g>
</svg>`,
  },
  "lace-repeat": {
    title: "Схема розрахунку рапорту та балансу ажуру",
    caption: "Схема структури ажурного ряду: рапорт R, петлі симетрії до та після рапорту, кромкові та закон балансу накидів і убавок.",
    svg: `<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-lace-repeat-title diagram-lace-repeat-desc">
  <title id="diagram-lace-repeat-title">Схема розрахунку рапорту та балансу ажурного візерунка</title>
  <desc id="diagram-lace-repeat-desc">Анатомія ажурного полотна: кромкові петлі, петлі симетрії, кратні рапорти R та закон рівноваги накидів і убавок.</desc>
  <defs>
    <marker id="lace-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="lace-arrow-left" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M8 1L2 5L8 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#2C2C2A">Анатомія ряду ажурного візерунка: розподіл петель</text>
  <rect x="40" y="52" width="600" height="96" rx="12" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.4"/>
  <rect x="40" y="52" width="35" height="96" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="57" y="94" text-anchor="middle" font-size="11" font-weight="700" fill="#5F5E5A">Кр.</text>
  <text x="57" y="112" text-anchor="middle" font-size="9" fill="#7A7870">1 п.</text>
  <rect x="75" y="52" width="65" height="96" fill="#FBF9F5" stroke="#5F5E5A" stroke-width="1"/>
  <text x="107" y="92" text-anchor="middle" font-size="11" font-weight="600" fill="#2C2C2A">До рапорту</text>
  <text x="107" y="110" text-anchor="middle" font-size="10" fill="#0F6E56">симетрія</text>
  <rect x="140" y="52" width="145" height="96" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.8"/>
  <text x="212" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#0F6E56">РАПОРТ 1 (R)</text>
  <text x="212" y="106" text-anchor="middle" font-size="11" fill="#2C2C2A">основний мотив</text>
  <text x="212" y="124" text-anchor="middle" font-size="10" font-weight="600" fill="#0F6E56">R петель</text>
  <rect x="285" y="52" width="145" height="96" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.8"/>
  <text x="357" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#0F6E56">РАПОРТ 2 (R)</text>
  <text x="357" y="106" text-anchor="middle" font-size="11" fill="#2C2C2A">повторення мотиву</text>
  <text x="357" y="124" text-anchor="middle" font-size="10" font-weight="600" fill="#0F6E56">R петель</text>
  <rect x="430" y="52" width="95" height="96" fill="#F2F9F6" stroke="#0F6E56" stroke-width="1.4" stroke-dasharray="4 2"/>
  <text x="477" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">РАПОРТ k</text>
  <text x="477" y="108" text-anchor="middle" font-size="10" fill="#5F5E5A">... k-й раз</text>
  <rect x="525" y="52" width="80" height="96" fill="#FBF9F5" stroke="#5F5E5A" stroke-width="1"/>
  <text x="565" y="92" text-anchor="middle" font-size="11" font-weight="600" fill="#2C2C2A">Після рапорту</text>
  <text x="565" y="110" text-anchor="middle" font-size="10" fill="#0F6E56">симетрія</text>
  <rect x="605" y="52" width="35" height="96" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="622" y="94" text-anchor="middle" font-size="11" font-weight="700" fill="#5F5E5A">Кр.</text>
  <text x="622" y="112" text-anchor="middle" font-size="9" fill="#7A7870">1 п.</text>
  <line x1="40" y1="162" x2="640" y2="162" stroke="#5F5E5A" stroke-width="1.2" marker-start="url(#lace-arrow-left)" marker-end="url(#lace-arrow)"/>
  <text x="340" y="180" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">Загальна кількість петель набору: N = (k × R) + S + 2 кр.</text>
  <rect x="40" y="200" width="600" height="152" rx="14" fill="#F8F6F0" stroke="#E2DCD2" stroke-width="1.2"/>
  <text x="65" y="228" font-size="13" font-weight="700" fill="#2C2C2A">Закон балансу ажуру в кожному ряду та біля пройми:</text>
  <g transform="translate(65, 245)">
    <circle cx="20" cy="20" r="14" fill="#FFFFFF" stroke="#0F6E56" stroke-width="2"/>
    <circle cx="20" cy="20" r="6" fill="none" stroke="#0F6E56" stroke-width="1.8"/>
    <text x="44" y="18" font-size="12" font-weight="700" fill="#0F6E56">Накид (U / yo): +1 петля</text>
    <text x="44" y="34" font-size="11" fill="#5F5E5A">Утворює ажурний отвір (просвіт)</text>
  </g>
  <g transform="translate(350, 245)">
    <circle cx="20" cy="20" r="14" fill="#FFFFFF" stroke="#D85A30" stroke-width="2"/>
    <line x1="13" y1="27" x2="27" y2="13" stroke="#D85A30" stroke-width="2.5" stroke-linecap="round"/>
    <text x="44" y="18" font-size="12" font-weight="700" fill="#993C1D">2 разом лицьовою (k2tog): −1 петля</text>
    <text x="44" y="34" font-size="11" fill="#5F5E5A">Зменшення з нахилом вправо</text>
  </g>
  <rect x="65" y="295" width="550" height="42" rx="8" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1.2"/>
  <text x="340" y="321" text-anchor="middle" font-size="13" font-weight="700" fill="#0F6E56">Баланс ряду: Кількість накидів (+1) = Кількість убавок (−1)</text>
  <g transform="translate(45, 372)">
    <rect x="0" y="0" width="590" height="34" rx="8" fill="#FEF3F2" stroke="#FECDCA" stroke-width="1"/>
    <text x="12" y="21" font-size="11" font-weight="600" fill="#B42318">⚠️ Увага біля пройми та горловини:</text>
    <text x="210" y="21" font-size="11" fill="#475467">якщо для парної убавки не вистачає петель, накид НЕ роблять (в'яжуть гладдю).</text>
  </g>
</svg>`,
  },
  "azhur": {
    title: "Схема розрахунку рапорту та балансу ажуру",
    caption: "Схема структури ажурного ряду: рапорт R, петлі симетрії до та після рапорту, кромкові та закон балансу накидів і убавок.",
    svg: `<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-lace-repeat-title diagram-lace-repeat-desc">
  <title id="diagram-lace-repeat-title">Схема розрахунку рапорту та балансу ажурного візерунка</title>
  <desc id="diagram-lace-repeat-desc">Анатомія ажурного полотна: кромкові петлі, петлі симетрії, кратні рапорти R та закон рівноваги накидів і убавок.</desc>
  <defs>
    <marker id="lace-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="lace-arrow-left" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M8 1L2 5L8 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#2C2C2A">Анатомія ряду ажурного візерунка: розподіл петель</text>
  <rect x="40" y="52" width="600" height="96" rx="12" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.4"/>
  <rect x="40" y="52" width="35" height="96" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="57" y="94" text-anchor="middle" font-size="11" font-weight="700" fill="#5F5E5A">Кр.</text>
  <text x="57" y="112" text-anchor="middle" font-size="9" fill="#7A7870">1 п.</text>
  <rect x="75" y="52" width="65" height="96" fill="#FBF9F5" stroke="#5F5E5A" stroke-width="1"/>
  <text x="107" y="92" text-anchor="middle" font-size="11" font-weight="600" fill="#2C2C2A">До рапорту</text>
  <text x="107" y="110" text-anchor="middle" font-size="10" fill="#0F6E56">симетрія</text>
  <rect x="140" y="52" width="145" height="96" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.8"/>
  <text x="212" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#0F6E56">РАПОРТ 1 (R)</text>
  <text x="212" y="106" text-anchor="middle" font-size="11" fill="#2C2C2A">основний мотив</text>
  <text x="212" y="124" text-anchor="middle" font-size="10" font-weight="600" fill="#0F6E56">R петель</text>
  <rect x="285" y="52" width="145" height="96" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1.8"/>
  <text x="357" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#0F6E56">РАПОРТ 2 (R)</text>
  <text x="357" y="106" text-anchor="middle" font-size="11" fill="#2C2C2A">повторення мотиву</text>
  <text x="357" y="124" text-anchor="middle" font-size="10" font-weight="600" fill="#0F6E56">R петель</text>
  <rect x="430" y="52" width="95" height="96" fill="#F2F9F6" stroke="#0F6E56" stroke-width="1.4" stroke-dasharray="4 2"/>
  <text x="477" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">РАПОРТ k</text>
  <text x="477" y="108" text-anchor="middle" font-size="10" fill="#5F5E5A">... k-й раз</text>
  <rect x="525" y="52" width="80" height="96" fill="#FBF9F5" stroke="#5F5E5A" stroke-width="1"/>
  <text x="565" y="92" text-anchor="middle" font-size="11" font-weight="600" fill="#2C2C2A">Після рапорту</text>
  <text x="565" y="110" text-anchor="middle" font-size="10" fill="#0F6E56">симетрія</text>
  <rect x="605" y="52" width="35" height="96" rx="12" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="622" y="94" text-anchor="middle" font-size="11" font-weight="700" fill="#5F5E5A">Кр.</text>
  <text x="622" y="112" text-anchor="middle" font-size="9" fill="#7A7870">1 п.</text>
  <line x1="40" y1="162" x2="640" y2="162" stroke="#5F5E5A" stroke-width="1.2" marker-start="url(#lace-arrow-left)" marker-end="url(#lace-arrow)"/>
  <text x="340" y="180" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">Загальна кількість петель набору: N = (k × R) + S + 2 кр.</text>
  <rect x="40" y="200" width="600" height="152" rx="14" fill="#F8F6F0" stroke="#E2DCD2" stroke-width="1.2"/>
  <text x="65" y="228" font-size="13" font-weight="700" fill="#2C2C2A">Закон балансу ажуру в кожному ряду та біля пройми:</text>
  <g transform="translate(65, 245)">
    <circle cx="20" cy="20" r="14" fill="#FFFFFF" stroke="#0F6E56" stroke-width="2"/>
    <circle cx="20" cy="20" r="6" fill="none" stroke="#0F6E56" stroke-width="1.8"/>
    <text x="44" y="18" font-size="12" font-weight="700" fill="#0F6E56">Накид (U / yo): +1 петля</text>
    <text x="44" y="34" font-size="11" fill="#5F5E5A">Утворює ажурний отвір (просвіт)</text>
  </g>
  <g transform="translate(350, 245)">
    <circle cx="20" cy="20" r="14" fill="#FFFFFF" stroke="#D85A30" stroke-width="2"/>
    <line x1="13" y1="27" x2="27" y2="13" stroke="#D85A30" stroke-width="2.5" stroke-linecap="round"/>
    <text x="44" y="18" font-size="12" font-weight="700" fill="#993C1D">2 разом лицьовою (k2tog): −1 петля</text>
    <text x="44" y="34" font-size="11" fill="#5F5E5A">Зменшення з нахилом вправо</text>
  </g>
  <rect x="65" y="295" width="550" height="42" rx="8" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1.2"/>
  <text x="340" y="321" text-anchor="middle" font-size="13" font-weight="700" fill="#0F6E56">Баланс ряду: Кількість накидів (+1) = Кількість убавок (−1)</text>
  <g transform="translate(45, 372)">
    <rect x="0" y="0" width="590" height="34" rx="8" fill="#FEF3F2" stroke="#FECDCA" stroke-width="1"/>
    <text x="12" y="21" font-size="11" font-weight="600" fill="#B42318">⚠️ Увага біля пройми та горловини:</text>
    <text x="210" y="21" font-size="11" fill="#475467">якщо для парної убавки не вистачає петель, накид НЕ роблять (в'яжуть гладдю).</text>
  </g>
</svg>`,
  },
  "oversize-fit": {
    title: "Схема конструкції оверсайз джемпера зі спущеним плечем",
    caption: "Викрійка оверсайз джемпера: припуски свободи облягання (+18–30 см), спущене плече, пряма пройма та компенсація довжини рукава.",
    svg: `<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-oversize-fit-title diagram-oversize-fit-desc">
  <title id="diagram-oversize-fit-title">Схема конструкції оверсайз джемпера зі спущеним плечем</title>
  <desc id="diagram-oversize-fit-desc">Викрійка та розрахункові зони оверсайз светра: припуск свободи облягання, спущене плече, пряма пройма та компенсація довжини рукава.</desc>
  <defs>
    <marker id="ov-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="ov-arrow-left" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M8 1L2 5L8 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="#2C2C2A">Конструкція та ключові мірки джемпера Оверсайз</text>
  <path d="M80 185 L180 135 L180 235 L105 240 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M80 185 L65 190 L85 242 L105 240 Z" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="130" y="175" font-size="11" font-weight="600" fill="#2C2C2A">Рукав</text>
  <text x="130" y="195" font-size="10" fill="#0F6E56">вкорочений</text>
  <path d="M600 185 L500 135 L500 235 L575 240 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M600 185 L615 190 L595 242 L575 240 Z" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="550" y="175" text-anchor="middle" font-size="11" font-weight="600" fill="#2C2C2A">Рукав</text>
  <text x="550" y="195" text-anchor="middle" font-size="10" fill="#0F6E56">вкорочений</text>
  <path d="M180 135 L280 120 Q340 135 400 120 L500 135 L500 320 L180 320 Z" fill="#FBF9F5" stroke="#0F6E56" stroke-width="2"/>
  <rect x="180" y="305" width="320" height="15" fill="#EAE7DC" stroke="#0F6E56" stroke-width="1.2"/>
  <text x="340" y="316" text-anchor="middle" font-size="9" fill="#5F5E5A">еластична резинка низу (вільна)</text>
  <path d="M280 120 Q340 160 400 120" fill="#FFFFFF" stroke="#D85A30" stroke-width="2"/>
  <text x="340" y="145" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">Горловина (широка)</text>
  <line x1="240" y1="125" x2="240" y2="235" stroke="#D85A30" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="440" y1="125" x2="440" y2="235" stroke="#D85A30" stroke-width="1.2" stroke-dasharray="3 3"/>
  <text x="238" y="112" text-anchor="end" font-size="10" fill="#D85A30">Анатомічне плече</text>
  <line x1="240" y1="126" x2="180" y2="135" stroke="#D85A30" stroke-width="2"/>
  <text x="205" y="152" font-size="10" font-weight="700" fill="#D85A30">+5–8 см спуск</text>
  <line x1="180" y1="270" x2="500" y2="270" stroke="#0F6E56" stroke-width="1.5" marker-start="url(#ov-arrow-left)" marker-end="url(#ov-arrow)"/>
  <text x="340" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">Ширина полотна = (ОГ + свобода 18–30 см) ÷ 2</text>
  <line x1="490" y1="135" x2="490" y2="235" stroke="#5F5E5A" stroke-width="1" marker-start="url(#ov-arrow-left)" marker-end="url(#ov-arrow)"/>
  <text x="475" y="185" text-anchor="end" font-size="10" fill="#5F5E5A">Глибина пройми 22–26 см</text>
  <rect x="40" y="340" width="600" height="68" rx="10" fill="#F8F6F0" stroke="#E2DCD2" stroke-width="1.2"/>
  <text x="60" y="362" font-size="12" font-weight="700" fill="#2C2C2A">Формула гармонійного оверсайзу:</text>
  <text x="60" y="382" font-size="11" fill="#0F6E56">1. Довжина рукава = Довжина руки − Величина спуску плеча (щоб манжета не закривала пальці).</text>
  <text x="60" y="398" font-size="11" fill="#5F5E5A">2. Скос спущеного плеча = лише 1.5–2.5 см (для плавного драпірування без гострих кутів).</text>
</svg>`,
  },
  "oversayz": {
    title: "Схема конструкції оверсайз джемпера зі спущеним плечем",
    caption: "Викрійка оверсайз джемпера: припуски свободи облягання (+18–30 см), спущене плече, пряма пройма та компенсація довжини рукава.",
    svg: `<svg width="680" height="420" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-oversize-fit-title diagram-oversize-fit-desc">
  <title id="diagram-oversize-fit-title">Схема конструкції оверсайз джемпера зі спущеним плечем</title>
  <desc id="diagram-oversize-fit-desc">Викрійка та розрахункові зони оверсайз светра: припуск свободи облягання, спущене плече, пряма пройма та компенсація довжини рукава.</desc>
  <defs>
    <marker id="ov-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="ov-arrow-left" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M8 1L2 5L8 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="#2C2C2A">Конструкція та ключові мірки джемпера Оверсайз</text>
  <path d="M80 185 L180 135 L180 235 L105 240 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M80 185 L65 190 L85 242 L105 240 Z" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="130" y="175" font-size="11" font-weight="600" fill="#2C2C2A">Рукав</text>
  <text x="130" y="195" font-size="10" fill="#0F6E56">вкорочений</text>
  <path d="M600 185 L500 135 L500 235 L575 240 Z" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M600 185 L615 190 L595 242 L575 240 Z" fill="#EAE7DC" stroke="#5F5E5A" stroke-width="1.2"/>
  <text x="550" y="175" text-anchor="middle" font-size="11" font-weight="600" fill="#2C2C2A">Рукав</text>
  <text x="550" y="195" text-anchor="middle" font-size="10" fill="#0F6E56">вкорочений</text>
  <path d="M180 135 L280 120 Q340 135 400 120 L500 135 L500 320 L180 320 Z" fill="#FBF9F5" stroke="#0F6E56" stroke-width="2"/>
  <rect x="180" y="305" width="320" height="15" fill="#EAE7DC" stroke="#0F6E56" stroke-width="1.2"/>
  <text x="340" y="316" text-anchor="middle" font-size="9" fill="#5F5E5A">еластична резинка низу (вільна)</text>
  <path d="M280 120 Q340 160 400 120" fill="#FFFFFF" stroke="#D85A30" stroke-width="2"/>
  <text x="340" y="145" text-anchor="middle" font-size="11" font-weight="600" fill="#993C1D">Горловина (широка)</text>
  <line x1="240" y1="125" x2="240" y2="235" stroke="#D85A30" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="440" y1="125" x2="440" y2="235" stroke="#D85A30" stroke-width="1.2" stroke-dasharray="3 3"/>
  <text x="238" y="112" text-anchor="end" font-size="10" fill="#D85A30">Анатомічне плече</text>
  <line x1="240" y1="126" x2="180" y2="135" stroke="#D85A30" stroke-width="2"/>
  <text x="205" y="152" font-size="10" font-weight="700" fill="#D85A30">+5–8 см спуск</text>
  <line x1="180" y1="270" x2="500" y2="270" stroke="#0F6E56" stroke-width="1.5" marker-start="url(#ov-arrow-left)" marker-end="url(#ov-arrow)"/>
  <text x="340" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">Ширина полотна = (ОГ + свобода 18–30 см) ÷ 2</text>
  <line x1="490" y1="135" x2="490" y2="235" stroke="#5F5E5A" stroke-width="1" marker-start="url(#ov-arrow-left)" marker-end="url(#ov-arrow)"/>
  <text x="475" y="185" text-anchor="end" font-size="10" fill="#5F5E5A">Глибина пройми 22–26 см</text>
  <rect x="40" y="340" width="600" height="68" rx="10" fill="#F8F6F0" stroke="#E2DCD2" stroke-width="1.2"/>
  <text x="60" y="362" font-size="12" font-weight="700" fill="#2C2C2A">Формула гармонійного оверсайзу:</text>
  <text x="60" y="382" font-size="11" fill="#0F6E56">1. Довжина рукава = Довжина руки − Величина спуску плеча (щоб манжета не закривала пальці).</text>
  <text x="60" y="398" font-size="11" fill="#5F5E5A">2. Скос спущеного плеча = лише 1.5–2.5 см (для плавного драпірування без гострих кутів).</text>
</svg>`,
  },
  "pattern-adaptation": {
    title: "Схема перерахунку опису під іншу пряжу",
    caption: "Порівняння щільності в описі та вашого зразка: формули коефіцієнтів Kp, Kr, масштабування набору та збереження рапортів.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-pattern-adaptation-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-pattern-adaptation-title">Схема адаптації опису в'язання: перерахунок петель та рядів через коефіцієнти Kp і Kr</title>
  <defs>
    <marker id="adapt-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0F6E56" />
    </marker>
    <marker id="adapt-arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#D85A30" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title Bar -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#F1EFE8" stroke="#E2DCD2" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#2C2C2A">ПОРІВНЯННЯ ЩІЛЬНОСТІ: ОПИС (МАЙСТЕР-КЛАС) vs ВАША ПРЯЖА</text>

  <!-- Box 1: Gauge in Pattern -->
  <g transform="translate(35, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#5F5E5A" stroke-width="1.2"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#F4F1EA"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">1. Щільність в описі (МК)</text>

    <!-- Swatch 10x10 representation -->
    <rect x="25" y="42" width="70" height="70" rx="4" fill="#EAE7DC" stroke="#5F5E5A" stroke-dasharray="3 3"/>
    <text x="60" y="80" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">10×10 см</text>

    <text x="110" y="58" font-size="12" font-weight="600" fill="#2C2C2A">P₁ = <tspan fill="#D85A30" font-weight="700">20 п.</tspan> (в 10 см)</text>
    <text x="110" y="76" font-size="11" fill="#5F5E5A">Щільність петель: 2.0 п./см</text>
    
    <text x="110" y="100" font-size="12" font-weight="600" fill="#2C2C2A">R₁ = <tspan fill="#D85A30" font-weight="700">28 р.</tspan> (в 10 см)</text>
    <text x="110" y="118" font-size="11" fill="#5F5E5A">Щільність рядів: 2.8 р./см</text>

    <rect x="15" y="124" width="250" height="18" rx="4" fill="#F8F6F0"/>
    <text x="140" y="137" text-anchor="middle" font-size="10" font-weight="500" fill="#5F5E5A">Приклад деталі: Набір = 100 петель</text>
  </g>

  <!-- Box 2: Knitter's Actual Gauge -->
  <g transform="translate(365, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1.5"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#E1F5EE"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">2. Ваша щільність (зразок після ВТО)</text>

    <!-- Swatch 10x10 representation -->
    <rect x="25" y="42" width="70" height="70" rx="4" fill="#CEEAD6" stroke="#0F6E56" stroke-dasharray="3 3"/>
    <text x="60" y="80" text-anchor="middle" font-size="11" font-weight="600" fill="#0F6E56">10×10 см</text>

    <text x="110" y="58" font-size="12" font-weight="600" fill="#2C2C2A">P₂ = <tspan fill="#0F6E56" font-weight="700">23 п.</tspan> (в 10 см)</text>
    <text x="110" y="76" font-size="11" fill="#5F5E5A">Щільність петель: 2.3 п./см</text>
    
    <text x="110" y="100" font-size="12" font-weight="600" fill="#2C2C2A">R₂ = <tspan fill="#0F6E56" font-weight="700">32 р.</tspan> (в 10 см)</text>
    <text x="110" y="118" font-size="11" fill="#5F5E5A">Щільність рядів: 3.2 р./см</text>

    <rect x="15" y="124" width="250" height="18" rx="4" fill="#E8F5E9"/>
    <text x="140" y="137" text-anchor="middle" font-size="10" font-weight="600" fill="#0F6E56">Потрібно новий розрахунок петель!</text>
  </g>

  <!-- Central Transformation Arrow -->
  <line x1="318" y1="140" x2="360" y2="140" stroke="#0F6E56" stroke-width="2" marker-end="url(#adapt-arrow)"/>

  <!-- Coefficients & Calculation Formula Section -->
  <g transform="translate(35, 230)">
    <rect width="610" height="106" rx="8" fill="#F1EFE8" stroke="#D8D1C5" stroke-width="1.2"/>
    
    <!-- Title -->
    <text x="305" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">ЗОЛОТІ ФОРМУЛИ ПЕРЕРАХУНКУ (МАСШТАБНИЙ КОЕФІЦІЄНТ)</text>

    <!-- Formula Kp -->
    <rect x="20" y="36" width="275" height="58" rx="6" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1"/>
    <text x="35" y="58" font-size="12" font-weight="700" fill="#0F6E56">Коефіцієнт петель Kp:</text>
    <text x="35" y="78" font-size="13" font-weight="700" fill="#2C2C2A">Kp = P₂ ÷ P₁ = 23 ÷ 20 = <tspan fill="#0F6E56">1.15</tspan></text>
    <text x="220" y="60" font-size="10" fill="#5F5E5A">Нові петлі:</text>
    <text x="220" y="78" font-size="11" font-weight="700" fill="#0F6E56">100 × 1.15 = 115 п.</text>

    <!-- Formula Kr -->
    <rect x="315" y="36" width="275" height="58" rx="6" fill="#FFFFFF" stroke="#D85A30" stroke-width="1"/>
    <text x="330" y="58" font-size="12" font-weight="700" fill="#D85A30">Коефіцієнт рядів Kr:</text>
    <text x="330" y="78" font-size="13" font-weight="700" fill="#2C2C2A">Kr = R₂ ÷ R₁ = 32 ÷ 28 = <tspan fill="#D85A30">1.143</tspan></text>
    <text x="515" y="60" font-size="10" fill="#5F5E5A">Нові ряди:</text>
    <text x="515" y="78" font-size="11" font-weight="700" fill="#D85A30">56 × 1.143 ≈ 64 р.</text>
  </g>

  <!-- Bottom Rules Note: 3 Key Golden Rules -->
  <g transform="translate(35, 348)">
    <rect width="610" height="68" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <circle cx="20" cy="22" r="8" fill="#0F6E56"/>
    <text x="20" y="26" text-anchor="middle" font-size="10" font-weight="700" fill="#FFFFFF">!</text>
    <text x="38" y="24" font-size="11" font-weight="700" fill="#2C2C2A">3 ПРАВИЛА УЗГОДЖЕННЯ НОВИХ ПЕТЕЛЬ:</text>
    
    <text x="38" y="42" font-size="10.5" fill="#5F5E5A">1. <tspan font-weight="600" fill="#2C2C2A">Рапорт візерунка:</tspan> округлюйте 115 п. до найближчого кратного рапорту (наприклад, 114 п. або 116 п.).</text>
    <text x="38" y="58" font-size="10.5" fill="#5F5E5A">2. <tspan font-weight="600" fill="#2C2C2A">Симетрія убавок:</tspan> глибину пройми та вирізу контролюйте в сантиметрах, а не в абстрактних рядах опису.</text>
  </g>
</svg>`,
  },
  "adaptatsiya": {
    title: "Схема перерахунку опису під іншу пряжу",
    caption: "Порівняння щільності в описі та вашого зразка: формули коефіцієнтів Kp, Kr, масштабування набору та збереження рапортів.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-pattern-adaptation-title-alias" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-pattern-adaptation-title-alias">Схема адаптації опису в'язання</title>
  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#F1EFE8" stroke="#E2DCD2" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#2C2C2A">ПОРІВНЯННЯ ЩІЛЬНОСТІ: ОПИС (МАЙСТЕР-КЛАС) vs ВАША ПРЯЖА</text>
  <g transform="translate(35, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#5F5E5A" stroke-width="1.2"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#F4F1EA"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">1. Щільність в описі (МК)</text>
    <rect x="25" y="42" width="70" height="70" rx="4" fill="#EAE7DC" stroke="#5F5E5A" stroke-dasharray="3 3"/>
    <text x="60" y="80" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">10×10 см</text>
    <text x="110" y="58" font-size="12" font-weight="600" fill="#2C2C2A">P₁ = 20 п. в 10 см</text>
    <text x="110" y="100" font-size="12" font-weight="600" fill="#2C2C2A">R₁ = 28 р. в 10 см</text>
  </g>
  <g transform="translate(365, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1.5"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#E1F5EE"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">2. Ваша щільність</text>
    <rect x="25" y="42" width="70" height="70" rx="4" fill="#CEEAD6" stroke="#0F6E56" stroke-dasharray="3 3"/>
    <text x="60" y="80" text-anchor="middle" font-size="11" font-weight="600" fill="#0F6E56">10×10 см</text>
    <text x="110" y="58" font-size="12" font-weight="600" fill="#2C2C2A">P₂ = 23 п. в 10 см</text>
    <text x="110" y="100" font-size="12" font-weight="600" fill="#2C2C2A">R₂ = 32 р. в 10 см</text>
  </g>
  <g transform="translate(35, 230)">
    <rect width="610" height="106" rx="8" fill="#F1EFE8" stroke="#D8D1C5" stroke-width="1.2"/>
    <text x="305" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">ЗОЛОТІ ФОРМУЛИ ПЕРЕРАХУНКУ</text>
    <rect x="20" y="36" width="275" height="58" rx="6" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1"/>
    <text x="35" y="58" font-size="12" font-weight="700" fill="#0F6E56">Kp = P₂ ÷ P₁ = 1.15</text>
    <text x="35" y="78" font-size="12" fill="#2C2C2A">Нові петлі = Петлі_МК × 1.15</text>
    <rect x="315" y="36" width="275" height="58" rx="6" fill="#FFFFFF" stroke="#D85A30" stroke-width="1"/>
    <text x="330" y="58" font-size="12" font-weight="700" fill="#D85A30">Kr = R₂ ÷ R₁ = 1.143</text>
    <text x="330" y="78" font-size="12" fill="#2C2C2A">Нові ряди = Ряди_МК × 1.143</text>
  </g>
</svg>`,
  },
  "cables-gauge-shaping": {
    title: "Схема розрахунку светра з косами",
    caption: "Порівняння щільності лицьової гладі та кіс: коефіцієнт стягування полотна (+20–40%), прибавки в останньому ряду резинки та симетрія рапортів.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-cables-gauge-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-cables-gauge-title">Схема розрахунку светра з косами: компенсація стягування полотна та перехід від резинки</title>
  <defs>
    <marker id="cable-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0F6E56" />
    </marker>
    <marker id="cable-arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#D85A30" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#F1EFE8" stroke="#E2DCD2" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#2C2C2A">АНАТОМІЯ СТЯГУВАННЯ: ЛИЦЬОВА ГЛАДЬ vs РЕЛЬЄФНІ КОСИ / АРАНИ</text>

  <!-- Box 1: Stockinette Swatch -->
  <g transform="translate(35, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#5F5E5A" stroke-width="1.2"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#F4F1EA"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">1. Лицьова гладь (базова)</text>

    <!-- Visual Swatch -->
    <rect x="20" y="42" width="80" height="60" rx="4" fill="#EAE7DC" stroke="#5F5E5A" stroke-dasharray="3 3"/>
    <text x="60" y="76" text-anchor="middle" font-size="11" font-weight="600" fill="#5F5E5A">10 см = 20 п.</text>

    <text x="115" y="58" font-size="12" font-weight="600" fill="#2C2C2A">Ширина деталі: <tspan font-weight="700" fill="#0F6E56">50 см</tspan></text>
    <text x="115" y="78" font-size="12" fill="#5F5E5A">Петлі: 50 × 2.0 = <tspan font-weight="700" fill="#2C2C2A">100 п.</tspan></text>
    <text x="115" y="98" font-size="11" fill="#5F5E5A">Коефіцієнт: 1.00 (база)</text>

    <rect x="15" y="118" width="250" height="22" rx="4" fill="#F8F6F0"/>
    <text x="140" y="133" text-anchor="middle" font-size="10.5" font-weight="500" fill="#5F5E5A">Резинка низу 2×2: 84–90 петель</text>
  </g>

  <!-- Box 2: Cable Swatch -->
  <g transform="translate(365, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1.5"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#E1F5EE"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">2. Полотно з косами / аранами</text>

    <!-- Visual Swatch with Cable icon -->
    <rect x="20" y="42" width="80" height="60" rx="4" fill="#CEEAD6" stroke="#0F6E56"/>
    <path d="M40 50 Q50 60 40 70 Q30 80 40 90" fill="none" stroke="#0F6E56" stroke-width="2.5"/>
    <path d="M60 50 Q70 60 60 70 Q50 80 60 90" fill="none" stroke="#0F6E56" stroke-width="2.5"/>
    <path d="M80 50 Q90 60 80 70 Q70 80 80 90" fill="none" stroke="#0F6E56" stroke-width="2.5"/>

    <text x="115" y="58" font-size="12" font-weight="600" fill="#2C2C2A">Ширина деталі: <tspan font-weight="700" fill="#0F6E56">50 см</tspan></text>
    <text x="115" y="78" font-size="12" font-weight="700" fill="#0F6E56">10 см = 25–28 петель</text>
    <text x="115" y="98" font-size="12" fill="#2C2C2A">Потрібно: <tspan font-weight="700" fill="#D85A30">125–135 п.</tspan></text>

    <rect x="15" y="118" width="250" height="22" rx="4" fill="#E8F5E9"/>
    <text x="140" y="133" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0F6E56">+25–35 петель різниці!</text>
  </g>

  <!-- Central Transformation Arrow -->
  <line x1="320" y1="140" x2="360" y2="140" stroke="#0F6E56" stroke-width="2" marker-end="url(#cable-arrow)"/>

  <!-- Transition Strategy: Where to add stitches -->
  <g transform="translate(35, 230)">
    <rect width="610" height="106" rx="8" fill="#F1EFE8" stroke="#D8D1C5" stroke-width="1.2"/>
    <text x="305" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">ТЕХНІКА БЕЗДОГАННОГО ПЕРЕХОДУ: РЕЗИНКА ➔ АРАНИ</text>

    <!-- Step A -->
    <rect x="20" y="36" width="275" height="58" rx="6" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1"/>
    <text x="35" y="56" font-size="11.5" font-weight="700" fill="#0F6E56">1. В'язання резинки манжети / низу:</text>
    <text x="35" y="74" font-size="11" fill="#2C2C2A">Спиці на 0.5–1.0 мм тонші. Набір 90 п.</text>
    <text x="35" y="88" font-size="10" fill="#5F5E5A">Резинка не розширюється дзвіночком.</text>

    <!-- Step B -->
    <rect x="315" y="36" width="275" height="58" rx="6" fill="#FFFFFF" stroke="#D85A30" stroke-width="1"/>
    <text x="330" y="56" font-size="11.5" font-weight="700" fill="#D85A30">2. Останній виворітний ряд резинки:</text>
    <text x="330" y="74" font-size="11" font-weight="700" fill="#2C2C2A">Рівномірні прибавки +28 п. з протяжки</text>
    <text x="330" y="88" font-size="10" fill="#5F5E5A">Додавати в центрі майбутніх кіс (непомітно!).</text>
  </g>

  <!-- Bottom Rules Note -->
  <g transform="translate(35, 348)">
    <rect width="610" height="68" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <circle cx="20" cy="22" r="8" fill="#D85A30"/>
    <text x="20" y="26" text-anchor="middle" font-size="10" font-weight="700" fill="#FFFFFF">!</text>
    <text x="38" y="24" font-size="11" font-weight="700" fill="#2C2C2A">ФОРМУЛА ВИТРАТИ ПРЯЖІ ТА ЦЕНТРУВАННЯ:</text>
    
    <text x="38" y="42" font-size="10.5" fill="#5F5E5A">1. <tspan font-weight="600" fill="#2C2C2A">Витрата пряжі:</tspan> закладайте +25–35% до ваги (650–850 г замість 500 г для лицьової гладі).</text>
    <text x="38" y="58" font-size="10.5" fill="#5F5E5A">2. <tspan font-weight="600" fill="#2C2C2A">Симетрія рапортів:</tspan> головну центральну косу виставляйте строго по осі переду/спинки.</text>
  </g>
</svg>`,
  },
  "kosy": {
    title: "Схема розрахунку светра з косами",
    caption: "Порівняння щільності лицьової гладі та кіс: коефіцієнт стягування полотна (+20–40%), прибавки в останньому ряду резинки та симетрія рапортів.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-cables-gauge-title-alias" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-cables-gauge-title-alias">Схема розрахунку светра з косами</title>
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#F1EFE8" stroke="#E2DCD2" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#2C2C2A">АНАТОМІЯ СТЯГУВАННЯ: ЛИЦЬОВА ГЛАДЬ vs РЕЛЬЄФНІ КОСИ</text>
  <g transform="translate(35, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#5F5E5A" stroke-width="1.2"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#F4F1EA"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#2C2C2A">1. Лицьова гладь: 20 п. = 10 см</text>
    <text x="20" y="70" font-size="12" fill="#2C2C2A">Ширина 50 см = 100 петель</text>
  </g>
  <g transform="translate(365, 66)">
    <rect width="280" height="150" rx="8" fill="#FFFFFF" stroke="#0F6E56" stroke-width="1.5"/>
    <rect x="0" y="0" width="280" height="28" rx="8" fill="#E1F5EE"/>
    <text x="140" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F6E56">2. Полотно з косами: 26 п. = 10 см</text>
    <text x="20" y="70" font-size="12" fill="#2C2C2A">Ширина 50 см = 130 петель (+30%)</text>
  </g>
  <g transform="translate(35, 230)">
    <rect width="610" height="106" rx="8" fill="#F1EFE8" stroke="#D8D1C5" stroke-width="1.2"/>
    <text x="305" y="35" text-anchor="middle" font-size="13" font-weight="700" fill="#2C2C2A">ПРИБАВКИ ПІСЛЯ РЕЗИНКИ</text>
    <text x="305" y="70" text-anchor="middle" font-size="12" fill="#5F5E5A">Додавайте різницю у 20–30 петель в останньому виворітному ряду резинки</text>
  </g>
</svg>`,
  },
  "tunic-silhouette-proportions": {
    title: "Схема розрахунку туніки: пропорції та А-силует",
    caption: "Інженерний розрахунок туніки: формула довжини від зросту (×0,37 + 3–5 см), розрахунок розширення А-силуету до низу та бічні розрізи 10–15 см.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-tunic-proportions-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-tunic-proportions-title">Схема розрахунку туніки: пропорції довжини, А-силует та бічні розрізи</title>
  <defs>
    <marker id="tunic-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284C7" />
    </marker>
    <marker id="tunic-arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0D9488" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#F0F9FF" stroke="#BAE6FD" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#0369A1">АНАТОМІЯ ТУНІКИ: ПРОПОРЦІЇ ЗРОСТУ, А-СИЛУЕТ ТА БІЧНІ РОЗРІЗИ</text>

  <!-- Box 1: Proportions & Height Formula -->
  <g transform="translate(35, 66)">
    <rect width="285" height="185" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3"/>
    <rect x="0" y="0" width="285" height="28" rx="8" fill="#E0F2FE"/>
    <text x="142" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0369A1">1. Формула довжини та зріст</text>

    <!-- Formula badge -->
    <rect x="15" y="38" width="255" height="32" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="142" y="59" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0F172A">L = Зріст × 0,37 + 3–5 см</text>

    <text x="20" y="92" font-size="11.5" fill="#475569">• Звичайний светр: <tspan font-weight="600" fill="#64748B">50–58 см</tspan></text>
    <text x="20" y="112" font-size="11.5" fill="#475569">• Туніка (довжина): <tspan font-weight="700" fill="#0284C7">65–78 см (+15–20 см)</tspan></text>
    <text x="20" y="132" font-size="11.5" fill="#475569">• Точка завершення: середина стегна</text>
    <text x="20" y="152" font-size="11.5" fill="#475569">• Рукав: <tspan font-weight="700" fill="#0284C7">7/8 (-5–7 см)</tspan> для балансу зросту</text>

    <rect x="15" y="160" width="255" height="18" rx="4" fill="#F0FDF4"/>
    <text x="142" y="173" text-anchor="middle" font-size="10" font-weight="700" fill="#15803D">✓ Ноги виглядають візуально довшими</text>
  </g>

  <!-- Box 2: A-line expansion & shaping -->
  <g transform="translate(360, 66)">
    <rect width="285" height="185" rx="8" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.3"/>
    <rect x="0" y="0" width="285" height="28" rx="8" fill="#CCFBF1"/>
    <text x="142" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F766E">2. Розрахунок А-силуету</text>

    <!-- Formula badge -->
    <rect x="15" y="38" width="255" height="32" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="142" y="59" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0F172A">Розширення = (Ш_низу − Ш_грудей) ÷ 2</text>

    <text x="20" y="92" font-size="11.5" fill="#475569">• Добавка з кожного боку: <tspan font-weight="700" fill="#0D9488">+2–4 см (6–8 п.)</tspan></text>
    <text x="20" y="112" font-size="11.5" fill="#475569">• Ритм: <tspan font-weight="600" fill="#0F172A">Довжина в рядах ÷ к-сть добавок</tspan></text>
    <text x="20" y="132" font-size="11.5" fill="#475569">• Типовий крок: <tspan font-weight="700" fill="#0D9488">кожен 16–19-й ряд</tspan></text>
    <text x="20" y="152" font-size="11.5" fill="#475569">• Перепад талія-стегна: Δ = (ОС - ОТ) ÷ 2</text>

    <rect x="15" y="160" width="255" height="18" rx="4" fill="#F0FDFA"/>
    <text x="142" y="173" text-anchor="middle" font-size="10" font-weight="700" fill="#0F766E">✓ М'яке розширення без зайвих складок</text>
  </g>

  <!-- Bottom Details: Side Slits & Yarn Consumption -->
  <g transform="translate(35, 268)">
    <rect width="610" height="142" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="610" height="26" rx="8" fill="#F5F3EF"/>
    <text x="305" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">3. ТЕХНІЧНІ ОСОБЛИВОСТІ: БІЧНІ РОЗРІЗИ ТА ВИТРАТА ПРЯЖІ</text>

    <!-- Sub-block A: Side slits -->
    <g transform="translate(20, 36)">
      <rect width="270" height="92" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="12" font-weight="700" fill="#0369A1">Бічні розрізи (10–15 см):</text>
      <text x="15" y="42" font-size="11" fill="#475569">• Початок розширення — на 5–7 см вище розрізу</text>
      <text x="15" y="60" font-size="11" fill="#475569">• Запобігають деформації та натягу на стегнах</text>
      <text x="15" y="78" font-size="11" font-weight="600" fill="#0284C7">• Гармонійно полегшують довге полотно</text>
    </g>

    <!-- Sub-block B: Yarn consumption -->
    <g transform="translate(315, 36)">
      <rect width="275" height="92" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="12" font-weight="700" fill="#D97706">Витрата пряжі (+20–30%):</text>
      <text x="15" y="42" font-size="11" fill="#475569">• Розмір 48: светр 500 г → туніка <tspan font-weight="700" fill="#D97706">600–650 г</tspan></text>
      <text x="15" y="60" font-size="11" fill="#475569">• Кожні +5 см довжини додають 35–40 г</text>
      <text x="15" y="78" font-size="11" font-weight="600" fill="#B45309">• Рекомендовано: +2 мотки запасу на проект</text>
    </g>
  </g>
</svg>`,
  },
  "tunika": {
    title: "Схема розрахунку туніки",
    caption: "Пропорції туніки: формула довжини за зростом, ритм добавок А-силуету та оформлення бічних розрізів.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-tunic-proportions-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-tunic-proportions-title">Схема розрахунку туніки: пропорції довжини, А-силует та бічні розрізи</title>
  <defs>
    <marker id="tunic-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284C7" />
    </marker>
    <marker id="tunic-arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0D9488" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#F0F9FF" stroke="#BAE6FD" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#0369A1">АНАТОМІЯ ТУНІКИ: ПРОПОРЦІЇ ЗРОСТУ, А-СИЛУЕТ ТА БІЧНІ РОЗРІЗИ</text>

  <!-- Box 1: Proportions & Height Formula -->
  <g transform="translate(35, 66)">
    <rect width="285" height="185" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3"/>
    <rect x="0" y="0" width="285" height="28" rx="8" fill="#E0F2FE"/>
    <text x="142" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0369A1">1. Формула довжини та зріст</text>

    <!-- Formula badge -->
    <rect x="15" y="38" width="255" height="32" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="142" y="59" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0F172A">L = Зріст × 0,37 + 3–5 см</text>

    <text x="20" y="92" font-size="11.5" fill="#475569">• Звичайний светр: <tspan font-weight="600" fill="#64748B">50–58 см</tspan></text>
    <text x="20" y="112" font-size="11.5" fill="#475569">• Туніка (довжина): <tspan font-weight="700" fill="#0284C7">65–78 см (+15–20 см)</tspan></text>
    <text x="20" y="132" font-size="11.5" fill="#475569">• Точка завершення: середина стегна</text>
    <text x="20" y="152" font-size="11.5" fill="#475569">• Рукав: <tspan font-weight="700" fill="#0284C7">7/8 (-5–7 см)</tspan> для балансу зросту</text>

    <rect x="15" y="160" width="255" height="18" rx="4" fill="#F0FDF4"/>
    <text x="142" y="173" text-anchor="middle" font-size="10" font-weight="700" fill="#15803D">✓ Ноги виглядають візуально довшими</text>
  </g>

  <!-- Box 2: A-line expansion & shaping -->
  <g transform="translate(360, 66)">
    <rect width="285" height="185" rx="8" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.3"/>
    <rect x="0" y="0" width="285" height="28" rx="8" fill="#CCFBF1"/>
    <text x="142" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F766E">2. Розрахунок А-силуету</text>

    <!-- Formula badge -->
    <rect x="15" y="38" width="255" height="32" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="142" y="59" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0F172A">Розширення = (Ш_низу − Ш_грудей) ÷ 2</text>

    <text x="20" y="92" font-size="11.5" fill="#475569">• Добавка з кожного боку: <tspan font-weight="700" fill="#0D9488">+2–4 см (6–8 п.)</tspan></text>
    <text x="20" y="112" font-size="11.5" fill="#475569">• Ритм: <tspan font-weight="600" fill="#0F172A">Довжина в рядах ÷ к-сть добавок</tspan></text>
    <text x="20" y="132" font-size="11.5" fill="#475569">• Типовий крок: <tspan font-weight="700" fill="#0D9488">кожен 16–19-й ряд</tspan></text>
    <text x="20" y="152" font-size="11.5" fill="#475569">• Перепад талія-стегна: Δ = (ОС - ОТ) ÷ 2</text>

    <rect x="15" y="160" width="255" height="18" rx="4" fill="#F0FDFA"/>
    <text x="142" y="173" text-anchor="middle" font-size="10" font-weight="700" fill="#0F766E">✓ М'яке розширення без зайвих складок</text>
  </g>

  <!-- Bottom Details: Side Slits & Yarn Consumption -->
  <g transform="translate(35, 268)">
    <rect width="610" height="142" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="610" height="26" rx="8" fill="#F5F3EF"/>
    <text x="305" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">3. ТЕХНІЧНІ ОСОБЛИВОСТІ: БІЧНІ РОЗРІЗИ ТА ВИТРАТА ПРЯЖІ</text>

    <!-- Sub-block A: Side slits -->
    <g transform="translate(20, 36)">
      <rect width="270" height="92" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="12" font-weight="700" fill="#0369A1">Бічні розрізи (10–15 см):</text>
      <text x="15" y="42" font-size="11" fill="#475569">• Початок розширення — на 5–7 см вище розрізу</text>
      <text x="15" y="60" font-size="11" fill="#475569">• Запобігають деформації та натягу на стегнах</text>
      <text x="15" y="78" font-size="11" font-weight="600" fill="#0284C7">• Гармонійно полегшують довге полотно</text>
    </g>

    <!-- Sub-block B: Yarn consumption -->
    <g transform="translate(315, 36)">
      <rect width="275" height="92" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="12" font-weight="700" fill="#D97706">Витрата пряжі (+20–30%):</text>
      <text x="15" y="42" font-size="11" fill="#475569">• Розмір 48: светр 500 г → туніка <tspan font-weight="700" fill="#D97706">600–650 г</tspan></text>
      <text x="15" y="60" font-size="11" fill="#475569">• Кожні +5 см довжини додають 35–40 г</text>
      <text x="15" y="78" font-size="11" font-weight="600" fill="#B45309">• Рекомендовано: +2 мотки запасу на проект</text>
    </g>
  </g>
</svg>`,
  },
  "jacket-pattern-construction": {
    title: "Схема викрійки жакета: полички, спинка та вшивний рукав",
    caption: "Інженерний розрахунок жакета: ширина спинки (½ ОГ + 2–4 см), поличка з планкою під ґудзики (¼ ОГ + 2–3 см + 3–5 см), окат вшивного рукава та оформлення коміра.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-jacket-pattern-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-jacket-pattern-title">Схема розрахунку викрійки жакета: спинка, полички, планка, вшивний рукав та комір</title>
  <defs>
    <marker id="jacket-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#4338CA" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#3730A3">КОНСТРУКЦІЯ ЖАКЕТА: СПИНКА, ПОЛИЧКИ З ПЛАНКОЮ ТА ВШИВНИЙ РУКАВ</text>

  <!-- Box 1: Back (Спинка) -->
  <g transform="translate(30, 66)">
    <rect width="195" height="195" rx="8" fill="#FFFFFF" stroke="#4338CA" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#E0E7FF"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#3730A3">1. Спинка</text>

    <!-- Visual schematic shape -->
    <path d="M 30 42 L 165 42 L 165 110 L 150 110 L 150 155 L 45 155 L 45 110 L 30 110 Z" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
    <text x="97" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="#4338CA">½ ОГ + 2–4 см</text>

    <text x="15" y="174" font-size="11" fill="#475569">• Пройма: <tspan font-weight="700" fill="#3730A3">19–23 см</tspan></text>
    <text x="15" y="190" font-size="11" fill="#475569">• Скіс плеча: <tspan font-weight="600" fill="#1E1B4B">2–3 см</tspan></text>
  </g>

  <!-- Box 2: Fronts & Placket (Полички з планкою) -->
  <g transform="translate(242, 66)">
    <rect width="195" height="195" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#E0F2FE"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0369A1">2. Полички з планкою</text>

    <!-- Visual schematic shape with button placket -->
    <path d="M 30 42 L 135 42 L 135 155 L 45 155 L 45 110 L 30 110 Z" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.2"/>
    <rect x="135" y="42" width="25" height="113" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.2"/>
    <circle cx="147" cy="65" r="3.5" fill="#0369A1"/>
    <circle cx="147" cy="95" r="3.5" fill="#0369A1"/>
    <circle cx="147" cy="125" r="3.5" fill="#0369A1"/>

    <text x="97" y="138" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369A1">¼ ОГ + 2–3 см + Планка</text>

    <text x="15" y="174" font-size="11" fill="#475569">• Планка: <tspan font-weight="700" fill="#0369A1">3–5 см</tspan> (петлі)</text>
    <text x="15" y="190" font-size="11" fill="#475569">• Крок ґудзиків: <tspan font-weight="600" fill="#0F172A">8–10 см</tspan></text>
  </g>

  <!-- Box 3: Set-in Sleeve (Вшивний рукав з окатом) -->
  <g transform="translate(455, 66)">
    <rect width="195" height="195" rx="8" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#CCFBF1"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F766E">3. Вшивний рукав</text>

    <!-- Visual schematic sleeve cap -->
    <path d="M 35 155 L 60 85 Q 97 42 135 85 L 160 155 Z" fill="#F0FDFA" stroke="#0D9488" stroke-width="1.2"/>
    <text x="97" y="115" text-anchor="middle" font-size="11" font-weight="700" fill="#0F766E">Окат: 14–16 см</text>

    <text x="15" y="174" font-size="11" fill="#475569">• Висота = Пройма − <tspan font-weight="700" fill="#0D9488">2–4 см</tspan></text>
    <text x="15" y="190" font-size="11" fill="#475569">• Закриття: <tspan font-weight="600" fill="#0F172A">3–2–1–...–1–2–3</tspan></text>
  </g>

  <!-- Bottom Details: Collar, lapel, and placket construction -->
  <g transform="translate(30, 276)">
    <rect width="620" height="135" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="620" height="26" rx="8" fill="#F5F3EF"/>
    <text x="310" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">4. ТЕХНОЛОГІЯ ОБРОБКИ: КОМІР, ЛАЦКАНИ ТА СТАБІЛЬНІСТЬ КРАЇВ</text>

    <!-- Sub-block A -->
    <g transform="translate(20, 36)">
      <rect width="280" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="11.5" font-weight="700" fill="#4338CA">Комір (англійський або шалька):</text>
      <text x="15" y="42" font-size="10.5" fill="#475569">• Набирається по краю горловини та лацканів</text>
      <text x="15" y="58" font-size="10.5" fill="#475569">• Висота стійки: 6–8 см, розширення до кутів</text>
      <text x="15" y="74" font-size="10.5" font-weight="600" fill="#3730A3">• Вкорочені ряди для бездоганного перегину</text>
    </g>

    <!-- Sub-block B -->
    <g transform="translate(320, 36)">
      <rect width="280" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="11.5" font-weight="700" fill="#0D9488">Планка під ґудзики та стабільність:</text>
      <text x="15" y="42" font-size="10.5" fill="#475569">• Спиці на 0.5–1.0 мм менші за основне полотно</text>
      <text x="15" y="58" font-size="10.5" fill="#475569">• Подвійна резинка або платочна в'язка (не косить)</text>
      <text x="15" y="74" font-size="10.5" font-weight="600" fill="#0F766E">• Витрата пряжі: 600–750 г для 48 розміру</text>
    </g>
  </g>
</svg>`,
  },
  "zhaket": {
    title: "Схема розрахунку жакета",
    caption: "Конструкція в'язаного жакета: викрійка спинки, поличок, планки з петлями та класичного оката рукава.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-jacket-pattern-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-jacket-pattern-title">Схема розрахунку викрійки жакета: спинка, полички, планка, вшивний рукав та комір</title>
  <defs>
    <marker id="jacket-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#4338CA" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#3730A3">КОНСТРУКЦІЯ ЖАКЕТА: СПИНКА, ПОЛИЧКИ З ПЛАНКОЮ ТА ВШИВНИЙ РУКАВ</text>

  <!-- Box 1: Back (Спинка) -->
  <g transform="translate(30, 66)">
    <rect width="195" height="195" rx="8" fill="#FFFFFF" stroke="#4338CA" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#E0E7FF"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#3730A3">1. Спинка</text>

    <!-- Visual schematic shape -->
    <path d="M 30 42 L 165 42 L 165 110 L 150 110 L 150 155 L 45 155 L 45 110 L 30 110 Z" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.2"/>
    <text x="97" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="#4338CA">½ ОГ + 2–4 см</text>

    <text x="15" y="174" font-size="11" fill="#475569">• Пройма: <tspan font-weight="700" fill="#3730A3">19–23 см</tspan></text>
    <text x="15" y="190" font-size="11" fill="#475569">• Скіс плеча: <tspan font-weight="600" fill="#1E1B4B">2–3 см</tspan></text>
  </g>

  <!-- Box 2: Fronts & Placket (Полички з планкою) -->
  <g transform="translate(242, 66)">
    <rect width="195" height="195" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#E0F2FE"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0369A1">2. Полички з планкою</text>

    <!-- Visual schematic shape with button placket -->
    <path d="M 30 42 L 135 42 L 135 155 L 45 155 L 45 110 L 30 110 Z" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.2"/>
    <rect x="135" y="42" width="25" height="113" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.2"/>
    <circle cx="147" cy="65" r="3.5" fill="#0369A1"/>
    <circle cx="147" cy="95" r="3.5" fill="#0369A1"/>
    <circle cx="147" cy="125" r="3.5" fill="#0369A1"/>

    <text x="97" y="138" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369A1">¼ ОГ + 2–3 см + Планка</text>

    <text x="15" y="174" font-size="11" fill="#475569">• Планка: <tspan font-weight="700" fill="#0369A1">3–5 см</tspan> (петлі)</text>
    <text x="15" y="190" font-size="11" fill="#475569">• Крок ґудзиків: <tspan font-weight="600" fill="#0F172A">8–10 см</tspan></text>
  </g>

  <!-- Box 3: Set-in Sleeve (Вшивний рукав з окатом) -->
  <g transform="translate(455, 66)">
    <rect width="195" height="195" rx="8" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#CCFBF1"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0F766E">3. Вшивний рукав</text>

    <!-- Visual schematic sleeve cap -->
    <path d="M 35 155 L 60 85 Q 97 42 135 85 L 160 155 Z" fill="#F0FDFA" stroke="#0D9488" stroke-width="1.2"/>
    <text x="97" y="115" text-anchor="middle" font-size="11" font-weight="700" fill="#0F766E">Окат: 14–16 см</text>

    <text x="15" y="174" font-size="11" fill="#475569">• Висота = Пройма − <tspan font-weight="700" fill="#0D9488">2–4 см</tspan></text>
    <text x="15" y="190" font-size="11" fill="#475569">• Закриття: <tspan font-weight="600" fill="#0F172A">3–2–1–...–1–2–3</tspan></text>
  </g>

  <!-- Bottom Details: Collar, lapel, and placket construction -->
  <g transform="translate(30, 276)">
    <rect width="620" height="135" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="620" height="26" rx="8" fill="#F5F3EF"/>
    <text x="310" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">4. ТЕХНОЛОГІЯ ОБРОБКИ: КОМІР, ЛАЦКАНИ ТА СТАБІЛЬНІСТЬ КРАЇВ</text>

    <!-- Sub-block A -->
    <g transform="translate(20, 36)">
      <rect width="280" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="11.5" font-weight="700" fill="#4338CA">Комір (англійський або шалька):</text>
      <text x="15" y="42" font-size="10.5" fill="#475569">• Набирається по краю горловини та лацканів</text>
      <text x="15" y="58" font-size="10.5" fill="#475569">• Висота стійки: 6–8 см, розширення до кутів</text>
      <text x="15" y="74" font-size="10.5" font-weight="600" fill="#3730A3">• Вкорочені ряди для бездоганного перегину</text>
    </g>

    <!-- Sub-block B -->
    <g transform="translate(320, 36)">
      <rect width="280" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="22" font-size="11.5" font-weight="700" fill="#0D9488">Планка під ґудзики та стабільність:</text>
      <text x="15" y="42" font-size="10.5" fill="#475569">• Спиці на 0.5–1.0 мм менші за основне полотно</text>
      <text x="15" y="58" font-size="10.5" fill="#475569">• Подвійна резинка або платочна в'язка (не косить)</text>
      <text x="15" y="74" font-size="10.5" font-weight="600" fill="#0F766E">• Витрата пряжі: 600–750 г для 48 розміру</text>
    </g>
  </g>
</svg>`,
  },
  "dolman-sleeve-construction": {
    title: "Конструкція рукава «летюча миша»",
    caption: "Схема суцільнокроєного рукава «летюча миша»: розмах зап'ясть, кут розширення, глибина пройми та напрямки в'язання.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-dolman-pattern-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-dolman-pattern-title">Схема крою рукава «летюча миша»: суцільнокроєна конструкція, кут нахилу, розширення та манжети</title>
  <defs>
    <marker id="dolman-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#D97706" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Header Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E">КОНСТРУКЦІЯ РУКАВА «ЛЕТЮЧА МИША»: СУЦІЛЬНОКРОЄНЕ РОЗШИРЕННЯ ТА ПРОПОРЦІЇ</text>

  <!-- Left: Visual Silhouette Shape -->
  <g transform="translate(30, 66)">
    <rect width="320" height="230" rx="8" fill="#FFFFFF" stroke="#D97706" stroke-width="1.3"/>
    <rect x="0" y="0" width="320" height="28" rx="8" fill="#FEF3C7"/>
    <text x="160" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#92400E">1. Викрійка: цільне полотно (рукав + корпус)</text>

    <!-- Dolman silhouette path -->
    <!-- Neckline -->
    <path d="M 130 50 Q 160 62 190 50 L 300 85 L 290 120 L 220 125 Q 185 140 185 210 L 135 210 Q 135 140 100 125 L 30 120 L 20 85 Z" fill="#FFFBEB" stroke="#D97706" stroke-width="1.6"/>

    <!-- Labels on shape -->
    <text x="160" y="58" text-anchor="middle" font-size="10" font-weight="600" fill="#B45309">Горловина</text>
    <text x="160" y="190" text-anchor="middle" font-size="11" font-weight="700" fill="#92400E">½ ОГ + свобода</text>
    <text x="25" y="105" font-size="9.5" font-weight="600" fill="#B45309">Манжета</text>
    <text x="260" y="105" font-size="9.5" font-weight="600" fill="#B45309">Манжета</text>

    <!-- Dimension annotations -->
    <line x1="20" y1="42" x2="300" y2="42" stroke="#B45309" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="160" y="38" text-anchor="middle" font-size="10" font-weight="700" fill="#B45309">Розмах від зап'ястя до зап'ястя: 140–155 см</text>

    <!-- Angle indicator -->
    <path d="M 185 210 Q 185 155 220 125" fill="none" stroke="#DC2626" stroke-width="1.8" stroke-dasharray="2 2"/>
    <text x="215" y="165" font-size="10.5" font-weight="700" fill="#DC2626">Кут: 28–35°</text>
  </g>

  <!-- Right: 3 Key Parameters Cards -->
  <g transform="translate(365, 66)">
    <rect width="285" height="230" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3"/>
    <rect x="0" y="0" width="285" height="28" rx="8" fill="#E0F2FE"/>
    <text x="142" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0369A1">2. Ключові параметри розрахунку</text>

    <!-- Item A -->
    <g transform="translate(14, 38)">
      <rect width="257" height="52" rx="6" fill="#F0F9FF" stroke="#BAE6FD"/>
      <text x="10" y="18" font-size="11" font-weight="700" fill="#0369A1">Глибина пройми (точка розширення):</text>
      <text x="10" y="34" font-size="10.5" fill="#334155">• Класична: <tspan font-weight="700" fill="#0F172A">19–21 см</tspan> | Вільна: <tspan font-weight="700" fill="#0F172A">22–24 см</tspan></text>
      <text x="10" y="47" font-size="10" fill="#64748B">• Глибока (від лінії талії): 25–28 см</text>
    </g>

    <!-- Item B -->
    <g transform="translate(14, 98)">
      <rect width="257" height="52" rx="6" fill="#F0F9FF" stroke="#BAE6FD"/>
      <text x="10" y="18" font-size="11" font-weight="700" fill="#0369A1">Ритм добавок по внутрішньому скосу:</text>
      <text x="10" y="34" font-size="10.5" fill="#334155">• Рівномірний крок: <tspan font-weight="700" fill="#0F172A">у кожному 4–6 ряду</tspan></text>
      <text x="10" y="47" font-size="10" fill="#64748B">• Біля пахви: прискорені добавки (в кожному 2 р.)</text>
    </g>

    <!-- Item C -->
    <g transform="translate(14, 158)">
      <rect width="257" height="58" rx="6" fill="#F0F9FF" stroke="#BAE6FD"/>
      <text x="10" y="18" font-size="11" font-weight="700" fill="#0369A1">Свобода та витрата пряжі:</text>
      <text x="10" y="34" font-size="10.5" fill="#334155">• Свобода облягання: <tspan font-weight="700" fill="#0F172A">+15–25 см</tspan> до ОГ</text>
      <text x="10" y="49" font-size="10" font-weight="600" fill="#0284C7">• Витрата: на 40–60% більша за базовий светр</text>
    </g>
  </g>

  <!-- Bottom Panel: Technology and Direction -->
  <g transform="translate(30, 310)">
    <rect width="620" height="100" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="620" height="26" rx="8" fill="#F5F3EF"/>
    <text x="310" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">3. НАПРЯМКИ В'ЯЗАННЯ ТА СТАБІЛІЗАЦІЯ КРОЮ</text>

    <g transform="translate(20, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#B45309">Варіант 1: Знизу вгору (класика)</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• В'яжеться резинка корпусу, потім поступовий набір петель рукавів.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Перевага: легше регулювати довжину тіла та форму вирізу горловини.</text>
    </g>

    <g transform="translate(330, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#0F766E">Варіант 2: Поперечне в'язання (від манжети до манжети)</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• В'язання йде суцільним полотном від лівого рукава до правого.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Вертикальні доріжки петель візуально витягують фігуру та не провисають.</text>
    </g>
  </g>
</svg>`,
  },
  "letucha-mysha": {
    title: "Конструкція рукава «летюча миша»",
    caption: "Схема суцільнокроєного рукава «летюча миша»: розмах зап'ясть, кут розширення, глибина пройми та напрямки в'язання.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-dolman-pattern-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-dolman-pattern-title">Схема крою рукава «летюча миша»: суцільнокроєна конструкція, кут нахилу, розширення та манжети</title>
  <defs>
    <marker id="dolman-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#D97706" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Header Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#92400E">КОНСТРУКЦІЯ РУКАВА «ЛЕТЮЧА МИША»: СУЦІЛЬНОКРОЄНЕ РОЗШИРЕННЯ ТА ПРОПОРЦІЇ</text>

  <!-- Left: Visual Silhouette Shape -->
  <g transform="translate(30, 66)">
    <rect width="320" height="230" rx="8" fill="#FFFFFF" stroke="#D97706" stroke-width="1.3"/>
    <rect x="0" y="0" width="320" height="28" rx="8" fill="#FEF3C7"/>
    <text x="160" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#92400E">1. Викрійка: цільне полотно (рукав + корпус)</text>

    <!-- Dolman silhouette path -->
    <!-- Neckline -->
    <path d="M 130 50 Q 160 62 190 50 L 300 85 L 290 120 L 220 125 Q 185 140 185 210 L 135 210 Q 135 140 100 125 L 30 120 L 20 85 Z" fill="#FFFBEB" stroke="#D97706" stroke-width="1.6"/>

    <!-- Labels on shape -->
    <text x="160" y="58" text-anchor="middle" font-size="10" font-weight="600" fill="#B45309">Горловина</text>
    <text x="160" y="190" text-anchor="middle" font-size="11" font-weight="700" fill="#92400E">½ ОГ + свобода</text>
    <text x="25" y="105" font-size="9.5" font-weight="600" fill="#B45309">Манжета</text>
    <text x="260" y="105" font-size="9.5" font-weight="600" fill="#B45309">Манжета</text>

    <!-- Dimension annotations -->
    <line x1="20" y1="42" x2="300" y2="42" stroke="#B45309" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="160" y="38" text-anchor="middle" font-size="10" font-weight="700" fill="#B45309">Розмах від зап'ястя до зап'ястя: 140–155 см</text>

    <!-- Angle indicator -->
    <path d="M 185 210 Q 185 155 220 125" fill="none" stroke="#DC2626" stroke-width="1.8" stroke-dasharray="2 2"/>
    <text x="215" y="165" font-size="10.5" font-weight="700" fill="#DC2626">Кут: 28–35°</text>
  </g>

  <!-- Right: 3 Key Parameters Cards -->
  <g transform="translate(365, 66)">
    <rect width="285" height="230" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3"/>
    <rect x="0" y="0" width="285" height="28" rx="8" fill="#E0F2FE"/>
    <text x="142" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#0369A1">2. Ключові параметри розрахунку</text>

    <!-- Item A -->
    <g transform="translate(14, 38)">
      <rect width="257" height="52" rx="6" fill="#F0F9FF" stroke="#BAE6FD"/>
      <text x="10" y="18" font-size="11" font-weight="700" fill="#0369A1">Глибина пройми (точка розширення):</text>
      <text x="10" y="34" font-size="10.5" fill="#334155">• Класична: <tspan font-weight="700" fill="#0F172A">19–21 см</tspan> | Вільна: <tspan font-weight="700" fill="#0F172A">22–24 см</tspan></text>
      <text x="10" y="47" font-size="10" fill="#64748B">• Глибока (від лінії талії): 25–28 см</text>
    </g>

    <!-- Item B -->
    <g transform="translate(14, 98)">
      <rect width="257" height="52" rx="6" fill="#F0F9FF" stroke="#BAE6FD"/>
      <text x="10" y="18" font-size="11" font-weight="700" fill="#0369A1">Ритм добавок по внутрішньому скосу:</text>
      <text x="10" y="34" font-size="10.5" fill="#334155">• Рівномірний крок: <tspan font-weight="700" fill="#0F172A">у кожному 4–6 ряду</tspan></text>
      <text x="10" y="47" font-size="10" fill="#64748B">• Біля пахви: прискорені добавки (в кожному 2 р.)</text>
    </g>

    <!-- Item C -->
    <g transform="translate(14, 158)">
      <rect width="257" height="58" rx="6" fill="#F0F9FF" stroke="#BAE6FD"/>
      <text x="10" y="18" font-size="11" font-weight="700" fill="#0369A1">Свобода та витрата пряжі:</text>
      <text x="10" y="34" font-size="10.5" fill="#334155">• Свобода облягання: <tspan font-weight="700" fill="#0F172A">+15–25 см</tspan> до ОГ</text>
      <text x="10" y="49" font-size="10" font-weight="600" fill="#0284C7">• Витрата: на 40–60% більша за базовий светр</text>
    </g>
  </g>

  <!-- Bottom Panel: Technology and Direction -->
  <g transform="translate(30, 310)">
    <rect width="620" height="100" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="620" height="26" rx="8" fill="#F5F3EF"/>
    <text x="310" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">3. НАПРЯМКИ В'ЯЗАННЯ ТА СТАБІЛІЗАЦІЯ КРОЮ</text>

    <g transform="translate(20, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#B45309">Варіант 1: Знизу вгору (класика)</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• В'яжеться резинка корпусу, потім поступовий набір петель рукавів.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Перевага: легше регулювати довжину тіла та форму вирізу горловини.</text>
    </g>

    <g transform="translate(330, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#0F766E">Варіант 2: Поперечне в'язання (від манжети до манжети)</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• В'язання йде суцільним полотном від лівого рукава до правого.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Вертикальні доріжки петель візуально витягують фігуру та не провисають.</text>
    </g>
  </g>
</svg>`,
  },
  "mohair-calculation-guide": {
    title: "Розрахунок светра з мохеру",
    caption: "Особливості в'язання з мохеру: коефіцієнт розтягнення, вибір спиць, мікси з мериносом та золотий стандарт ВТО.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-mohair-calc-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-mohair-calc-title">Розрахунок светра з мохеру: коефіцієнт розтягнення, вибір спиць, мікси пряжі та витрата</title>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#FDF2F8" stroke="#FBCFE8" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#9D174D">ОСОБЛИВОСТІ РОЗРАХУНКУ З МОХЕРУ: РОЗТЯГНЕННЯ, СПИЦІ ТА ВИТРАТА ПРЯЖІ</text>

  <!-- Card 1: Gauge & Shrink/Stretch Factor -->
  <g transform="translate(30, 66)">
    <rect width="195" height="230" rx="8" fill="#FFFFFF" stroke="#DB2777" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#FCE7F3"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#9D174D">1. Коефіцієнт розтягу (K)</text>

    <!-- Swatch illustration -->
    <g transform="translate(25, 40)">
      <rect width="145" height="85" rx="6" fill="#FFF1F2" stroke="#F43F5E" stroke-dasharray="3 3"/>
      <text x="72" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="#E11D48">Зразок 15 × 15 см</text>
      <text x="72" y="48" text-anchor="middle" font-size="10" fill="#475569">ВТО: ручне прання 30°C</text>
      <text x="72" y="64" text-anchor="middle" font-size="10" font-weight="600" fill="#BE123C">Сушіння вертикальне!</text>
    </g>

    <text x="15" y="148" font-size="11" font-weight="700" fill="#9D174D">Коефіцієнт петель:</text>
    <text x="15" y="166" font-size="10.5" fill="#475569">• 100% кід-мохер: <tspan font-weight="700" fill="#0F172A">0.90 (−10%)</tspan></text>
    <text x="15" y="184" font-size="10.5" fill="#475569">• Мохер + шовк: <tspan font-weight="700" fill="#0F172A">0.95 (−5%)</tspan></text>
    <text x="15" y="202" font-size="10.5" fill="#475569">• Мохер + поліамід: <tspan font-weight="700" fill="#0F172A">0.96 (−4%)</tspan></text>
    <text x="15" y="219" font-size="10" font-weight="600" fill="#BE123C">Петлі набору = Сантиметри × 0.9</text>
  </g>

  <!-- Card 2: Needles vs Transparency -->
  <g transform="translate(242, 66)">
    <rect width="195" height="230" rx="8" fill="#FFFFFF" stroke="#7C3AED" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#EDE9FE"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#6D28D9">2. Спиці та прозорість</text>

    <!-- 3 Needle Modes -->
    <g transform="translate(12, 38)">
      <rect width="171" height="52" rx="5" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="18" font-size="10.5" font-weight="700" fill="#6D28D9">Павутинка (Lace halo):</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Спиці: <tspan font-weight="700" fill="#4C1D95">4.5–5.5 мм</tspan> (дерево)</text>
      <text x="8" y="46" font-size="9.5" fill="#64748B">• Невагоме полотно, напівпрозоре</text>
    </g>

    <g transform="translate(12, 98)">
      <rect width="171" height="52" rx="5" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="18" font-size="10.5" font-weight="700" fill="#6D28D9">Зимовий джемпер:</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Спиці: <tspan font-weight="700" fill="#4C1D95">3.0–3.5 мм</tspan></text>
      <text x="8" y="46" font-size="9.5" fill="#64748B">• Щільніше, майже без просвіту</text>
    </g>

    <g transform="translate(12, 158)">
      <rect width="171" height="58" rx="5" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="18" font-size="10.5" font-weight="700" fill="#6D28D9">Манжети та резинки:</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Спиці на <tspan font-weight="700" fill="#4C1D95">0.5–1.0 мм тонші</tspan></text>
      <text x="8" y="48" font-size="9.5" fill="#64748B">• Захищає край від розтягування</text>
    </g>
  </g>

  <!-- Card 3: Mohair Mixes & Yarn Weight -->
  <g transform="translate(455, 66)">
    <rect width="195" height="230" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#D1FAE5"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#065F46">3. Мікси та витрата</text>

    <!-- Mixes item -->
    <g transform="translate(12, 38)">
      <rect width="171" height="74" rx="5" fill="#ECFDF5" stroke="#A7F3D0"/>
      <text x="8" y="17" font-size="10.5" font-weight="700" fill="#047857">Комбінування (в 2 нитки):</text>
      <text x="8" y="33" font-size="10" fill="#334155">• <tspan font-weight="600">Мохер + Меринос (400м):</tspan></text>
      <text x="8" y="47" font-size="9.5" fill="#475569">розтягнення падає на 50%</text>
      <text x="8" y="62" font-size="9.5" font-weight="600" fill="#065F46">• Економія мохеру: до 35%</text>
    </g>

    <!-- Consumption item -->
    <g transform="translate(12, 122)">
      <rect width="171" height="94" rx="5" fill="#ECFDF5" stroke="#A7F3D0"/>
      <text x="8" y="17" font-size="10.5" font-weight="700" fill="#047857">Витрата (светр 44–48):</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Павутинка в 1 нитку:</text>
      <text x="8" y="47" font-size="10" font-weight="700" fill="#065F46">100–125 г (4–5 мотків)</text>
      <text x="8" y="63" font-size="10" fill="#334155">• Оверсайз / коси:</text>
      <text x="8" y="77" font-size="10" font-weight="700" fill="#065F46">150–175 г (6–7 мотків)</text>
      <text x="8" y="89" font-size="9" fill="#64748B">+1 моток обов'язково в запас</text>
    </g>
  </g>

  <!-- Bottom Panel: Washing and Blocking Protocol -->
  <g transform="translate(30, 310)">
    <rect width="620" height="100" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="620" height="26" rx="8" fill="#F5F3EF"/>
    <text x="310" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">4. ЗОЛОТИЙ СТАНДАРТ ВТО ДЛЯ МОХЕРОВИХ ВИРОБІВ</text>

    <g transform="translate(20, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#E11D48">Прання та полоскання:</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• Вода суворо 30°C, без перепаду температури між ваннами.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Засіб для вовни/шовку. Не терти і не крутити руками!</text>
    </g>

    <g transform="translate(330, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#0D9488">Сушіння та блокування:</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• Віджим у рушнику. Горизонтальне блокування на маті.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Легке струшування після висихання піднімає пухнастий німб ворсу.</text>
    </g>
  </g>
</svg>`,
  },
  "mokher": {
    title: "Розрахунок светра з мохеру",
    caption: "Особливості в'язання з мохеру: коефіцієнт розтягнення, вибір спиць, мікси з мериносом та золотий стандарт ВТО.",
    svg: `<svg viewBox="0 0 680 430" role="img" aria-labelledby="diagram-mohair-calc-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-mohair-calc-title">Розрахунок светра з мохеру: коефіцієнт розтягнення, вибір спиць, мікси пряжі та витрата</title>

  <!-- Background -->
  <rect width="680" height="430" fill="#FCFAF7" rx="12"/>

  <!-- Top Title -->
  <rect x="25" y="16" width="630" height="34" rx="6" fill="#FDF2F8" stroke="#FBCFE8" stroke-width="1"/>
  <text x="340" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#9D174D">ОСОБЛИВОСТІ РОЗРАХУНКУ З МОХЕРУ: РОЗТЯГНЕННЯ, СПИЦІ ТА ВИТРАТА ПРЯЖІ</text>

  <!-- Card 1: Gauge & Shrink/Stretch Factor -->
  <g transform="translate(30, 66)">
    <rect width="195" height="230" rx="8" fill="#FFFFFF" stroke="#DB2777" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#FCE7F3"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#9D174D">1. Коефіцієнт розтягу (K)</text>

    <!-- Swatch illustration -->
    <g transform="translate(25, 40)">
      <rect width="145" height="85" rx="6" fill="#FFF1F2" stroke="#F43F5E" stroke-dasharray="3 3"/>
      <text x="72" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="#E11D48">Зразок 15 × 15 см</text>
      <text x="72" y="48" text-anchor="middle" font-size="10" fill="#475569">ВТО: ручне прання 30°C</text>
      <text x="72" y="64" text-anchor="middle" font-size="10" font-weight="600" fill="#BE123C">Сушіння вертикальне!</text>
    </g>

    <text x="15" y="148" font-size="11" font-weight="700" fill="#9D174D">Коефіцієнт петель:</text>
    <text x="15" y="166" font-size="10.5" fill="#475569">• 100% кід-мохер: <tspan font-weight="700" fill="#0F172A">0.90 (−10%)</tspan></text>
    <text x="15" y="184" font-size="10.5" fill="#475569">• Мохер + шовк: <tspan font-weight="700" fill="#0F172A">0.95 (−5%)</tspan></text>
    <text x="15" y="202" font-size="10.5" fill="#475569">• Мохер + поліамід: <tspan font-weight="700" fill="#0F172A">0.96 (−4%)</tspan></text>
    <text x="15" y="219" font-size="10" font-weight="600" fill="#BE123C">Петлі набору = Сантиметри × 0.9</text>
  </g>

  <!-- Card 2: Needles vs Transparency -->
  <g transform="translate(242, 66)">
    <rect width="195" height="230" rx="8" fill="#FFFFFF" stroke="#7C3AED" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#EDE9FE"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#6D28D9">2. Спиці та прозорість</text>

    <!-- 3 Needle Modes -->
    <g transform="translate(12, 38)">
      <rect width="171" height="52" rx="5" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="18" font-size="10.5" font-weight="700" fill="#6D28D9">Павутинка (Lace halo):</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Спиці: <tspan font-weight="700" fill="#4C1D95">4.5–5.5 мм</tspan> (дерево)</text>
      <text x="8" y="46" font-size="9.5" fill="#64748B">• Невагоме полотно, напівпрозоре</text>
    </g>

    <g transform="translate(12, 98)">
      <rect width="171" height="52" rx="5" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="18" font-size="10.5" font-weight="700" fill="#6D28D9">Зимовий джемпер:</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Спиці: <tspan font-weight="700" fill="#4C1D95">3.0–3.5 мм</tspan></text>
      <text x="8" y="46" font-size="9.5" fill="#64748B">• Щільніше, майже без просвіту</text>
    </g>

    <g transform="translate(12, 158)">
      <rect width="171" height="58" rx="5" fill="#F5F3FF" stroke="#DDD6FE"/>
      <text x="8" y="18" font-size="10.5" font-weight="700" fill="#6D28D9">Манжети та резинки:</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Спиці на <tspan font-weight="700" fill="#4C1D95">0.5–1.0 мм тонші</tspan></text>
      <text x="8" y="48" font-size="9.5" fill="#64748B">• Захищає край від розтягування</text>
    </g>
  </g>

  <!-- Card 3: Mohair Mixes & Yarn Weight -->
  <g transform="translate(455, 66)">
    <rect width="195" height="230" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.3"/>
    <rect x="0" y="0" width="195" height="28" rx="8" fill="#D1FAE5"/>
    <text x="97" y="19" text-anchor="middle" font-size="12" font-weight="700" fill="#065F46">3. Мікси та витрата</text>

    <!-- Mixes item -->
    <g transform="translate(12, 38)">
      <rect width="171" height="74" rx="5" fill="#ECFDF5" stroke="#A7F3D0"/>
      <text x="8" y="17" font-size="10.5" font-weight="700" fill="#047857">Комбінування (в 2 нитки):</text>
      <text x="8" y="33" font-size="10" fill="#334155">• <tspan font-weight="600">Мохер + Меринос (400м):</tspan></text>
      <text x="8" y="47" font-size="9.5" fill="#475569">розтягнення падає на 50%</text>
      <text x="8" y="62" font-size="9.5" font-weight="600" fill="#065F46">• Економія мохеру: до 35%</text>
    </g>

    <!-- Consumption item -->
    <g transform="translate(12, 122)">
      <rect width="171" height="94" rx="5" fill="#ECFDF5" stroke="#A7F3D0"/>
      <text x="8" y="17" font-size="10.5" font-weight="700" fill="#047857">Витрата (светр 44–48):</text>
      <text x="8" y="33" font-size="10" fill="#334155">• Павутинка в 1 нитку:</text>
      <text x="8" y="47" font-size="10" font-weight="700" fill="#065F46">100–125 г (4–5 мотків)</text>
      <text x="8" y="63" font-size="10" fill="#334155">• Оверсайз / коси:</text>
      <text x="8" y="77" font-size="10" font-weight="700" fill="#065F46">150–175 г (6–7 мотків)</text>
      <text x="8" y="89" font-size="9" fill="#64748B">+1 моток обов'язково в запас</text>
    </g>
  </g>

  <!-- Bottom Panel: Washing and Blocking Protocol -->
  <g transform="translate(30, 310)">
    <rect width="620" height="100" rx="8" fill="#FFFFFF" stroke="#E2DCD2" stroke-width="1.2"/>
    <rect x="0" y="0" width="620" height="26" rx="8" fill="#F5F3EF"/>
    <text x="310" y="18" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C2C2A">4. ЗОЛОТИЙ СТАНДАРТ ВТО ДЛЯ МОХЕРОВИХ ВИРОБІВ</text>

    <g transform="translate(20, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#E11D48">Прання та полоскання:</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• Вода суворо 30°C, без перепаду температури між ваннами.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Засіб для вовни/шовку. Не терти і не крутити руками!</text>
    </g>

    <g transform="translate(330, 36)">
      <text x="0" y="18" font-size="11" font-weight="700" fill="#0D9488">Сушіння та блокування:</text>
      <text x="0" y="34" font-size="10.5" fill="#475569">• Віджим у рушнику. Горизонтальне блокування на маті.</text>
      <text x="0" y="49" font-size="10" fill="#64748B">• Легке струшування після висихання піднімає пухнастий німб ворсу.</text>
    </g>
  </g>
</svg>`,
  },
  "drop-shoulder-construction": {
    title: "Конструкція та розрахунок светра зі спущеним плечем",
    caption: "Схема спущеного плеча: лінії природного та спущеного плеча (3–10 см), глибина прямої пройми, рукав без окату та компенсація довжини.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-drop-shoulder-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-drop-shoulder-title">Конструкція та розрахунок светра зі спущеним плечем</title>
  <defs>
    <linearGradient id="dsBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#DBEAFE" stop-opacity="0.7"/>
    </linearGradient>
    <linearGradient id="dsSleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#FDE68A" stop-opacity="0.7"/>
    </linearGradient>
    <filter id="dsShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FAFAFA"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Badge -->
  <g transform="translate(30, 32)">
    <rect width="320" height="30" rx="8" fill="#1E3A8A"/>
    <text x="160" y="20" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">ГЕОМЕТРІЯ СПУЩЕНОГО ПЛЕЧА (DROP SHOULDER)</text>
  </g>

  <!-- Left: Garment Silhouette -->
  <g transform="translate(60, 80)">
    <!-- Natural Shoulder Guide (Dotted Red) -->
    <path d="M 100,50 L 150,55" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,4" fill="none"/>
    <path d="M 230,55 L 280,50" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,4" fill="none"/>
    <text x="80" y="44" fill="#DC2626" font-size="11" font-weight="600">Анатомічне плече</text>

    <!-- Sweater Body (Wide rectangle) -->
    <!-- Neckline -->
    <path d="M 150,55 Q 190,80 230,55 L 310,72 L 310,210 L 290,210 L 290,360 L 90,360 L 90,210 L 70,210 L 70,72 Z" fill="url(#dsBodyGrad)" stroke="#2563EB" stroke-width="2.5" filter="url(#dsShadow)"/>
    
    <!-- Ribbing Hem -->
    <rect x="90" y="340" width="200" height="20" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.5"/>
    <text x="190" y="354" fill="#1E40AF" font-size="11" font-weight="600" text-anchor="middle">Еластична гумка низу</text>

    <!-- Neck Ribbing -->
    <path d="M 150,55 Q 190,80 230,55 Q 190,68 150,55 Z" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.5"/>

    <!-- Left Dropped Sleeve -->
    <!-- Attached to straight vertical armhole from y=72 to y=210 -->
    <path d="M 70,72 L -20,130 L 0,165 L 70,210 Z" fill="url(#dsSleeveGrad)" stroke="#D97706" stroke-width="2"/>
    <!-- Cuff -->
    <rect x="-22" y="130" width="24" height="36" rx="4" transform="rotate(-30, -10, 148)" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>

    <!-- Right Dropped Sleeve -->
    <path d="M 310,72 L 400,130 L 380,165 L 310,210 Z" fill="url(#dsSleeveGrad)" stroke="#D97706" stroke-width="2"/>
    <rect x="380" y="130" width="24" height="36" rx="4" transform="rotate(30, 392, 148)" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>

    <!-- Dropped shoulder seam indicator -->
    <line x1="70" y1="72" x2="70" y2="210" stroke="#DC2626" stroke-width="3"/>
    <line x1="310" y1="72" x2="310" y2="210" stroke="#DC2626" stroke-width="3"/>
    <circle cx="70" cy="72" r="4" fill="#DC2626"/>
    <circle cx="70" cy="210" r="4" fill="#DC2626"/>

    <!-- Annotations & Arrows -->
    <!-- Drop Depth Indicator -->
    <line x1="48" y1="50" x2="48" y2="72" stroke="#475569" stroke-width="1.5"/>
    <path d="M 45,52 L 48,46 L 51,52 M 45,70 L 48,76 L 51,70" stroke="#475569" stroke-width="1.5" fill="none"/>
    <text x="42" y="65" fill="#475569" font-size="11" font-weight="700" text-anchor="end">Спущення 3–10 см</text>

    <!-- Armhole Depth -->
    <line x1="325" y1="72" x2="325" y2="210" stroke="#2563EB" stroke-width="1.5"/>
    <path d="M 322,74 L 325,68 L 328,74 M 322,208 L 325,214 L 328,208" stroke="#2563EB" stroke-width="1.5" fill="none"/>
    <text x="335" y="145" fill="#1E40AF" font-size="11" font-weight="700">Пройма: 20–25 см (пряма)</text>

    <!-- Body Width Ease -->
    <line x1="90" y1="380" x2="290" y2="380" stroke="#1E293B" stroke-width="1.5"/>
    <path d="M 92,377 L 86,380 L 92,383 M 288,377 L 294,380 L 288,383" stroke="#1E293B" stroke-width="1.5" fill="none"/>
    <text x="190" y="398" fill="#1E293B" font-size="12" font-weight="700" text-anchor="middle">Ширина: ½ ОГ + свобода 8–20 см</text>
  </g>

  <!-- Right: Engineering Calculation Cards -->
  <g transform="translate(500, 75)">
    <!-- Card 1: Key Drop Rules -->
    <rect width="270" height="115" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#dsShadow)"/>
    <rect width="270" height="28" rx="10" fill="#EFF6FF"/>
    <text x="15" y="19" fill="#1D4ED8" font-size="12" font-weight="700">1. ШИРИНА ПЛЕЧА ТА СПУЩЕННЯ</text>
    <text x="15" y="48" fill="#334155" font-size="11">• Легке спущення: <tspan font-weight="700" fill="#0F172A">3–5 см</tspan> (розміри 42–46)</text>
    <text x="15" y="68" fill="#334155" font-size="11">• Помірне оверсайз: <tspan font-weight="700" fill="#0F172A">5–8 см</tspan> (48–52)</text>
    <text x="15" y="88" fill="#334155" font-size="11">• Сильний оверсайз: <tspan font-weight="700" fill="#0F172A">8–10 см</tspan> (54+)</text>
    <text x="15" y="105" fill="#DC2626" font-size="10" font-weight="600">Скіс плеча обов'язковий: 2–3 см (не 0!)</text>

    <!-- Card 2: Sleeve Length Compensation -->
    <rect y="130" width="270" height="110" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#dsShadow)"/>
    <rect y="130" width="270" height="28" rx="10" fill="#FEF3C7"/>
    <text x="15" y="149" fill="#B45309" font-size="12" font-weight="700">2. ДОВЖИНА ТА ОКАТ РУКАВА</text>
    <text x="15" y="178" fill="#334155" font-size="11">Формула довжини рукава:</text>
    <text x="15" y="198" fill="#B45309" font-size="12" font-weight="800">L рукава = L стандарт − Глибина спущення</text>
    <text x="15" y="222" fill="#64748B" font-size="10.5">Окат = 0 см (прямокутний набір по проймі)</text>

    <!-- Card 3: Seam & Armhole Ratio -->
    <rect y="255" width="270" height="135" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#dsShadow)"/>
    <rect y="255" width="270" height="28" rx="10" fill="#F1F5F9"/>
    <text x="15" y="274" fill="#334155" font-size="12" font-weight="700">3. РОЗРАХУНОК ПРОЙМИ</text>
    <text x="15" y="302" fill="#0F172A" font-size="11" font-weight="600">Глибина пройми = Базова + Спущення</text>
    <text x="15" y="322" fill="#475569" font-size="10.5">• Розмір 42–44: 18–19 см + спущення</text>
    <text x="15" y="340" fill="#475569" font-size="10.5">• Розмір 46–48: 20–21 см + спущення</text>
    <text x="15" y="358" fill="#475569" font-size="10.5">• Розмір 50–52: 22–23 см + спущення</text>
    <text x="15" y="378" fill="#16A34A" font-size="10.5" font-weight="700">✓ Прямий край без заокруглень</text>
  </g>
</svg>`,
  },
  "spushchene-pleche": {
    title: "Конструкція та розрахунок светра зі спущеним плечем",
    caption: "Схема спущеного плеча: лінії природного та спущеного плеча (3–10 см), глибина прямої пройми, рукав без окату та компенсація довжини.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-drop-shoulder-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-drop-shoulder-title">Конструкція та розрахунок светра зі спущеним плечем</title>
  <defs>
    <linearGradient id="dsBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#DBEAFE" stop-opacity="0.7"/>
    </linearGradient>
    <linearGradient id="dsSleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#FDE68A" stop-opacity="0.7"/>
    </linearGradient>
    <filter id="dsShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FAFAFA"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Badge -->
  <g transform="translate(30, 32)">
    <rect width="320" height="30" rx="8" fill="#1E3A8A"/>
    <text x="160" y="20" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">ГЕОМЕТРІЯ СПУЩЕНОГО ПЛЕЧА (DROP SHOULDER)</text>
  </g>

  <!-- Left: Garment Silhouette -->
  <g transform="translate(60, 80)">
    <!-- Natural Shoulder Guide (Dotted Red) -->
    <path d="M 100,50 L 150,55" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,4" fill="none"/>
    <path d="M 230,55 L 280,50" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,4" fill="none"/>
    <text x="80" y="44" fill="#DC2626" font-size="11" font-weight="600">Анатомічне плече</text>

    <!-- Sweater Body (Wide rectangle) -->
    <!-- Neckline -->
    <path d="M 150,55 Q 190,80 230,55 L 310,72 L 310,210 L 290,210 L 290,360 L 90,360 L 90,210 L 70,210 L 70,72 Z" fill="url(#dsBodyGrad)" stroke="#2563EB" stroke-width="2.5" filter="url(#dsShadow)"/>
    
    <!-- Ribbing Hem -->
    <rect x="90" y="340" width="200" height="20" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.5"/>
    <text x="190" y="354" fill="#1E40AF" font-size="11" font-weight="600" text-anchor="middle">Еластична гумка низу</text>

    <!-- Neck Ribbing -->
    <path d="M 150,55 Q 190,80 230,55 Q 190,68 150,55 Z" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.5"/>

    <!-- Left Dropped Sleeve -->
    <!-- Attached to straight vertical armhole from y=72 to y=210 -->
    <path d="M 70,72 L -20,130 L 0,165 L 70,210 Z" fill="url(#dsSleeveGrad)" stroke="#D97706" stroke-width="2"/>
    <!-- Cuff -->
    <rect x="-22" y="130" width="24" height="36" rx="4" transform="rotate(-30, -10, 148)" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>

    <!-- Right Dropped Sleeve -->
    <path d="M 310,72 L 400,130 L 380,165 L 310,210 Z" fill="url(#dsSleeveGrad)" stroke="#D97706" stroke-width="2"/>
    <rect x="380" y="130" width="24" height="36" rx="4" transform="rotate(30, 392, 148)" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>

    <!-- Dropped shoulder seam indicator -->
    <line x1="70" y1="72" x2="70" y2="210" stroke="#DC2626" stroke-width="3"/>
    <line x1="310" y1="72" x2="310" y2="210" stroke="#DC2626" stroke-width="3"/>
    <circle cx="70" cy="72" r="4" fill="#DC2626"/>
    <circle cx="70" cy="210" r="4" fill="#DC2626"/>

    <!-- Annotations & Arrows -->
    <!-- Drop Depth Indicator -->
    <line x1="48" y1="50" x2="48" y2="72" stroke="#475569" stroke-width="1.5"/>
    <path d="M 45,52 L 48,46 L 51,52 M 45,70 L 48,76 L 51,70" stroke="#475569" stroke-width="1.5" fill="none"/>
    <text x="42" y="65" fill="#475569" font-size="11" font-weight="700" text-anchor="end">Спущення 3–10 см</text>

    <!-- Armhole Depth -->
    <line x1="325" y1="72" x2="325" y2="210" stroke="#2563EB" stroke-width="1.5"/>
    <path d="M 322,74 L 325,68 L 328,74 M 322,208 L 325,214 L 328,208" stroke="#2563EB" stroke-width="1.5" fill="none"/>
    <text x="335" y="145" fill="#1E40AF" font-size="11" font-weight="700">Пройма: 20–25 см (пряма)</text>

    <!-- Body Width Ease -->
    <line x1="90" y1="380" x2="290" y2="380" stroke="#1E293B" stroke-width="1.5"/>
    <path d="M 92,377 L 86,380 L 92,383 M 288,377 L 294,380 L 288,383" stroke="#1E293B" stroke-width="1.5" fill="none"/>
    <text x="190" y="398" fill="#1E293B" font-size="12" font-weight="700" text-anchor="middle">Ширина: ½ ОГ + свобода 8–20 см</text>
  </g>

  <!-- Right: Engineering Calculation Cards -->
  <g transform="translate(500, 75)">
    <!-- Card 1: Key Drop Rules -->
    <rect width="270" height="115" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#dsShadow)"/>
    <rect width="270" height="28" rx="10" fill="#EFF6FF"/>
    <text x="15" y="19" fill="#1D4ED8" font-size="12" font-weight="700">1. ШИРИНА ПЛЕЧА ТА СПУЩЕННЯ</text>
    <text x="15" y="48" fill="#334155" font-size="11">• Легке спущення: <tspan font-weight="700" fill="#0F172A">3–5 см</tspan> (розміри 42–46)</text>
    <text x="15" y="68" fill="#334155" font-size="11">• Помірне оверсайз: <tspan font-weight="700" fill="#0F172A">5–8 см</tspan> (48–52)</text>
    <text x="15" y="88" fill="#334155" font-size="11">• Сильний оверсайз: <tspan font-weight="700" fill="#0F172A">8–10 см</tspan> (54+)</text>
    <text x="15" y="105" fill="#DC2626" font-size="10" font-weight="600">Скіс плеча обов'язковий: 2–3 см (не 0!)</text>

    <!-- Card 2: Sleeve Length Compensation -->
    <rect y="130" width="270" height="110" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#dsShadow)"/>
    <rect y="130" width="270" height="28" rx="10" fill="#FEF3C7"/>
    <text x="15" y="149" fill="#B45309" font-size="12" font-weight="700">2. ДОВЖИНА ТА ОКАТ РУКАВА</text>
    <text x="15" y="178" fill="#334155" font-size="11">Формула довжини рукава:</text>
    <text x="15" y="198" fill="#B45309" font-size="12" font-weight="800">L рукава = L стандарт − Глибина спущення</text>
    <text x="15" y="222" fill="#64748B" font-size="10.5">Окат = 0 см (прямокутний набір по проймі)</text>

    <!-- Card 3: Seam & Armhole Ratio -->
    <rect y="255" width="270" height="135" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#dsShadow)"/>
    <rect y="255" width="270" height="28" rx="10" fill="#F1F5F9"/>
    <text x="15" y="274" fill="#334155" font-size="12" font-weight="700">3. РОЗРАХУНОК ПРОЙМИ</text>
    <text x="15" y="302" fill="#0F172A" font-size="11" font-weight="600">Глибина пройми = Базова + Спущення</text>
    <text x="15" y="322" fill="#475569" font-size="10.5">• Розмір 42–44: 18–19 см + спущення</text>
    <text x="15" y="340" fill="#475569" font-size="10.5">• Розмір 46–48: 20–21 см + спущення</text>
    <text x="15" y="358" fill="#475569" font-size="10.5">• Розмір 50–52: 22–23 см + спущення</text>
    <text x="15" y="378" fill="#16A34A" font-size="10.5" font-weight="700">✓ Прямий край без заокруглень</text>
  </g>
</svg>`,
  },
  "circular-knitting-guide": {
    title: "Кругове безшовне вʼязання: геометрія, волосінь та замикання в коло",
    caption: "Інженерний гайд кругового в'язання: спіральні ряди без швів, підбір довжини волосіні (-5..10 см), круговий зразок та змикання без дірочки.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-circular-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-circular-title">Кругове безшовне в'язання: геометрія, волосінь та замикання в коло</title>
  <defs>
    <linearGradient id="ckRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#059669" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="ckCardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <filter id="ckShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FAFAFA"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Badge -->
  <g transform="translate(30, 32)">
    <rect width="360" height="30" rx="8" fill="#065F46"/>
    <text x="180" y="20" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">ІНЖЕНЕРНИЙ ГАЙД КРУГОВОГО В'ЯЗАННЯ СПИЦЯМИ</text>
  </g>

  <!-- Left Side: Circular Geometry & 1-Stitch Join -->
  <g transform="translate(60, 85)">
    <!-- Big Circle Representing Circular Seamless Body -->
    <circle cx="160" cy="160" r="130" fill="url(#ckRingGrad)" stroke="#059669" stroke-width="3"/>
    <circle cx="160" cy="160" r="100" fill="#FAFAFA" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4"/>

    <!-- Spiral Rows Indicator -->
    <path d="M 160,30 A 130,130 0 1,1 159,30.5" stroke="#047857" stroke-width="2" fill="none"/>
    <path d="M 160,42 A 118,118 0 1,1 159,42.5" stroke="#10B981" stroke-width="2" fill="none"/>

    <!-- Marker at Beginning of Round -->
    <circle cx="160" cy="30" r="8" fill="#EF4444"/>
    <text x="160" y="16" fill="#DC2626" font-size="11" font-weight="700" text-anchor="middle">МАРКЕР (Початок ряду)</text>

    <!-- Seamless Join Note Inside Circle -->
    <g transform="translate(160, 140)">
      <text x="0" y="-20" fill="#065F46" font-size="13" font-weight="800" text-anchor="middle">БЕЗШОВНЕ КОЛО</text>
      <text x="0" y="0" fill="#047857" font-size="11" font-weight="600" text-anchor="middle">Крайових петель = 0</text>
      <text x="0" y="18" fill="#334155" font-size="10.5" text-anchor="middle">Формула: Обхват × Щільність</text>
      <text x="0" y="34" fill="#059669" font-size="10.5" font-weight="700" text-anchor="middle">+ 1 п. для змикання</text>
    </g>

    <!-- Side Markers for Split -->
    <circle cx="30" cy="160" r="5" fill="#3B82F6"/>
    <text x="25" y="180" fill="#2563EB" font-size="10" font-weight="600" text-anchor="end">Бічний шов 1</text>
    
    <circle cx="290" cy="160" r="5" fill="#3B82F6"/>
    <text x="295" y="180" fill="#2563EB" font-size="10" font-weight="600">Бічний шов 2</text>

    <!-- Step / Jogless visual arrow -->
    <path d="M 165,30 C 180,30 185,55 170,55" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
    <text x="195" y="48" fill="#D97706" font-size="10.5" font-weight="700">Jogless: підйом дужки</text>
  </g>

  <!-- Right Side: 3 Technical Guidance Cards -->
  <g transform="translate(430, 80)">
    <!-- Card 1: Cable Length Golden Rule -->
    <rect width="330" height="110" rx="10" fill="url(#ckCardGrad)" stroke="#CBD5E1" stroke-width="1.5" filter="url(#ckShadow)"/>
    <rect width="330" height="26" rx="10" fill="#ECFDF5"/>
    <text x="15" y="18" fill="#047857" font-size="12" font-weight="700">1. ПРАВИЛО ДОВЖИНИ ВОЛОСІНІ (ТРОСИКА)</text>
    <text x="15" y="46" fill="#065F46" font-size="11.5" font-weight="700">Довжина спиць = Обхват деталі − (5–10 см)</text>
    <text x="15" y="66" fill="#475569" font-size="11">• 40 см: манжети, шапки, горловини</text>
    <text x="15" y="84" fill="#475569" font-size="11">• 60–80 см: дитячі светри, рукави</text>
    <text x="15" y="102" fill="#475569" font-size="11">• 80–100 см: тіло светра (дорослі) / Magic Loop</text>

    <!-- Card 2: Density Shift (+5..10%) -->
    <rect y="125" width="330" height="120" rx="10" fill="url(#ckCardGrad)" stroke="#CBD5E1" stroke-width="1.5" filter="url(#ckShadow)"/>
    <rect y="125" width="330" height="26" rx="10" fill="#FEF3C7"/>
    <text x="15" y="143" fill="#B45309" font-size="12" font-weight="700">2. ЩІЛЬНІСТЬ: ПОВОРОТНЕ vs КРУГОВЕ</text>
    <text x="15" y="172" fill="#0F172A" font-size="11">• У колі <tspan font-weight="700">немає слабких виворітних петель</tspan></text>
    <text x="15" y="190" fill="#D97706" font-size="11" font-weight="700">⚠ Щільність по колу на 5–10% щільніша!</text>
    <text x="15" y="210" fill="#334155" font-size="10.5">Зразок в'язати з протяжками позаду або</text>
    <text x="15" y="228" fill="#334155" font-size="10.5">робити надбавку +1 розмір спиць при потребі.</text>

    <!-- Card 3: Symmetrical Pattern Repeat -->
    <rect y="260" width="330" height="125" rx="10" fill="url(#ckCardGrad)" stroke="#CBD5E1" stroke-width="1.5" filter="url(#ckShadow)"/>
    <rect y="260" width="330" height="26" rx="10" fill="#EFF6FF"/>
    <text x="15" y="278" fill="#1D4ED8" font-size="12" font-weight="700">3. КРАТНІСТЬ РАПОРТІВ ПО КОЛУ</text>
    <text x="15" y="306" fill="#334155" font-size="11">• Гумка 1×1: <tspan font-weight="700" fill="#1E40AF">кратна 2</tspan></text>
    <text x="15" y="324" fill="#334155" font-size="11">• Гумка 2×2: <tspan font-weight="700" fill="#1E40AF">кратна 4</tspan> (без залишку!)</text>
    <text x="15" y="342" fill="#334155" font-size="11">• Французька гумка / ажур: <tspan font-weight="700" fill="#1E40AF">кратна 4 або 6</tspan></text>
    <text x="15" y="362" fill="#DC2626" font-size="10.5" font-weight="600">Косина гладі: в'яжіть з 2 клубків кожні 2 ряди</text>
  </g>
</svg>`,
  },
  "krugove-vyazannya": {
    title: "Кругове безшовне вʼязання: геометрія, волосінь та замикання в коло",
    caption: "Інженерний гайд кругового в'язання: спіральні ряди без швів, підбір довжини волосіні (-5..10 см), круговий зразок та змикання без дірочки.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-circular-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-circular-title">Кругове безшовне в'язання: геометрія, волосінь та замикання в коло</title>
  <defs>
    <linearGradient id="ckRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#059669" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="ckCardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <filter id="ckShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FAFAFA"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Badge -->
  <g transform="translate(30, 32)">
    <rect width="360" height="30" rx="8" fill="#065F46"/>
    <text x="180" y="20" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">ІНЖЕНЕРНИЙ ГАЙД КРУГОВОГО В'ЯЗАННЯ СПИЦЯМИ</text>
  </g>

  <!-- Left Side: Circular Geometry & 1-Stitch Join -->
  <g transform="translate(60, 85)">
    <!-- Big Circle Representing Circular Seamless Body -->
    <circle cx="160" cy="160" r="130" fill="url(#ckRingGrad)" stroke="#059669" stroke-width="3"/>
    <circle cx="160" cy="160" r="100" fill="#FAFAFA" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4"/>

    <!-- Spiral Rows Indicator -->
    <path d="M 160,30 A 130,130 0 1,1 159,30.5" stroke="#047857" stroke-width="2" fill="none"/>
    <path d="M 160,42 A 118,118 0 1,1 159,42.5" stroke="#10B981" stroke-width="2" fill="none"/>

    <!-- Marker at Beginning of Round -->
    <circle cx="160" cy="30" r="8" fill="#EF4444"/>
    <text x="160" y="16" fill="#DC2626" font-size="11" font-weight="700" text-anchor="middle">МАРКЕР (Початок ряду)</text>

    <!-- Seamless Join Note Inside Circle -->
    <g transform="translate(160, 140)">
      <text x="0" y="-20" fill="#065F46" font-size="13" font-weight="800" text-anchor="middle">БЕЗШОВНЕ КОЛО</text>
      <text x="0" y="0" fill="#047857" font-size="11" font-weight="600" text-anchor="middle">Крайових петель = 0</text>
      <text x="0" y="18" fill="#334155" font-size="10.5" text-anchor="middle">Формула: Обхват × Щільність</text>
      <text x="0" y="34" fill="#059669" font-size="10.5" font-weight="700" text-anchor="middle">+ 1 п. для змикання</text>
    </g>

    <!-- Side Markers for Split -->
    <circle cx="30" cy="160" r="5" fill="#3B82F6"/>
    <text x="25" y="180" fill="#2563EB" font-size="10" font-weight="600" text-anchor="end">Бічний шов 1</text>
    
    <circle cx="290" cy="160" r="5" fill="#3B82F6"/>
    <text x="295" y="180" fill="#2563EB" font-size="10" font-weight="600">Бічний шов 2</text>

    <!-- Step / Jogless visual arrow -->
    <path d="M 165,30 C 180,30 185,55 170,55" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
    <text x="195" y="48" fill="#D97706" font-size="10.5" font-weight="700">Jogless: підйом дужки</text>
  </g>

  <!-- Right Side: 3 Technical Guidance Cards -->
  <g transform="translate(430, 80)">
    <!-- Card 1: Cable Length Golden Rule -->
    <rect width="330" height="110" rx="10" fill="url(#ckCardGrad)" stroke="#CBD5E1" stroke-width="1.5" filter="url(#ckShadow)"/>
    <rect width="330" height="26" rx="10" fill="#ECFDF5"/>
    <text x="15" y="18" fill="#047857" font-size="12" font-weight="700">1. ПРАВИЛО ДОВЖИНИ ВОЛОСІНІ (ТРОСИКА)</text>
    <text x="15" y="46" fill="#065F46" font-size="11.5" font-weight="700">Довжина спиць = Обхват деталі − (5–10 см)</text>
    <text x="15" y="66" fill="#475569" font-size="11">• 40 см: манжети, шапки, горловини</text>
    <text x="15" y="84" fill="#475569" font-size="11">• 60–80 см: дитячі светри, рукави</text>
    <text x="15" y="102" fill="#475569" font-size="11">• 80–100 см: тіло светра (дорослі) / Magic Loop</text>

    <!-- Card 2: Density Shift (+5..10%) -->
    <rect y="125" width="330" height="120" rx="10" fill="url(#ckCardGrad)" stroke="#CBD5E1" stroke-width="1.5" filter="url(#ckShadow)"/>
    <rect y="125" width="330" height="26" rx="10" fill="#FEF3C7"/>
    <text x="15" y="143" fill="#B45309" font-size="12" font-weight="700">2. ЩІЛЬНІСТЬ: ПОВОРОТНЕ vs КРУГОВЕ</text>
    <text x="15" y="172" fill="#0F172A" font-size="11">• У колі <tspan font-weight="700">немає слабких виворітних петель</tspan></text>
    <text x="15" y="190" fill="#D97706" font-size="11" font-weight="700">⚠ Щільність по колу на 5–10% щільніша!</text>
    <text x="15" y="210" fill="#334155" font-size="10.5">Зразок в'язати з протяжками позаду або</text>
    <text x="15" y="228" fill="#334155" font-size="10.5">робити надбавку +1 розмір спиць при потребі.</text>

    <!-- Card 3: Symmetrical Pattern Repeat -->
    <rect y="260" width="330" height="125" rx="10" fill="url(#ckCardGrad)" stroke="#CBD5E1" stroke-width="1.5" filter="url(#ckShadow)"/>
    <rect y="260" width="330" height="26" rx="10" fill="#EFF6FF"/>
    <text x="15" y="278" fill="#1D4ED8" font-size="12" font-weight="700">3. КРАТНІСТЬ РАПОРТІВ ПО КОЛУ</text>
    <text x="15" y="306" fill="#334155" font-size="11">• Гумка 1×1: <tspan font-weight="700" fill="#1E40AF">кратна 2</tspan></text>
    <text x="15" y="324" fill="#334155" font-size="11">• Гумка 2×2: <tspan font-weight="700" fill="#1E40AF">кратна 4</tspan> (без залишку!)</text>
    <text x="15" y="342" fill="#334155" font-size="11">• Французька гумка / ажур: <tspan font-weight="700" fill="#1E40AF">кратна 4 або 6</tspan></text>
    <text x="15" y="362" fill="#DC2626" font-size="10.5" font-weight="600">Косина гладі: в'яжіть з 2 клубків кожні 2 ряди</text>
  </g>
</svg>`,
  },
  "ribbing-calculation-chart": {
    title: "Таблиця стискання та перехід від гумки до основного полотна",
    caption: "Розрахунок гумки для светра: коефіцієнти стискання 1×1 (K=0.88), 2×2 (K=0.80), патентної (K=0.96) та формула кроку переходу до гладі.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-ribbing-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-ribbing-title">Таблиця стискання та перехід від гумки до основного полотна</title>
  <defs>
    <linearGradient id="rbHeadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C2410C"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <filter id="rbShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.07"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FAFAFA"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Badge -->
  <g transform="translate(30, 32)">
    <rect width="370" height="30" rx="8" fill="url(#rbHeadGrad)"/>
    <text x="185" y="20" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">РОЗРАХУНОК ГУМКИ ДЛЯ СВЕТРА: СТИСКАННЯ ТА ПЕРЕХІД</text>
  </g>

  <!-- Left: Contraction Comparison Bars -->
  <g transform="translate(45, 80)">
    <text x="0" y="20" fill="#0F172A" font-size="14" font-weight="800">1. КОЕФІЦІЄНТИ СТИСКАННЯ РІЗНИХ ТИПІВ ГУМОК</text>
    
    <!-- Base Fabric 100% (Stockinette) -->
    <g transform="translate(0, 45)">
      <rect width="360" height="36" rx="6" fill="#E2E8F0"/>
      <text x="14" y="23" fill="#334155" font-size="12" font-weight="700">Лицьова гладь (База: 100% ширини)</text>
      <text x="345" y="23" fill="#475569" font-size="11" font-weight="600" text-anchor="end">K = 1.00</text>
    </g>

    <!-- Rib 1x1 (-12..15%) -->
    <g transform="translate(0, 95)">
      <rect width="310" height="36" rx="6" fill="#FED7AA" stroke="#EA580C" stroke-width="1.5"/>
      <text x="14" y="23" fill="#9A3412" font-size="12" font-weight="700">Гумка 1×1 (стискання 12–15%)</text>
      <text x="295" y="23" fill="#C2410C" font-size="11" font-weight="700" text-anchor="end">K = 0.88</text>
      <text x="320" y="23" fill="#64748B" font-size="10.5">Кратність 2</text>
    </g>

    <!-- Rib 2x2 (-18..22%) -->
    <g transform="translate(0, 145)">
      <rect width="285" height="36" rx="6" fill="#FFEDD5" stroke="#F97316" stroke-width="2"/>
      <text x="14" y="23" fill="#C2410C" font-size="12" font-weight="800">Гумка 2×2 (стискання 18–22%)</text>
      <text x="270" y="23" fill="#EA580C" font-size="11" font-weight="800" text-anchor="end">K = 0.80</text>
      <text x="295" y="23" fill="#64748B" font-size="10.5">Кратність 4</text>
    </g>

    <!-- Brioche / Patent (-3..5%) -->
    <g transform="translate(0, 195)">
      <rect width="345" height="36" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>
      <text x="14" y="23" fill="#92400E" font-size="12" font-weight="700">Патентна / бріош (стискання 3–5%)</text>
      <text x="330" y="23" fill="#B45309" font-size="11" font-weight="700" text-anchor="end">K = 0.96</text>
      <text x="355" y="23" fill="#64748B" font-size="10.5">Кратність 2</text>
    </g>

    <!-- Double Hollow Rib (-2..3%) -->
    <g transform="translate(0, 245)">
      <rect width="352" height="36" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5"/>
      <text x="14" y="23" fill="#475569" font-size="12" font-weight="700">Порожниста (подвійна) гумка</text>
      <text x="335" y="23" fill="#334155" font-size="11" font-weight="700" text-anchor="end">K = 0.98</text>
      <text x="360" y="23" fill="#64748B" font-size="10.5">Для планок</text>
    </g>

    <!-- Golden Rule Box -->
    <g transform="translate(0, 305)">
      <rect width="370" height="75" rx="8" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5"/>
      <text x="15" y="22" fill="#C2410C" font-size="11.5" font-weight="800">ЗОЛОТЕ ПРАВИЛО СПИЦЬ ДЛЯ ГУМКИ:</text>
      <text x="15" y="42" fill="#431407" font-size="11">Завжди в'яжіть гумку на спицях на <tspan font-weight="700" fill="#EA580C">0.5–1.0 мм тонших</tspan>,</text>
      <text x="15" y="60" fill="#431407" font-size="11">ніж основне полотно — це запобігає розхлябаності!</text>
    </g>
  </g>

  <!-- Right: Transition & Increase Step Calculation -->
  <g transform="translate(455, 80)">
    <text x="0" y="20" fill="#0F172A" font-size="14" font-weight="800">2. АЛГОРИТМ ПЕРЕХОДУ ВІД ГУМКИ ДО ТІЛА</text>

    <!-- Transition Formula Card -->
    <rect y="45" width="305" height="135" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#rbShadow)"/>
    <rect y="45" width="305" height="28" rx="10" fill="#FFEDD5"/>
    <text x="15" y="64" fill="#C2410C" font-size="12" font-weight="700">ФОРМУЛА КРОКУ ДОДАВАННЯ ПЕТЕЛЬ</text>
    
    <text x="15" y="94" fill="#334155" font-size="11">Різниця петель: <tspan font-weight="700" fill="#0F172A">Δ = N_тіла − N_гумки</tspan></text>
    <text x="15" y="116" fill="#334155" font-size="11">Крок додавання: <tspan font-weight="800" fill="#EA580C">Крок = N_гумки ÷ Δ</tspan></text>
    
    <rect x="15" y="130" width="275" height="38" rx="6" fill="#F8FAFC"/>
    <text x="25" y="146" fill="#64748B" font-size="10">Приклад: Гумка 96 п, полотно 120 п (Δ = 24)</text>
    <text x="25" y="160" fill="#0F172A" font-size="10.5" font-weight="700">96 ÷ 24 = 4 → додавати по 1 п. після кожної 4-ї петлі</text>

    <!-- Anatomical Recommendations Card -->
    <rect y="200" width="305" height="180" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#rbShadow)"/>
    <rect y="200" width="305" height="28" rx="10" fill="#F1F5F9"/>
    <text x="15" y="219" fill="#334155" font-size="12" font-weight="700">ВИСОТА ТА ЕЛАСТИЧНІСТЬ ЗА ЗОНАМИ</text>
    
    <text x="15" y="248" fill="#0F172A" font-size="11" font-weight="700">• Манжети рукавів:</text>
    <text x="25" y="266" fill="#64748B" font-size="10.5">Висота: 5–8 см | K = 0.80–0.85 від зап'ястя</text>
    
    <text x="15" y="288" fill="#0F172A" font-size="11" font-weight="700">• Низ светра:</text>
    <text x="25" y="306" fill="#64748B" font-size="10.5">Висота: 6–10 см | K = 0.80 (2×2) або 0.88 (1×1)</text>

    <text x="15" y="328" fill="#0F172A" font-size="11" font-weight="700">• Горловина:</text>
    <text x="25" y="346" fill="#64748B" font-size="10.5">Висота: 3–5 см (стійка 8–12 см) | Набір 80–85%</text>
    <text x="25" y="364" fill="#16A34A" font-size="10" font-weight="700">✓ Закриття голкою (італійський шов) для еластичності</text>
  </g>
</svg>`,
  },
  "humka-dlya-svetra": {
    title: "Таблиця стискання та перехід від гумки до основного полотна",
    caption: "Розрахунок гумки для светра: коефіцієнти стискання 1×1 (K=0.88), 2×2 (K=0.80), патентної (K=0.96) та формула кроку переходу до гладі.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-ribbing-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-ribbing-title">Таблиця стискання та перехід від гумки до основного полотна</title>
  <defs>
    <linearGradient id="rbHeadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C2410C"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <filter id="rbShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.07"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FAFAFA"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Badge -->
  <g transform="translate(30, 32)">
    <rect width="370" height="30" rx="8" fill="url(#rbHeadGrad)"/>
    <text x="185" y="20" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">РОЗРАХУНОК ГУМКИ ДЛЯ СВЕТРА: СТИСКАННЯ ТА ПЕРЕХІД</text>
  </g>

  <!-- Left: Contraction Comparison Bars -->
  <g transform="translate(45, 80)">
    <text x="0" y="20" fill="#0F172A" font-size="14" font-weight="800">1. КОЕФІЦІЄНТИ СТИСКАННЯ РІЗНИХ ТИПІВ ГУМОК</text>
    
    <!-- Base Fabric 100% (Stockinette) -->
    <g transform="translate(0, 45)">
      <rect width="360" height="36" rx="6" fill="#E2E8F0"/>
      <text x="14" y="23" fill="#334155" font-size="12" font-weight="700">Лицьова гладь (База: 100% ширини)</text>
      <text x="345" y="23" fill="#475569" font-size="11" font-weight="600" text-anchor="end">K = 1.00</text>
    </g>

    <!-- Rib 1x1 (-12..15%) -->
    <g transform="translate(0, 95)">
      <rect width="310" height="36" rx="6" fill="#FED7AA" stroke="#EA580C" stroke-width="1.5"/>
      <text x="14" y="23" fill="#9A3412" font-size="12" font-weight="700">Гумка 1×1 (стискання 12–15%)</text>
      <text x="295" y="23" fill="#C2410C" font-size="11" font-weight="700" text-anchor="end">K = 0.88</text>
      <text x="320" y="23" fill="#64748B" font-size="10.5">Кратність 2</text>
    </g>

    <!-- Rib 2x2 (-18..22%) -->
    <g transform="translate(0, 145)">
      <rect width="285" height="36" rx="6" fill="#FFEDD5" stroke="#F97316" stroke-width="2"/>
      <text x="14" y="23" fill="#C2410C" font-size="12" font-weight="800">Гумка 2×2 (стискання 18–22%)</text>
      <text x="270" y="23" fill="#EA580C" font-size="11" font-weight="800" text-anchor="end">K = 0.80</text>
      <text x="295" y="23" fill="#64748B" font-size="10.5">Кратність 4</text>
    </g>

    <!-- Brioche / Patent (-3..5%) -->
    <g transform="translate(0, 195)">
      <rect width="345" height="36" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>
      <text x="14" y="23" fill="#92400E" font-size="12" font-weight="700">Патентна / бріош (стискання 3–5%)</text>
      <text x="330" y="23" fill="#B45309" font-size="11" font-weight="700" text-anchor="end">K = 0.96</text>
      <text x="355" y="23" fill="#64748B" font-size="10.5">Кратність 2</text>
    </g>

    <!-- Double Hollow Rib (-2..3%) -->
    <g transform="translate(0, 245)">
      <rect width="352" height="36" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5"/>
      <text x="14" y="23" fill="#475569" font-size="12" font-weight="700">Порожниста (подвійна) гумка</text>
      <text x="335" y="23" fill="#334155" font-size="11" font-weight="700" text-anchor="end">K = 0.98</text>
      <text x="360" y="23" fill="#64748B" font-size="10.5">Для планок</text>
    </g>

    <!-- Golden Rule Box -->
    <g transform="translate(0, 305)">
      <rect width="370" height="75" rx="8" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5"/>
      <text x="15" y="22" fill="#C2410C" font-size="11.5" font-weight="800">ЗОЛОТЕ ПРАВИЛО СПИЦЬ ДЛЯ ГУМКИ:</text>
      <text x="15" y="42" fill="#431407" font-size="11">Завжди в'яжіть гумку на спицях на <tspan font-weight="700" fill="#EA580C">0.5–1.0 мм тонших</tspan>,</text>
      <text x="15" y="60" fill="#431407" font-size="11">ніж основне полотно — це запобігає розхлябаності!</text>
    </g>
  </g>

  <!-- Right: Transition & Increase Step Calculation -->
  <g transform="translate(455, 80)">
    <text x="0" y="20" fill="#0F172A" font-size="14" font-weight="800">2. АЛГОРИТМ ПЕРЕХОДУ ВІД ГУМКИ ДО ТІЛА</text>

    <!-- Transition Formula Card -->
    <rect y="45" width="305" height="135" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#rbShadow)"/>
    <rect y="45" width="305" height="28" rx="10" fill="#FFEDD5"/>
    <text x="15" y="64" fill="#C2410C" font-size="12" font-weight="700">ФОРМУЛА КРОКУ ДОДАВАННЯ ПЕТЕЛЬ</text>
    
    <text x="15" y="94" fill="#334155" font-size="11">Різниця петель: <tspan font-weight="700" fill="#0F172A">Δ = N_тіла − N_гумки</tspan></text>
    <text x="15" y="116" fill="#334155" font-size="11">Крок додавання: <tspan font-weight="800" fill="#EA580C">Крок = N_гумки ÷ Δ</tspan></text>
    
    <rect x="15" y="130" width="275" height="38" rx="6" fill="#F8FAFC"/>
    <text x="25" y="146" fill="#64748B" font-size="10">Приклад: Гумка 96 п, полотно 120 п (Δ = 24)</text>
    <text x="25" y="160" fill="#0F172A" font-size="10.5" font-weight="700">96 ÷ 24 = 4 → додавати по 1 п. після кожної 4-ї петлі</text>

    <!-- Anatomical Recommendations Card -->
    <rect y="200" width="305" height="180" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#rbShadow)"/>
    <rect y="200" width="305" height="28" rx="10" fill="#F1F5F9"/>
    <text x="15" y="219" fill="#334155" font-size="12" font-weight="700">ВИСОТА ТА ЕЛАСТИЧНІСТЬ ЗА ЗОНАМИ</text>
    
    <text x="15" y="248" fill="#0F172A" font-size="11" font-weight="700">• Манжети рукавів:</text>
    <text x="25" y="266" fill="#64748B" font-size="10.5">Висота: 5–8 см | K = 0.80–0.85 від зап'ястя</text>
    
    <text x="15" y="288" fill="#0F172A" font-size="11" font-weight="700">• Низ светра:</text>
    <text x="25" y="306" fill="#64748B" font-size="10.5">Висота: 6–10 см | K = 0.80 (2×2) або 0.88 (1×1)</text>

    <text x="15" y="328" fill="#0F172A" font-size="11" font-weight="700">• Горловина:</text>
    <text x="25" y="346" fill="#64748B" font-size="10.5">Висота: 3–5 см (стійка 8–12 см) | Набір 80–85%</text>
    <text x="25" y="364" fill="#16A34A" font-size="10" font-weight="700">✓ Закриття голкою (італійський шов) для еластичності</text>
  </g>
</svg>`,
  },
  "crew-neck-guide": {
    title: "Розрахунок та геометрія круглого вирізу Crew Neck",
    caption: "Інженерна схема розрахунку горловини crew neck: пропорції 35/18/18/30, скіс плеча укороченими рядами, правило набору планки 3:4 та еластичне закриття tubular bind-off.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-crew-neck-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-crew-neck-title">Розрахунок та геометрія круглого вирізу Crew Neck</title>
  <defs>
    <linearGradient id="cnBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#F1F5F9" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="cnCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#DBEAFE" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="cnShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.07"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FFFFFF"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Header Banner -->
  <rect x="25" y="24" width="750" height="36" rx="8" fill="#0F172A"/>
  <text x="400" y="47" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="0.5">АНАТОМІЯ ТА РОЗРАХУНОК КРУГЛОГО ВИРІЗУ (CREW NECK)</text>

  <!-- Left: Technical Diagram of Crew Neck Geometry -->
  <g transform="translate(40, 80)">
    <!-- Main Sweater Chest & Neck Contour -->
    <!-- Shoulder Left, Neck curve, Shoulder Right, Body sides -->
    <path d="M 20,90 L 110,65 L 110,65 Q 150,65 170,105 Q 190,145 230,145 Q 270,145 290,105 Q 310,65 350,65 L 440,90 L 420,240 L 40,240 Z" fill="url(#cnBodyGrad)" stroke="#64748B" stroke-width="2" filter="url(#cnShadow)"/>

    <!-- Cutout Curve for Neckline with highlight -->
    <path d="M 110,65 Q 150,65 170,105 Q 190,145 230,145 Q 270,145 290,105 Q 310,65 350,65 Q 310,50 230,50 Q 150,50 110,65 Z" fill="url(#cnCurveGrad)" stroke="#2563EB" stroke-width="2.5"/>

    <!-- Center Front Straight Segment (Закриття центру) -->
    <path d="M 195,145 L 265,145" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>
    <rect x="175" y="160" width="110" height="24" rx="4" fill="#FEE2E2" stroke="#EF4444" stroke-width="1"/>
    <text x="230" y="176" fill="#991B1B" font-size="10.5" font-weight="700" text-anchor="middle">Центр: 35–40% петель</text>

    <!-- Stepped Decrease Groups (Left & Right) -->
    <!-- Right side steps: 3, 2, 1, 1, 1 -->
    <circle cx="275" cy="138" r="4" fill="#2563EB"/>
    <text x="290" y="142" fill="#1E40AF" font-size="9.5" font-weight="700">3 п.</text>
    
    <circle cx="285" cy="120" r="4" fill="#2563EB"/>
    <text x="300" y="124" fill="#1E40AF" font-size="9.5" font-weight="700">2 п.</text>
    
    <circle cx="295" cy="98" r="4" fill="#2563EB"/>
    <text x="310" y="102" fill="#1E40AF" font-size="9.5" font-weight="700">1 п. × 3</text>

    <!-- Shoulder Slopes (Укорочені ряди) -->
    <!-- Left shoulder slope -->
    <line x1="20" y1="90" x2="110" y2="65" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
    <text x="65" y="55" fill="#047857" font-size="10.5" font-weight="700" text-anchor="middle">Скіс плеча (3–5 см)</text>

    <!-- Right shoulder slope -->
    <line x1="350" y1="65" x2="440" y2="90" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
    <text x="395" y="55" fill="#047857" font-size="10.5" font-weight="700" text-anchor="middle">Німецькі укорочені ряди</text>

    <!-- Depth and Width Dimension Arrows -->
    <!-- Depth Front (6-8 cm) -->
    <line x1="230" y1="50" x2="230" y2="145" stroke="#EA580C" stroke-width="1.8" stroke-dasharray="3,3"/>
    <polygon points="230,50 227,58 233,58" fill="#EA580C"/>
    <polygon points="230,145 227,137 233,137" fill="#EA580C"/>
    <rect x="235" y="85" width="95" height="20" rx="4" fill="#FFEDD5"/>
    <text x="240" y="99" fill="#C2410C" font-size="10.5" font-weight="700">Глибина: 6–8 см</text>

    <!-- Depth Back (2-3 cm) -->
    <line x1="165" y1="50" x2="165" y2="65" stroke="#64748B" stroke-width="1.5"/>
    <text x="115" y="45" fill="#475569" font-size="9.5" font-weight="600">Спинка: 2–3 см</text>

    <!-- Width of Neckline (16-20 cm) -->
    <line x1="110" y1="260" x2="350" y2="260" stroke="#2563EB" stroke-width="1.8"/>
    <line x1="110" y1="70" x2="110" y2="265" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2,2"/>
    <line x1="350" y1="70" x2="350" y2="265" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2,2"/>
    <rect x="180" y="248" width="100" height="24" rx="4" fill="#DBEAFE"/>
    <text x="230" y="264" fill="#1E40AF" font-size="11" font-weight="700" text-anchor="middle">Ширина: 16–20 см</text>

    <!-- Bottom summary banner in left box -->
    <rect x="20" y="295" width="420" height="95" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="35" y="316" fill="#0F172A" font-size="11.5" font-weight="700">ПРАВИЛО НАБОРУ ПЕТЕЛЬ ДЛЯ ПЛАНКИ (БЕЙКИ):</text>
    <text x="35" y="336" fill="#334155" font-size="10.5">• По вертикальних скосах: <tspan font-weight="700" fill="#2563EB">3 петлі з кожних 4 рядів (співвідношення 3:4)</tspan></text>
    <text x="35" y="354" fill="#334155" font-size="10.5">• По горизонтальній частині: <tspan font-weight="700" fill="#059669">1 петля з 1 закритої петлі (1:1)</tspan></text>
    <text x="35" y="372" fill="#334155" font-size="10.5">• Зменшення спиць: <tspan font-weight="700" fill="#DC2626">на 0.5–1.0 мм тонші</tspan> за основу (для пружності)</text>
  </g>

  <!-- Right Column: Formulas & Rules -->
  <g transform="translate(510, 80)">
    <text x="0" y="20" fill="#0F172A" font-size="13" font-weight="800">ЗОЛОТІ ПРОПОРЦІЇ CREW NECK</text>

    <!-- Card 1: 35/18/18/30 Proportion -->
    <rect y="38" width="250" height="125" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cnShadow)"/>
    <rect y="38" width="250" height="26" rx="10" fill="#EEF2FF"/>
    <text x="12" y="55" fill="#4338CA" font-size="11" font-weight="700">РОЗПОДІЛ ПЕТЕЛЬ ГОРЛОВИНИ</text>
    <text x="12" y="82" fill="#334155" font-size="10.5">• Спинка: <tspan font-weight="700" fill="#0F172A">35–38%</tspan> петель</text>
    <text x="12" y="100" fill="#334155" font-size="10.5">• Перед (глибоке коло): <tspan font-weight="700" fill="#0F172A">30–35%</tspan></text>
    <text x="12" y="118" fill="#334155" font-size="10.5">• Плечі (ліве + праве): <tspan font-weight="700" fill="#0F172A">по 15–18%</tspan></text>
    <text x="12" y="136" fill="#64748B" font-size="9.5">Баланс: Спинка ширша за перед на 2–4 см</text>

    <!-- Card 2: Rounding Stages Algorithm -->
    <rect y="178" width="250" height="135" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cnShadow)"/>
    <rect y="178" width="250" height="26" rx="10" fill="#ECFDF5"/>
    <text x="12" y="195" fill="#047857" font-size="11" font-weight="700">СТАДІЇ ПЛАВНОГО ЗАКРУГЛЕННЯ</text>
    <text x="12" y="222" fill="#334155" font-size="10">• 1. Центр: закрити одразу <tspan font-weight="700" fill="#059669">40% петель</tspan></text>
    <text x="12" y="240" fill="#334155" font-size="10">• 2. Крутий підйом: <tspan font-weight="700" fill="#059669">1×3 п., 1×2 п.</tspan></text>
    <text x="12" y="258" fill="#334155" font-size="10">• 3. Плавна дуга: <tspan font-weight="700" fill="#059669">по 1 п. у кожному 2-му р.</tspan></text>
    <text x="12" y="276" fill="#334155" font-size="10">• 4. Вертикаль: <tspan font-weight="700" fill="#059669">2–4 ряди прямо</tspan> до плеча</text>
    <text x="12" y="294" fill="#059669" font-size="9.5" font-weight="600">✓ Захист від сходинок і затягування краю</text>

    <!-- Card 3: Elastic Bind-off -->
    <rect y="328" width="250" height="85" rx="10" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1"/>
    <text x="12" y="348" fill="#991B1B" font-size="11" font-weight="700">ЕЛАСТИЧНИЙ ФАБРИЧНИЙ КРАЙ</text>
    <text x="12" y="368" fill="#7F1D1D" font-size="10">• Метод: <tspan font-weight="700">Tubular bind-off (голкою)</tspan></text>
    <text x="12" y="386" fill="#7F1D1D" font-size="10">• Розтяжність: комфортно проходить голова</text>
    <text x="12" y="402" fill="#7F1D1D" font-size="9.5">Ідеально тримає круглу форму після прання</text>
  </g>
</svg>`,
  },
  "dzhemper-kruhlyy": {
    title: "Розрахунок та геометрія круглого вирізу Crew Neck",
    caption: "Інженерна схема розрахунку горловини crew neck: пропорції 35/18/18/30, скіс плеча укороченими рядами, правило набору планки 3:4 та еластичне закриття tubular bind-off.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-crew-neck-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-crew-neck-title">Розрахунок та геометрія круглого вирізу Crew Neck</title>
  <defs>
    <linearGradient id="cnBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#F1F5F9" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="cnCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#DBEAFE" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="cnShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.07"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FFFFFF"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Header Banner -->
  <rect x="25" y="24" width="750" height="36" rx="8" fill="#0F172A"/>
  <text x="400" y="47" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="0.5">АНАТОМІЯ ТА РОЗРАХУНОК КРУГЛОГО ВИРІЗУ (CREW NECK)</text>

  <!-- Left: Technical Diagram of Crew Neck Geometry -->
  <g transform="translate(40, 80)">
    <!-- Main Sweater Chest & Neck Contour -->
    <!-- Shoulder Left, Neck curve, Shoulder Right, Body sides -->
    <path d="M 20,90 L 110,65 L 110,65 Q 150,65 170,105 Q 190,145 230,145 Q 270,145 290,105 Q 310,65 350,65 L 440,90 L 420,240 L 40,240 Z" fill="url(#cnBodyGrad)" stroke="#64748B" stroke-width="2" filter="url(#cnShadow)"/>

    <!-- Cutout Curve for Neckline with highlight -->
    <path d="M 110,65 Q 150,65 170,105 Q 190,145 230,145 Q 270,145 290,105 Q 310,65 350,65 Q 310,50 230,50 Q 150,50 110,65 Z" fill="url(#cnCurveGrad)" stroke="#2563EB" stroke-width="2.5"/>

    <!-- Center Front Straight Segment (Закриття центру) -->
    <path d="M 195,145 L 265,145" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>
    <rect x="175" y="160" width="110" height="24" rx="4" fill="#FEE2E2" stroke="#EF4444" stroke-width="1"/>
    <text x="230" y="176" fill="#991B1B" font-size="10.5" font-weight="700" text-anchor="middle">Центр: 35–40% петель</text>

    <!-- Stepped Decrease Groups (Left & Right) -->
    <!-- Right side steps: 3, 2, 1, 1, 1 -->
    <circle cx="275" cy="138" r="4" fill="#2563EB"/>
    <text x="290" y="142" fill="#1E40AF" font-size="9.5" font-weight="700">3 п.</text>
    
    <circle cx="285" cy="120" r="4" fill="#2563EB"/>
    <text x="300" y="124" fill="#1E40AF" font-size="9.5" font-weight="700">2 п.</text>
    
    <circle cx="295" cy="98" r="4" fill="#2563EB"/>
    <text x="310" y="102" fill="#1E40AF" font-size="9.5" font-weight="700">1 п. × 3</text>

    <!-- Shoulder Slopes (Укорочені ряди) -->
    <!-- Left shoulder slope -->
    <line x1="20" y1="90" x2="110" y2="65" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
    <text x="65" y="55" fill="#047857" font-size="10.5" font-weight="700" text-anchor="middle">Скіс плеча (3–5 см)</text>

    <!-- Right shoulder slope -->
    <line x1="350" y1="65" x2="440" y2="90" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
    <text x="395" y="55" fill="#047857" font-size="10.5" font-weight="700" text-anchor="middle">Німецькі укорочені ряди</text>

    <!-- Depth and Width Dimension Arrows -->
    <!-- Depth Front (6-8 cm) -->
    <line x1="230" y1="50" x2="230" y2="145" stroke="#EA580C" stroke-width="1.8" stroke-dasharray="3,3"/>
    <polygon points="230,50 227,58 233,58" fill="#EA580C"/>
    <polygon points="230,145 227,137 233,137" fill="#EA580C"/>
    <rect x="235" y="85" width="95" height="20" rx="4" fill="#FFEDD5"/>
    <text x="240" y="99" fill="#C2410C" font-size="10.5" font-weight="700">Глибина: 6–8 см</text>

    <!-- Depth Back (2-3 cm) -->
    <line x1="165" y1="50" x2="165" y2="65" stroke="#64748B" stroke-width="1.5"/>
    <text x="115" y="45" fill="#475569" font-size="9.5" font-weight="600">Спинка: 2–3 см</text>

    <!-- Width of Neckline (16-20 cm) -->
    <line x1="110" y1="260" x2="350" y2="260" stroke="#2563EB" stroke-width="1.8"/>
    <line x1="110" y1="70" x2="110" y2="265" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2,2"/>
    <line x1="350" y1="70" x2="350" y2="265" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2,2"/>
    <rect x="180" y="248" width="100" height="24" rx="4" fill="#DBEAFE"/>
    <text x="230" y="264" fill="#1E40AF" font-size="11" font-weight="700" text-anchor="middle">Ширина: 16–20 см</text>

    <!-- Bottom summary banner in left box -->
    <rect x="20" y="295" width="420" height="95" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="35" y="316" fill="#0F172A" font-size="11.5" font-weight="700">ПРАВИЛО НАБОРУ ПЕТЕЛЬ ДЛЯ ПЛАНКИ (БЕЙКИ):</text>
    <text x="35" y="336" fill="#334155" font-size="10.5">• По вертикальних скосах: <tspan font-weight="700" fill="#2563EB">3 петлі з кожних 4 рядів (співвідношення 3:4)</tspan></text>
    <text x="35" y="354" fill="#334155" font-size="10.5">• По горизонтальній частині: <tspan font-weight="700" fill="#059669">1 петля з 1 закритої петлі (1:1)</tspan></text>
    <text x="35" y="372" fill="#334155" font-size="10.5">• Зменшення спиць: <tspan font-weight="700" fill="#DC2626">на 0.5–1.0 мм тонші</tspan> за основу (для пружності)</text>
  </g>

  <!-- Right Column: Formulas & Rules -->
  <g transform="translate(510, 80)">
    <text x="0" y="20" fill="#0F172A" font-size="13" font-weight="800">ЗОЛОТІ ПРОПОРЦІЇ CREW NECK</text>

    <!-- Card 1: 35/18/18/30 Proportion -->
    <rect y="38" width="250" height="125" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cnShadow)"/>
    <rect y="38" width="250" height="26" rx="10" fill="#EEF2FF"/>
    <text x="12" y="55" fill="#4338CA" font-size="11" font-weight="700">РОЗПОДІЛ ПЕТЕЛЬ ГОРЛОВИНИ</text>
    <text x="12" y="82" fill="#334155" font-size="10.5">• Спинка: <tspan font-weight="700" fill="#0F172A">35–38%</tspan> петель</text>
    <text x="12" y="100" fill="#334155" font-size="10.5">• Перед (глибоке коло): <tspan font-weight="700" fill="#0F172A">30–35%</tspan></text>
    <text x="12" y="118" fill="#334155" font-size="10.5">• Плечі (ліве + праве): <tspan font-weight="700" fill="#0F172A">по 15–18%</tspan></text>
    <text x="12" y="136" fill="#64748B" font-size="9.5">Баланс: Спинка ширша за перед на 2–4 см</text>

    <!-- Card 2: Rounding Stages Algorithm -->
    <rect y="178" width="250" height="135" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cnShadow)"/>
    <rect y="178" width="250" height="26" rx="10" fill="#ECFDF5"/>
    <text x="12" y="195" fill="#047857" font-size="11" font-weight="700">СТАДІЇ ПЛАВНОГО ЗАКРУГЛЕННЯ</text>
    <text x="12" y="222" fill="#334155" font-size="10">• 1. Центр: закрити одразу <tspan font-weight="700" fill="#059669">40% петель</tspan></text>
    <text x="12" y="240" fill="#334155" font-size="10">• 2. Крутий підйом: <tspan font-weight="700" fill="#059669">1×3 п., 1×2 п.</tspan></text>
    <text x="12" y="258" fill="#334155" font-size="10">• 3. Плавна дуга: <tspan font-weight="700" fill="#059669">по 1 п. у кожному 2-му р.</tspan></text>
    <text x="12" y="276" fill="#334155" font-size="10">• 4. Вертикаль: <tspan font-weight="700" fill="#059669">2–4 ряди прямо</tspan> до плеча</text>
    <text x="12" y="294" fill="#059669" font-size="9.5" font-weight="600">✓ Захист від сходинок і затягування краю</text>

    <!-- Card 3: Elastic Bind-off -->
    <rect y="328" width="250" height="85" rx="10" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1"/>
    <text x="12" y="348" fill="#991B1B" font-size="11" font-weight="700">ЕЛАСТИЧНИЙ ФАБРИЧНИЙ КРАЙ</text>
    <text x="12" y="368" fill="#7F1D1D" font-size="10">• Метод: <tspan font-weight="700">Tubular bind-off (голкою)</tspan></text>
    <text x="12" y="386" fill="#7F1D1D" font-size="10">• Розтяжність: комфортно проходить голова</text>
    <text x="12" y="402" fill="#7F1D1D" font-size="9.5">Ідеально тримає круглу форму після прання</text>
  </g>
</svg>`,
  },
  "sectional-yarn-guide": {
    title: "Розрахунок секційної пряжі: рапорт секцій, градієнт та color pooling",
    caption: "Схема розрахунку в'язання з секційної пряжі: анатомія рапорту секції, математика запобігання випадковому пулінгу (плямам), чергування мотків 2х2 та синхронізація рукавів.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-sectional-yarn-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-sectional-yarn-title">Розрахунок в'язання з секційної пряжі та керування градієнтом</title>
  <defs>
    <linearGradient id="syGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="33%" stop-color="#FB923C"/>
      <stop offset="66%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <filter id="syShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FFFFFF"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Header Banner -->
  <rect x="25" y="24" width="750" height="36" rx="8" fill="#4C1D95"/>
  <text x="400" y="47" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="0.5">РОЗРАХУНОК СЕКЦІЙНОЇ ПРЯЖІ: COLOR POOLING ТА СИМЕТРІЯ</text>

  <!-- Left: Color Section Repeat Diagram -->
  <g transform="translate(35, 80)">
    <text x="0" y="18" fill="#0F172A" font-size="13" font-weight="800">1. АНАТОМІЯ СЕКЦІЙНОГО МОТКА (РАПОРТ СЕКЦІЇ)</text>

    <!-- Skein Yarn Thread with colored sections -->
    <rect y="35" width="420" height="40" rx="20" fill="url(#syGrad1)" stroke="#4C1D95" stroke-width="1.5" filter="url(#syShadow)"/>
    
    <!-- Section Markers & Lengths -->
    <line x1="140" y1="35" x2="140" y2="75" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3,3"/>
    <line x1="280" y1="35" x2="280" y2="75" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3,3"/>
    
    <text x="70" y="60" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Секція А (40 см)</text>
    <text x="210" y="60" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Секція Б (40 см)</text>
    <text x="350" y="60" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Секція В (40 см)</text>

    <text x="210" y="95" fill="#64748B" font-size="10" font-weight="600" text-anchor="middle">Повний кольоровий цикл (рапорт) = L_секції × Кількість_кольорів</text>

    <!-- Comparison: Planned Pooling vs Accidental Pooling -->
    <g transform="translate(0, 115)">
      <!-- Box 1: Accidental ugly spots -->
      <rect width="205" height="155" rx="8" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="1.5"/>
      <text x="102" y="24" fill="#9F1239" font-size="9" font-weight="700" text-anchor="middle">ХАОТИЧНІ ПЛЯМИ (БЕЗ РОЗРАХУНКУ)</text>
      
      <!-- Random color blob visuals -->
      <ellipse cx="60" cy="65" rx="35" ry="18" fill="#FB7185" opacity="0.7"/>
      <ellipse cx="130" cy="90" rx="45" ry="22" fill="#FBBF24" opacity="0.7"/>
      <ellipse cx="80" cy="115" rx="40" ry="16" fill="#38BDF8" opacity="0.7"/>
      
      <rect x="12" y="125" width="181" height="22" rx="4" fill="#FFE4E6"/>
      <text x="102" y="140" fill="#BE123C" font-size="9" font-weight="700" text-anchor="middle">⚠ Секція збігається з рядом</text>

      <!-- Box 2: Controlled Gradient / Alternating skeins -->
      <rect x="215" width="205" height="155" rx="8" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.5"/>
      <text x="317" y="24" fill="#166534" font-size="9" font-weight="700" text-anchor="middle">РІВНИЙ ГРАДІЄНТ (З РОЗРАХУНКОМ)</text>
      
      <!-- Clean parallel striping / helix -->
      <rect x="232" y="45" width="170" height="14" rx="3" fill="#FB7185"/>
      <rect x="232" y="64" width="170" height="14" rx="3" fill="#FB923C"/>
      <rect x="232" y="83" width="170" height="14" rx="3" fill="#FBBF24"/>
      <rect x="232" y="102" width="170" height="14" rx="3" fill="#38BDF8"/>
      
      <rect x="227" y="125" width="181" height="22" rx="4" fill="#DCFCE7"/>
      <text x="317" y="140" fill="#15803D" font-size="9" font-weight="700" text-anchor="middle">✓ Чергування 2 мотків (Helical)</text>
    </g>

    <!-- Bottom Tip Banner -->
    <rect y="290" width="420" height="98" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
    <text x="18" y="313" fill="#0F172A" font-size="11" font-weight="700">МАТЕМАТИКА COLOR POOLING (ПЕРЕВІРКА ЗБІГУ):</text>
    <text x="18" y="333" fill="#334155" font-size="10">• Витрата на 1 петлю: <tspan font-weight="700" fill="#7C3AED">l_п = Довжина_нитки ÷ N_петель</tspan></text>
    <text x="18" y="352" fill="#334155" font-size="10">• Кількість петель з секції: <tspan font-weight="700" fill="#2563EB">N_секції = Довжина_секції ÷ l_п</tspan></text>
    <text x="18" y="371" fill="#334155" font-size="10">• Щоб уникнути плям: <tspan font-weight="700" fill="#DC2626">Петлі_ряду не повинні бути кратними N_секції!</tspan></text>
  </g>

  <!-- Right: 3 Rules & Calculator Callout -->
  <g transform="translate(475, 80)">
    <text x="0" y="18" fill="#0F172A" font-size="13" font-weight="800">3 ГОЛОВНІ ПРИЙОМИ ДЛЯ СЕКЦІЙКИ</text>

    <!-- Rule 1: Alternating 2 skeins -->
    <rect y="35" width="290" height="88" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#syShadow)"/>
    <rect y="35" width="290" height="24" rx="10" fill="#F3E8FF"/>
    <text x="12" y="51" fill="#6B21A8" font-size="10" font-weight="700">1. ЧЕРГУВАННЯ МОТКІВ (2 РЯДИ / 2 РЯДИ)</text>
    <text x="12" y="74" fill="#334155" font-size="9.5">• Розбиває непередбачувані колірні плями.</text>
    <text x="12" y="91" fill="#334155" font-size="9.5">• Згладжує різницю відтінків між партіями.</text>
    <text x="12" y="108" fill="#059669" font-size="9" font-weight="600">✓ Створює м'який акварельний меланж</text>

    <!-- Rule 2: Hand-dyed sleeves matching -->
    <rect y="135" width="290" height="88" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#syShadow)"/>
    <rect y="135" width="290" height="24" rx="10" fill="#FEF3C7"/>
    <text x="12" y="151" fill="#92400E" font-size="10" font-weight="700">2. СИНХРОНІЗАЦІЯ РУКАВІВ ТА ПЕРЕДУ</text>
    <text x="12" y="174" fill="#334155" font-size="9.5">• Відмотуйте моток до тієї самої контрольної точки.</text>
    <text x="12" y="191" fill="#334155" font-size="9.5">• Починайте обидва рукави з одного кольору секції.</text>
    <text x="12" y="208" fill="#D97706" font-size="9" font-weight="600">✓ Однаковий малюнок на лівому та правому рукаві</text>

    <!-- Rule 3: Stitch Patterns selection -->
    <rect y="235" width="290" height="85" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#syShadow)"/>
    <rect y="235" width="290" height="24" rx="10" fill="#E0F2FE"/>
    <text x="12" y="251" fill="#0369A1" font-size="10" font-weight="700">3. ПІДБІР ПРАВИЛЬНОГО ВІЗЕРУНКА</text>
    <text x="12" y="274" fill="#334155" font-size="9.5">• Ідеально: Лицьова гладь, платочна в'язка, мохер.</text>
    <text x="12" y="291" fill="#334155" font-size="9.5">• Уникати: Складні дрібні коси (малюнок губиться).</text>
    <text x="12" y="307" fill="#0284C7" font-size="9" font-weight="600">✓ Хвилясті ажури (шеврони) підсилюють градієнт</text>

    <!-- Quick Formula Card -->
    <rect y="330" width="290" height="58" rx="8" fill="#FAF5FF" stroke="#C084FC" stroke-width="1"/>
    <text x="145" y="350" fill="#581C87" font-size="10" font-weight="700" text-anchor="middle">ФОРМУЛА ВИТРАТИ МЕТРІВ НА РЯД:</text>
    <text x="145" y="370" fill="#7E22CE" font-size="9.5" font-weight="800" text-anchor="middle">L_ряду (м) = N_петель_ряду × l_петлі (см) ÷ 100</text>
  </g>
</svg>`,
  },
  "sektsiyna-pryazha": {
    title: "Розрахунок секційної пряжі: рапорт секцій, градієнт та color pooling",
    caption: "Схема розрахунку в'язання з секційної пряжі: анатомія рапорту секції, математика запобігання випадковому пулінгу (плямам), чергування мотків 2х2 та синхронізація рукавів.",
    svg: `<svg viewBox="0 0 800 520" role="img" aria-labelledby="diagram-sectional-yarn-title" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="diagram-sectional-yarn-title">Розрахунок в'язання з секційної пряжі та керування градієнтом</title>
  <defs>
    <linearGradient id="syGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="33%" stop-color="#FB923C"/>
      <stop offset="66%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <filter id="syShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="800" height="520" rx="16" fill="#FFFFFF"/>
  <rect x="12" y="12" width="776" height="496" rx="12" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Title Header Banner -->
  <rect x="25" y="24" width="750" height="36" rx="8" fill="#4C1D95"/>
  <text x="400" y="47" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="0.5">РОЗРАХУНОК СЕКЦІЙНОЇ ПРЯЖІ: COLOR POOLING ТА СИМЕТРІЯ</text>

  <!-- Left: Color Section Repeat Diagram -->
  <g transform="translate(35, 80)">
    <text x="0" y="18" fill="#0F172A" font-size="13" font-weight="800">1. АНАТОМІЯ СЕКЦІЙНОГО МОТКА (РАПОРТ СЕКЦІЇ)</text>

    <!-- Skein Yarn Thread with colored sections -->
    <rect y="35" width="420" height="40" rx="20" fill="url(#syGrad1)" stroke="#4C1D95" stroke-width="1.5" filter="url(#syShadow)"/>
    
    <!-- Section Markers & Lengths -->
    <line x1="140" y1="35" x2="140" y2="75" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3,3"/>
    <line x1="280" y1="35" x2="280" y2="75" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3,3"/>
    
    <text x="70" y="60" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Секція А (40 см)</text>
    <text x="210" y="60" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Секція Б (40 см)</text>
    <text x="350" y="60" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Секція В (40 см)</text>

    <text x="210" y="95" fill="#64748B" font-size="10" font-weight="600" text-anchor="middle">Повний кольоровий цикл (рапорт) = L_секції × Кількість_кольорів</text>

    <!-- Comparison: Planned Pooling vs Accidental Pooling -->
    <g transform="translate(0, 115)">
      <!-- Box 1: Accidental ugly spots -->
      <rect width="205" height="155" rx="8" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="1.5"/>
      <text x="102" y="24" fill="#9F1239" font-size="9" font-weight="700" text-anchor="middle">ХАОТИЧНІ ПЛЯМИ (БЕЗ РОЗРАХУНКУ)</text>
      
      <!-- Random color blob visuals -->
      <ellipse cx="60" cy="65" rx="35" ry="18" fill="#FB7185" opacity="0.7"/>
      <ellipse cx="130" cy="90" rx="45" ry="22" fill="#FBBF24" opacity="0.7"/>
      <ellipse cx="80" cy="115" rx="40" ry="16" fill="#38BDF8" opacity="0.7"/>
      
      <rect x="12" y="125" width="181" height="22" rx="4" fill="#FFE4E6"/>
      <text x="102" y="140" fill="#BE123C" font-size="9" font-weight="700" text-anchor="middle">⚠ Секція збігається з рядом</text>

      <!-- Box 2: Controlled Gradient / Alternating skeins -->
      <rect x="215" width="205" height="155" rx="8" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.5"/>
      <text x="317" y="24" fill="#166534" font-size="9" font-weight="700" text-anchor="middle">РІВНИЙ ГРАДІЄНТ (З РОЗРАХУНКОМ)</text>
      
      <!-- Clean parallel striping / helix -->
      <rect x="232" y="45" width="170" height="14" rx="3" fill="#FB7185"/>
      <rect x="232" y="64" width="170" height="14" rx="3" fill="#FB923C"/>
      <rect x="232" y="83" width="170" height="14" rx="3" fill="#FBBF24"/>
      <rect x="232" y="102" width="170" height="14" rx="3" fill="#38BDF8"/>
      
      <rect x="227" y="125" width="181" height="22" rx="4" fill="#DCFCE7"/>
      <text x="317" y="140" fill="#15803D" font-size="9" font-weight="700" text-anchor="middle">✓ Чергування 2 мотків (Helical)</text>
    </g>

    <!-- Bottom Tip Banner -->
    <rect y="290" width="420" height="98" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/>
    <text x="18" y="313" fill="#0F172A" font-size="11" font-weight="700">МАТЕМАТИКА COLOR POOLING (ПЕРЕВІРКА ЗБІГУ):</text>
    <text x="18" y="333" fill="#334155" font-size="10">• Витрата на 1 петлю: <tspan font-weight="700" fill="#7C3AED">l_п = Довжина_нитки ÷ N_петель</tspan></text>
    <text x="18" y="352" fill="#334155" font-size="10">• Кількість петель з секції: <tspan font-weight="700" fill="#2563EB">N_секції = Довжина_секції ÷ l_п</tspan></text>
    <text x="18" y="371" fill="#334155" font-size="10">• Щоб уникнути плям: <tspan font-weight="700" fill="#DC2626">Петлі_ряду не повинні бути кратними N_секції!</tspan></text>
  </g>

  <!-- Right: 3 Rules & Calculator Callout -->
  <g transform="translate(475, 80)">
    <text x="0" y="18" fill="#0F172A" font-size="13" font-weight="800">3 ГОЛОВНІ ПРИЙОМИ ДЛЯ СЕКЦІЙКИ</text>

    <!-- Rule 1: Alternating 2 skeins -->
    <rect y="35" width="290" height="88" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#syShadow)"/>
    <rect y="35" width="290" height="24" rx="10" fill="#F3E8FF"/>
    <text x="12" y="51" fill="#6B21A8" font-size="10" font-weight="700">1. ЧЕРГУВАННЯ МОТКІВ (2 РЯДИ / 2 РЯДИ)</text>
    <text x="12" y="74" fill="#334155" font-size="9.5">• Розбиває непередбачувані колірні плями.</text>
    <text x="12" y="91" fill="#334155" font-size="9.5">• Згладжує різницю відтінків між партіями.</text>
    <text x="12" y="108" fill="#059669" font-size="9" font-weight="600">✓ Створює м'який акварельний меланж</text>

    <!-- Rule 2: Hand-dyed sleeves matching -->
    <rect y="135" width="290" height="88" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#syShadow)"/>
    <rect y="135" width="290" height="24" rx="10" fill="#FEF3C7"/>
    <text x="12" y="151" fill="#92400E" font-size="10" font-weight="700">2. СИНХРОНІЗАЦІЯ РУКАВІВ ТА ПЕРЕДУ</text>
    <text x="12" y="174" fill="#334155" font-size="9.5">• Відмотуйте моток до тієї самої контрольної точки.</text>
    <text x="12" y="191" fill="#334155" font-size="9.5">• Починайте обидва рукави з одного кольору секції.</text>
    <text x="12" y="208" fill="#D97706" font-size="9" font-weight="600">✓ Однаковий малюнок на лівому та правому рукаві</text>

    <!-- Rule 3: Stitch Patterns selection -->
    <rect y="235" width="290" height="85" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#syShadow)"/>
    <rect y="235" width="290" height="24" rx="10" fill="#E0F2FE"/>
    <text x="12" y="251" fill="#0369A1" font-size="10" font-weight="700">3. ПІДБІР ПРАВИЛЬНОГО ВІЗЕРУНКА</text>
    <text x="12" y="274" fill="#334155" font-size="9.5">• Ідеально: Лицьова гладь, платочна в'язка, мохер.</text>
    <text x="12" y="291" fill="#334155" font-size="9.5">• Уникати: Складні дрібні коси (малюнок губиться).</text>
    <text x="12" y="307" fill="#0284C7" font-size="9" font-weight="600">✓ Хвилясті ажури (шеврони) підсилюють градієнт</text>

    <!-- Quick Formula Card -->
    <rect y="330" width="290" height="58" rx="8" fill="#FAF5FF" stroke="#C084FC" stroke-width="1"/>
    <text x="145" y="350" fill="#581C87" font-size="10" font-weight="700" text-anchor="middle">ФОРМУЛА ВИТРАТИ МЕТРІВ НА РЯД:</text>
    <text x="145" y="370" fill="#7E22CE" font-size="9.5" font-weight="800" text-anchor="middle">L_ряду (м) = N_петель_ряду × l_петлі (см) ÷ 100</text>
  </g>
</svg>`,
  },
};

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