var LAYERS = [
  { key:"growth", label:"رشد و بازار",    max:25, color:"#1F7A8C" },
  { key:"unit",   label:"اقتصاد واحد",     max:20, color:"#2E8F6B" },
  { key:"surv",   label:"بقا و رقیق‌سازی", max:20, color:"#B07D2B" },
  { key:"people", label:"مدیریت و مالکیت", max:15, color:"#8C5A9E" },
  { key:"cat",    label:"کاتالیزور و موج", max:15, color:"#C25E3A" },
  { key:"val",    label:"ارزش‌گذاری",      max:5,  color:"#5C6B73" }
];
var NUMS = ["marketCapM","advK","revGrowth","growthAccel","marketShare","grossMargin","gmTrend",
            "opLeverage","runwayMonths","shareGrowth","insiderOwn","instOwn","evSales","tamAnnualM","ret2y"];
var BOOLS = ["fcfPositive","founderLed","insiderBuying","de"];
var SELS  = ["debtLevel","megatrend","catalyst","moat"];
var FLAGS = [
  ["goingConcern","تداوم فعالیت"],["serialDilution","افزایش سرمایه پی‌درپی"],["reverseSplit","reverse split"],
  ["customerConc","تمرکز مشتری"],["auditorChange","تغییر حسابرس"],["otcShell","OTC / shell"],
  ["lumpyRevenue","درآمد یک‌باره"]
];
var VETO_FLAG = "goingConcern", FLAG_PENALTY = 7, CEIL_MIN = 4;
var CEIL = { share:40, margin:12, multiple:25 };

function step(v, table, fallback){
  if(!isFinite(v) || v === null || v === undefined) v = 0;
  for(var i=0;i<table.length;i++){ if(v < table[i][0]) return table[i][1]; }
  return fallback;
}
/* نبودِ داده با صفر یکی نیست. قبلاً فیلد خالی روی چند معیار نمره کامل می‌گرفت
   (رقیق‌سازی خالی = ۸ از ۸). حالا مجهول صفر امتیاز می‌گیرد و شمرده می‌شود. */
function isKnown(v){ return !(v === null || v === undefined || v === "" || !isFinite(v)); }
function stepN(v, table, fallback, ctx, label){
  if(!isKnown(v)){ ctx.unknown.push(label); return 0; }
  return step(v, table, fallback);
}
/* تعداد سهام منفی می‌تواند بازخرید سهام باشد یا تجمیع سهام یا اثر حسابداری IPO.
   بدون تأیید، «خوب» فرض نمی‌شود. */
function shareGrowthScore(d, ctx){
  var v = d.shareGrowth;
  if(!isKnown(v)){ ctx.unknown.push("رقیق‌سازی"); return 0; }
  if(v < 0 && !d.buybackVerified){ ctx.unknown.push("کاهش سهام تأییدنشده"); return 0; }
  return step(v, [[2,8],[5,6],[10,3],[20,1]], 0);
}
function ceiling(d){
  var tam = Number(d.tamAnnualM) || 0, mc = Number(d.marketCapM) || 0;
  if(!tam || !mc) return null;
  return tam * (CEIL.share/100) * (CEIL.margin/100) * CEIL.multiple / mc;
}
function score(d){
  var ctx = { unknown: [] };
  var g = stepN(d.revGrowth, [[0,0],[15,3],[30,7],[50,11],[80,14]], 15, ctx, "رشد درآمد")
        + stepN(d.growthAccel, [[-10,0],[0,2],[10,5]], 6, ctx, "شتاب رشد")
        + stepN(d.marketShare, [[1,4],[5,3],[15,2]], 0, ctx, "سهم بازار");
  var u = stepN(d.grossMargin, [[20,0],[35,3],[50,6],[70,9]], 10, ctx, "حاشیه ناخالص")
        + stepN(d.gmTrend, [[-2,0],[0,2],[3,4]], 5, ctx, "روند حاشیه")
        + stepN(d.opLeverage, [[0,0],[10,3]], 5, ctx, "اهرم عملیاتی");
  var s = (d.fcfPositive ? 10 : stepN(d.runwayMonths, [[12,0],[18,2],[24,5],[36,7]], 9, ctx, "Runway"))
        + shareGrowthScore(d, ctx)
        + ({none:2, low:1, high:0})[d.debtLevel || "low"];
  var p = stepN(d.insiderOwn, [[5,0],[10,3],[20,5]], 6, ctx, "مالکیت داخلی")
        + (d.founderLed ? 4 : 0) + (d.insiderBuying ? 3 : 0)
        + stepN(d.instOwn, [[5,2],[30,2],[60,1]], 0, ctx, "مالکیت نهادی");
  var c = ({strong:6, moderate:3, none:0})[d.megatrend || "none"]
        + ({dated:6, likely:3, vague:0})[d.catalyst || "vague"]
        + ({strong:3, some:1.5, none:0})[d.moat || "none"];
  var v;
  if(!isKnown(d.evSales) || !isKnown(d.revGrowth)){ ctx.unknown.push("ارزش‌گذاری"); v = 0; }
  else v = step(d.evSales / (Math.max(d.revGrowth, 1) / 10), [[1,5],[2,4],[4,2.5],[8,1]], 0);

  var mc = isKnown(d.marketCapM) ? d.marketCapM : (ctx.unknown.push("ارزش بازار"), 0);
  var mcGate = !mc ? 1 : mc > 10000 ? 0.30 : mc > 5000 ? 0.60 : mc > 2000 ? 0.85 : mc < 50 ? 0.90 : 1;
  var liqGate = isKnown(d.advK) ? (d.advK < 300 ? 0.80 : 1) : (ctx.unknown.push("حجم معاملات"), 1);
  var gate = mcGate * liqGate;

  var raw = g + u + s + p + c + v;
  var fl = FLAGS.filter(function(f){ return !!d["x_" + f[0]]; });
  var base = Math.round(raw * gate);
  var penalty = FLAG_PENALTY * fl.length;
  var total = Math.max(0, base - penalty);
  var veto = fl.some(function(f){ return f[0] === VETO_FLAG; }) || fl.length >= 3;
  var ceilX = ceiling(d);
  var ceilFail = (ceilX !== null && ceilX < CEIL_MIN);
  /* کفایت شواهد: خروجی چهارم و مستقل. رکوردی که سه ورودی یا بیشترش مجهول است
     نمی‌تواند «منطقه شکار» باشد — امتیازش معنا ندارد، نه اینکه بد است. */
  var unknown = ctx.unknown, thin = unknown.length >= 3;
  var band = (veto || ceilFail) ? "stop" : total >= 75 ? "go" : total >= 60 ? "watch" : "stop";
  if(band === "go" && thin) band = "watch";

  return {
    parts:{ growth:g, unit:u, surv:s, people:p, cat:c, val:v },
    raw:raw, gate:gate, mcGate:mcGate, liqGate:liqGate,
    base:base, penalty:penalty, nFlags:fl.length, flags:fl, veto:veto,
    ceilX:ceilX, ceilFail:ceilFail, total:total,
    unknown:unknown, thin:thin, band:band
  };
}

export {score,ceiling,CEIL,LAYERS,NUMS,FLAGS};
