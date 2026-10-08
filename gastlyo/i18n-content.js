// Translations for menu content (descriptions, ingredients, allergens, portions).
// Order of every array: de, fr, es, it, tr, ar, fa  (English = source text from the database)
(function(){
const L=["de","fr","es","it","tr","ar","fa"];
const pack=o=>Object.fromEntries(Object.entries(o).map(([k,a])=>[k,Object.fromEntries(L.map((l,i)=>[l,a[i]]))]));

const descriptions={
"Crispy garlic bread with parsley and parmesan.":["Knuspriges Knoblauchbrot mit Petersilie und Parmesan.","Pain à l’ail croustillant au persil et au parmesan.","Pan de ajo crujiente con perejil y parmesano.","Pane all’aglio croccante con prezzemolo e parmigiano.","Maydanoz ve parmesanlı çıtır sarımsaklı ekmek.","خبز ثوم مقرمش مع البقدونس والبارميزان.","نان سیر ترد با جعفری و پنیر پارمزان."],
"Fresh tomato bruschetta with basil, garlic and olive oil.":["Frische Tomaten-Bruschetta mit Basilikum, Knoblauch und Olivenöl.","Bruschetta aux tomates fraîches, basilic, ail et huile d’olive.","Bruschetta de tomate fresco con albahaca, ajo y aceite de oliva.","Bruschetta al pomodoro fresco con basilico, aglio e olio d’oliva.","Fesleğen, sarımsak ve zeytinyağlı taze domatesli bruschetta.","بروسكيتا بالطماطم الطازجة مع الريحان والثوم وزيت الزيتون.","بروسکتا با گوجه‌فرنگی تازه، ریحان، سیر و روغن زیتون."],
"Crispy mozzarella sticks served with tomato dip.":["Knusprige Mozzarella-Sticks mit Tomaten-Dip.","Bâtonnets de mozzarella croustillants avec sauce tomate.","Palitos de mozzarella crujientes con salsa de tomate.","Bastoncini di mozzarella croccanti con salsa di pomodoro.","Domates sosuyla servis edilen çıtır mozzarella çubukları.","أصابع موتزاريلا مقرمشة تقدم مع صلصة الطماطم.","استیک موزارلا ترد با سس گوجه‌فرنگی."],
"Juicy chicken wings with smoky BBQ sauce.":["Saftige Chicken Wings mit rauchiger BBQ-Sauce.","Ailes de poulet juteuses à la sauce barbecue fumée.","Alitas de pollo jugosas con salsa barbacoa ahumada.","Ali di pollo succose con salsa barbecue affumicata.","İsli barbekü soslu sulu tavuk kanatları.","أجنحة دجاج طرية مع صلصة باربكيو مدخنة.","بال مرغ آبدار با سس باربیکیو دودی."],
"Crispy calamari with lemon and creamy aioli.":["Knusprige Calamari mit Zitrone und cremiger Aioli.","Calamars croustillants au citron et aïoli crémeux.","Calamares crujientes con limón y alioli cremoso.","Calamari croccanti con limone e aioli cremosa.","Limon ve kremamsı aioli ile çıtır kalamar.","كاليماري مقرمش مع الليمون وصلصة الأيولي الكريمية.","کالاماری ترد با لیمو و سس آیولی خامه‌ای."],
"Classic Caesar salad topped with grilled chicken.":["Klassischer Caesar Salad mit gegrilltem Hähnchen.","Salade César classique au poulet grillé.","Ensalada César clásica con pollo a la parrilla.","Classica Caesar salad con pollo alla griglia.","Izgara tavuklu klasik Sezar salata.","سلطة سيزر كلاسيكية مع دجاج مشوي.","سالاد سزار کلاسیک با مرغ گریل‌شده."],
"Fresh Mediterranean salad with feta and olives.":["Frischer mediterraner Salat mit Feta und Oliven.","Salade méditerranéenne fraîche à la feta et aux olives.","Ensalada mediterránea fresca con feta y aceitunas.","Insalata mediterranea fresca con feta e olive.","Beyaz peynir ve zeytinli taze Akdeniz salatası.","سلطة متوسطية طازجة مع جبنة الفيتا والزيتون.","سالاد مدیترانه‌ای تازه با پنیر فتا و زیتون."],
"Fresh quinoa salad with avocado, spinach and chickpeas.":["Frischer Quinoa-Salat mit Avocado, Spinat und Kichererbsen.","Salade de quinoa fraîche à l’avocat, aux épinards et aux pois chiches.","Ensalada fresca de quinoa con aguacate, espinacas y garbanzos.","Insalata fresca di quinoa con avocado, spinaci e ceci.","Avokado, ıspanak ve nohutlu taze kinoa salatası.","سلطة كينوا طازجة مع الأفوكادو والسبانخ والحمص.","سالاد کینوای تازه با آووکادو، اسفناج و نخود."],
"Protein-rich tuna salad with egg and olives.":["Proteinreicher Thunfischsalat mit Ei und Oliven.","Salade de thon riche en protéines avec œuf et olives.","Ensalada de atún rica en proteínas con huevo y aceitunas.","Insalata di tonno ricca di proteine con uovo e olive.","Yumurta ve zeytinli, protein açısından zengin ton balığı salatası.","سلطة تونة غنية بالبروتين مع البيض والزيتون.","سالاد تن ماهی پرپروتئین با تخم‌مرغ و زیتون."],
"Classic beef burger with cheddar, fresh vegetables and fries.":["Klassischer Rindfleischburger mit Cheddar, frischem Gemüse und Pommes.","Burger de bœuf classique au cheddar, légumes frais et frites.","Hamburguesa clásica de ternera con cheddar, verduras frescas y patatas fritas.","Classico burger di manzo con cheddar, verdure fresche e patatine.","Çedar peyniri, taze sebze ve patates kızartmalı klasik dana burger.","برغر لحم بقري كلاسيكي مع جبنة الشيدر والخضار الطازجة والبطاطس المقلية.","برگر کلاسیک گوشت گاو با پنیر چدار، سبزیجات تازه و سیب‌زمینی سرخ‌کرده."],
"Double beef burger for serious burger lovers.":["Doppelter Rindfleischburger für echte Burger-Fans.","Double burger de bœuf pour les vrais amateurs de burgers.","Hamburguesa doble de ternera para auténticos amantes de las hamburguesas.","Doppio burger di manzo per veri amanti dei burger.","Gerçek burger severler için duble dana burger.","برغر لحم بقري مزدوج لعشاق البرغر الحقيقيين.","برگر دوبل گوشت گاو برای عاشقان واقعی برگر."],
"A spicy beef burger with jalapeños and salsa.":["Scharfer Rindfleischburger mit Jalapeños und Salsa.","Burger de bœuf épicé aux jalapeños et à la salsa.","Hamburguesa de ternera picante con jalapeños y salsa.","Burger di manzo piccante con jalapeños e salsa.","Jalapeño ve salsalı acı dana burger.","برغر لحم بقري حار مع الهالبينو والصلصة.","برگر تند گوشت گاو با هالاپینو و سالسا."],
"Crispy chicken burger with fresh salad and special sauce.":["Knuspriger Hähnchenburger mit frischem Salat und Spezialsauce.","Burger de poulet croustillant, salade fraîche et sauce spéciale.","Hamburguesa de pollo crujiente con lechuga fresca y salsa especial.","Burger di pollo croccante con insalata fresca e salsa speciale.","Taze marul ve özel soslu çıtır tavuk burger.","برغر دجاج مقرمش مع خس طازج وصلصة خاصة.","برگر مرغ سوخاری با کاهوی تازه و سس مخصوص."],
"Vegetarian burger with grilled vegetable patty.":["Vegetarischer Burger mit gegrilltem Gemüse-Patty.","Burger végétarien avec galette de légumes grillée.","Hamburguesa vegetariana con hamburguesa de verduras a la parrilla.","Burger vegetariano con polpetta di verdure alla griglia.","Izgara sebze köfteli vejetaryen burger.","برغر نباتي مع قرص خضار مشوي.","برگر گیاهی با پتی سبزیجات گریل‌شده."],
"Plant-based burger with creamy avocado and vegan sauce.":["Pflanzlicher Burger mit cremiger Avocado und veganer Sauce.","Burger végétal à l’avocat crémeux et sauce vegan.","Hamburguesa vegetal con aguacate cremoso y salsa vegana.","Burger vegetale con avocado cremoso e salsa vegana.","Kremamsı avokado ve vegan soslu bitkisel burger.","برغر نباتي مع أفوكادو كريمي وصلصة نباتية.","برگر گیاهی با آووکادوی خامه‌ای و سس وگان."],
"Lean grilled chicken breast with rice and vegetables.":["Magere gegrillte Hähnchenbrust mit Reis und Gemüse.","Blanc de poulet grillé maigre avec riz et légumes.","Pechuga de pollo a la parrilla con arroz y verduras.","Petto di pollo magro alla griglia con riso e verdure.","Pilav ve sebzeli yağsız ızgara tavuk göğsü.","صدر دجاج مشوي قليل الدهن مع الأرز والخضار.","سینه مرغ کم‌چرب گریل‌شده با برنج و سبزیجات."],
"250g grilled beef steak with roasted potatoes and vegetables.":["250 g gegrilltes Rindersteak mit Röstkartoffeln und Gemüse.","Steak de bœuf grillé de 250 g, pommes de terre rôties et légumes.","Filete de ternera a la parrilla de 250 g con patatas asadas y verduras.","Bistecca di manzo alla griglia da 250 g con patate arrosto e verdure.","Fırın patates ve sebzeli 250 g ızgara dana biftek.","ستيك لحم بقري مشوي 250 غ مع بطاطس محمصة وخضار.","استیک گوشت گاو گریل‌شده ۲۵۰ گرمی با سیب‌زمینی تنوری و سبزیجات."],
"Slow-cooked BBQ ribs with fries and coleslaw.":["Langsam gegarte BBQ-Rippchen mit Pommes und Krautsalat.","Travers de porc barbecue cuits lentement, frites et coleslaw.","Costillas BBQ cocinadas a fuego lento con patatas fritas y ensalada de col.","Costine BBQ cotte lentamente con patatine e insalata di cavolo.","Patates kızartması ve lahana salatası ile ağır pişmiş barbekü kaburga.","أضلاع باربكيو مطهوة ببطء مع البطاطس المقلية وسلطة الملفوف.","دنده باربیکیو آرام‌پز با سیب‌زمینی سرخ‌کرده و سالاد کلم."],
"Creamy coconut chicken curry with rice.":["Cremiges Kokos-Hähnchen-Curry mit Reis.","Curry de poulet crémeux à la noix de coco avec riz.","Curry cremoso de pollo con coco y arroz.","Curry di pollo cremoso al cocco con riso.","Pilavlı kremamsı hindistan cevizli tavuk köri.","كاري دجاج كريمي بجوز الهند مع الأرز.","کاری مرغ خامه‌ای با نارگیل و برنج."],
"Tender beef with vegetables, rice and teriyaki sauce.":["Zartes Rindfleisch mit Gemüse, Reis und Teriyaki-Sauce.","Bœuf tendre avec légumes, riz et sauce teriyaki.","Ternera tierna con verduras, arroz y salsa teriyaki.","Manzo tenero con verdure, riso e salsa teriyaki.","Sebze, pilav ve teriyaki soslu yumuşak dana eti.","لحم بقري طري مع الخضار والأرز وصلصة الترياكي.","گوشت گاو نرم با سبزیجات، برنج و سس تریاکی."],
"Creamy tagliatelle with mushrooms and parmesan.":["Cremige Tagliatelle mit Pilzen und Parmesan.","Tagliatelle crémeuses aux champignons et au parmesan.","Tagliatelle cremosos con champiñones y parmesano.","Tagliatelle cremose con funghi e parmigiano.","Mantarlı ve parmesanlı kremalı tagliatelle.","تالياتيلي كريمية مع الفطر والبارميزان.","تالیاتله خامه‌ای با قارچ و پارمزان."],
"Classic spicy tomato pasta with garlic and chili.":["Klassische scharfe Tomatenpasta mit Knoblauch und Chili.","Pâtes classiques à la tomate épicée, ail et piment.","Pasta clásica de tomate picante con ajo y guindilla.","Classica pasta al pomodoro piccante con aglio e peperoncino.","Sarımsak ve acı biberli klasik acılı domatesli makarna.","معكرونة كلاسيكية بالطماطم الحارة مع الثوم والفلفل الحار.","پاستای کلاسیک گوجه‌فرنگی تند با سیر و فلفل."],
"Creamy Alfredo pasta with grilled chicken.":["Cremige Alfredo-Pasta mit gegrilltem Hähnchen.","Pâtes Alfredo crémeuses au poulet grillé.","Pasta Alfredo cremosa con pollo a la parrilla.","Pasta Alfredo cremosa con pollo alla griglia.","Izgara tavuklu kremalı Alfredo makarna.","معكرونة ألفريدو كريمية مع دجاج مشوي.","پاستا آلفردو خامه‌ای با مرغ گریل‌شده."],
"Traditional pasta with rich beef and tomato sauce.":["Traditionelle Pasta mit kräftiger Rindfleisch-Tomatensauce.","Pâtes traditionnelles à la riche sauce bœuf-tomate.","Pasta tradicional con abundante salsa de ternera y tomate.","Pasta tradizionale con ricco sugo di manzo e pomodoro.","Bol dana etli domates soslu geleneksel makarna.","معكرونة تقليدية مع صلصة غنية باللحم البقري والطماطم.","پاستای سنتی با سس غلیظ گوشت گاو و گوجه‌فرنگی."],
"Pasta with fresh basil pesto, parmesan and pine nuts.":["Pasta mit frischem Basilikum-Pesto, Parmesan und Pinienkernen.","Pâtes au pesto de basilic frais, parmesan et pignons de pin.","Pasta con pesto de albahaca fresca, parmesano y piñones.","Pasta con pesto di basilico fresco, parmigiano e pinoli.","Taze fesleğenli pesto, parmesan ve çam fıstıklı makarna.","معكرونة مع بيستو الريحان الطازج والبارميزان وحب الصنوبر.","پاستا با پستوی ریحان تازه، پارمزان و چلغوز."],
"Colorful grilled vegetables with chickpeas and quinoa.":["Buntes Grillgemüse mit Kichererbsen und Quinoa.","Légumes grillés colorés avec pois chiches et quinoa.","Verduras a la parrilla variadas con garbanzos y quinoa.","Verdure grigliate colorate con ceci e quinoa.","Nohut ve kinoalı rengârenk ızgara sebzeler.","خضار مشوية ملونة مع الحمص والكينوا.","سبزیجات رنگارنگ گریل‌شده با نخود و کینوا."],
"Falafel bowl with hummus, fresh vegetables and quinoa.":["Falafel-Bowl mit Hummus, frischem Gemüse und Quinoa.","Bol de falafels avec houmous, légumes frais et quinoa.","Bol de falafel con hummus, verduras frescas y quinoa.","Bowl di falafel con hummus, verdure fresche e quinoa.","Humus, taze sebze ve kinoalı falafel kâsesi.","وعاء فلافل مع الحمص والخضار الطازجة والكينوا.","کاسه فلافل با حمص، سبزیجات تازه و کینوا."],
"Plant-based coconut curry with chickpeas and vegetables.":["Pflanzliches Kokos-Curry mit Kichererbsen und Gemüse.","Curry végétal à la noix de coco, pois chiches et légumes.","Curry vegetal de coco con garbanzos y verduras.","Curry vegetale al cocco con ceci e verdure.","Nohut ve sebzeli bitkisel hindistan cevizli köri.","كاري نباتي بجوز الهند مع الحمص والخضار.","کاری گیاهی نارگیل با نخود و سبزیجات."],
"High-protein vegan bowl with quinoa, beans and avocado.":["Proteinreiche vegane Bowl mit Quinoa, Bohnen und Avocado.","Bol vegan riche en protéines avec quinoa, haricots et avocat.","Bol vegano rico en proteínas con quinoa, alubias y aguacate.","Bowl vegana ricca di proteine con quinoa, fagioli e avocado.","Kinoa, fasulye ve avokadolu yüksek proteinli vegan kâse.","وعاء نباتي غني بالبروتين مع الكينوا والفاصولياء والأفوكادو.","کاسه وگان پرپروتئین با کینوا، لوبیا و آووکادو."],
"Classic Italian coffee-flavoured tiramisu.":["Klassisches italienisches Tiramisu mit Kaffeegeschmack.","Tiramisu italien classique au café.","Tiramisú italiano clásico con sabor a café.","Classico tiramisù italiano al caffè.","Kahve aromalı klasik İtalyan tiramisu.","تيراميسو إيطالي كلاسيكي بنكهة القهوة.","تیرامیسوی کلاسیک ایتالیایی با طعم قهوه."],
"Warm chocolate cake with molten center and vanilla ice cream.":["Warmer Schokoladenkuchen mit flüssigem Kern und Vanilleeis.","Gâteau au chocolat chaud au cœur coulant et glace vanille.","Pastel de chocolate caliente con centro fundido y helado de vainilla.","Tortino caldo al cioccolato dal cuore fondente con gelato alla vaniglia.","Akışkan içli sıcak çikolatalı kek ve vanilyalı dondurma.","كعكة شوكولاتة دافئة بقلب ذائب مع آيس كريم الفانيليا.","کیک شکلاتی گرم با مغز ذوب‌شده و بستنی وانیلی."],
"Creamy cheesecake with a crunchy biscuit base.":["Cremiger Käsekuchen mit knusprigem Keksboden.","Cheesecake crémeux sur une base croquante de biscuits.","Tarta de queso cremosa con base crujiente de galleta.","Cheesecake cremosa con base croccante di biscotto.","Çıtır bisküvi tabanlı kremamsı cheesecake.","تشيز كيك كريمي بقاعدة بسكويت مقرمشة.","چیزکیک خامه‌ای با کف بیسکویتی ترد."],
"Refreshing bowl of seasonal fresh fruit.":["Erfrischende Schale mit frischem Obst der Saison.","Bol rafraîchissant de fruits frais de saison.","Refrescante cuenco de fruta fresca de temporada.","Coppa rinfrescante di frutta fresca di stagione.","Mevsim meyvelerinden ferahlatıcı bir kâse.","وعاء منعش من الفواكه الطازجة الموسمية.","کاسه‌ای خنک از میوه‌های تازه فصل."],
"Classic chilled Coca-Cola.":["Klassische gekühlte Coca-Cola.","Coca-Cola classique bien fraîche.","Coca-Cola clásica bien fría.","Coca-Cola classica ben fredda.","Soğuk servis edilen klasik Coca-Cola.","كوكا كولا كلاسيكية مبردة.","کوکاکولای کلاسیک خنک."],
"Sugar-free Coca-Cola served chilled.":["Zuckerfreie Coca-Cola, gekühlt serviert.","Coca-Cola sans sucre servi bien frais.","Coca-Cola sin azúcar servida fría.","Coca-Cola senza zucchero servita fredda.","Soğuk servis edilen şekersiz Coca-Cola.","كوكا كولا خالية من السكر تقدم مبردة.","کوکاکولای بدون شکر، خنک سرو می‌شود."],
"Fresh homemade lemonade with lemon and mint.":["Frische hausgemachte Limonade mit Zitrone und Minze.","Limonade maison fraîche au citron et à la menthe.","Limonada casera fresca con limón y menta.","Limonata fatta in casa con limone e menta.","Limon ve naneli taze ev yapımı limonata.","ليموناضة منزلية طازجة بالليمون والنعناع.","لیموناد خانگی تازه با لیمو و نعناع."],
"Freshly squeezed orange juice.":["Frisch gepresster Orangensaft.","Jus d’orange fraîchement pressé.","Zumo de naranja recién exprimido.","Spremuta d’arancia fresca.","Taze sıkılmış portakal suyu.","عصير برتقال طازج معصور.","آب پرتقال تازه گرفته‌شده."],
"Strong Italian-style espresso.":["Kräftiger Espresso nach italienischer Art.","Espresso corsé à l’italienne.","Espresso intenso al estilo italiano.","Espresso forte all’italiana.","Sert İtalyan usulü espresso.","إسبريسو قوي على الطريقة الإيطالية.","اسپرسوی غلیظ به سبک ایتالیایی."],
"Espresso with steamed milk and creamy foam.":["Espresso mit heißer Milch und cremigem Milchschaum.","Espresso avec lait chaud et mousse onctueuse.","Espresso con leche caliente y espuma cremosa.","Espresso con latte caldo e schiuma cremosa.","Buharla ısıtılmış süt ve kremamsı köpüklü espresso.","إسبريسو مع حليب مبخر ورغوة كريمية.","اسپرسو با شیر داغ و کف شیر خامه‌ای."],
"Layered espresso with plenty of warm milk.":["Geschichteter Espresso mit viel warmer Milch.","Espresso en couches avec beaucoup de lait chaud.","Espresso en capas con abundante leche caliente.","Espresso a strati con tanto latte caldo.","Bol sıcak sütlü katmanlı espresso.","إسبريسو بطبقات مع كمية وفيرة من الحليب الدافئ.","اسپرسوی لایه‌ای با مقدار زیادی شیر گرم."]
};

const ingredients={
"Baguette":["Baguette","Baguette","Baguette","Baguette","Baget","باغيت","باگت"],
"Garlic butter":["Knoblauchbutter","Beurre à l’ail","Mantequilla de ajo","Burro all’aglio","Sarımsaklı tereyağı","زبدة بالثوم","کره سیر"],
"Parsley":["Petersilie","Persil","Perejil","Prezzemolo","Maydanoz","بقدونس","جعفری"],
"Parmesan":["Parmesan","Parmesan","Parmesano","Parmigiano","Parmesan","بارميزان","پارمزان"],
"Toasted bread":["Geröstetes Brot","Pain grillé","Pan tostado","Pane tostato","Kızarmış ekmek","خبز محمص","نان برشته"],
"Tomato":["Tomate","Tomate","Tomate","Pomodoro","Domates","طماطم","گوجه‌فرنگی"],
"Basil":["Basilikum","Basilic","Albahaca","Basilico","Fesleğen","ريحان","ریحان"],
"Garlic":["Knoblauch","Ail","Ajo","Aglio","Sarımsak","ثوم","سیر"],
"Olive oil":["Olivenöl","Huile d’olive","Aceite de oliva","Olio d’oliva","Zeytinyağı","زيت الزيتون","روغن زیتون"],
"Mozzarella":["Mozzarella","Mozzarella","Mozzarella","Mozzarella","Mozzarella","موتزاريلا","موزارلا"],
"Breadcrumbs":["Paniermehl","Chapelure","Pan rallado","Pangrattato","Galeta unu","فتات الخبز","پودر سوخاری"],
"Tomato dip":["Tomaten-Dip","Sauce tomate","Salsa de tomate","Salsa di pomodoro","Domates sosu","صلصة الطماطم","سس گوجه‌فرنگی"],
"Chicken wings":["Chicken Wings","Ailes de poulet","Alitas de pollo","Ali di pollo","Tavuk kanadı","أجنحة الدجاج","بال مرغ"],
"Spices":["Gewürze","Épices","Especias","Spezie","Baharatlar","توابل","ادویه"],
"BBQ sauce":["BBQ-Sauce","Sauce barbecue","Salsa barbacoa","Salsa barbecue","Barbekü sosu","صلصة باربكيو","سس باربیکیو"],
"Calamari":["Calamari","Calamars","Calamares","Calamari","Kalamar","كاليماري","کالاماری"],
"Breadcrumb coating":["Panade","Panure","Rebozado","Panatura","Pane harcı","طبقة مقرمشة من فتات الخبز","روکش سوخاری"],
"Lemon":["Zitrone","Citron","Limón","Limone","Limon","ليمون","لیمو"],
"Aioli":["Aioli","Aïoli","Alioli","Aioli","Aioli","أيولي","آیولی"],
"Grilled chicken":["Gegrilltes Hähnchen","Poulet grillé","Pollo a la parrilla","Pollo alla griglia","Izgara tavuk","دجاج مشوي","مرغ گریل‌شده"],
"Romaine lettuce":["Romanasalat","Laitue romaine","Lechuga romana","Lattuga romana","Marul","خس روماني","کاهو رومی"],
"Croutons":["Croutons","Croûtons","Picatostes","Crostini","Kruton","خبز محمص مكعبات","کروتون"],
"Caesar dressing":["Caesar-Dressing","Sauce César","Aderezo César","Salsa Caesar","Sezar sosu","صلصة سيزر","سس سزار"],
"Cucumber":["Gurke","Concombre","Pepino","Cetriolo","Salatalık","خيار","خیار"],
"Olives":["Oliven","Olives","Aceitunas","Olive","Zeytin","زيتون","زیتون"],
"Feta":["Feta","Feta","Feta","Feta","Beyaz peynir","جبنة فيتا","پنیر فتا"],
"Red onion":["Rote Zwiebel","Oignon rouge","Cebolla morada","Cipolla rossa","Kırmızı soğan","بصل أحمر","پیاز قرمز"],
"Quinoa":["Quinoa","Quinoa","Quinoa","Quinoa","Kinoa","كينوا","کینوا"],
"Avocado":["Avocado","Avocat","Aguacate","Avocado","Avokado","أفوكادو","آووکادو"],
"Spinach":["Spinat","Épinards","Espinacas","Spinaci","Ispanak","سبانخ","اسفناج"],
"Chickpeas":["Kichererbsen","Pois chiches","Garbanzos","Ceci","Nohut","حمص","نخود"],
"Tuna":["Thunfisch","Thon","Atún","Tonno","Ton balığı","تونة","تن ماهی"],
"Lettuce":["Salat","Laitue","Lechuga","Lattuga","Marul","خس","کاهو"],
"Egg":["Ei","Œuf","Huevo","Uovo","Yumurta","بيض","تخم‌مرغ"],
"Beef patty":["Rindfleisch-Patty","Steak haché de bœuf","Hamburguesa de ternera","Hamburger di manzo","Dana köfte","قرص لحم بقري","پتی گوشت گاو"],
"Cheddar":["Cheddar","Cheddar","Cheddar","Cheddar","Çedar","شيدر","پنیر چدار"],
"Onion":["Zwiebel","Oignon","Cebolla","Cipolla","Soğan","بصل","پیاز"],
"Burger sauce":["Burgersauce","Sauce burger","Salsa de hamburguesa","Salsa burger","Burger sosu","صلصة البرغر","سس برگر"],
"Brioche bun":["Brioche-Brötchen","Pain brioché","Pan brioche","Panino brioche","Brioş ekmeği","خبز بريوش","نان بریوش"],
"French fries":["Pommes frites","Frites","Patatas fritas","Patatine fritte","Patates kızartması","بطاطس مقلية","سیب‌زمینی سرخ‌کرده"],
"Two beef patties":["Zwei Rindfleisch-Patties","Deux steaks hachés de bœuf","Dos hamburguesas de ternera","Due hamburger di manzo","İki dana köfte","قرصان من اللحم البقري","دو پتی گوشت گاو"],
"Caramelized onion":["Karamellisierte Zwiebeln","Oignons caramélisés","Cebolla caramelizada","Cipolla caramellata","Karamelize soğan","بصل مكرمل","پیاز کاراملی"],
"Jalapeño":["Jalapeño","Jalapeño","Jalapeño","Jalapeño","Jalapeño","هالبينو","هالاپینو"],
"Salsa":["Salsa","Salsa","Salsa","Salsa","Salsa","صلصة سالسا","سالسا"],
"Crispy chicken":["Knuspriges Hähnchen","Poulet croustillant","Pollo crujiente","Pollo croccante","Çıtır tavuk","دجاج مقرمش","مرغ سوخاری"],
"Special sauce":["Spezialsauce","Sauce spéciale","Salsa especial","Salsa speciale","Özel sos","صلصة خاصة","سس مخصوص"],
"Vegetable patty":["Gemüse-Patty","Galette de légumes","Hamburguesa de verduras","Polpetta di verdure","Sebze köftesi","قرص خضار","پتی سبزیجات"],
"Bun":["Brötchen","Pain","Pan","Panino","Ekmek","خبز","نان"],
"Vegan patty":["Veganes Patty","Galette vegan","Hamburguesa vegana","Polpetta vegana","Vegan köfte","قرص نباتي","پتی وگان"],
"Vegan sauce":["Vegane Sauce","Sauce vegan","Salsa vegana","Salsa vegana","Vegan sos","صلصة نباتية","سس وگان"],
"Grilled chicken breast":["Gegrillte Hähnchenbrust","Blanc de poulet grillé","Pechuga de pollo a la parrilla","Petto di pollo alla griglia","Izgara tavuk göğsü","صدر دجاج مشوي","سینه مرغ گریل‌شده"],
"Rice":["Reis","Riz","Arroz","Riso","Pirinç","أرز","برنج"],
"Seasonal vegetables":["Saisongemüse","Légumes de saison","Verduras de temporada","Verdure di stagione","Mevsim sebzeleri","خضار موسمية","سبزیجات فصل"],
"Beef steak":["Rindersteak","Steak de bœuf","Filete de ternera","Bistecca di manzo","Dana biftek","ستيك لحم بقري","استیک گوشت گاو"],
"Roasted potatoes":["Röstkartoffeln","Pommes de terre rôties","Patatas asadas","Patate arrosto","Fırın patates","بطاطس محمصة","سیب‌زمینی تنوری"],
"Pork ribs":["Schweinerippchen","Travers de porc","Costillas de cerdo","Costine di maiale","Domuz kaburga","أضلاع لحم الخنزير","دنده خوک"],
"Coleslaw":["Krautsalat","Coleslaw","Ensalada de col","Insalata di cavolo","Lahana salatası","سلطة الملفوف","سالاد کلم"],
"Chicken":["Hähnchen","Poulet","Pollo","Pollo","Tavuk","دجاج","مرغ"],
"Coconut curry sauce":["Kokos-Currysauce","Sauce curry coco","Salsa de curry y coco","Salsa curry al cocco","Hindistan cevizli köri sosu","صلصة كاري بجوز الهند","سس کاری نارگیل"],
"Vegetables":["Gemüse","Légumes","Verduras","Verdure","Sebzeler","خضار","سبزیجات"],
"Beef":["Rindfleisch","Bœuf","Ternera","Manzo","Dana eti","لحم بقري","گوشت گاو"],
"Broccoli":["Brokkoli","Brocoli","Brócoli","Broccoli","Brokoli","بروكلي","بروکلی"],
"Carrot":["Karotte","Carotte","Zanahoria","Carota","Havuç","جزر","هویج"],
"Teriyaki sauce":["Teriyaki-Sauce","Sauce teriyaki","Salsa teriyaki","Salsa teriyaki","Teriyaki sosu","صلصة ترياكي","سس تریاکی"],
"Tagliatelle":["Tagliatelle","Tagliatelle","Tagliatelle","Tagliatelle","Tagliatelle","تالياتيلي","تالیاتله"],
"Mushrooms":["Pilze","Champignons","Champiñones","Funghi","Mantar","فطر","قارچ"],
"Cream":["Sahne","Crème","Nata","Panna","Krema","كريمة","خامه"],
"Pasta":["Pasta","Pâtes","Pasta","Pasta","Makarna","معكرونة","پاستا"],
"Chili":["Chili","Piment","Guindilla","Peperoncino","Acı biber","فلفل حار","فلفل تند"],
"Tomato sauce":["Tomatensauce","Sauce tomate","Salsa de tomate","Salsa di pomodoro","Domates sosu","صلصة الطماطم","سس گوجه‌فرنگی"],
"Celery":["Sellerie","Céleri","Apio","Sedano","Kereviz","كرفس","کرفس"],
"Basil pesto":["Basilikum-Pesto","Pesto au basilic","Pesto de albahaca","Pesto di basilico","Fesleğenli pesto","بيستو الريحان","پستوی ریحان"],
"Pine nuts":["Pinienkerne","Pignons de pin","Piñones","Pinoli","Çam fıstığı","حب الصنوبر","چلغوز"],
"Zucchini":["Zucchini","Courgette","Calabacín","Zucchine","Kabak","كوسا","کدو سبز"],
"Eggplant":["Aubergine","Aubergine","Berenjena","Melanzana","Patlıcan","باذنجان","بادمجان"],
"Bell pepper":["Paprika","Poivron","Pimiento","Peperone","Dolmalık biber","فلفل رومي","فلفل دلمه‌ای"],
"Falafel":["Falafel","Falafels","Falafel","Falafel","Falafel","فلافل","فلافل"],
"Hummus":["Hummus","Houmous","Hummus","Hummus","Humus","حمص بطحينة","حمص"],
"Coconut milk":["Kokosmilch","Lait de coco","Leche de coco","Latte di cocco","Hindistan cevizi sütü","حليب جوز الهند","شیر نارگیل"],
"Kidney beans":["Kidneybohnen","Haricots rouges","Alubias rojas","Fagioli rossi","Barbunya","فاصولياء حمراء","لوبیا قرمز"],
"Mascarpone":["Mascarpone","Mascarpone","Mascarpone","Mascarpone","Mascarpone","ماسكاربوني","ماسکارپونه"],
"Coffee":["Kaffee","Café","Café","Caffè","Kahve","قهوة","قهوه"],
"Ladyfingers":["Löffelbiskuits","Biscuits à la cuillère","Bizcochos de soletilla","Savoiardi","Kedi dili bisküvi","بسكويت أصابع","بیسکویت لیدی‌فینگر"],
"Cocoa":["Kakao","Cacao","Cacao","Cacao","Kakao","كاكاو","کاکائو"],
"Chocolate cake":["Schokoladenkuchen","Gâteau au chocolat","Pastel de chocolate","Torta al cioccolato","Çikolatalı kek","كعكة الشوكولاتة","کیک شکلاتی"],
"Chocolate center":["Schokoladenkern","Cœur chocolat","Centro de chocolate","Cuore di cioccolato","Çikolata dolgusu","قلب شوكولاتة","مغز شکلاتی"],
"Vanilla ice cream":["Vanilleeis","Glace vanille","Helado de vainilla","Gelato alla vaniglia","Vanilyalı dondurma","آيس كريم الفانيليا","بستنی وانیلی"],
"Cream cheese":["Frischkäse","Fromage frais","Queso crema","Formaggio cremoso","Krem peynir","جبنة كريمية","پنیر خامه‌ای"],
"Biscuit base":["Keksboden","Base biscuitée","Base de galleta","Base di biscotto","Bisküvi tabanı","قاعدة بسكويت","کف بیسکویتی"],
"Sugar":["Zucker","Sucre","Azúcar","Zucchero","Şeker","سكر","شکر"],
"Seasonal fresh fruit":["Frisches Obst der Saison","Fruits frais de saison","Fruta fresca de temporada","Frutta fresca di stagione","Taze mevsim meyveleri","فواكه طازجة موسمية","میوه تازه فصل"],
"Cola":["Cola","Cola","Cola","Cola","Kola","كولا","کولا"],
"Sugar-free cola":["Zuckerfreie Cola","Cola sans sucre","Cola sin azúcar","Cola senza zucchero","Şekersiz kola","كولا خالية من السكر","کولای بدون شکر"],
"Mint":["Minze","Menthe","Menta","Menta","Nane","نعناع","نعناع"],
"Sparkling water":["Mineralwasser mit Kohlensäure","Eau gazeuse","Agua con gas","Acqua frizzante","Maden suyu","مياه غازية","آب گازدار"],
"Fresh orange juice":["Frischer Orangensaft","Jus d’orange frais","Zumo de naranja natural","Spremuta d’arancia","Taze portakal suyu","عصير برتقال طازج","آب پرتقال تازه"],
"Espresso coffee":["Espresso-Kaffee","Café espresso","Café espresso","Caffè espresso","Espresso kahvesi","قهوة إسبريسو","قهوه اسپرسو"],
"Espresso":["Espresso","Espresso","Espresso","Espresso","Espresso","إسبريسو","اسپرسو"],
"Milk foam":["Milchschaum","Mousse de lait","Espuma de leche","Schiuma di latte","Süt köpüğü","رغوة الحليب","کف شیر"],
"Steamed milk":["Heiße Milch","Lait chaud","Leche caliente","Latte caldo","Buharlı süt","حليب مبخر","شیر داغ"]
};

const allergens={
"Gluten":["Gluten","Gluten","Gluten","Glutine","Gluten","غلوتين","گلوتن"],
"Milk":["Milch","Lait","Leche","Latte","Süt","حليب","شیر"],
"Egg":["Ei","Œuf","Huevo","Uova","Yumurta","بيض","تخم‌مرغ"],
"Molluscs":["Weichtiere","Mollusques","Moluscos","Molluschi","Yumuşakçalar","رخويات","نرم‌تنان"],
"Fish":["Fisch","Poisson","Pescado","Pesce","Balık","سمك","ماهی"],
"Soy":["Soja","Soja","Soja","Soia","Soya","صويا","سویا"],
"Nuts":["Schalenfrüchte","Fruits à coque","Frutos de cáscara","Frutta a guscio","Sert kabuklu yemişler","مكسرات","آجیل"],
"Sesame":["Sesam","Sésame","Sésamo","Sesamo","Susam","سمسم","کنجد"],
"Celery":["Sellerie","Céleri","Apio","Sedano","Kereviz","كرفس","کرفس"],
"Mustard":["Senf","Moutarde","Mostaza","Senape","Hardal","خردل","خردل"],
"Peanuts":["Erdnüsse","Arachides","Cacahuetes","Arachidi","Yer fıstığı","فول سوداني","بادام زمینی"],
"Crustaceans":["Krebstiere","Crustacés","Crustáceos","Crostacei","Kabuklular","قشريات","سخت‌پوستان"],
"Lupin":["Lupinen","Lupin","Altramuces","Lupini","Acı bakla","الترمس","باقلای گرگی"],
"Sulphites":["Sulfite","Sulfites","Sulfitos","Solfiti","Sülfitler","كبريتيت","سولفیت"]
};

const units={piece:["Stück","pièces","piezas","pezzi","adet","قطع","عدد"],
bowl:["Schale","bol","bol","ciotola","kâse","وعاء","کاسه"],
burger:["Burger","burger","hamburguesa","burger","burger","برغر","برگر"],
fries:["Pommes","frites","patatas fritas","patatine","patates kızartması","بطاطس مقلية","سیب‌زمینی سرخ‌کرده"],
chicken:["Hähnchen","poulet","pollo","pollo","tavuk","دجاج","مرغ"],
steak:["Steak","steak","filete","bistecca","biftek","ستيك","استیک"],
rack:["Rippchen-Portion","portion de travers","costillar","costata","porsiyon kaburga","طبق أضلاع","پرس دنده"],
plate:["Teller","assiette","plato","piatto","tabak","طبق","بشقاب"],
slice:["Stück","part","porción","fetta","dilim","قطعة","برش"],
cake:["Kuchen","gâteau","pastel","tortino","kek","كعكة","کیک"],
cup:["Tasse","tasse","taza","tazza","fincan","فنجان","فنجان"],
fat:["Fett","lipides","grasas","grassi","yağ","دهون","چربی"],
carbs:["KH","glucides","carbohidratos","carboidrati","karbonhidrat","كربوهيدرات","کربوهیدرات"],
protein:["Eiweiß","protéines","proteínas","proteine","protein","بروتين","پروتئین"]};
const U=pack(units);

function serving(s,lang){
  if(!s||lang==="en") return s;
  const u=k=>U[k]?.[lang]||k;
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
    .replace(/(\d)\.(\d+) L/,(m,a,b)=>["de","fr","es","it","tr"].includes(lang)?`${a},${b} l`:m);
}

window.I18N = window.I18N || {};
window.I18N.content = {
  descriptions: pack(descriptions),
  ingredients: pack(ingredients),
  allergens: pack(allergens),
  units: U,
  serving
};
})();
