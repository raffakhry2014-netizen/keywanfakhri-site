/* KeyOne – Schnelleinstieg auf der Startseite: drei klare Wege direkt unter dem Hero
   (Excel-Vorlagen, Gastronomie, Logistik) + Kontaktzeile. 12 Sprachen wie die Website. */
(function () {
  "use strict";
  var T = {
    de: { h: "Womit kann ich Ihnen helfen?", a: ["Kostenlose Excel-Vorlagen", "7 fertige Vorlagen für Lager, Finanzen, Personal und Gastronomie – ohne Makros, in 12 Sprachen.", "Vorlagen ansehen"], b: ["Digitale Lösungen für Gastronomie", "Mehrsprachige Speisekarte per QR, Online-Reservierung, Telefon- und E-Mail-Assistent.", "Lösungen ansehen"], c: ["Logistik & Prozesse", "Lagerplanung, KPI-Dashboards und Prozessanalyse – aus über 8 Jahren Praxis in der Logistik.", "Projekte ansehen"], q: "Sie haben eine konkrete Aufgabe?", k: "Unverbindlich anfragen" },
    en: { h: "How can I help you?", a: ["Free Excel templates", "7 ready-made templates for warehouse, finance, staff and restaurants – no macros, in 12 languages.", "View templates"], b: ["Digital tools for restaurants", "Multilingual QR menu, online booking, phone and email assistant.", "View solutions"], c: ["Logistics & processes", "Warehouse planning, KPI dashboards and process analysis – from 8+ years of hands-on logistics work.", "View projects"], q: "Have a specific task in mind?", k: "Get in touch" },
    fa: { h: "چطور می‌توانم کمکتان کنم؟", a: ["قالب‌های رایگان اکسل", "۷ قالب آماده برای انبار، مالی، پرسنل و رستوران – بدون ماکرو، به ۱۲ زبان.", "دیدن قالب‌ها"], b: ["راهکارهای دیجیتال برای رستوران", "منوی چندزبانه با QR، رزرو آنلاین، دستیار تلفن و ایمیل.", "دیدن راهکارها"], c: ["لجستیک و فرایندها", "برنامه‌ریزی انبار، داشبورد KPI و تحلیل فرایند – با بیش از ۸ سال تجربهٔ عملی در لجستیک.", "دیدن پروژه‌ها"], q: "کار مشخصی در نظر دارید؟", k: "تماس بدون تعهد" },
    ar: { h: "كيف يمكنني مساعدتك؟", a: ["قوالب Excel مجانية", "7 قوالب جاهزة للمستودعات والمالية والموظفين والمطاعم – بدون وحدات ماكرو، بـ12 لغة.", "عرض القوالب"], b: ["حلول رقمية للمطاعم", "قائمة طعام متعددة اللغات عبر QR، حجز عبر الإنترنت، مساعد للهاتف والبريد الإلكتروني.", "عرض الحلول"], c: ["اللوجستيات والعمليات", "تخطيط المستودعات ولوحات مؤشرات الأداء وتحليل العمليات – بخبرة عملية تزيد على 8 سنوات.", "عرض المشاريع"], q: "هل لديك مهمة محددة؟", k: "تواصل دون التزام" },
    tr: { h: "Size nasıl yardımcı olabilirim?", a: ["Ücretsiz Excel şablonları", "Depo, finans, personel ve restoran için 7 hazır şablon – makrosuz, 12 dilde.", "Şablonları gör"], b: ["Restoranlar için dijital çözümler", "QR ile çok dilli menü, online rezervasyon, telefon ve e-posta asistanı.", "Çözümleri gör"], c: ["Lojistik ve süreçler", "Depo planlama, KPI panoları ve süreç analizi – 8 yılı aşkın lojistik deneyimiyle.", "Projeleri gör"], q: "Belirli bir işiniz mi var?", k: "Bağlayıcı olmadan yazın" },
    it: { h: "Come posso aiutarti?", a: ["Modelli Excel gratuiti", "7 modelli pronti per magazzino, finanza, personale e ristorazione – senza macro, in 12 lingue.", "Vedi i modelli"], b: ["Soluzioni digitali per la ristorazione", "Menu multilingue con QR, prenotazione online, assistente telefonico ed e-mail.", "Vedi le soluzioni"], c: ["Logistica e processi", "Pianificazione del magazzino, dashboard KPI e analisi dei processi – da oltre 8 anni di pratica in logistica.", "Vedi i progetti"], q: "Hai un'esigenza concreta?", k: "Scrivimi senza impegno" },
    fr: { h: "Comment puis-je vous aider ?", a: ["Modèles Excel gratuits", "7 modèles prêts à l'emploi pour l'entrepôt, la finance, le personnel et la restauration – sans macros, en 12 langues.", "Voir les modèles"], b: ["Solutions numériques pour la restauration", "Menu multilingue par QR, réservation en ligne, assistant téléphonique et e-mail.", "Voir les solutions"], c: ["Logistique et processus", "Planification d'entrepôt, tableaux de bord KPI et analyse des processus – fort de plus de 8 ans de pratique en logistique.", "Voir les projets"], q: "Vous avez un besoin précis ?", k: "Me contacter sans engagement" },
    ko: { h: "무엇을 도와드릴까요?", a: ["무료 Excel 템플릿", "창고, 재무, 인사, 외식업을 위한 7가지 완성형 템플릿 – 매크로 없음, 12개 언어 지원.", "템플릿 보기"], b: ["외식업을 위한 디지털 솔루션", "QR 다국어 메뉴, 온라인 예약, 전화·이메일 어시스턴트.", "솔루션 보기"], c: ["물류 및 프로세스", "창고 설계, KPI 대시보드, 프로세스 분석 – 8년 이상의 물류 실무 경험.", "프로젝트 보기"], q: "구체적인 과제가 있으신가요?", k: "부담 없이 문의하기" },
    zh: { h: "我能为您做什么？", a: ["免费 Excel 模板", "7 个现成模板，涵盖仓库、财务、人员和餐饮——无宏，支持 12 种语言。", "查看模板"], b: ["餐饮数字化解决方案", "多语言二维码菜单、在线预订、电话与邮件助手。", "查看方案"], c: ["物流与流程", "仓库规划、KPI 仪表板和流程分析——基于 8 年以上的物流实践经验。", "查看项目"], q: "有具体的需求吗？", k: "免费咨询" },
    ja: { h: "どのようにお手伝いできますか？", a: ["無料のExcelテンプレート", "倉庫・財務・人事・飲食店向けの7つのテンプレート – マクロなし、12言語対応。", "テンプレートを見る"], b: ["飲食店向けデジタルソリューション", "QR多言語メニュー、オンライン予約、電話・メールアシスタント。", "ソリューションを見る"], c: ["物流とプロセス", "倉庫計画、KPIダッシュボード、プロセス分析 – 8年以上の物流実務経験から。", "プロジェクトを見る"], q: "具体的なご依頼がありますか？", k: "お気軽にお問い合わせ" },
    es: { h: "¿En qué puedo ayudarte?", a: ["Plantillas de Excel gratuitas", "7 plantillas listas para almacén, finanzas, personal y hostelería – sin macros, en 12 idiomas.", "Ver plantillas"], b: ["Soluciones digitales para hostelería", "Carta multilingüe con QR, reservas online, asistente telefónico y de correo.", "Ver soluciones"], c: ["Logística y procesos", "Planificación de almacenes, paneles de KPI y análisis de procesos – con más de 8 años de experiencia práctica en logística.", "Ver proyectos"], q: "¿Tienes una tarea concreta?", k: "Consultar sin compromiso" },
    sq: { h: "Si mund t'ju ndihmoj?", a: ["Shabllone Excel falas", "7 shabllone të gatshme për magazinë, financa, personel dhe gastronomi – pa makro, në 12 gjuhë.", "Shiko shabllonet"], b: ["Zgjidhje dixhitale për gastronominë", "Menu shumëgjuhëshe me QR, rezervim online, asistent telefonik dhe email.", "Shiko zgjidhjet"], c: ["Logjistikë dhe procese", "Planifikim magazine, panele KPI dhe analizë procesesh – nga mbi 8 vjet përvojë praktike në logjistikë.", "Shiko projektet"], q: "Keni një detyrë konkrete?", k: "Na shkruani pa detyrim" }
  };
  var ICON = {
    a: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
    b: "M5 3h14v18H5zM8 7h8M8 11h8M8 15h5",
    c: "M3 21V8l9-5 9 5v13M7 21v-7h10v7"
  };
  var CSS = ".quick-paths{padding:8px 0 40px;border-bottom:1px solid var(--line,#dce5e4);margin-bottom:12px}" +
    ".quick-paths h2{font-family:Manrope,'DM Sans',Arial,sans-serif;font-size:clamp(21px,2.2vw,26px);font-weight:600;letter-spacing:-.4px;margin:0 0 18px}" +
    "html[dir=rtl] .quick-paths h2{font-family:'Vazirmatn',Arial,sans-serif;letter-spacing:0}" +
    ".qp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}" +
    ".qp-card{display:flex;flex-direction:column;gap:8px;border:1px solid var(--line,#dce5e4);border-radius:14px;padding:20px 20px 18px;text-decoration:none;color:inherit;background:#fff;transition:border-color .15s,box-shadow .15s}" +
    ".qp-card:hover{border-color:#087e7c;box-shadow:0 10px 28px rgba(8,126,124,.12)}" +
    ".qp-card svg{width:26px;height:26px;fill:none;stroke:#087e7c;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}" +
    ".qp-card b{font-size:17px;line-height:1.35}.qp-card span{font-size:14.5px;line-height:1.55;color:var(--muted,#5b6b6c);flex:1}" +
    ".qp-card em{font-style:normal;font-weight:700;font-size:14.5px;color:#066562;margin-top:4px}" +
    ".qp-ask{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:18px;font-size:15.5px}" +
    ".qp-ask a{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:10px;background:#087e7c;color:#fff;font-weight:700;text-decoration:none}.qp-ask a:hover{background:#066562}" +
    "@media (max-width:900px){.qp-grid{grid-template-columns:1fr}}";

  function curLang() {
    var l = "";
    try { if (typeof lang !== "undefined" && T[lang]) l = lang; } catch (e) {}
    if (!l) { var q = new URLSearchParams(location.search).get("lang"); if (T[q]) l = q; }
    if (!l) { try { var s = localStorage.getItem("keyone-language"); if (T[s]) l = s; } catch (e) {} }
    return l || "de";
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function card(key, d, href, track, area) {
    return '<a class="qp-card" href="' + href + '" data-track="home-path: ' + track + '"' + (area ? ' data-area-go="' + area + '"' : "") + '>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[key] + '"/></svg>' +
      '<b>' + esc(d[0]) + '</b><span>' + esc(d[1]) + '</span><em>' + esc(d[2]) + (/^(fa|ar)$/.test(curLang()) ? ' ←' : ' →') + '</em></a>';
  }
  function render() {
    var hero = document.getElementById("home");
    if (!hero) return;
    if (!document.getElementById("qp-css")) { var st = document.createElement("style"); st.id = "qp-css"; st.textContent = CSS; document.head.appendChild(st); }
    var box = document.getElementById("quick-paths");
    if (!box) { box = document.createElement("section"); box.id = "quick-paths"; box.className = "quick-paths"; hero.insertAdjacentElement("afterend", box); }
    var l = curLang(), t = T[l];
    box.setAttribute("aria-labelledby", "qp-title");
    box.innerHTML = '<h2 id="qp-title">' + esc(t.h) + '</h2><div class="qp-grid">' +
      card("a", t.a, "/templates/?lang=" + l, "templates") +
      card("b", t.b, "#projects", "gastro", "gastro") +
      card("c", t.c, "#projects", "logistics", "eng") +
      '</div><p class="qp-ask"><span>' + esc(t.q) + '</span><a href="/contact/?lang=' + l + '" data-track="home-path: contact">' + esc(t.k) + '</a></p>';
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-area-go]");
    if (!a) return;
    var tab = document.getElementById("area-tab-" + a.getAttribute("data-area-go"));
    if (tab) setTimeout(function () { tab.click(); }, 0);
  });
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "language-select") setTimeout(render, 30);
  });
  try {
    new MutationObserver(function () { setTimeout(render, 0); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] });
  } catch (e) {}
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
