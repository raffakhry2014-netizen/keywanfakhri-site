// Extra languages for the guest menu: Korean, Chinese (Simplified), Japanese, Albanian.
// Extends window.I18N (from i18n.js + i18n-content.js). Array order everywhere: ko, zh, ja, sq.
(function(){
const L=["ko","zh","ja","sq"];
const I=window.I18N=window.I18N||{};
const put=(target,src)=>{for(const [k,a] of Object.entries(src)){target[k]=target[k]||{};L.forEach((l,i)=>{target[k][l]=a[i];});}};

/* ---------- UI (same keys as I18N.ui.en) ---------- */
I.ui=I.ui||{};
I.ui.ko={language:"언어",tagline:"콘스탄츠 • 스마트한 다이닝 경험",ingredients:"재료",allergens:"알레르기 유발 성분",nutrition:"영양 정보",portion:"제공량",prep:"조리 시간",minutes:"분",no_allergens:"표시된 알레르기 성분 없음",ai_title:"AI 웨이터에게 물어보세요",ai_intro:"원하시는 걸 말씀해 주시면 추천해 드릴게요.",placeholder:"예: 17€ 이하 채식",ask:"물어보기",empty:"질문을 입력해 주세요.",thinking:"KIWA가 생각 중이에요…",error:"죄송합니다. 지금은 KIWA를 이용할 수 없습니다. 다시 시도해 주세요.",
categories:{"Starter":"전채","Salad":"샐러드","Burger":"버거","Main":"메인 요리","Pasta":"파스타","Vegan":"비건 & 채식","Dessert":"디저트","Cold Drink":"차가운 음료","Hot Drink":"따뜻한 음료"},
tags:{vegan:"비건",vegetarian:"채식",gluten_free:"글루텐 프리",bestseller:"베스트셀러",mild:"순한 맛",medium:"중간 맛",hot:"매운 맛"}};
I.ui.zh={language:"语言",tagline:"康斯坦茨 • 您的智能用餐体验",ingredients:"配料",allergens:"过敏原",nutrition:"营养成分",portion:"份量",prep:"制作时间",minutes:"分钟",no_allergens:"无标注过敏原",ai_title:"问问我们的 AI 服务员",ai_intro:"告诉我您的喜好，我来为您推荐。",placeholder:"例如：17 € 以下的素食",ask:"提问",empty:"请输入问题。",thinking:"KIWA 正在思考…",error:"抱歉，KIWA 暂时无法使用，请稍后再试。",
categories:{"Starter":"前菜","Salad":"沙拉","Burger":"汉堡","Main":"主菜","Pasta":"意面","Vegan":"纯素与素食","Dessert":"甜点","Cold Drink":"冷饮","Hot Drink":"热饮"},
tags:{vegan:"纯素",vegetarian:"素食",gluten_free:"无麸质",bestseller:"招牌",mild:"微辣",medium:"中辣",hot:"特辣"}};
I.ui.ja={language:"言語",tagline:"コンスタンツ • スマートな食事体験",ingredients:"材料",allergens:"アレルゲン",nutrition:"栄養成分",portion:"量",prep:"調理時間",minutes:"分",no_allergens:"表示対象のアレルゲンなし",ai_title:"AIウェイターに聞く",ai_intro:"お好みを教えてください。おすすめをご提案します。",placeholder:"例：17€以下のベジタリアン",ask:"質問する",empty:"質問を入力してください。",thinking:"KIWAが考えています…",error:"申し訳ありません。KIWAは現在ご利用いただけません。もう一度お試しください。",
categories:{"Starter":"前菜","Salad":"サラダ","Burger":"バーガー","Main":"メイン","Pasta":"パスタ","Vegan":"ヴィーガン＆ベジタリアン","Dessert":"デザート","Cold Drink":"コールドドリンク","Hot Drink":"ホットドリンク"},
tags:{vegan:"ヴィーガン",vegetarian:"ベジタリアン",gluten_free:"グルテンフリー",bestseller:"人気",mild:"辛さ控えめ",medium:"中辛",hot:"辛口"}};
I.ui.sq={language:"Gjuha",tagline:"Konstanz • Përvoja juaj e zgjuar gastronomike",ingredients:"Përbërësit",allergens:"Alergjenët",nutrition:"Vlerat ushqyese",portion:"Porcioni",prep:"Përgatitja",minutes:"min",no_allergens:"Nuk ka alergjenë të shënuar",ai_title:"Pyetni kamarierin tonë AI",ai_intro:"Më thoni çfarë ju pëlqen dhe unë do t’ju rekomandoj diçka.",placeholder:"p.sh. vegjetariane nën 17 €",ask:"Pyet",empty:"Ju lutem shkruani një pyetje.",thinking:"KIWA po mendon…",error:"Na vjen keq, KIWA nuk është e disponueshme tani. Provoni përsëri.",
categories:{"Starter":"Antipasta","Salad":"Sallata","Burger":"Burgerë","Main":"Pjata kryesore","Pasta":"Makarona","Vegan":"Vegane & vegjetariane","Dessert":"Ëmbëlsira","Cold Drink":"Pije të ftohta","Hot Drink":"Pije të ngrohta"},
tags:{vegan:"Vegane",vegetarian:"Vegjetariane",gluten_free:"Pa gluten",bestseller:"Më e shitura",mild:"Pak pikante",medium:"Mesatarisht pikante",hot:"Pikante"}};

/* ---------- Dish names (by external_id) ---------- */
I.itemNames=I.itemNames||{};
put(I.itemNames,{
"1":["갈릭 브레드","蒜香面包","ガーリックブレッド","Bukë me hudhër"],
"2":["클래식 브루스케타","经典意式烤面包","クラシック・ブルスケッタ","Bruskëta klasike"],
"3":["모차렐라 스틱","马苏里拉芝士条","モッツァレラスティック","Shkopinj mocarele"],
"4":["치킨 윙","鸡翅","チキンウィング","Krahë pule"],
"5":["크리스피 오징어 튀김","香脆鱿鱼圈","カリカリカラマリ","Kallamar krokant"],
"6":["치킨 시저 샐러드","鸡肉凯撒沙拉","チキンシーザーサラダ","Sallatë Cezar me pulë"],
"7":["그릭 샐러드","希腊沙拉","ギリシャ風サラダ","Sallatë greke"],
"8":["아보카도 퀴노아 샐러드","牛油果藜麦沙拉","アボカドとキヌアのサラダ","Sallatë me avokado dhe kinoa"],
"9":["참치 샐러드","金枪鱼沙拉","ツナサラダ","Sallatë me ton"],
"10":["클래식 버거","经典汉堡","クラシックバーガー","Burger klasik"],
"11":["더블 비프 버거","双层牛肉汉堡","ダブルビーフバーガー","Burger me dy qofte viçi"],
"12":["매운 할라피뇨 버거","香辣墨西哥辣椒汉堡","スパイシーハラペーニョバーガー","Burger pikant me jalapeño"],
"13":["크리스피 치킨 버거","香脆鸡肉汉堡","クリスピーチキンバーガー","Burger me pulë krokante"],
"14":["베지 버거","蔬菜汉堡","ベジバーガー","Burger vegjetarian"],
"15":["비건 아보카도 버거","纯素牛油果汉堡","ヴィーガンアボカドバーガー","Burger vegan me avokado"],
"16":["그릴드 치킨 플레이트","烤鸡胸肉套餐","グリルチキンプレート","Pjatë me pulë në skarë"],
"17":["비프 스테이크 250g","牛排 250 克","ビーフステーキ 250g","Biftek viçi 250 g"],
"18":["BBQ 립","烧烤排骨","BBQリブ","Brinjë BBQ"],
"19":["치킨 커리","咖喱鸡","チキンカレー","Kerri me pulë"],
"20":["비프 데리야키 볼","照烧牛肉饭","ビーフ照り焼き丼","Tas me viç teriyaki"],
"21":["버섯 탈리아텔레","蘑菇宽面","きのこのタリアテッレ","Taljatele me kërpudha"],
"22":["매콤한 아라비아타","香辣番茄意面","スパイシー・アラビアータ","Arrabbiata pikante"],
"23":["치킨 알프레도","鸡肉阿尔弗雷多意面","チキンアルフレッド","Pulë Alfredo"],
"24":["볼로네제","意式肉酱面","ボロネーゼ","Bolonjeze"],
"25":["페스토 파스타","青酱意面","ジェノベーゼパスタ","Makarona me pesto"],
"26":["구운 채소 볼","烤蔬菜碗","グリル野菜ボウル","Tas me perime në skarë"],
"27":["팔라펠 볼","法拉费碗","ファラフェルボウル","Tas me falafel"],
"28":["비건 커리","纯素咖喱","ヴィーガンカレー","Kerri vegan"],
"29":["프로틴 파워 볼","高蛋白能量碗","プロテインパワーボウル","Tas me shumë proteina"],
"30":["티라미수","提拉米苏","ティラミス","Tiramisu"],
"31":["초콜릿 라바 케이크","熔岩巧克力蛋糕","フォンダンショコラ","Kek me çokollatë të shkrirë"],
"32":["치즈케이크","芝士蛋糕","チーズケーキ","Cheesecake"],
"33":["과일 볼","水果碗","フルーツボウル","Tas me fruta"],
"34":["코카콜라","可口可乐","コカ・コーラ","Coca-Cola"],
"35":["코카콜라 제로","零度可口可乐","コカ・コーラ ゼロ","Coca-Cola Zero"],
"36":["수제 레모네이드","自制柠檬水","自家製レモネード","Limonadë shtëpie"],
"37":["생오렌지 주스","鲜榨橙汁","フレッシュオレンジジュース","Lëng portokalli i freskët"],
"38":["에스프레소","意式浓缩咖啡","エスプレッソ","Espresso"],
"39":["카푸치노","卡布奇诺","カプチーノ","Kapuçino"],
"40":["라떼 마키아토","拿铁玛奇朵","ラテ・マキアート","Latte macchiato"]
});

/* ---------- Menu content (keys = English source text) ---------- */
const C=I.content=I.content||{};
C.descriptions=C.descriptions||{};C.ingredients=C.ingredients||{};C.allergens=C.allergens||{};C.units=C.units||{};
put(C.descriptions,{
"Crispy garlic bread with parsley and parmesan.":["파슬리와 파르메산을 곁들인 바삭한 갈릭 브레드.","撒有欧芹和帕玛森芝士的香脆蒜香面包。","パセリとパルメザンをのせたカリカリのガーリックブレッド。","Bukë krokante me hudhër, majdanoz dhe parmixhano."],
"Fresh tomato bruschetta with basil, garlic and olive oil.":["바질, 마늘, 올리브 오일을 곁들인 신선한 토마토 브루스케타.","配罗勒、大蒜和橄榄油的新鲜番茄烤面包。","バジル、ニンニク、オリーブオイルの新鮮なトマトのブルスケッタ。","Bruskëta me domate të freskëta, borzilok, hudhër dhe vaj ulliri."],
"Crispy mozzarella sticks served with tomato dip.":["토마토 딥을 곁들인 바삭한 모차렐라 스틱.","配番茄蘸酱的香脆马苏里拉芝士条。","トマトディップ付きのカリカリのモッツァレラスティック。","Shkopinj krokantë mocarele me salcë domatesh."],
"Juicy chicken wings with smoky BBQ sauce.":["스모키 BBQ 소스를 곁들인 육즙 가득한 치킨 윙.","配烟熏烧烤酱的多汁鸡翅。","スモーキーなBBQソースのジューシーなチキンウィング。","Krahë pule të lëngshëm me salcë BBQ të tymosur."],
"Crispy calamari with lemon and creamy aioli.":["레몬과 크리미한 아이올리를 곁들인 바삭한 오징어 튀김.","配柠檬和蒜泥蛋黄酱的香脆鱿鱼圈。","レモンとクリーミーなアイオリを添えたカリカリのカラマリ。","Kallamar krokant me limon dhe aioli kremoze."],
"Classic Caesar salad topped with grilled chicken.":["그릴드 치킨을 올린 클래식 시저 샐러드.","配烤鸡肉的经典凯撒沙拉。","グリルチキンをのせたクラシックなシーザーサラダ。","Sallatë klasike Cezar me pulë në skarë."],
"Fresh Mediterranean salad with feta and olives.":["페타 치즈와 올리브를 곁들인 신선한 지중해식 샐러드.","配菲达奶酪和橄榄的新鲜地中海沙拉。","フェタチーズとオリーブの新鮮な地中海風サラダ。","Sallatë e freskët mesdhetare me djathë feta dhe ullinj."],
"Fresh quinoa salad with avocado, spinach and chickpeas.":["아보카도, 시금치, 병아리콩을 곁들인 신선한 퀴노아 샐러드.","配牛油果、菠菜和鹰嘴豆的新鲜藜麦沙拉。","アボカド、ほうれん草、ひよこ豆の新鮮なキヌアサラダ。","Sallatë e freskët kinoa me avokado, spinaq dhe qiqra."],
"Protein-rich tuna salad with egg and olives.":["달걀과 올리브를 곁들인 고단백 참치 샐러드.","配鸡蛋和橄榄的高蛋白金枪鱼沙拉。","卵とオリーブ入りの高たんぱくツナサラダ。","Sallatë me ton, e pasur me proteina, me vezë dhe ullinj."],
"Classic beef burger with cheddar, fresh vegetables and fries.":["체다 치즈, 신선한 채소, 감자튀김을 곁들인 클래식 비프 버거.","配切达芝士、新鲜蔬菜和薯条的经典牛肉汉堡。","チェダー、新鮮な野菜、フライドポテト付きのクラシックなビーフバーガー。","Burger klasik viçi me çedar, perime të freskëta dhe patate të skuqura."],
"Double beef burger for serious burger lovers.":["진정한 버거 마니아를 위한 더블 비프 버거.","为汉堡爱好者准备的双层牛肉汉堡。","本格派バーガー好きのためのダブルビーフバーガー。","Burger me dy qofte viçi për adhuruesit e vërtetë të burgerit."],
"A spicy beef burger with jalapeños and salsa.":["할라피뇨와 살사를 곁들인 매운 비프 버거.","配墨西哥辣椒和莎莎酱的香辣牛肉汉堡。","ハラペーニョとサルサのスパイシーなビーフバーガー。","Burger pikant viçi me jalapeño dhe salsa."],
"Crispy chicken burger with fresh salad and special sauce.":["신선한 샐러드와 특제 소스를 곁들인 크리스피 치킨 버거.","配新鲜生菜和特制酱汁的香脆鸡肉汉堡。","新鮮なレタスと特製ソースのクリスピーチキンバーガー。","Burger me pulë krokante, sallatë të freskët dhe salcë speciale."],
"Vegetarian burger with grilled vegetable patty.":["구운 채소 패티로 만든 채식 버거.","烤蔬菜饼制成的素食汉堡。","グリル野菜パティのベジタリアンバーガー。","Burger vegjetarian me qofte perimesh në skarë."],
"Plant-based burger with creamy avocado and vegan sauce.":["크리미한 아보카도와 비건 소스를 곁들인 식물성 버거.","配奶油牛油果和纯素酱的植物基汉堡。","クリーミーなアボカドとヴィーガンソースのプラントベースバーガー。","Burger me bazë bimore, me avokado kremoze dhe salcë vegane."],
"Lean grilled chicken breast with rice and vegetables.":["밥과 채소를 곁들인 담백한 그릴드 닭가슴살.","配米饭和蔬菜的低脂烤鸡胸肉。","ご飯と野菜を添えたヘルシーなグリルチキンブレスト。","Gjoks pule i ligët në skarë me oriz dhe perime."],
"250g grilled beef steak with roasted potatoes and vegetables.":["구운 감자와 채소를 곁들인 250g 그릴드 비프 스테이크.","配烤土豆和蔬菜的 250 克烤牛排。","ローストポテトと野菜を添えた250gのグリルビーフステーキ。","Biftek viçi 250 g në skarë me patate të pjekura dhe perime."],
"Slow-cooked BBQ ribs with fries and coleslaw.":["감자튀김과 코울슬로를 곁들인 저온 조리 BBQ 립.","配薯条和凉拌卷心菜的慢炖烧烤排骨。","フライドポテトとコールスロー付きのじっくり調理したBBQリブ。","Brinjë BBQ të gatuara ngadalë me patate të skuqura dhe sallatë lakre."],
"Creamy coconut chicken curry with rice.":["밥과 함께 나오는 크리미한 코코넛 치킨 커리.","配米饭的椰香奶油咖喱鸡。","ご飯付きのクリーミーなココナッツチキンカレー。","Kerri kremoze me pulë dhe kokos, me oriz."],
"Tender beef with vegetables, rice and teriyaki sauce.":["채소, 밥, 데리야키 소스를 곁들인 부드러운 소고기.","配蔬菜、米饭和照烧酱的嫩牛肉。","野菜、ご飯、照り焼きソースを合わせた柔らかい牛肉。","Mish viçi i butë me perime, oriz dhe salcë teriyaki."],
"Creamy tagliatelle with mushrooms and parmesan.":["버섯과 파르메산을 곁들인 크리미한 탈리아텔레.","配蘑菇和帕玛森芝士的奶油宽面。","きのことパルメザンのクリーミーなタリアテッレ。","Taljatele kremoze me kërpudha dhe parmixhano."],
"Classic spicy tomato pasta with garlic and chili.":["마늘과 고추를 넣은 클래식 매운 토마토 파스타.","配大蒜和辣椒的经典香辣番茄意面。","ニンニクと唐辛子のクラシックなスパイシートマトパスタ。","Makarona klasike pikante me domate, hudhër dhe djegës."],
"Creamy Alfredo pasta with grilled chicken.":["그릴드 치킨을 곁들인 크리미한 알프레도 파스타.","配烤鸡肉的奶油阿尔弗雷多意面。","グリルチキン入りのクリーミーなアルフレッドパスタ。","Makarona kremoze Alfredo me pulë në skarë."],
"Traditional pasta with rich beef and tomato sauce.":["진한 소고기 토마토 소스의 전통 파스타.","配浓郁牛肉番茄酱的传统意面。","濃厚な牛肉とトマトのソースの伝統的なパスタ。","Makarona tradicionale me salcë të pasur me mish viçi dhe domate."],
"Pasta with fresh basil pesto, parmesan and pine nuts.":["신선한 바질 페스토, 파르메산, 잣을 곁들인 파스타.","配新鲜罗勒青酱、帕玛森芝士和松子的意面。","新鮮なバジルペースト、パルメザン、松の実のパスタ。","Makarona me pesto të freskët borziloku, parmixhano dhe arra pishe."],
"Colorful grilled vegetables with chickpeas and quinoa.":["병아리콩과 퀴노아를 곁들인 다채로운 구운 채소.","配鹰嘴豆和藜麦的缤纷烤蔬菜。","ひよこ豆とキヌアを添えた彩り豊かなグリル野菜。","Perime shumëngjyrëshe në skarë me qiqra dhe kinoa."],
"Falafel bowl with hummus, fresh vegetables and quinoa.":["후무스, 신선한 채소, 퀴노아를 곁들인 팔라펠 볼.","配鹰嘴豆泥、新鲜蔬菜和藜麦的法拉费碗。","フムス、新鮮な野菜、キヌアのファラフェルボウル。","Tas me falafel, humus, perime të freskëta dhe kinoa."],
"Plant-based coconut curry with chickpeas and vegetables.":["병아리콩과 채소를 넣은 식물성 코코넛 커리.","配鹰嘴豆和蔬菜的植物基椰香咖喱。","ひよこ豆と野菜のプラントベース・ココナッツカレー。","Kerri me bazë bimore me kokos, qiqra dhe perime."],
"High-protein vegan bowl with quinoa, beans and avocado.":["퀴노아, 콩, 아보카도를 담은 고단백 비건 볼.","配藜麦、豆类和牛油果的高蛋白纯素碗。","キヌア、豆、アボカドの高たんぱくヴィーガンボウル。","Tas vegan me shumë proteina, me kinoa, fasule dhe avokado."],
"Classic Italian coffee-flavoured tiramisu.":["커피 향의 클래식 이탈리안 티라미수.","经典意式咖啡风味提拉米苏。","コーヒー風味のクラシックなイタリアンティラミス。","Tiramisu klasik italian me shije kafeje."],
"Warm chocolate cake with molten center and vanilla ice cream.":["녹아내리는 속과 바닐라 아이스크림을 곁들인 따뜻한 초콜릿 케이크.","配香草冰淇淋的熔岩夹心热巧克力蛋糕。","とろける中心とバニラアイスを添えた温かいチョコレートケーキ。","Kek i ngrohtë çokollate me qendër të shkrirë dhe akullore vanilje."],
"Creamy cheesecake with a crunchy biscuit base.":["바삭한 비스킷 베이스의 크리미한 치즈케이크.","酥脆饼干底的绵密芝士蛋糕。","サクサクのビスケット生地のクリーミーなチーズケーキ。","Cheesecake kremoze me bazë biskote krokante."],
"Refreshing bowl of seasonal fresh fruit.":["상큼한 제철 과일 한 그릇.","一碗清爽的时令鲜果。","爽やかな季節のフレッシュフルーツ。","Tas freskues me fruta stinore."],
"Classic chilled Coca-Cola.":["시원한 클래식 코카콜라.","冰镇经典可口可乐。","よく冷えたクラシックなコカ・コーラ。","Coca-Cola klasike e ftohtë."],
"Sugar-free Coca-Cola served chilled.":["시원하게 제공되는 무설탕 코카콜라.","冰镇无糖可口可乐。","冷やしてお出しするシュガーフリーのコカ・コーラ。","Coca-Cola pa sheqer, e shërbyer e ftohtë."],
"Fresh homemade lemonade with lemon and mint.":["레몬과 민트를 넣은 신선한 수제 레모네이드.","加入柠檬和薄荷的新鲜自制柠檬水。","レモンとミントの自家製フレッシュレモネード。","Limonadë e freskët shtëpie me limon dhe mente."],
"Freshly squeezed orange juice.":["갓 짜낸 오렌지 주스.","现榨橙汁。","搾りたてのオレンジジュース。","Lëng portokalli i shtrydhur në çast."],
"Strong Italian-style espresso.":["진한 이탈리아식 에스프레소.","浓郁的意式浓缩咖啡。","濃厚なイタリア風エスプレッソ。","Espresso e fortë në stil italian."],
"Espresso with steamed milk and creamy foam.":["스팀 밀크와 부드러운 거품을 올린 에스프레소.","加蒸汽牛奶和绵密奶泡的浓缩咖啡。","スチームミルクとクリーミーな泡をのせたエスプレッソ。","Espresso me qumësht të avulluar dhe shkumë kremoze."],
"Layered espresso with plenty of warm milk.":["따뜻한 우유를 듬뿍 넣은 레이어드 에스프레소.","加入大量热牛奶的分层浓缩咖啡。","たっぷりの温かいミルクに重ねたエスプレッソ。","Espresso me shtresa dhe shumë qumësht të ngrohtë."]
});
put(C.ingredients,{
"Baguette":["바게트","法棍","バゲット","Bagetë"],"Garlic butter":["갈릭 버터","蒜香黄油","ガーリックバター","Gjalpë me hudhër"],"Parsley":["파슬리","欧芹","パセリ","Majdanoz"],"Parmesan":["파르메산","帕玛森芝士","パルメザン","Parmixhano"],
"Toasted bread":["구운 빵","烤面包","トーストしたパン","Bukë e thekur"],"Tomato":["토마토","番茄","トマト","Domate"],"Basil":["바질","罗勒","バジル","Borzilok"],"Garlic":["마늘","大蒜","ニンニク","Hudhër"],
"Olive oil":["올리브 오일","橄榄油","オリーブオイル","Vaj ulliri"],"Mozzarella":["모차렐라","马苏里拉芝士","モッツァレラ","Mocarela"],"Breadcrumbs":["빵가루","面包糠","パン粉","Galeta"],"Tomato dip":["토마토 딥","番茄蘸酱","トマトディップ","Salcë domatesh"],
"Chicken wings":["닭날개","鸡翅","手羽先","Krahë pule"],"Spices":["향신료","香料","スパイス","Erëza"],"BBQ sauce":["BBQ 소스","烧烤酱","BBQソース","Salcë BBQ"],"Calamari":["오징어","鱿鱼","カラマリ","Kallamar"],
"Breadcrumb coating":["빵가루 튀김옷","面包糠裹衣","パン粉の衣","Veshje me galetë"],"Lemon":["레몬","柠檬","レモン","Limon"],"Aioli":["아이올리","蒜泥蛋黄酱","アイオリ","Aioli"],"Grilled chicken":["그릴드 치킨","烤鸡肉","グリルチキン","Pulë në skarë"],
"Romaine lettuce":["로메인 상추","罗马生菜","ロメインレタス","Marule romane"],"Croutons":["크루통","面包丁","クルトン","Krutona"],"Caesar dressing":["시저 드레싱","凯撒酱","シーザードレッシング","Salcë Cezar"],"Cucumber":["오이","黄瓜","キュウリ","Kastravec"],
"Olives":["올리브","橄榄","オリーブ","Ullinj"],"Feta":["페타 치즈","菲达奶酪","フェタチーズ","Djathë feta"],"Red onion":["적양파","紫洋葱","赤玉ねぎ","Qepë e kuqe"],"Quinoa":["퀴노아","藜麦","キヌア","Kinoa"],
"Avocado":["아보카도","牛油果","アボカド","Avokado"],"Spinach":["시금치","菠菜","ほうれん草","Spinaq"],"Chickpeas":["병아리콩","鹰嘴豆","ひよこ豆","Qiqra"],"Tuna":["참치","金枪鱼","ツナ","Ton"],
"Lettuce":["상추","生菜","レタス","Marule"],"Egg":["달걀","鸡蛋","卵","Vezë"],"Beef patty":["소고기 패티","牛肉饼","ビーフパティ","Qofte viçi"],"Cheddar":["체다 치즈","切达芝士","チェダーチーズ","Çedar"],
"Onion":["양파","洋葱","玉ねぎ","Qepë"],"Burger sauce":["버거 소스","汉堡酱","バーガーソース","Salcë burgeri"],"Brioche bun":["브리오슈 번","布里欧修面包","ブリオッシュバンズ","Panine brioshe"],"French fries":["감자튀김","薯条","フライドポテト","Patate të skuqura"],
"Two beef patties":["소고기 패티 2장","两块牛肉饼","ビーフパティ2枚","Dy qofte viçi"],"Caramelized onion":["캐러멜라이즈드 양파","焦糖洋葱","キャラメリゼした玉ねぎ","Qepë e karamelizuar"],"Jalapeño":["할라피뇨","墨西哥辣椒","ハラペーニョ","Jalapeño"],"Salsa":["살사","莎莎酱","サルサ","Salsa"],
"Crispy chicken":["크리스피 치킨","香脆鸡肉","クリスピーチキン","Pulë krokante"],"Special sauce":["특제 소스","特制酱汁","特製ソース","Salcë speciale"],"Vegetable patty":["채소 패티","蔬菜饼","野菜パティ","Qofte perimesh"],"Bun":["번","汉堡面包","バンズ","Panine"],
"Vegan patty":["비건 패티","纯素肉饼","ヴィーガンパティ","Qofte vegane"],"Vegan sauce":["비건 소스","纯素酱","ヴィーガンソース","Salcë vegane"],"Grilled chicken breast":["그릴드 닭가슴살","烤鸡胸肉","グリルチキンブレスト","Gjoks pule në skarë"],"Rice":["밥","米饭","ご飯","Oriz"],
"Seasonal vegetables":["제철 채소","时令蔬菜","季節の野菜","Perime stinore"],"Beef steak":["소고기 스테이크","牛排","ビーフステーキ","Biftek viçi"],"Roasted potatoes":["구운 감자","烤土豆","ローストポテト","Patate të pjekura"],"Pork ribs":["돼지갈비","猪肋排","ポークリブ","Brinjë derri"],
"Coleslaw":["코울슬로","凉拌卷心菜","コールスロー","Sallatë lakre"],"Chicken":["닭고기","鸡肉","鶏肉","Pulë"],"Coconut curry sauce":["코코넛 커리 소스","椰香咖喱酱","ココナッツカレーソース","Salcë kerri me kokos"],"Vegetables":["채소","蔬菜","野菜","Perime"],
"Beef":["소고기","牛肉","牛肉","Mish viçi"],"Broccoli":["브로콜리","西兰花","ブロッコリー","Brokoli"],"Carrot":["당근","胡萝卜","ニンジン","Karotë"],"Teriyaki sauce":["데리야키 소스","照烧酱","照り焼きソース","Salcë teriyaki"],
"Tagliatelle":["탈리아텔레","意大利宽面","タリアテッレ","Taljatele"],"Mushrooms":["버섯","蘑菇","きのこ","Kërpudha"],"Cream":["크림","奶油","クリーム","Krem qumështi"],"Pasta":["파스타","意面","パスタ","Makarona"],
"Chili":["고추","辣椒","唐辛子","Djegës"],"Tomato sauce":["토마토 소스","番茄酱","トマトソース","Salcë domatesh"],"Celery":["셀러리","芹菜","セロリ","Selino"],"Basil pesto":["바질 페스토","罗勒青酱","バジルペースト","Pesto borziloku"],
"Pine nuts":["잣","松子","松の実","Arra pishe"],"Zucchini":["주키니","西葫芦","ズッキーニ","Kungulleshë"],"Eggplant":["가지","茄子","ナス","Patëllxhan"],"Bell pepper":["파프리카","甜椒","パプリカ","Spec"],
"Falafel":["팔라펠","法拉费","ファラフェル","Falafel"],"Hummus":["후무스","鹰嘴豆泥","フムス","Humus"],"Coconut milk":["코코넛 밀크","椰奶","ココナッツミルク","Qumësht kokosi"],"Kidney beans":["강낭콩","红腰豆","キドニービーンズ","Fasule të kuqe"],
"Mascarpone":["마스카포네","马斯卡彭奶酪","マスカルポーネ","Maskarpone"],"Coffee":["커피","咖啡","コーヒー","Kafe"],"Ladyfingers":["레이디핑거","手指饼干","フィンガービスケット","Savojardi"],"Cocoa":["코코아","可可粉","ココア","Kakao"],
"Chocolate cake":["초콜릿 케이크","巧克力蛋糕","チョコレートケーキ","Kek çokollate"],"Chocolate center":["초콜릿 필링","巧克力夹心","チョコレートの中心","Qendër çokollate"],"Vanilla ice cream":["바닐라 아이스크림","香草冰淇淋","バニラアイス","Akullore vanilje"],"Cream cheese":["크림치즈","奶油奶酪","クリームチーズ","Djathë krem"],
"Biscuit base":["비스킷 베이스","饼干底","ビスケット生地","Bazë biskote"],"Sugar":["설탕","糖","砂糖","Sheqer"],"Seasonal fresh fruit":["제철 생과일","时令鲜果","季節のフルーツ","Fruta të freskëta stinore"],"Cola":["콜라","可乐","コーラ","Kola"],
"Sugar-free cola":["무설탕 콜라","无糖可乐","シュガーフリーコーラ","Kola pa sheqer"],"Mint":["민트","薄荷","ミント","Mente"],"Sparkling water":["탄산수","气泡水","炭酸水","Ujë i gazuar"],"Fresh orange juice":["생오렌지 주스","鲜榨橙汁","フレッシュオレンジジュース","Lëng portokalli i freskët"],
"Espresso coffee":["에스프레소 커피","浓缩咖啡","エスプレッソコーヒー","Kafe espresso"],"Espresso":["에스프레소","浓缩咖啡","エスプレッソ","Espresso"],"Milk foam":["우유 거품","奶泡","ミルクフォーム","Shkumë qumështi"],"Steamed milk":["스팀 밀크","蒸汽牛奶","スチームミルク","Qumësht i avulluar"]
});
put(C.allergens,{
"Gluten":["글루텐","麸质","小麦（グルテン）","Gluten"],"Milk":["우유","乳制品","乳","Qumësht"],"Egg":["달걀","蛋","卵","Vezë"],"Molluscs":["연체동물","软体动物","軟体動物","Molusqe"],
"Fish":["생선","鱼","魚","Peshk"],"Soy":["대두","大豆","大豆","Soje"],"Nuts":["견과류","坚果","ナッツ類","Fruta me lëvozhgë"],"Sesame":["참깨","芝麻","ごま","Susam"],
"Celery":["셀러리","芹菜","セロリ","Selino"],"Mustard":["겨자","芥末","からし","Mustardë"],"Peanuts":["땅콩","花生","落花生","Kikirikë"],"Crustaceans":["갑각류","甲壳类","甲殻類","Krustace"],
"Lupin":["루핀","羽扇豆","ルピナス","Lupin"],"Sulphites":["아황산염","亚硫酸盐","亜硫酸塩","Sulfite"]
});
put(C.units,{
piece:["개","块","個","copë"],bowl:["그릇","碗","ボウル","tas"],burger:["버거","汉堡","バーガー","burger"],fries:["감자튀김","薯条","フライドポテト","patate të skuqura"],
chicken:["닭고기","鸡肉","鶏肉","pulë"],steak:["스테이크","牛排","ステーキ","biftek"],rack:["립 세트","份排骨","リブ","porcion brinjësh"],plate:["접시","盘","皿","pjatë"],
slice:["조각","块","切れ","fetë"],cake:["케이크","个蛋糕","ケーキ","kek"],cup:["잔","杯","杯","filxhan"],
fat:["지방","脂肪","脂質","yndyrë"],carbs:["탄수화물","碳水","炭水化物","karbohidrate"],protein:["단백질","蛋白质","たんぱく質","proteina"]
});

/* serving() that also knows the new languages (same rules as i18n-content.js) */
const base=C.serving;
C.serving=function(s,lang){
  if(!s||lang==="en") return s;
  if(!L.includes(lang)) return base?base(s,lang):s;
  const u=k=>C.units[k]?.[lang]||k;
  return String(s)
    .replace(/(\d+) pieces?/,(m,n)=>`${n} ${u("piece")}`)
    .replace(/1 burger \+ fries/,`1 ${u("burger")} + ${u("fries")}`)
    .replace(/^1 burger$/,`1 ${u("burger")}`)
    .replace(/(\d+)g chicken/,(m,n)=>`${n} g ${u("chicken")}`)
    .replace(/(\d+)g steak/,(m,n)=>`${n} g ${u("steak")}`)
    .replace(/^(\d+)g$/,"$1 g")
    .replace(/^1 bowl$/,`1 ${u("bowl")}`)
    .replace(/^1 rack$/,`1 ${u("rack")}`)
    .replace(/^1 plate$/,`1 ${u("plate")}`)
    .replace(/^1 slice$/,`1 ${u("slice")}`)
    .replace(/^1 cake$/,`1 ${u("cake")}`)
    .replace(/1 cup/,`1 ${u("cup")}`)
    .replace(/(\d)\.(\d+) L/,(m,a,b)=>lang==="sq"?`${a},${b} l`:m);
};
})();
