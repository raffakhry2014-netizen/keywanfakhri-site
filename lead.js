/* KeyOne – Anfrage nach dem Vorlagen-Download.
   Der Download startet immer sofort und ohne Bedingung. Danach erscheint einmal pro Sitzung
   ein kleines, freiwilliges Formular für eine individuelle Version. Die Anfrage geht an /api/contact
   (erscheint im Panel unter „پیام‌ها" und per E-Mail). Keine Cookies, kein Newsletter. */
(function () {
  "use strict";
  var T = {
    de: { t: "Ihr Download läuft", p: "Soll ich die Vorlage an Ihren Betrieb anpassen? Zum Beispiel eigene Kategorien, mehrere Standorte oder Anbindung an Ihre Daten. Schreiben Sie kurz, wofür Sie sie nutzen – ich melde mich innerhalb von 1–2 Werktagen. Unverbindlich.", n: "Name", e: "E-Mail", m: "Wofür nutzen Sie die Vorlage? (optional)", s: "Unverbindlich anfragen", c: "Nein danke", ok: "Danke! Ihre Anfrage ist angekommen. Ich melde mich bald.", err: "Senden hat nicht geklappt. Bitte schreiben Sie an keywanfakhri1@gmail.com.", inv: "Bitte Name und eine gültige E-Mail eingeben.", pr: "Ihre Angaben werden nur zur Beantwortung dieser Anfrage verwendet.", ds: "Datenschutz", x: "Schließen" },
    en: { t: "Your download has started", p: "Would you like the template adapted to your business? For example your own categories, several sites or a link to your data. Tell me briefly what you use it for – I'll reply within 1–2 working days. No obligation.", n: "Name", e: "Email", m: "What do you use the template for? (optional)", s: "Send request", c: "No thanks", ok: "Thank you! Your request has arrived. I'll be in touch soon.", err: "Sending failed. Please write to keywanfakhri1@gmail.com.", inv: "Please enter your name and a valid email.", pr: "Your details are only used to answer this request.", ds: "Privacy policy", x: "Close" },
    fa: { t: "دانلود شروع شد", p: "می‌خواهید این قالب برای کسب‌وکار شما شخصی‌سازی شود؟ مثلاً دسته‌بندی‌های خودتان، چند شعبه یا اتصال به داده‌هایتان. کوتاه بنویسید برای چه کاری از آن استفاده می‌کنید – ظرف ۱ تا ۲ روز کاری پاسخ می‌دهم. بدون هیچ تعهدی.", n: "نام", e: "ایمیل", m: "از قالب برای چه کاری استفاده می‌کنید؟ (اختیاری)", s: "ارسال درخواست", c: "نه، ممنون", ok: "ممنون! درخواست شما رسید. به‌زودی با شما تماس می‌گیرم.", err: "ارسال انجام نشد. لطفاً به keywanfakhri1@gmail.com ایمیل بزنید.", inv: "لطفاً نام و یک ایمیل معتبر وارد کنید.", pr: "اطلاعات شما فقط برای پاسخ به همین درخواست استفاده می‌شود.", ds: "حریم خصوصی", x: "بستن" },
    ar: { t: "بدأ التنزيل", p: "هل تريد تكييف القالب مع نشاطك التجاري؟ مثلاً فئات خاصة بك أو عدة مواقع أو ربطه ببياناتك. اكتب باختصار لماذا تستخدمه – سأرد خلال يوم إلى يومي عمل. دون أي التزام.", n: "الاسم", e: "البريد الإلكتروني", m: "لأي غرض تستخدم القالب؟ (اختياري)", s: "إرسال الطلب", c: "لا، شكرًا", ok: "شكرًا! وصل طلبك. سأتواصل معك قريبًا.", err: "تعذّر الإرسال. يرجى الكتابة إلى keywanfakhri1@gmail.com.", inv: "يرجى إدخال الاسم وبريد إلكتروني صالح.", pr: "تُستخدم بياناتك فقط للرد على هذا الطلب.", ds: "سياسة الخصوصية", x: "إغلاق" },
    tr: { t: "İndirme başladı", p: "Şablonu işletmenize göre uyarlamamı ister misiniz? Örneğin kendi kategorileriniz, birden fazla lokasyon veya verilerinize bağlantı. Ne için kullandığınızı kısaca yazın – 1–2 iş günü içinde dönüş yaparım. Bağlayıcı değildir.", n: "Ad", e: "E-posta", m: "Şablonu ne için kullanıyorsunuz? (isteğe bağlı)", s: "Talep gönder", c: "Hayır, teşekkürler", ok: "Teşekkürler! Talebiniz ulaştı. Yakında dönüş yapacağım.", err: "Gönderilemedi. Lütfen keywanfakhri1@gmail.com adresine yazın.", inv: "Lütfen adınızı ve geçerli bir e-posta girin.", pr: "Bilgileriniz yalnızca bu talebi yanıtlamak için kullanılır.", ds: "Gizlilik", x: "Kapat" },
    it: { t: "Il download è iniziato", p: "Vuoi che adatti il modello alla tua attività? Ad esempio categorie proprie, più sedi o il collegamento ai tuoi dati. Scrivimi in breve per cosa lo usi – rispondo entro 1–2 giorni lavorativi. Senza impegno.", n: "Nome", e: "E-mail", m: "Per cosa usi il modello? (facoltativo)", s: "Invia richiesta", c: "No, grazie", ok: "Grazie! La tua richiesta è arrivata. Ti risponderò presto.", err: "Invio non riuscito. Scrivi a keywanfakhri1@gmail.com.", inv: "Inserisci nome e un indirizzo e-mail valido.", pr: "I tuoi dati vengono usati solo per rispondere a questa richiesta.", ds: "Privacy", x: "Chiudi" },
    fr: { t: "Votre téléchargement a commencé", p: "Souhaitez-vous que j'adapte le modèle à votre entreprise ? Par exemple vos propres catégories, plusieurs sites ou un lien avec vos données. Dites-moi brièvement à quoi il vous sert – je réponds sous 1 à 2 jours ouvrés. Sans engagement.", n: "Nom", e: "E-mail", m: "À quoi vous sert le modèle ? (facultatif)", s: "Envoyer la demande", c: "Non merci", ok: "Merci ! Votre demande est bien arrivée. Je reviens vers vous bientôt.", err: "L'envoi a échoué. Écrivez à keywanfakhri1@gmail.com.", inv: "Veuillez saisir votre nom et une adresse e-mail valide.", pr: "Vos données servent uniquement à répondre à cette demande.", ds: "Confidentialité", x: "Fermer" },
    ko: { t: "다운로드가 시작되었습니다", p: "템플릿을 귀사에 맞게 조정해 드릴까요? 예: 자체 카테고리, 여러 지점, 데이터 연동. 어떤 용도로 쓰시는지 간단히 적어 주세요 – 영업일 기준 1~2일 내에 답변드립니다. 부담 없이 문의하세요.", n: "이름", e: "이메일", m: "템플릿을 어떤 용도로 사용하시나요? (선택)", s: "문의 보내기", c: "괜찮습니다", ok: "감사합니다! 문의가 접수되었습니다. 곧 연락드리겠습니다.", err: "전송에 실패했습니다. keywanfakhri1@gmail.com으로 보내 주세요.", inv: "이름과 올바른 이메일을 입력해 주세요.", pr: "입력하신 정보는 이 문의에 답변하는 데에만 사용됩니다.", ds: "개인정보 처리방침", x: "닫기" },
    zh: { t: "下载已开始", p: "需要我根据您的业务调整这个模板吗？例如自定义类别、多个门店或连接您的数据。简单写一下您的用途——我会在 1–2 个工作日内回复。无任何义务。", n: "姓名", e: "电子邮箱", m: "您用这个模板做什么？（可选）", s: "发送咨询", c: "不用了，谢谢", ok: "谢谢！已收到您的咨询，我会尽快回复。", err: "发送失败。请写信至 keywanfakhri1@gmail.com。", inv: "请输入姓名和有效的电子邮箱。", pr: "您的信息仅用于回复本次咨询。", ds: "隐私政策", x: "关闭" },
    ja: { t: "ダウンロードを開始しました", p: "テンプレートを御社向けにカスタマイズしましょうか？独自のカテゴリ、複数拠点、データ連携など。用途を簡単にお書きください。1〜2営業日以内にご返信します。お気軽にどうぞ。", n: "お名前", e: "メールアドレス", m: "テンプレートの用途（任意）", s: "問い合わせを送信", c: "結構です", ok: "ありがとうございます。お問い合わせを受け付けました。近日中にご連絡します。", err: "送信できませんでした。keywanfakhri1@gmail.com までご連絡ください。", inv: "お名前と有効なメールアドレスを入力してください。", pr: "入力内容はこのお問い合わせへの回答にのみ使用します。", ds: "プライバシーポリシー", x: "閉じる" },
    es: { t: "Tu descarga ha comenzado", p: "¿Quieres que adapte la plantilla a tu negocio? Por ejemplo categorías propias, varias sedes o conexión con tus datos. Cuéntame brevemente para qué la usas – respondo en 1–2 días laborables. Sin compromiso.", n: "Nombre", e: "Correo electrónico", m: "¿Para qué usas la plantilla? (opcional)", s: "Enviar solicitud", c: "No, gracias", ok: "¡Gracias! Tu solicitud ha llegado. Te responderé pronto.", err: "No se pudo enviar. Escribe a keywanfakhri1@gmail.com.", inv: "Introduce tu nombre y un correo válido.", pr: "Tus datos solo se usan para responder a esta solicitud.", ds: "Privacidad", x: "Cerrar" },
    sq: { t: "Shkarkimi filloi", p: "Dëshironi ta përshtat shabllonin për biznesin tuaj? Për shembull kategori të veta, disa vendndodhje ose lidhje me të dhënat tuaja. Shkruani shkurt për çfarë e përdorni – përgjigjem brenda 1–2 ditëve pune. Pa detyrim.", n: "Emri", e: "Email", m: "Për çfarë e përdorni shabllonin? (opsionale)", s: "Dërgo kërkesën", c: "Jo, faleminderit", ok: "Faleminderit! Kërkesa juaj mbërriti. Do t'ju kontaktoj së shpejti.", err: "Dërgimi dështoi. Ju lutem shkruani në keywanfakhri1@gmail.com.", inv: "Ju lutem shkruani emrin dhe një email të vlefshëm.", pr: "Të dhënat tuaja përdoren vetëm për t'iu përgjigjur kësaj kërkese.", ds: "Privatësia", x: "Mbyll" }
  };

  var lang = ((new URLSearchParams(location.search).get("lang")) || document.documentElement.lang || "de").slice(0, 2).toLowerCase();
  var L = T[lang] || T.en;
  var KEY = "keyone-lead-shown";
  var shown = false;
  function seen() { if (shown) return true; try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function mark() { shown = true; try { sessionStorage.setItem(KEY, "1"); } catch (e) {} }

  function nameFromFile(href) {
    var f = (href.split("/").pop() || "").replace(/\.xlsx.*$/i, "").replace(/^KeyOne_/, "");
    return f.replace(/_/g, " ");
  }

  var CSS = ".ko-lead{border:0;padding:0;border-radius:14px;max-width:min(480px,calc(100vw - 32px));width:100%;color:#162d2e;box-shadow:0 24px 60px rgba(10,40,40,.28);font-family:inherit}" +
    ".ko-lead::backdrop{background:rgba(10,30,30,.45)}" +
    ".ko-lead form{padding:26px 26px 22px;margin:0;display:grid;gap:12px}" +
    ".ko-lead h2{font-size:21px;margin:0;line-height:1.3;display:flex;align-items:center;gap:10px}" +
    ".ko-lead h2 span{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#eef7f5;color:#087e7c;font-size:16px;flex:none}" +
    ".ko-lead p{margin:0;font-size:15px;line-height:1.6;color:#3e5253}" +
    ".ko-lead label{display:grid;gap:4px;font-size:13.5px;font-weight:600}" +
    ".ko-lead input,.ko-lead textarea{font:inherit;font-size:15px;font-weight:400;border:1px solid #c9d6d5;border-radius:8px;padding:10px 12px;width:100%;box-sizing:border-box;color:inherit;background:#fff}" +
    ".ko-lead textarea{min-height:72px;resize:vertical}" +
    ".ko-lead input:focus,.ko-lead textarea:focus{outline:2px solid #087e7c;outline-offset:1px;border-color:#087e7c}" +
    ".ko-lead .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}" +
    ".ko-lead button{font:inherit;font-size:15px;font-weight:600;border-radius:8px;padding:11px 18px;cursor:pointer;border:1px solid #087e7c}" +
    ".ko-lead .go{background:#087e7c;color:#fff}.ko-lead .go:hover{background:#066562}.ko-lead .go[disabled]{opacity:.6;cursor:wait}" +
    ".ko-lead .no{background:#fff;color:#087e7c}" +
    ".ko-lead .x{position:absolute;top:10px;inset-inline-end:10px;border:0;background:none;font-size:22px;line-height:1;padding:6px 10px;color:#5b6b6c}" +
    ".ko-lead small{font-size:12.5px;color:#5b6b6c;line-height:1.5}.ko-lead small a{color:#087e7c}" +
    ".ko-lead .msg{font-size:14px;font-weight:600;color:#087e7c}.ko-lead .msg.bad{color:#b3261e}" +
    ".ko-lead .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}";

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function open(tpl) {
    if (typeof HTMLDialogElement !== "function") return;
    if (!document.getElementById("ko-lead-css")) {
      var st = document.createElement("style"); st.id = "ko-lead-css"; st.textContent = CSS; document.head.appendChild(st);
    }
    var d = document.createElement("dialog");
    d.className = "ko-lead";
    d.setAttribute("aria-labelledby", "ko-lead-t");
    d.innerHTML =
      '<form method="dialog" novalidate>' +
      '<button type="button" class="x" aria-label="' + esc(L.x) + '">×</button>' +
      '<h2 id="ko-lead-t"><span aria-hidden="true">✓</span>' + esc(L.t) + '</h2>' +
      '<p>' + esc(L.p) + '</p>' +
      '<label>' + esc(L.n) + '<input name="name" autocomplete="name" maxlength="100" required></label>' +
      '<label>' + esc(L.e) + '<input name="email" type="email" autocomplete="email" maxlength="150" required></label>' +
      '<label>' + esc(L.m) + '<textarea name="note" maxlength="1500"></textarea></label>' +
      '<div class="hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>' +
      '<div class="msg" role="status" aria-live="polite"></div>' +
      '<div class="row"><button type="submit" class="go" data-track="lead: send">' + esc(L.s) + '</button>' +
      '<button type="button" class="no" data-track="lead: no">' + esc(L.c) + '</button></div>' +
      '<small>' + esc(L.pr) + ' <a href="/datenschutz/" target="_blank" rel="noopener">' + esc(L.ds) + '</a></small>' +
      '</form>';
    document.body.appendChild(d);
    var f = d.querySelector("form"), msg = d.querySelector(".msg"), go = d.querySelector(".go");
    var t0 = Date.now();
    function close() { try { d.close(); } catch (e) {} d.remove(); }
    d.querySelector(".x").addEventListener("click", close);
    d.querySelector(".no").addEventListener("click", close);
    d.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
    d.addEventListener("click", function (e) { if (e.target === d) close(); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = f.name.value.trim(), email = f.email.value.trim(), note = f.note.value.trim();
      msg.className = "msg";
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = L.inv; msg.className = "msg bad"; return; }
      go.disabled = true;
      fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name, email: email, lang: lang, page: location.pathname,
          message: "[Vorlage: " + tpl + "] Anfrage nach Download – individuelle Version.\n\n" + (note || "—"),
          website: f.website.value, elapsed: Date.now() - t0
        })
      }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function () {
        f.innerHTML = '<button type="button" class="x" aria-label="' + esc(L.x) + '">×</button><h2><span aria-hidden="true">✓</span>' + esc(L.ok) + '</h2>';
        f.querySelector(".x").addEventListener("click", close);
        setTimeout(close, 4000);
      }).catch(function () { go.disabled = false; msg.textContent = L.err; msg.className = "msg bad"; });
    });
    d.showModal();
    setTimeout(function () { try { f.name.focus(); } catch (e) {} }, 50);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="/templates/files/"]');
    if (!a || !/\.xlsx(\?|#|$)/i.test(a.getAttribute("href") || "") || seen()) return;
    mark();
    var tpl = nameFromFile(a.getAttribute("href"));
    setTimeout(function () { open(tpl); }, 700);
  });
})();
