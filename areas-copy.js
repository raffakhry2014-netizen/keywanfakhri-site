// Bereiche der Startseite: [Engineering, Gastronomie, Finanzen], Einleitungen in gleicher Reihenfolge, Label der Leiste.
const areaCopy={
de:{tabs:["Logistik- & Prozessengineering","Für Gastronomie","Finanzanalyse & Investment-Tools"],intro:["Lager planen, Prozesse gestalten, Kennzahlen steuern – für Unternehmen","Digitale Helfer für Cafés und Restaurants","Unternehmen bewerten, Risiken einschätzen – mit Lerndemos"],label:"Bereich wählen"},
en:{tabs:["Logistics & Process Engineering","For Hospitality","Financial Analysis & Investment Tools"],intro:["Plan warehouses, design processes, steer KPIs – for companies","Digital helpers for cafés and restaurants","Evaluate companies, assess risks – with learning demos"],label:"Choose an area"},
fa:{tabs:["مهندسی لجستیک و فرایند","برای رستوران و کافه","تحلیل مالی و ابزارهای سرمایه‌گذاری"],intro:["برنامه‌ریزی انبار، طراحی فرایند، کنترل شاخص‌ها – برای شرکت‌ها","دستیارهای دیجیتال برای کافه‌ها و رستوران‌ها","ارزیابی شرکت‌ها و سنجش ریسک – با دموهای آموزشی"],label:"انتخاب حوزه"},
ar:{tabs:["هندسة اللوجستيات والعمليات","للمطاعم والمقاهي","التحليل المالي وأدوات الاستثمار"],intro:["تخطيط المستودعات وتصميم العمليات وإدارة المؤشرات – للشركات","مساعدون رقميون للمقاهي والمطاعم","تقييم الشركات وتقدير المخاطر – بعروض تعليمية"],label:"اختر المجال"},
tr:{tabs:["Lojistik ve Süreç Mühendisliği","Gastronomi için","Finansal Analiz ve Yatırım Araçları"],intro:["Depo planlama, süreç tasarımı, KPI yönetimi – şirketler için","Kafe ve restoranlar için dijital yardımcılar","Şirketleri değerlendirin, riskleri ölçün – eğitim demolarıyla"],label:"Alan seçin"},
it:{tabs:["Ingegneria logistica e dei processi","Per la ristorazione","Analisi finanziaria e strumenti di investimento"],intro:["Pianificare magazzini, progettare processi, gestire KPI – per le aziende","Assistenti digitali per bar e ristoranti","Valutare aziende, stimare i rischi – con demo didattiche"],label:"Scegli un'area"},
fr:{tabs:["Ingénierie logistique et des processus","Pour la restauration","Analyse financière et outils d'investissement"],intro:["Planifier l'entrepôt, concevoir les processus, piloter les KPI – pour les entreprises","Des assistants numériques pour cafés et restaurants","Évaluer des entreprises, estimer les risques – avec des démos pédagogiques"],label:"Choisir un domaine"},
ko:{tabs:["물류·프로세스 엔지니어링","외식업용","재무 분석·투자 도구"],intro:["창고 계획, 프로세스 설계, KPI 관리 – 기업을 위해","카페와 레스토랑을 위한 디지털 도우미","기업 평가와 리스크 분석 – 학습용 데모"],label:"분야 선택"},
zh:{tabs:["物流与流程工程","餐饮业","财务分析与投资工具"],intro:["仓库规划、流程设计、KPI 管控 – 面向企业","为咖啡馆和餐厅打造的数字助手","评估企业、衡量风险 – 学习演示"],label:"选择领域"},
ja:{tabs:["物流・プロセスエンジニアリング","飲食店向け","財務分析・投資ツール"],intro:["倉庫計画、プロセス設計、KPI管理 – 企業向け","カフェ・レストラン向けデジタルアシスタント","企業評価とリスク分析 – 学習用デモ"],label:"分野を選択"},
es:{tabs:["Ingeniería logística y de procesos","Para hostelería","Análisis financiero y herramientas de inversión"],intro:["Planificar almacenes, diseñar procesos, gestionar KPI – para empresas","Asistentes digitales para cafeterías y restaurantes","Evaluar empresas, valorar riesgos – con demos didácticas"],label:"Elegir un área"},
sq:{tabs:["Inxhinieri logjistike dhe procesesh","Për gastronominë","Analizë financiare dhe mjete investimi"],intro:["Planifikoni magazinën, projektoni procese, drejtoni KPI – për kompani","Ndihmës dixhitalë për kafene dhe restorante","Vlerësoni kompani, matni rreziqe – me demo mësimore"],label:"Zgjidhni fushën"}
};
// Zuordnung der Projekte zu den Bereichen; neue Projekte folgen ihrem Typ.
const AREA_ORDER=['eng','gastro','fin'];
function projectAreaOf(project){
 if(['logistics','prozessatlas','lagerplaner'].includes(project.id))return 'eng';
 if(['10x','6m'].includes(project.id)||project.type==='finance')return 'fin';
 if(project.id==='gastlyo'||project.type==='hospitality')return 'gastro';
 return 'eng';
}
