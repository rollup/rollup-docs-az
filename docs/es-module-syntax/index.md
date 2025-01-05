---
title: ES Modul Sintaksisi
---

# {{ $frontmatter.title }}

[[toc]]

Aşağıdakı mətnin [ES2015 spesifikasiyasındakı](https://www.ecma-international.org/ecma-262/6.0/) modullar barədə yığcam məlumat kitabçası olması nəzərdə tutulub, çünki idxalat və ixracat ifadələrinin düzgün qavranılması Rollup-dan düzgün şəkildə istifadə etmək üçün vacibdir.

## İdxaletmə {#importing}

İdxal edilmiş dəyərlər yeniləri ilə əvəz edilə bilməzlər, ancaq obyektlər və siyahılar burada istisnadır (həmçinin ixracat modulu və digər idxalatçılar bu əvəzedilmədən təsirlənəcəklər). Belə demək olar ki, idxaletmələr `const` deklarasiyaları ilə bənzərdir.

### Adlandırılmış idxallar {#named-imports}

Hansısa moduldan xüsusi bir obyekti orijinal adı ilə:

```js
import { something } from './module.js';
```

yaxud həmin obyekti xüsusi bir ad ilə idxal edə bilərsiniz:

```js
import { something as somethingElse } from './module.js';
```

### Ad fəzası idxalları {#namespace-imports}

Modulun bütün adlandırılmış ixraclarını özündə ehtiva edən obyekt idxal edə bilərsiniz:

```js
import * as module from './module.js';
```

Yuxarıdakı `something` bu dəfə idxal edilən `module` obyektinin bir parametri — `module.something` kimi idxal ediləcək. Əgər modulun defolt ixracatı varsa,`module.default` vasitəsilə onu əldə etmək mümkündür.

### Defolt idxal {#default-import}

Mənbə modulun **defolt ixracatını** idxal edə bilərsiniz:

```js
import something from './module.js';
```

### Boş idxal {#empty-import}

Yeni obyektlər daxil etmədən modulun kodunu yükləyə bilərsiniz:

```js
import './module.js';
```

Bu, "polyfill"lərlə iş zamanı, yaxud idxal edilmiş kodla prototiplər vasitəsilə "oyun oynayan" zaman faydalıdır.

### Dinamik idxal {#dynamic-import}

[Dinamik idxal TPİ-sindən](https://github.com/tc39/proposal-dynamic-import#import) istifadə edərək modulları idxal edə bilərsiniz:

```js
import('./modules.js').then(({ default: DefaultExport, NamedExport }) => {
	// artıq modullarla iş görə bilərsiniz
});
```

Bu, tətbiq kodlarını bölən zaman, yaxud modullardan bədahətən istifadə edən zaman işinizə yarayacaq.

## İxracetmə {#exporting}

### Adlandırılmış ixraclar {#named-exports}

Daha əvvəl deklarasiya edilmiş dəyəri ixrac edə bilərsiniz:

```js
const something = true;
export { something };
```

İxracat zamanı addəyişmə edə bilərsiniz:

```js
export { something as somethingElse };
```

Deklarasiya zamanı birbaşa ixracat apara bilərsiniz:

```js
// this works with `var`, `let`, `const`, `class`, and `function`
export const something = true;
```

### Defolt ixracat {#default-export}

Hansısa bir dəyəri modulun defolt ixracatı kimi ixrac edə bilərsiniz:

```js
export default something;
```

Bundan modulun yalnız bir ixracatı olan zaman istifadə etmək tövsiyə edilir.

Bir modulda defolt və adlı ixracatları birləşdirmək mümkün olsa da, o qədər yaxşı fikir deyil.

## Qoşmalar necə işləyir {#how-bindings-work}

ES modulları dəyərlər əvəzinə _canlı qoşmalar_ da ixrac edə bilər, beləliklə, onlar idxal ediləndən sonra dəyişdirilə bilər. [Nümunə](../repl/index.md?shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMmltcG9ydCUyMCU3QiUyMGNvdW50JTJDJTIwaW5jcmVtZW50JTIwJTdEJTIwZnJvbSUyMCcuJTJGaW5jcmVtZW50ZXIuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyhjb3VudCklM0IlMjAlMkYlMkYlMjAwJTVDbmluY3JlbWVudCgpJTNCJTVDbmNvbnNvbGUubG9nKGNvdW50KSUzQiUyMCUyRiUyRiUyMDElMjIlMkMlMjJpc0VudHJ5JTIyJTNBdHJ1ZSUyQyUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTdEJTJDJTdCJTIyY29kZSUyMiUzQSUyMmV4cG9ydCUyMGxldCUyMGNvdW50JTIwJTNEJTIwMCUzQiU1Q24lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBpbmNyZW1lbnQoKSUyMCU3QiU1Q24lMjAlMjBjb3VudCUyMCUyQiUzRCUyMDElM0IlNUNuJTdEJTIyJTJDJTIyaXNFbnRyeSUyMiUzQWZhbHNlJTJDJTIybmFtZSUyMiUzQSUyMmluY3JlbWVudGVyLmpzJTIyJTdEJTVEJTJDJTIyb3B0aW9ucyUyMiUzQSU3QiUyMmFtZCUyMiUzQSU3QiUyMmlkJTIyJTNBJTIyJTIyJTdEJTJDJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlMkMlMjJnbG9iYWxzJTIyJTNBJTdCJTdEJTJDJTIybmFtZSUyMiUzQSUyMm15QnVuZGxlJTIyJTdEJTdE):

```js
// incrementer.js
export let count = 0;

export function increment() {
	count += 1;
}
```

```js
// main.js
import { count, increment } from './incrementer.js';

console.log(count); // 0
increment();
console.log(count); // 1

count += 1; // Xəta — bunu yalnız incrementer.js dəyişdirə bilər
```
