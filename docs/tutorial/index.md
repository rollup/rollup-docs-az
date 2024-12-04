---
title: Öyrədici
---

# {{ $frontmatter.title }}

[[toc]]

## İlk bandlınızı yaradın {#creating-your-first-bundle}

_Başlamazdan əvvəl, sizin kompüterinizdə [Node.js](https://nodejs.org) quraşdırılmış olmalıdır ki, [NPM](https://npmjs.com)-dən istifadə edə biləsiniz. Sizə həmçinin [komanda sətrində](https://www.codecademy.com/learn/learn-the-command-line) necə əməliyyat aparmağı bilmək də lazım gələcək._

Rollup-ı quraşdırmağın ən asan yolu Kommanda Sətri İnterfeysindən (KSİ-dən) istifadə etməkdir. Hələlik onu qlobal şəkildə quraşdıra bilərik (bir azdan onu proyektə necə lokal şəkildə yükləməli olduğunuzu da görəcəksiniz, beləcə inşa prosesini mobilləşdirmək mümkün olacaq). Komanda sətrinə bunu daxil edin:

```shell
npm install rollup --global
# yaxud qısaca `npm i rollup -g`
```

İndi siz `rollup` komandasını işə sala bilərsiniz!

```shell
rollup
```

Heç bir arqument daxil edilmədiyi üçün Rollup istifadə instruksiyasını çap edir. `rollup --help`, yaxud `rollup -h` komandaları da eyni nəticəni verəcək.

Gəlin sadə bir proyekt yaradaq:

```shell
mkdir -p my-rollup-project/src
cd my-rollup-project
```

Bizə hər şeydən əvvəl bir giriş nöqtəsi lazımdır. Aşağıdakı kodu `src/main.js` faylına daxil edin:

```js
// src/main.js
import foo from './foo.js';
export default function () {
	console.log(foo);
}
```

İndi isə giriş nöqtəmizin idxal edəcəyi `foo.js` modulunu yaradaq:

```js
// src/foo.js
export default 'salam, dünya!';
```

İndi biz bandl yarada bilərik:

```shell
rollup src/main.js -f cjs
```

`-f` parametri (`--format` sözünün ixtisarından) yaratdığımız bandlın növünü müəyyən edir — bu nümunədə CommonJS (Node.js-də işə salmaq üçün). Çıxış faylı təyin eləmədiyimiz üçün çap əməliyyatı birbaşa `stdout`-da icra olunacaq:

```js
'use strict';

const foo = 'salam, dünya!';

const main = function () {
	console.log(foo);
};

module.exports = main;
```

Bandlı fayla bu cür yaza bilərsiniz:

```shell
rollup src/main.js -o bundle.js -f cjs
```

İstəsəniz, həmçinin `rollup src/main.js -f cjs > bundle.js` komandasını da icra edə bilərsiniz, amma bir azdan görəcəyik ki, mənbə xəritələri üçün bu üsul o qədər də əlverişli deyil.

Kodu işə sala bilərsiniz:

```
node
> var myBundle = require('./bundle.js');
> myBundle();
'salam, dünya!'
```

Təbrik edirik! Siz Rollup ilə ilk bandlınızı yaratdınız.

## Konfiqurasiya fayllarından istifadə {#using-config-files}

Hələ ki, yaxşı gedirik, ancaq bir neçə parametr daha əlavə eləsək, komandaları yazmaq bir qədər vaxt aparacaq.

Eyni şeyi təkrar-təkrar yazmamaq üçün ehtiyacımız olan parametrlərdən ibarət konfiqurasiya faylı yarada bilərik. Konfiqurasiya faylı JavaScript ilə yazılır və sadə KSİ-dən daha əlverişlidir.

Proyektin olduğu qovluqda `rollup.config.mjs` faylını yaradıb aşağıdakı kodu daxil edin::

```js twoslash
// rollup.config.mjs
// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	}
};
```

Qeyd edək ki, siz CJS modullarından, o cümlədən `module.exports = {/* config */}` sintaksisindən də istifadə edə bilərsiniz.

Konfiqurasiya faylından istifadə etmək üçün `--config`, yaxud `-c` parametrindən istifadə edirik:

```shell
rm bundle.js # komandanın işləyib-işləmədiyini yoxlamaq üçün
rollup -c
```

Konfiqurasiya faylındakı istədiyiniz parametri komanda sətrində qeyd etdiklərinizlə əvəz edə bilərsiniz:

```shell
rollup -c -o bundle-2.js # "-o" parametri "--file" ilə eynigüclüdür ("output" sözündən)
```

_Qeyd: Rollup özü konfiqurasiya faylını emal edir, buna görə də `export default` sintaksisindən istifadə etmək mümkündür — daxil edilən kod Babel, yaxud hər hansı sair alət ilə transkompilyasiya edilmir, buna görə də siz yalnızca quraşdırdığınız Node.js versiyasının dəstəklədiyi ES2015 xüsusiyyətlərindən istifadə edə bilərsiniz._

İstəsəniz, konfiqurasiya üçün `rollup.config.mjs`-dən başqa da fayl seçə bilərsiniz:

```shell
rollup --config rollup.config.dev.mjs
rollup --config rollup.config.prod.mjs
```

## Rollup-ı lokal şəkildə quraşdırmaq {#installing-rollup-locally}

Komandaların tərkibində, yaxud bölünmüş mühitlərdə işləyərkən Rollup-ı lokal asılılıq kimi əlavə eləmək daha məqsədəuyğun olar. Rollup-ı lokal şəkildə quraşdıranda başqa-başqa əməkdaşların bir də Rollup-ı ayrıca quraşdırmalarına ehtiyac qalmır və bütün əməkdaşlar Rollup-ın eyni versiyasından istifadə edir.

Rollup-ı bu cür lokal şəkildə quraşdıra bilərsiniz:

::: code-group

```shell [npm]
npm install rollup --save-dev
```

```shell [Yarn]
yarn -D add rollup
```

:::

Yüklənəndən sonra Rollup proyektinizin mövcud olduğu qovluqda işə salına bilər:

::: code-group

```shell [npm]
npx rollup --config
```

```shell [Yarn]
yarn rollup --config
```

:::

Tövsiyə edilir ki, kitabxananı yükləyəndən sonra `package.json` faylına bütün əməkdaşların rahatlıqla istifadə edə biləcəyi inşa skripti komandası əlavə edəsiniz:

```json
{
	"scripts": {
		"build": "rollup --config"
	}
}
```

_Qeyd: Lokal şəkildə yüklənəndə həm NPM, həm də Yarn kitabxananın binar faylını emal edəcək və hansısa paket skriptindən çağrılanda Rollup-ı işə salacaq._

## Plaginlərdən istifadə {#using-plugins}

Hələ ki, biz bir giriş nöqtəsi və nisbi fayl mövqeyi vasitəsilə idxal edilən bir moduldan ibarət sadə bir bandl yaratmışıq. Sizə isə daha mürəkkəb bandllar yaratdıqca daha çox elastiklik lazım olacaq, məsələn: NPM ilə yüklənmiş modulları idxal etmək, Babel ilə kodu kompilyasiya etmək, JSON faylları ilə işləmək və s.

Bunun üçün isə bizə **plaginlər** lazım olacaq. Plaginlər bandl yaradılma prosesi zamanı müəyyən mühüm nöqtələrdə Rollup-ın iş metoduna təsir edir. [Rollup-ın Möhtəşəmlər Siyahısında](https://github.com/rollup/awesome) bir sıra möhtəşəm plaginlər tapa bilərsiniz.

Bu dərs zamanı biz [@rollup/plugin-json](https://github.com/rollup/plugins/tree/master/packages/json) plaginindən istifadə edəcəyik. Plagin bizə JSON faylından data idxal etməyə kömək edəcək.

Proyekt qovluğunda `package.json` faylını yaradın və aşağıdakı kodu daxil edin:

```json
{
	"name": "rollup-tutorial",
	"version": "1.0.0",
	"scripts": {
		"build": "rollup -c"
	}
}
```

`@rollup/plugin-json` kitabxanasını tərtibat asılılığı kimi yükləyin:

```shell
npm install --save-dev @rollup/plugin-json
```

Burada `--save` əvəzinə `-save-dev` parametrindən istifadə etməyimizin səbəbi kodun işə salınma zamanı plagindən asılı olmamasıdır — o bizə yalnızca bandl yaradılması zamanı lazım olacaq.

`src/main.js` faylınızı lazımi məlumatı `src/foo.js` əvəzinə `package.json` faylından alması üçün redaktə edin:

```js
// src/main.js
import { version } from '../package.json';

export default function () {
	console.log('versiya ' + version);
}
```

`rollup.config.mjs` faylınıza JSON plaginini tanıyan kodu əlavə edin:

```js twoslash
// rollup.config.mjs
import json from '@rollup/plugin-json';

// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	plugins: [json()]
};
```

Rollup-ı `npm run build` ilə işə salın. Nəticə bu cür olmalıdır:

```js
'use strict';

var version = '1.0.0';

function main() {
	console.log('versiya ' + version);
}

module.exports = main;
```

_Qeyd: Yalnızca bizə lazım olan data idxal edilir — `name`, `devDependencies` və `package.json` faylının digər hissələri görməzlikdən gəlinir. Bu, **tri-şeykinqin** əyani nümunəsidir._

## Çıxış plaginlərindən istifadə etmək {#using-output-plugins}

Bəzi plaginlər sırf bəzi nəzərdə tutulmuş nəticələri əldə etmək üçün istifadə edilə bilər. Çıxış üçün nəzərdə tutulmuş plaginlərin nələr edə biləcəyinin texniki təfərrüatı haqqında [plagin qarmaqlarında](../plugin-development/index.md#build-hooks) ətraflı öyrənə bilərsiniz. Müxtəsər, bu plaginlər kod üzərində yalnız Rollup-ın əsas analizi sona çatandan sonra dəyişikliklər apara bilər. Əgər çıxış üçün uyğun olmayan bir plagin bu məqsədlə istifadə edilərsə, Rollup xəbərdarlıq verəcək. Nümunəvi istifadə kimi bandlların brauzerdə yüklənilmək üçün kiçildilməsini göstərmək olar.

Gəlin bayaqkı nümunəni genişləndirək və bir kiçildilmiş, bir də kiçildilməmiş bandlı bir yerdə yaradaq. Bunun üçün bizə [@rollup/plugin-terser](https://github.com/rollup/plugins/tree/master/packages/terser) lazım olacaq:

```shell
npm install --save-dev @rollup/plugin-terser
```

`rollup.config.mjs` faylını ikinci bir kiçildilmiş çıxış yaradılması üçün redaktə edin. Format kimi `iife` təyin edəcəyik, beləcə kod yığcamlaşdırılır və brauzerdə `script` teqi vasitəsilə digər kodla toqquşmadan istifadə edilə bilir. Bizim kodumuzda bir ədəd ixracat mövcuddur və savayı kodların bu ixracatdan istifadə edə bilməsi üçün bandl zamanı ona təyin edilmiş qlobal dəyişən yaradılacaq, buna görə də biz həmin dəyişən üçün ad təyin etməliyik.

```js twoslash
// rollup.config.mjs
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
	input: 'src/main.js',
	output: [
		{
			file: 'bundle.js',
			format: 'cjs'
		},
		{
			file: 'bundle.min.js',
			format: 'iife',
			name: 'version',
			plugins: [terser()]
		}
	],
	plugins: [json()]
};
```

İndi isə Rollup `bundle.js` faylından başqa `bundle.min.js` adında ikinci bir fayl da yaradacaq:

```js
var version = (function () {
	'use strict';
	var n = '1.0.0';
	return function () {
		console.log('versiya ' + n);
	};
})();
```

## Kod bölgüsü {#code-splitting}

Dinamik yükləmə, yaxud çoxlu giriş nöqtəsindən istifadə kimi bəzi hallarda Rollup kodu bloklara avtomatik ayıra bilər, yaxud istəsəniz, Rollup-a [`output.manualChunks`](../configuration-options/index.md#output-manualchunks) parametri vasitəsilə hansı modulların parçalanmalı olduğunu siz deyə bilərsiniz.

Astagəl ("lazy") dinamik yükləməni (idxal edilmiş bəzi modulların yalnız müəyyən bir funksiya işə salınandan sonra yüklənməsi) həyata keçirmək məqsədilə kod bölgüsü aparmaq üçün biz ilkin nümunəyə gedirik və `src/main.js` faylını redaktə edirik ki, `src/foo.js` dinamik şəkildə yüklənsin:

```js
// src/main.js
export default function () {
	import('./foo.js').then(({ default: foo }) => console.log(foo));
}
```

Rollup bu dəfə dinamik idxaletmədən istifadə edərək yalnızca lazım olanda yüklənən ayrı bir blok yaradacaq. Rollup-ın bu bloku hara qoyacağını bilməsi üçün biz gərək `--file` parametri əvəzinə `--dir` ilə bir qovluq təyin edək:

```shell
rollup src/main.js -f cjs -d dist
```

Bu, `dist` adında, 2 fayldan — `main.js` və `chunk-[hash].js` fayllarından ibarət bir qovluq yaradacaq. Burada `[hash]` — çözənəkdən ibarət yazıdır. [`output.chunkFileNames`](../configuration-options/index.md#output-chunkfilenames) və [`output.entryFileNames`](../configuration-options/index.md#output-entryfilenames) parametrləri ilə siz öz adlandırma sxemlərinizi təyin edə bilərsiniz.

Siz yenə əvvəlki kimi eyni çıxışla kodu işə sala bilərsiniz, sadəcə `foo.js` faylının yüklənməsi və emalı ixrac edilmiş funksiya çağrılandan sonra başlayacağı üçün kod bir qədər yavaş işləyəcək.

```shell
node -e "require('./dist/main.js')()"
```

Əgər biz `--dir` parametrindən istifadə etməsək, Rollup sərhədləri şərhlər vasitəsilə qeyd edərək blokları yenə `stdout`-a çap edəcək.

```js
//→ main.js:
'use strict';

function main() {
	Promise.resolve(require('./chunk-b8774ea3.js')).then(({ default: foo }) =>
		console.log(foo)
	);
}

module.exports = main;

//→ chunk-b8774ea3.js:
('use strict');

var foo = 'salam, dünya!';

exports.default = foo;
```

Əgər siz yalnızca lazım olanda işə salınmalı, ağır funksiyalardan istifadə etmək istəyirsinizsə, bu üsul işinizə yaraya bilər.

Kod bölgüsünün başqa bir istifadə nümunəsi isə bir sıra ortaq asılılıqları olan müxtəlif giriş nöqtələrinin yaradılmasıdır. Biz yenə qayıdırıq bayaqkı nümunəyə və `src/main2.js` adında ikinci bir giriş nöqtəsi yaradırıq və birinci nümunədəki kimi `src/foo.js` modulunu statik idxal kimi təyin edirik:

```js
// src/main2.js
import foo from './foo.js';
export default function () {
	console.log(foo);
}
```

Əgər Rollup-a hər iki giriş nöqtəsini də versək:

```shell
rollup src/main.js src/main2.js -f cjs
```

Çıxış belə olacaq:

```js
//→ main.js:
'use strict';

function main() {
	Promise.resolve(require('./chunk-b8774ea3.js')).then(({ default: foo }) =>
		console.log(foo)
	);
}

module.exports = main;

//→ main2.js:
('use strict');

var foo_js = require('./chunk-b8774ea3.js');

function main2() {
	console.log(foo_js.default);
}

module.exports = main2;

//→ chunk-b8774ea3.js:
('use strict');

var foo = 'salam, dünya!';

exports.default = foo;
```

Diqqət etmək lazımdır ki, hər iki giriş nöqtəsi eyni bir bloku idxal etdi. Rollup bir qayda kimi eyni kodu təkrar-təkrar çıxarmaq əvəzinə yalnızca lazım olan hissələrdən ibarət bloklar yaradacaq. Əvvəlki kimi, `--dir` parametrini təyin eləyəndə nəticə diskə yazılacaq.

Siz eyni kodu brauzer üçün doğma ES modulları, AMD yükləyicisi, yaxud SystemJS formatlarında inşa edə bilərsiniz.

Məsələn, `-f es` sizə doğma modul çıxışı verəcək:

```shell
rollup src/main.js src/main2.js -f es -d dist
```

```html
<!doctype html>
<script type="module">
	import main2 from './dist/main2.js';
	main2();
</script>
```

Həmçinin `-f system` parametri də SystemJS çıxışı:

```shell
rollup src/main.js src/main2.js -f system -d dist
```

SystemJS-i aşağıdakı kimi quraşdırın:

```shell
npm install --save-dev systemjs
```

Daha sonra isə giriş nöqtələrindən birini, yaxud hər ikisini HTML səhifəsində işə salın:

```html
<!doctype html>
<script src="node_modules/systemjs/dist/s.min.js"></script>
<script>
	System.import('./dist/main2.js').then(({ default: main }) => main());
</script>
```

Doğma ES modulları və ehtiyatda onları dəstəkləyən SystemJS kodundan istifadə edən veb tətbiqinin yaradılması barədə [rollup-starter-code-splitting](https://github.com/rollup/rollup-starter-code-splitting) nümunəsinə nəzər yetirə bilərsiniz.
