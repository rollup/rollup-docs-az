---
title: Tez-tez verilən suallar
---

# {{ $frontmatter.title }}

[[toc]]

## ES modulları niyə CommonJS modulları ilə müqayisədə daha üstündür? {#why-are-es-modules-better-than-commonjs-modules}

ES modulları rəsmi standart kimi qəbul edilib və JavaScript kod strukturunu irəli aparan yol kimidir; CommonJS modulları isə köhnədən qalmış bir təhər formatdır və ES modulları təklif edilənə qədər müvəqqəti üsul kimi istifadə olunublar. ES modulları tri-şeykinq və skop-hoystinq ("scope-hoisting") kimi optimizasiyalarda köməkçi olan statik analizə icazə verir və dairəvi istinad və canlı qoşma kimi təkmilləşmiş funksiyaları təmin edir.

## Tri-şeykinq nədir? {#what-is-tree-shaking}

Rollup-ın istifadə edilməyən kodları xaricetmə prosesi "canlı koddaxiletmə", yaxud "tri-şeykinq" adlanır (ingilis dilindən hərfi tərcümədə _ağacsilkələmə_ deməkdir). [Ölü kodun aradanqaldırılmasının bir növüdür](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n), ancaq son nəticənin ölçüsünə görə digər üsullardan daha səmərəlidir. Texnologiyanın adı modulların [abstrakt sintaksis ağacından](https://az.wikipedia.org/wiki/Abstrakt_sintaksis_ağacı) gəlir. Alqoritm əvvəlcə lazım olan ifadələri qeyd edir, daha sonra isə "sintaksis ağacını silkələyərək" bütün ölü kodu aradan götürür. Bu, fikrən [işarələyib-süpürən zibilyığma alqoritminə](https://az.wikipedia.org/wiki/İzsürülən_zibilyığma) bənzəyir. Alqoritm ES modulları ilə məhdudlaşmasa da, onlar Rollup-ın bütün modulları şərikli qoşmaların daxil edildiyi böyük bir abstrakt sintaksis ağacı kimi görməsinə şərait yaratdıqları üçün alqoritmi daha da məhsuldar edirlər.

## Rollup-dan Node.js-də CommonJS modulları ilə necə istifadə etmək olar? {#how-do-i-use-rollup-in-node-js-with-commonjs-modules}

Rollup-ın əsas məqsədi Node.js, NPM, `require()` və CommonJS əvəzinə ES modullarının spesifikasiyasını həyata keçirməkdir. Bu səbəbdəndir ki, həm CommonJS modullarının yüklənməsi, həm də Node-un modul yeri həlletmə məntiqi Rollup-ın özündə defolt kimi yox, plagin kimi mövcuddur. Sadəcə [`commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) və [`node-resolve`](https://github.com/rollup/plugins/tree/master/packages/node-resolve) plaginlərini `npm install` ilə yükləməyiniz kifayətdir. Əgər modullar JSON faylları idxal edirsə, sizə [`json`](https://github.com/rollup/plugins/tree/master/packages/json) plagini də lazım olacaq.

## `node-resolve` niyə Rollup-ın özündə yoxdur? {#why-isn-t-node-resolve-a-built-in-feature}

Bunun iki əsas səbəbi var:

1. Fəlsəfi nöqteyi-nəzərdən Rollup, əslində, həm Node, həm də brauzerlərdə doğma ("native") modul yükləyiciləri üçün bir növ [polifildir](https://az.wikipedia.org/wiki/Polifil). Brauzerlər Node-un həlletmə alqoritmindən istifadə etmədiyi üçün `import foo from 'foo'` brauzerlərdə işləməyəcək;

2. Praktiki səviyyədən baxanda da, əgər bu məsələlər yaxşı bir TPİ ilə təmiz şəkildə ayırılıbsa, proqram yazmaq daha asan olacaq. Rollup-ın nüvəsi kifayət qədər böyükdür və onun daha da çox böyüməyinin qarşısını alan hər bir şey yaxşıdır. Digər bir yandan baqların düzəldilməsi və yeni xüsusiyyətlərin əlavə olunması da asandır. Rollup kiçik saxlananda potensial texniki borc da kiçik qalır.

Daha geniş izah üçün [buraya](https://github.com/rollup/rollup/issues/1555#issuecomment-322862209) baxa bilərsiniz.

## Kod bölüşdürməsi zamanı niyə giriş bloklarında artıq idxalatlar görünür? {#why-do-additional-imports-turn-up-in-my-entry-chunks-when-code-splitting}

Defolt kimi çoxlu sayda kod blokları yaradılan zaman giriş bloklarının asılılıqlarının elədiyi idxallar giriş blokunun özünə boş idxal kimi əlavə olunacaq. [Məsələn](../repl/index.md?shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMHZhbHVlJTIwZnJvbSUyMCcuJTJGb3RoZXItZW50cnkuanMnJTNCJTVDbmNvbnNvbGUubG9nKHZhbHVlKSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0F0cnVlJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMm90aGVyLWVudHJ5LmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMGV4dGVybmFsVmFsdWUlMjBmcm9tJTIwJ2V4dGVybmFsJyUzQiU1Q25leHBvcnQlMjBkZWZhdWx0JTIwMiUyMColMjBleHRlcm5hbFZhbHVlJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXNtJTIyJTJDJTIybmFtZSUyMiUzQSUyMm15QnVuZGxlJTIyJTJDJTIyYW1kJTIyJTNBJTdCJTIyaWQlMjIlM0ElMjIlMjIlN0QlMkMlMjJnbG9iYWxzJTIyJTNBJTdCJTdEJTdEJTJDJTIyZXhhbXBsZSUyMiUzQW51bGwlN0Q=):

```js
// input
// main.js
import value from './other-entry.js';
console.log(value);

// other-entry.js
import externalValue from 'external';
export default 2 * externalValue;

// output
// main.js
import 'external'; // this import has been hoisted from other-entry.js
import value from './other-entry.js';
console.log(value);

// other-entry.js
import externalValue from 'external';
var value = 2 * externalValue;
export default value;
```

Bu, kod icrasının sırasını, yaxud davranışını pozmur, ancaq kodun yüklənilməsi və emalını sürətləndirir. Bu optimizasiya olmasa idi, JavaScript mühərriki `main.js` faylını işə salmaq üçün aşağıdakıları yerinə yetirməli olardı:

1. `main.js` faylını yüklə və emal et. Axırda `other-entry.js` faylının idxal edilməsi aşkar ediləcək.
2. `other-entry.js` faylını yüklə və emal et. Axırda `external` kitabxanasının idxal edilməsi aşkar ediləcək.
3. `external` kitabxanasını yüklə və emal et.
4. `main.js` faylını işə sal

Ancaq optimizasiya olan zaman JavaScript mühərriki bütün keçid asılılıqlarını sadəcə giriş modulunu emal etməklə tapacaq və yuxarıdakı proses daha tez başa çatacaq:

1. `main.js` faylını yüklə və emal et. Axırda `other-entry.js` faylına və `external` kitabxanasının idxal edilməsi aşkar ediləcək.
2. `other-entry.js` faylı ilə `external` kitabxanasını yüklə və emal et. `other-entry.js` faylına idxal edilən `external` kitabxanası artıq yüklənilib və emal edilib.
3. `main.js` faylını işə sal.

Ola bilsin, bu optimizasiya bəzi hallarda arzuolunan olmasın; bu halda onu [`output.hoistTransitiveImports`](../configuration-options/index.md#output-hoisttransitiveimports) seçimi ilə bağlaya bilərsiniz. Həmçinin [`output.preserveModules`](../configuration-options/index.md#output-preservemodules) seçimindən istifadə olunanda da optimizasiya prosesdən xaric edilir.

## Rollup bandlına necə polifil əlavə etmək olar? {#how-do-i-add-polyfills-to-a-rollup-bundle}

Baxmayaraq ki, Rollup bandl yaradan zaman, əsasən, modulların icrası sırasını eynilə qoruyub-saxlayacaq, iki halda bu olmaya bilər: kod bölüşdürülməsi və xarici asılılıqlar. Xarici asılılıqlarla bağlı problem açıq-aşkar görünür, aşağıdakı [nümunəyə](../repl/index.md?shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCcuJTJGcG9seWZpbGwuanMnJTNCJTVDbmltcG9ydCUyMCdleHRlcm5hbCclM0IlNUNuY29uc29sZS5sb2coJ21haW4nKSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0F0cnVlJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMnBvbHlmaWxsLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmNvbnNvbGUubG9nKCdwb2x5ZmlsbCcpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQWZhbHNlJTdEJTVEJTJDJTIyb3B0aW9ucyUyMiUzQSU3QiUyMmZvcm1hdCUyMiUzQSUyMmVzbSUyMiUyQyUyMm5hbWUlMjIlM0ElMjJteUJ1bmRsZSUyMiUyQyUyMmFtZCUyMiUzQSU3QiUyMmlkJTIyJTNBJTIyJTIyJTdEJTJDJTIyZ2xvYmFscyUyMiUzQSU3QiU3RCU3RCUyQyUyMmV4YW1wbGUlMjIlM0FudWxsJTdE) nəzər yetirə bilərsiniz:

```js
// main.js
import './polyfill.js';
import 'external';
console.log('main');

// polyfill.js
console.log('polyfill');
```

Burada icraedilmə sırası belədir: `polyfill.js` → `external` → `main.js`. Kodu bandl etsəniz, bunu alacaqsınız:

```js
import 'external';
console.log('polyfill');
console.log('main');
```

İcraedilmə sırası isə `external` → `polyfill.js` → `main.js` kimi olacaq. Bu, Rollup-ın `import`-u bandlın ən yuxarısına qoymağından yaranan bir problem deyil — idxalatlar faylın harasında yerləşməklərindən asılı olmayaraq həmişə birinci işə düşürlər. Bu problemi əlavə bloklar yaradaraq həll etmək mümkündür — əgər `polyfill.js` `main.js`-dən başqa bloka düşsə, [arzuolunan icraedilmə sırası qorunub-saxlanılacaq](../repl/index.md?shareable=JTdCJTIybW9kdWxlcyUyMiUzQSU1QiU3QiUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCcuJTJGcG9seWZpbGwuanMnJTNCJTVDbmltcG9ydCUyMCdleHRlcm5hbCclM0IlNUNuY29uc29sZS5sb2coJ21haW4nKSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0F0cnVlJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMnBvbHlmaWxsLmpzJTIyJTJDJTIyY29kZSUyMiUzQSUyMmNvbnNvbGUubG9nKCdwb2x5ZmlsbCcpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXNtJTIyJTJDJTIybmFtZSUyMiUzQSUyMm15QnVuZGxlJTIyJTJDJTIyYW1kJTIyJTNBJTdCJTIyaWQlMjIlM0ElMjIlMjIlN0QlMkMlMjJnbG9iYWxzJTIyJTNBJTdCJTdEJTdEJTJDJTIyZXhhbXBsZSUyMiUzQW51bGwlN0Q=). Lakin bunu Rollup-da avtomatik etmək mümkün deyil. Vəziyyət Rollup lazım olmayan heç bir kodun işə salınmamasını təmin etməyə çalışa-çalışa mümkün olan ən az sayda blok yaratmağa çalışacağı üçün kod bölgüsü üçün də oxşardır.

Əksər hallarda bu, problem deyil, çünkü Rollup zəmanət verir ki, əgər "A" modulu "B" modulunu idxal edir və dairəvi idxalat yoxdursa, onda "B" həmişə "A"dan əvvəl işə düşəcək.

Polifillər üçün isə bu, problemdir, çünki, əksər hallarda, onlar birinci işə düşməlidir, ancaq hər modulda polifil idxal eləmək elə də yaxşı üsul deyil. Xoşbəxtlikdən, buna, onsuz, ehtiyac da yoxdur, çünki:

1. əgər polifildən asılı olan hansısa bir xarici asılılıq yoxdursa, polifilin idxalını hər statik giriş nöqtəsində ilk bəyanat kimi qeyd etmək kifayətdir;
2. əks halda, polifili ayrıca giriş, yaxud [manual bloka](../configuration-options/index.md#output-manualchunks) çevirmək onun birinci icra edilməsini təmin edəcək.

## Rollup kitabxanalar, yaxud tətbiqlər düzəltmək üçün nəzərdə tutulub? {#is-rollup-meant-for-building-libraries-or-applications}

Rollup, onsuz da, çox sayda böyük JavaScript kitabxanaları tərəfindən istifadə olunur; həmçinin, əksər tətbiqləri yaratmaq üçün də istifadə oluna bilər. Ancaq əgər siz kod bölgüsü, yaxud dinamik idxalatı köhnə brauzerlərdə istifadə etmək istəyirsinizsə, sizə çatışmayan blokları yükləyən əlavə rantaym ("runtime") lazım olacaq. Biz Rollup-ın sistem formatı çıxarışı ilə inteqrasiya edilə bildiyi və canlı ES modulu qoşmaları və yenidənixrac ec-keyslərini ("edge case") yaxşı idarə edə bildiyi üçün ["SystemJS Production Build"dan](https://github.com/systemjs/systemjs#browser-production) istifadə etməyinizi tövsiyə edirik. Alternativ kimi AMD yükləyicisi də sizə kömək edə bilər.

## Rollup-ın loqosu çox qəşəngdir, onu kim düzəldib? {#who-made-the-rollup-logo-it-s-lovely}

[Culian Lloyd](https://github.com/jlmakes)!
