---
title: Giriş
---

# {{ $frontmatter.title }}

[[toc]]

## Ümumi baxış {#overview}

Rollup kiçik kod parçalarını kitabxanalar, yaxud tətbiqlər kimi daha böyük və daha mürəkkəb vahidlərə kompilyasiya edən JavaScript modul bandleridir. O, CommonJS və AMD kimi köhnə üsulların əvəzinə JavaScript-in ES6 nəşrindəki standart modul formatından istifadə edir. ES modulları sizə istədiyiniz kitabxanadan istədiyiniz funksiyaları azad və rahat şəkildə yığmağa şərait yaradır. Gələcəkdə doğma ("native") üsullarla bunu hər yerdə etmək mümkün olacaq, ancaq Rollup sizə bu fürsəti indidən verir.

## Quraşdırma {#installation}

```shell
npm install --global rollup
```

Bununla Rollup-ı qlobal komanda sətri aləti kimi quraşdırmaq mümkündür. Əgər istəsəniz, Rollup-ı [lokal şəkildə də quraşdıra bilərsiniz](../tutorial/index.md#installing-rollup-locally).

## Cəld başlanğıc {#quick-start}

Rollup-dan həm ixtiyari bir konfiqurasiya faylı ilə [komanda sətri interfeysi](../command-line-interface/index.md), həm də onun [JavaScript proqramlaşdırma interfeysi](../javascript-api/index.md) vasitəsilə istifadə edə bilərsiniz. Mümkün konfiqurasiya seçimləri və parametrlərini `rollup --help` komandası ilə görə bilərsiniz.

> Rollup-ın istifadə olunduğu nümunə kitabxana və tətbiqləri görmək üçün [rollup-starter-lib](https://github.com/rollup/rollup-starter-lib) və [rollup-starter-app](https://github.com/rollup/rollup-starter-app) proyektlərinə nəzər yetirə bilərsiniz.

Bu komandalar ilə əsas giriş nöqtəsi `main.js` olan və bütün idxalatı `bundle.js` faylında cəmləşən bir tətbiqi kompilyasiya edə bilərsiniz.

::: code-group

```shell [Brauzerlər üçün:]
# öz-özünü işə salan funksiyanın ("iife") mövcud olduğu <script> teqinə kompilyasiya edir
$ rollup main.js --file bundle.js --format iife
```

```shell [Node.js üçün:]
# CommonJS moduluna ("cjs") kompilyasiya edir
$ rollup main.js --file bundle.js --format cjs
```

```shell [Həm brauzerlər, həm də Node.js üçün:]
# UMD formatında bandl adını qeyd etmək lazım gəlir
$ rollup main.js --file bundle.js --format umd --name "myBundle"
```

:::

## Niyə məhz Rollup {#the-why}

Proyekti kiçik hissələrə böləndə proqram yazmaq, adətən, daha asan başa gəlir, çünki belə olan halda gözlənilməyən qarşılıqlı təsirlər və həll olunmalı problemlərin mürəkkəbliyi böyük ölçüdə azalır. Bununla belə, sadəcə kiçik ölçülü proyektlər yazmaq da [hər zaman çıxış yolu olmur](https://medium.com/@Rich_Harris/small-modules-it-s-not-quite-that-simple-3ca532d65de4). Təəssüf ki, JavaScript dilinin özülündə tarixən bu qabiliyyət mövcud olmayıb.

Bu, nəhayət, JavaScript-in ES6 nəşrində dəyişdi — data və funksiyaların ayrı-ayrı skriptlərdə istifadə edilə bilməsi məqsədilə idxal və ixracı üçün məqsədəuyğun sintaksis əlavə edildi. Bu spesifikasiya artıq qərarlaşdırılmış olsa da, yalnız müasir brauzerlər tərəfindən dəstəklənir və Node.js-də tamamlanmamışdır. Rollup sizə yeni modul sistemindən istifadə edərək kod yazmağınız üçün şərait yaradır. Yazdığınız kod isə CommonJS və AMD modulları, həmçinin öz-özünü işə salan skriptlərə kompilyasiya olunur. Beləliklə, siz _gələcəyə davamlı_ kod yaza bilərsiniz.

## Tri-şeykinq {#tree-shaking}

ES modullarının istifadəsini mümkün etməkdən başqa, Rollup həmçinin sizin idxal etdiyiniz kodu statik analizini edir və istifadə edilməyən hissələri kənarlaşdırır. Bu isə sizə əlavə asılılıqlar əlavə etmədən, yaxud proyektin ölçüsündə güzəştə getmədən mövcud alətlər və modullarla kod yazmağınıza imkan yaradır.

Məsələn, CommonJS-də siz gərək bütün aləti, yaxud kitabxananı idxal edəsiniz.

```js
// CommonJS ilə bütün "utils" utilitlər obyektini idxal edirsiniz
const utils = require('./utils');
const query = 'Rollup';
// "utils" obyektinin "ajax" metodundan istifadə edirsiniz
utils.ajax(`https://api.example.com?search=${query}`).then(handleResponse);
```

ES modulları ilə isə bütün `utils` obyekti əvəzinə sadəcə bizə lazım olan `ajax` funksiyasını idxal edə bilərik:

```js
// ES6 idxal bəyanatı ilə "ajax" funksiyasını idxal edin
import { ajax } from './utils';
const query = 'Rollup';
// "ajax" funksiyasını işə salın
ajax(`https://api.example.com?search=${query}`).then(handleResponse);
```

Rollup mümkün qədər minimal kod daxil etdiyi üçün daha yüngül, daha sürətli və daha az mürəkkəb kitabxanalar və tətbiqlər yaradır. Beləliklə, birbaşa `import` və `export` bəyanatlarından istifadə edildiyi üçün kompilyasiya edilmiş kodda istifadə edilməyən dəyişənləri avtomatik kiçildici ilə aşkar etməkdən daha əlverişli bir üsul alınır.

## Uyumluluq {#compatibility}

### CommonJS idxalatı {#importing-commonjs}

Rollup [plagin vasitəsilə](https://github.com/rollup/plugins/tree/master/packages/commonjs) mövcud CommonJS modullarını idxal edə bilər.

### ES modulları yayımlamaq {#publishing-es-modules}

ES modullarınızın Node.js, yaxud webpack kimi CommonJS ilə işləyən alətlər tərəfindən istifadə edilə bilməsini təmin etmək üçün Rollup ilə UMD, yaxud CommonJS formatlarına kompilyasiya edib `package.json` faylındakı `main` parametrinə həmin kompilyasiya edilmiş faylı təyin edə bilərsiniz. Əgər `package.json` faylınızda `module` da təyin edilibsə, [webpack 2+](https://webpack.js.org/) və Rollup kimi ES modulunu tanıyan alətlər [birbaşa ES modulunu idxal edəcək](https://github.com/rollup/rollup/wiki/pkg.module).
