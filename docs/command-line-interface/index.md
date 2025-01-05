---
title: Komanda Sətri İnterfeysi
---

# {{ $frontmatter.title }}

[[toc]]

Rollup-dan əksər hallarda komanda sətri vasitəsilə istifadə edilməlidir. İstəsəniz, bu prosesi yüngülləşdirmək və Rollup-ın daha təkmilləşmiş xüsusiyyətlərindən faydalanmaq üçün xüsusi konfiqurasiyalardan istifadə edə bilərsiniz.

## Konfiqurasiya faylları {#configuration-files}

Rollup-da konfiqurasiya fayllarından istifadə etmək məcburi olmasa da, xeyli təkmilləşmiş olduqları və onlardan istifadə etmək rahat olduğu üçün **tövsiyə olunur**. Konfiqurasiya faylı lazımi seçimlərdən ibarət bir defolt obyekt ixrac edən ES moduludur.

```javascript twoslash
/** @type {import('rollup').RollupOptions} */
// ---cut---
export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	}
};
```

Fayl, əsasən, `rollup.config.js`, yaxud `rollup.config.mjs` adlanır və proyektin mövcud olduğu qovluqda yerləşir. [`--configPlugin`](#configplugin-plugin) və ya [`--bundleConfigAsCjs`](#bundleconfigascjs) istifadə edilməyən zaman Rollup faylı idxal etmək üçün birbaşa Node-dan istifadə edəcək. Qeyd etmək lazımdır ki, Rollup [Node ESM semantikasını](https://nodejs.org/docs/latest-v14.x/api/packages.html#packages_determining_module_system) izlədiyi üçün [doğma Node ES modullarından istifadə edən zaman diqqət etməli olduğunuz bir sıra nüanslar](#caveats-when-using-native-node-es-modules) mövcuddur.

Əgər konfiqurasiyanızı `require` və `module.exports`-dan istifadə edərək CommonJS formatında yazmaq istəyirsinizsə, fayl uzantısını `.cjs` kimi təyin etməlisiniz.

Konfiqurasiya faylınız üçün həmçinin TypeScript kimi digər dillərdən də istifadə edə bilərsiniz. Bunun üçün `@rollup/plugin-typescript` kimi müvafiq bir Rollup plagini yükləyib [`--configPlugin`](#configplugin-plugin) seçimindən istifadə edə bilərsiniz:

```shell
rollup --config rollup.config.ts --configPlugin typescript
```

`--configPlugin` parametrindən istifadə eləsəniz, konfiqurasiya faylınız oxunmamışdan əvvəl icbari şəkildə CommonJS-ə transkompilyasiya ediləcək. Konfiqurasiya fayllarınızda TypeScript data tiplərindən istifadə eləmək istəyirsinizsə, [IntelliSense konfiqurasiyası](#config-intellisense) başlığına nəzər yetirə bilərsiniz.

Konfiqurasiya faylları aşağıda sadalanan seçimləri dəstəkləyir. Hər biri haqqında ətraflı məlumat üçün [geniş siyahıya](../configuration-options/index.md) nəzər yetirə bilərsiniz.

```javascript twoslash
// rollup.config.js

// çoxlu sayda giriş nəzərdə tutulubsa, siyahı formatında ola bilər
// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
	// təməl giriş seçimləri
	external,
	input, // şərtdən asılı olaraq zəruri ola bilər
	plugins,

	// təkmilləşmiş giriş seçimləri
	cache,
	logLevel,
	makeAbsoluteExternalsRelative,
	maxParallelFileOps,
	onLog,
	onwarn,
	preserveEntrySignatures,
	strictDeprecations,

	// bunlarla işləyərkən ehtiyatlı olun
	context,
	moduleContext,
	preserveSymlinks,
	shimMissingExports,
	treeshake,

	// eksperimental
	experimentalCacheExpiry,
	experimentalLogSideEffects,
	experimentalMinChunkSize,
	perf,

	// zəruri (çoxlu sayda çıxış nəzərdə tutulubsa, siyahı formatında ola bilər)
	output: {
		// təməl çıxış seçimləri
		dir,
		file,
		format,
		globals,
		name,
		plugins,

		// təkmilləşmiş çıxış seçimləri
		assetFileNames,
		banner,
		chunkFileNames,
		compact,
		dynamicImportInCjs,
		entryFileNames,
		extend,
		externalImportAttributes,
		footer,
		generatedCode,
		hashCharacters,
		hoistTransitiveImports,
		importAttributesKey,
		inlineDynamicImports,
		interop,
		intro,
		manualChunks,
		minifyInternalExports,
		outro,
		paths,
		preserveModules,
		preserveModulesRoot,
		sourcemap,
		sourcemapBaseUrl,
		sourcemapDebugIds,
		sourcemapExcludeSources,
		sourcemapFile,
		sourcemapFileNames,
		sourcemapIgnoreList,
		sourcemapPathTransform,
		validate,

		// bunlarla işləyərkən ehtiyatlı olun
		amd,
		esModule,
		exports,
		externalLiveBindings,
		freeze,
		indent,
		noConflict,
		sanitizeFileName,
		strict,
		systemNullSetters,

		// eksperimental
		experimentalMinChunkSize
	},

	watch: {
		buildDelay,
		chokidar,
		clearScreen,
		exclude,
		include,
		skipWrite
	}
};
```

Bandlların birdəfəyə bir neçə müxtəlif girişdən yaradılmağını istəyirsinizsə, hətta izləmə modunda olsanız belə, konfiqurasiya faylınızdan **siyahı** ixrac edə bilərsiniz. Bir girişdən müxtəlif bandllar yaratmaq üçün isə çıxış seçimlərindən ibarət siyahılardan istifadə edə bilərsiniz:

```javascript twoslash
// rollup.config.js (çoxlu sayda bandlın yaradıldığı hal)

// ---cut-start---
/** @type {import('rollup').RollupOptions[]} */
// ---cut-end---
export default [
	{
		input: 'main-a.js',
		output: {
			file: 'dist/bundle-a.js',
			format: 'cjs'
		}
	},
	{
		input: 'main-b.js',
		output: [
			{
				file: 'dist/bundle-b1.js',
				format: 'cjs'
			},
			{
				file: 'dist/bundle-b2.js',
				format: 'es'
			}
		]
	}
];
```

Əgər öz konfiqurasiyanızı asinxron şəkildə yaratmaq istəyirsinizsə, Rollup həmçinin obyekt, yaxud siyahıya həll olan `Promise` də qəbul edə bilir:

```javascript
// rollup.config.js
import fetch from 'node-fetch';

export default fetch(
	'/konfiqurasiya-faylının-əldə-edildiyi-hansısa-bir-ünvan'
);
```

Həmçinin bu üsulu da sınaya bilərsiniz:

```javascript
// rollup.config.js (siyahıya həll olan vəd)
export default Promise.all([
	fetch('konfiqurasiya-1'),
	fetch('konfiqurasiya-2')
]);
```

Rollup-ı konfiqurasiya faylı ilə işə salmaq üçün `--config`, yaxud `-c` seçimlərindən istifadə edə bilərsiniz:

```shell
# Rollup-a xüsusi konfiqurasiya faylının ötürülməsi
rollup --config my.config.js

# əgər fayl adı təyin eləməsəniz, Rollup çalışacaq ki,
# aşağıdakı sırada konfiqurasiya faylını tapıb yükləsin:
# rollup.config.mjs -> rollup.config.cjs -> rollup.config.js
rollup --config
```

İstəsəniz, konfiqurasiya faylından yuxarıdakı konfiqurasiya formatlarından hər hansı birini qaytaran bir funksiya da ixrac edə bilərsiniz. Bu funksiya təyin edilmiş komanda sətri arqumentlərini qəbul edəcək, beləliklə sizin konfiqurasiyanız, məsələn, [`--silent`](#silent) parametri ilə ayaqlaşacaq. Hətta istəsəniz, `config` ilə başlayan öz arqumentlərinizi də təyin edə bilərsiniz:

```javascript twoslash
// rollup.config.js
import defaultConfig from './rollup.default.config.js';
import debugConfig from './rollup.debug.config.js';

// ---cut-start---
/** @type {import('rollup').RollupOptionsFunction} */
// ---cut-end---
export default commandLineArgs => {
	if (commandLineArgs.configDebug === true) {
		return debugConfig;
	}
	return defaultConfig;
};
```

İndi `rollup --config --configDebug` komandasını işə salsanız, debaq konfiqurasiyasından istifadə olunacaq.

Komanda sətri arqumentləri defolt halda hər zaman konfiqurasiya faylından ixrac edilən parametrləri üstələyəcək. Əgər bunu dəyişdirmək istəyirsinizsə, Rollup-ın komanda sətri arqumentlərini onları `commandLineArgs`-dan silərək görməzlikdən gəlməsini təmin edə bilərsiniz:

```javascript twoslash
// rollup.config.js
// ---cut-start---
/** @type {import('rollup').RollupOptionsFunction} */
// ---cut-end---
export default commandLineArgs => {
	const inputBase = commandLineArgs.input || 'main.js';

	// rollup KSİ arqumentini nəzərə almayacaq
	delete commandLineArgs.input;
	return {
		input: 'src/entries/' + inputBase,
		output: {
			/* ... */
		}
	};
};
```

### IntelliSense konfiqurasiyası {#config-intellisense}

Rollup TypeScript tipləri ilə işlədiyi üçün siz öz tərtibat mühitinizin IntelliSense-ini JSDoc ilə quraşdıra bilərsiniz:

```javascript twoslash
// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	/* konfiqurasiyanız */
};
export default config;
```

Alternativ kimi siz JSDoc ifadələrinə ehtiyac olmadan IntelliSense dəstəyi təmin edən `defineConfig` köməkçisindən də istifadə edə bilərsiniz:

```javascript twoslash
// rollup.config.js
import { defineConfig } from 'rollup';

export default defineConfig({
	/* konfiqurasiyanız */
});
```

`RollupOptions` və bu tipi ehtiva edən `defineConfig` köməkçisindən savayı aşağıdakılar da sizin üçün faydalı ola bilər:

- `OutputOptions` — konfiqurasiya faylının `output` hissəsi;
- `Plugin` — `name` parametri və bir sıra qarmaqlar ehtiva edən plagin obyekti (bütün qarmaqlar plagin tərtibatını rahatlaşdırmaq üçün verilən tipləri ilə tam təchiz olunmuşdur);
- `PluginImpl` — parametrlər obyektini plagin obyektinə çevirən funksiya (əksər ictimai Rollup plaginləri bu yolu izləyir).

Siz həmçinin konfiqurasiyanızı [`--configPlugin`](#configplugin-plugin) vasitəsilə birbaşa TypeScript-də də yaza bilərsiniz. TypeScript ilə `RollupOptions` tipini birbaşa idxal edə bilərsiniz:

```typescript twoslash
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
	/* konfiqurasiyanız */
};
export default config;
```

## JavaScript proqramlaşdırma interfeysinə düzəlişlər {#differences-to-the-javascript-api}

Konfiqurasiya faylları Rollup-ı düzəltməyin asan bir yolu olsa da, onlar həmçinin Rollup-ın konfiqurasiya edilə və işə salına bilmə üsullarını məhdudlaşdırırlar. Xüsusilə də əgər siz Rollup vasitəsilə başqa inşaat ("build") alətinə bandl edirsinizsə, yaxud onu daha mürəkkəb bir inşaat prosesinə inteqrasiya etmək istəyirsinizsə, sizin üçün əlverişli olan Rollup-ı proqramla birbaşa skriptlərinizdən işə salmaqdır.

Əgər konfiqurasiya fayllarından [JavaScript proqramlaşdırma interfeysinə](../javascript-api/index.md) köçmək istəsəniz, diqqət etməli olduğunuz bir sıra mühüm nüanslar mövcuddur:

- proqramlaşdırma interfeysindən istifadə edərkən `rollup.rollup`-a ötürülən konfiqurasiya mütləq obyekt olmalıdır və bir vəd, yaxud funksiya daxilində yerləşməməlidir;
- konfiqurasiyalardan ibarət siyahı ötürə bilməzsiniz, bunun əvəzinə gərək hər bir `inputOptions` üçün `rollup.rollup`-ı ayrıca işə salasınız;
- `output` parametri nəzərə alınmayacaq, siz gərək `bundle.generate(outputOptions)` və ya `bundle.write(outputOptions)` funksiyalarını `outputOptions`-a daxil olan hər bir yığma üçün ayrıca işə salasınız.

## Node paketindən konfiqurasiya yükləmək {#loading-a-configuration-from-a-node-package}

Rollup həmçinin sizə konfiqurasiyanızı `node_modules` qovluğundakı paketlərdən də yükləməyə şərait yaradır.

```shell
# bu kod əvvəlcə "rollup-config-my-special-config" paketini yükləməyə çalışacaq
# əgər uğursuz alınarsa, ondan sonra "my-special-config" yüklənəcək
rollup --config node:my-special-config
```

## Doğma Node ES modullarından istifadə edərkən diqqət tələb edən nüanslar {#caveats-when-using-native-node-es-modules}

Ələlxüsus Rollup-ın köhnə versiyalarından keçid edərsinizsə, konfiqurasiya faylınızda doğma ES modulundan istifadə edərkən diqqətli olmağınızı tələb edən bir sıra məsələlər var.

### Hal-hazırkı qovluğu əldə etmək {#getting-the-current-directory}

CommonJS faylları ilə işləyərkən, əsasən, faylın mövcud olduğu qovluğu əldə etmək və nisbi mövqeləri mütləq mövqelərə çevirmək üçün `__dirname`-dən istifadə edilir. Bu isə doğma ES modullarında dəstəklənmir. Bunun əvəzinə aşağıdakı üsuldan istifadə edə bilərsiniz:

```js twoslash
// rollup.config.js
import { fileURLToPath } from 'node:url';

export default {
	/* ..., */
	// <hal-hazırkı qovluq>/src/hansısa-fayl.js üçün mütləq mövqe yaradır
	external: [fileURLToPath(new URL('src/hansısa-fayl.js', import.meta.url))]
};
```

### package.json faylının idxalı {#importing-package-json}

Məsələn, asılılıqları avtomatik şəkildə "external" kimi işarə etmək istəyirsinizsə, `package.json` faylını idxal etmək sizə kömək ola bilər. Node versiyanızdan asılı olaraq bunu etməyin bir neçə yolu var:

- Node 17.5+ üçün idxalat yoxlamasından istifadə edə bilərsiniz:

  ```js twoslash
  import pkg from './package.json' assert { type: 'json' };

  export default {
  	// Asılılıqları "external" kimi işarə edir.
  	// Konfiqurasiyanın qalanı göstərilməyib.
  	external: Object.keys(pkg.dependencies)
  };
  ```

- Daha köhnə Node versiyaları üçün isə `createRequire` funksiyasından:

  ```js twoslash
  import { createRequire } from 'node:module';
  const require = createRequire(import.meta.url);
  const pkg = require('./package.json');

  // ...
  ```

- Yaxud faylı birbaşa diskdən oxuya da bilərsiniz:

  ```js twoslash
  // rollup.config.mjs
  import { readFileSync } from 'node:fs';

  // process.cwd() əvəzinə fayl mövqeyini nisbi hala gətirmək üçün
  // import.meta.url-dən istifadə edə bilərsiniz. Ətraflı məlumat üçün:
  // https://nodejs.org/docs/latest-v16.x/api/esm.html#importmetaurl
  const packageJson = JSON.parse(
  	readFileSync(new URL('./package.json', import.meta.url))
  );

  // ...
  ```

## Komanda sətri parametrləri {#command-line-flags}

Əksər seçimlərin komanda sətri ekvivalentləri mövcuddur. Əgər onlardan istifadə etsəniz, konfiqurasiya faylındakılar əvəzinə komanda sətrindən təyin edilən arqumentlər üstün tutulacaq. Dəstəklənən bütün seçimlərin siyahısı:

```
-c, --config <fayladı>      Konfiqurasiya faylından istifadə edilsin (əgər
                              parametr fayl adı olmadan qeyd olunubsa, defoltu
                              "rollup.config.js"-dir)
-d, --dir <qovluqadı>       Kod blokları üçün qovluq (boş olduqda `stdout`-a
                              çap edir)
-e, --external <idlər>      Xaric edilməli modul identifikatorların
                            vergüllə ayrılmış siyahısı
-f, --format <format>       Çıxış formatı (amd, cjs, es, iife, umd, system)
-g, --globals <cütlüklər>   `moduleID:Global` cütlüklərinin vergüllə ayrılmış
                              siyahısı
-h, --help                  Bu kömək mesajını göstərir (ingilis dilində)
-i, --input <fayladı>       Giriş mənbəyi (<giriş faylı> üçün alternativ)
-m, --sourcemap             Mənbə xəritəsi yaradır (sətirdaxili olması üçün
                              `-m inline`)
-n, --name <ad>             UMD ixracı üçün ad
-o, --file <çıxış>          Çıxış faylı (yoxdursa, stdout-a çıxış verilir)
-p, --plugin <plagin>       Qeyd edilmiş plagindən istifadə edilsin (təkrarlana
                              bilər)
-v, --version               Versiya nömrəsini göstərir
-w, --watch                 Faylları izləyib dəyişiklik zamanı proqram yenidən
                              inşa edilsin
--amd.autoId                Blok adı əsasında AMD identifikatoru yaradır
--amd.basePath <mövqe>      Avtomatik yaradılmış AMD identifikatorunun qabağına
                              əlavə olunacaq fayl mövqeyi
--amd.define <ad>           `define` əvəzinə istifadə olunacaq funksiya
--amd.forceJsExtensionForImports AMD idxallarında `.js` uzantısından istifadə
                              edilsin
--amd.id <id>               AMD modulu üçün identifikator (defolt olaraq anonim)
--assetFileNames <sxem>     Daxil edilmiş resurslar üçün ad sxemi
--banner <mətn>             Bandlın yuxarısına (örtüyün ("wrapper") xaricinə)
                              əlavə ediləcək kod
--chunkFileNames <sxem>     Daxil ediləcək ikinci dərəcəli kod blokları üçün
                              ad sxemi
--compact                   Örtük kodunu yığcamlaşdırır
--context <dəyişən>         `this` üçün dəyər təyin edir
--no-dynamicImportInCjs     Xarici dinamik CommonJS idxallarına `require`
                              təyin edir
--entryFileNames <sxem>     Giriş kod blokları üçün ad sxemi
--environment <dəyərlər>    Konfiqurasiya faylına ötürüləcək tənzimləmələr
                              (nümunəyə nəzər yetirin)
--no-esModule               __esModule əlavə edilməsin
--exports <mod>             İxracat modunu təyin edir (auto, default, named,
                              none)
--extend                    --name ilə təyin edilmiş qlobal dəyişəni
                              genişləndirir
--no-externalImportAttributes "es" çıxışından idxal atributlarını istisna edir
--no-externalLiveBindings   Canlı qoşmaları dəstəkləyən kod yaradılmasın
--failAfterWarnings         İnşa zamanı xəbərdarlıq olarsa, xəta verib çıxılsın
--filterLogs <filtr>        Qeyd mesajlarını filtrləyir
--footer <mətn>             Bandlın sonuna (örtüyün xaricinə) əlavə ediləcək kod
--forceExit                 İş qurtaran zaman məcburən çıxış verilsin
--no-freeze                 Ad fəzası obyektləri dondurulmasın
--generatedCode <şablon>    Hansı kod özəlliklərindən istifadə ediləcəyini təyin
                              edir (es5/es2015)
--generatedCode.arrowFunctions Yaradılan kodda ox funksiyalarından istifadə
                              edilsin
--generatedCode.constBindings Yaradılan kodda "const"dan istifadə edilsin
--generatedCode.objectShorthand Yaradılan koddakı obyekt parametrlərində qısa
                              yollardan istifadə edilsin
--no-generatedCode.reservedNamesAsProps Rezervasiya edilmiş adlar obyekt
                              parametri kimi dırnağa alınsın
--generatedCode.symbols     Yaradılan kodda xüsusi simvollardan istifadə edilsin
--hashCharacters <ad>       Fayl çözənəklərində göstərilən simvollardan istifadə
                              edilsin
--no-hoistTransitiveImports Təsirli idxalları giriş bloklarına qaldırmasın
--importAttributesKey <ad>  İdxal atributları üçün göstərilən açar sözdən
                              istifadə edilsin
--no-indent                 Nəticədə girintilərdən ("indent") istifadə edilməsin
--inlineDynamicImports      Dinamik idxallardan istifadə edilərkən bir bandl
                              yaradılsın
--no-interop                Birlikdə işə salına bilən kod blokları daxil
                              edilməsin
--intro <mətn>              Bandlın yuxarısına (örtüyün daxilinə) əlavə ediləcək
                              kod
--logLevel <səviyyə>        Hansı növ qeydlərin göstəriləcəyini təyin edir
--no-makeAbsoluteExternalsRelative Xarici idxalların normallaşdırılmasının
                              qarşısını alır
--maxParallelFileOps <dəyər> Paraleldə neçə faylın oxunmasını təyin edir
--minifyInternalExports     Daxili ixracların kiçildilməsini məcbur, yaxud
                              qadağan edir
--noConflict                UMD qlobalları üçün "noConflict" metodu yaradır
--outro <mətn>              Bandlın sonuna (örtüyün daxilinə) əlavə ediləcək kod
--perf                      Performans zamanlamalarını göstərir
--no-preserveEntrySignatures Giriş nöqtələrinə fasad blokları daxil edilməsin
--preserveModules           Modul strukturu qoruyub-saxlanılsın
--preserveModulesRoot       Qorunmuş modulların əlavə ediləcəyi fayl mövqeyini
                              təyin edir
--preserveSymlinks          Fayllar həll edilərkən simvolik keçidlər izlənməsin
--no-reexportProtoFromExternal Ulduzlu yenidənixraclarda `__proto__`-ları
                              görməzlikdən gəlsin
--no-sanitizeFileName       Fayl adlarında etibarsız simvollar əvəz olunmasın
--shimMissingExports        İtkin ixraclar üçün ayırıcı ("shim") dəyişənləri
                              yaradılsın
--silent                    Xəbərdarlıqlar çap edilməsin
--sourcemapBaseUrl <url>    Mütləq mənbə xəritəsi keçidləri üçün baza mövqeyini
                              təyin edir
--sourcemapDebugIds         Emit unique debug ids in source and sourcemaps
--sourcemapExcludeSources   Mənbə xəritələrində mənbə kodu daxil edilməsin
--sourcemapFile <fayl>      Mənbə xəritələri üçün bandl mövqeyi
--sourcemapFileNames <sxem> Daxil edilmiş mənbə xəritələri üçün ad sxemi
--stdin=uzantı              `stdin` girişi üçün fayl uzantısını təyin edir
--no-stdin                  `stdin`-dən "-" oxunmasın
--no-strict                 Yaradılan modullarda `"use strict";` qeyd edilməsin
--strictDeprecations        Köhnəlmiş funksiyalar üçün xəta verilsin
--no-systemNullSetters      Boş SystemJS təyinediciləri `null` ilə əvəz
                              edilməsin
--no-treeshake              Tri-şeykinq optimizasiyasını deaktivləşdirir
--no-treeshake.annotations  Saf çağırış ifadələri görməzlikdən gəlinsin
--treeshake.correctVarValueBeforeDeclaration Bəyan edilənə qədər dəyişənlər
                              deoptimizə edilsin
--treeshake.manualPureFunctions <adlar> Funksiyalar manual olaraq saf kimi
                              təyin edilsin
--no-treeshake.moduleSideEffects Modulların yan təsirləri görməzlikdən gəlinsin
--no-treeshake.propertyReadSideEffects Obyekt parametrlərinin yan təsirləri
                              görməzlikdən gəlinsin
--no-treeshake.tryCatchDeoptimization "try-catch" bloklarında tri-şeykinq aktiv
                              saxlanılsın
--no-treeshake.unknownGlobalSideEffects Bilinməyən qloballar xəta verməyən kimi
                              qəbul edilsin
--validate                  Çıxışı yoxlanıb təsdiq edilsin
--waitForBundleInput        Bandl üçün giriş fayllarını gözləyir
--watch.buildDelay <ədəd>   İzləmə zamanı inşaları gecikdirir
--no-watch.clearScreen      Yenidən inşa zamanı ekranı təmizləmir
--watch.exclude <fayllar>   Müəyyən faylları izləmədən xaric edir
--watch.include <fayllar>   Yalnızca müəyyən fayllar izlənilsin
--watch.onBundleEnd <kmd>   `"BUNDLE_END"` hadisəsi zamanı işə salınacaq
                              Shell komandası
--watch.onBundleStart <kmd> `"BUNDLE_START"` hadisəsi zamanı işə salınacaq
                              Shell komandası
--watch.onEnd <kmd>         `"END"` hadisəsi zamanı işə salınacaq
                              Shell komandası
--watch.onError <kmd>       `"ERROR"` hadisəsi zamanı işə salınacaq
                              Shell komandası
--watch.onStart <kmd>       `"START"` hadisəsi zamanı işə salınacaq
                              Shell komandası
--watch.skipWrite           İzləmədə olan zaman fayllar diskə yazılmasın
```

Aşağıda sadalanan parametrlər yalnızca komanda sətri interfeysi vasitəsilə əlçatandır. Yerdə qalanların isə konfiqurasiya faylında öz ekvivalentləri var və onları üstələyirlər. Ətraflı [parametrlərin böyük siyahısında](../configuration-options/index.md).

### `--bundleConfigAsCjs`

Bu parametr konfiqurasiyanı məcburi olaraq CommonJS-ə transkompilyasiya edəcək.

Bu, konfiqurasiyanızın özü ES modulu formatında olsa belə orada `__dirname`, yaxud `require.resolve` kimi CommonJS ifadələrindən istifadə etməyinizə imkan yaradır.

### `--configImportAttributesKey <with | assert>`

Rollup-ın konfiqurasiya faylınızdakı idxalat atributları üçün istifadə edəcəyi açar sözü təyin edir.

```shell
rollup --config rollup.config.ts --configPlugin typescript --configImportAttributesKey with
```

Bu seçim yalnızca [`--configPlugin`](#configplugin-plugin) və ya [`--bundleConfigAsCjs`](#bundleconfigascjs) seçimlərindən istifadə etdiyiniz zaman əlçatandır.

### `--configPlugin <plagin>` {##configplugin-plugin}

Təyin edilmiş Rollup plaginlərinə konfiqurasiya faylını transkompilyasiya etmək, yaxud onun emalına başqa cür təsir etməyə icazə verir. Bunun mahiyyəti ondadır ki, qeyri-JavaScript konfiqurasiya fayllarından istifadə etməyə imkan yaradır. Məsələn, əgər `@rollup/plugin-typescript`-i yükləmisinizsə, bu kod sizə konfiqurasiyanızı TypeScript ilə yazmağa imkan verəcək:

```shell
rollup --config rollup.config.ts --configPlugin @rollup/plugin-typescript
```

TypeScript üçün qeyd: `tsconfig.json`-unuzun `include` hissəsində Rollup konfiqurasiya faylınızın mövqeyinin olduğuna əmin olun. Məsələn:

```
"include": ["src/**/*", "rollup.config.ts"],
```

Bu parametr [`--plugin`](#p-plugin-plugin-plugin) ilə eyni sintaksisə malikdir, yəni bu parametrdən bir neçə dəfə istifadə edə, `@rollup/plugin-` hissəsini ixtisar edib sadəcə `typescript` qeyd edə və plagin seçimlərini `={...}` ilə təyin edə bilərsiniz.

Bu seçimdən istifadə edən zaman Rollup konfiqurasiya faylınızı işə salmamışdan əvvəl ES moduluna transkompilyasiya edəcək. Əgər faylın CommonJS-ə transkompilyasiya edilməyini istəyirsinizsə, [`--bundleConfigAsCjs`](#bundleconfigascjs) parametrindən istifadə edə bilərsiniz.

### `--environment <dəyərlər>` {#environment-values}

`process.ENV` vasitəsilə konfiqurasiya faylınızı əlavə parametrlər ilə təmin edin.

```shell
rollup -c --environment INCLUDE_DEPS,BUILD:production
```

Bu kod `process.env.INCLUDE_DEPS === 'true'` və `process.env.BUILD === 'production'` təyin edəcək. Bu parametrdən siz bir neçə dəfə istifadə edə bilərsiniz. Belə olan halda sonradan qeyd edilən dəyərlər əvvəlkiləri üstələyəcək. Bu isə, məsələn, `package.json` skriptlərinizdəki mühit dəyişənlərinə yeni dəyərlər təmin etməyinizə şərait yaradır:

```json
{
	"scripts": {
		"build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
	}
}
```

Əgər bu skripti bu cür işə salsanız:

```shell
npm run build -- --environment BUILD:development
```

konfiqurasiya faylınız `process.env.INCLUDE_DEPS === 'true'` və `process.env.BUILD === 'development'` qəbul edəcək.

### `--failAfterWarnings`

İnşa zamanı hər hansı bir xəbərdarlıq yaranarsa, inşa prosesi sona çatan zaman xəta ilə çıxış verilsin.

### `--filterLogs <filtr>` {#filterlogs-filter}

Xüsusi filtrlər əsasında yalnızca müəyyən qeyd mesajlarının göstərilməsini təmin edir. Filtr ən sadə variantda açarın qeyd obyektinin parametri və dəyərin də etibarlı (qəbul edilə bilən) dəyər olduğu `açar:dəyər` cütlüyüdür. Məsələn:

```shell
rollup -c --filterLogs code:EVAL
```

Bu kod yalnızca `log.code === 'EVAL'` olan qeyd mesajlarını göstərəcək. Çoxlu sayda filtr təyin etmək üçün onları vergüllə ayıra, yaxud parametrdən bir neçə dəfə istifadə edə bilərsiniz:

```shell
rollup -c --filterLogs "code:FOO,message:Mesaj" --filterLogs code:BAR
```

Bu kod isə `code`-un `"FOO"` və ya `"BAR"`, yaxud `message`-in `"Mesaj"` olduğu qeydləri əks etdirəcək.

Çoxlu sayda komanda sətri interfeysi parametri əlavə etmək məqsədəuyğun olmayan zaman `ROLLUP_FILTER_LOGS` mühit dəyişənindən istifadə edə bilərsiniz. Bu dəyişənin dəyəri komanda sətrində `--filterLogs` təyin etmisinizsə, eyni şəkildə emal ediləcək. Parametr həmçinin filtrlərin vergüllə ayrılmış siyahısını da qəbul edə bilər.

Nisbətən daha mürəkkəb filtrlər üçün təkmilləşmiş sintaksis də mövcuddur.

- `!` filtri inkar edəcək:

  ```shell
  rollup -c --filterLogs "!code:CIRCULAR_DEPENDENCY"
  ```

  Bu kod dairəvi asılılıq ("circular dependency") xəbərdarlıqlarından başqa bütün qeydləri göstərəcək.

- `*` filtr dəyərində istifadə olunan zaman ixtiyarı yazını seçir:

  ```shell
  rollup -c --filterLogs "code:*_ERROR,message:*error*"
  ```

  Bu kod `code`-un `_ERROR` ilə bitdiyi və ya `message`-ində `error` yazısı olan qeydləri göstərəcək.

- `&` bir neçə filtrin kəsişməsini seçir:

  ```shell
  rollup -c --filterLogs "code:CIRCULAR_DEPENDENCY&ids:*/main.js*"
  ```

  Bu kod yalnız həm `code`-un `CIRCULAR_DEPENDENCY` olduğu, həm də `ids`-in `/main.js` ehtiva etdiyi filtrləri göstərəcək. Bu, digər bir özəllikdən istifadəyə yol açır:

- əgər dəyər obyektdirsə, o, filtr işə salınmamışdan əvvəl `JSON.stringify` vasitəsilə yazıya çevriləcək, həmçinin yazı formatında olmayan digər dəyərlər də;
- birinin digərinin daxilində (iç-içə) yerləşdiyi parametrlər də dəstəklənir:

  ```shell
  rollup -c --filterLogs "foo.bar:dəyər"
  ```

  Bu kod `log.foo.bar` parametrinin `"dəyər"` olduğu qeydləri göstərəcək.

### `--forceExit`

İş sona çatan zaman prosesdən məcburi olaraq çıxılsın. Bəzi hallarda plaginlər, yaxud onların asılılıqları təmizləməni düzgün aparmaya bilər və KSİ prosesinin çıxış verməsinin qarşısını ala bilər. Bu problemi təyin etmək isə çətin ola bilər, ona görə də o vaxta qədər bu parametrdən vəziyyətdən çıxış üsulu kimi istifadə etmək olar.

Qeyd etmək lazımdır ki, bu, bəzi iş axışlarına uyğun olmaya və problemli şəkildə işləyə bilər.

### `-h`/`--help`

Kömək sənədini çap edir (ingiliscə).

### `-p <plagin>`, `--plugin <plagin>` {##p-plugin-plugin-plugin}

Qeyd edilən plagindən istifadə edilsin. Burada plaginləri qeyd etməyin bir neçə üsulu var:

- Nisbi yol vasitəsilə:

  ```shell
  rollup -i input.js -f es -p ./my-plugin.js
  ```

  Buradakı fayl plagin obyekti qaytaran funksiya ixrac etməlidir.

- Lokal, yaxud qlobal bir `node_modules` qovluğunda quraşdırılmış plaginin adı ilə:

  ```shell
  rollup -i input.js -f es -p @rollup/plugin-node-resolve
  ```

  Əgər plagin adı `rollup-plugin`, yaxud `@rollup/plugin-` ilə başlamırsa, Rollup özü avtomatik olaraq bunları əlavə edəcək:

  ```shell
  rollup -i input.js -f es -p node-resolve
  ```

- Sətirdaxili proqram vasitəsilə:

  ```shell
  rollup -i input.js -f es -p '{transform: (c, i) => `/* ${JSON.stringify(i)} */\n${c}`}'
  ```

Əgər birdən artıq plagin yükləmək istəsəniz, parametrdən təkrar istifadə edə, yaxud vergüllə ayrılmış siyahı təyin edə bilərsiniz:

```shell
rollup -i input.js -f es -p node-resolve -p commonjs,json
```

Defolt olaraq plagini yaratmaq üçün olan funksiyalar arqument olmadan işə salınacaq. Ancaq istəsəniz, özünüz arqument daxil edə bilərsiniz:

```shell
rollup -i input.js -f es -p 'terser={output: {beautify: true, indent_level: 2}}'
```

### `--silent`

Konsola xəbərdarlıqlar çap edilməsin. Əgər konfiqurasiya faylınızda `onLog`, yaxud `onwarn` mövcuddursa, onlar işə düşəcək, həmçinin `onLog` qarmağı olan plaginlər də. Bunun qarşısını almaq üçün əlavə olaraq [`logLevel`](../configuration-options/index.md#loglevel) parametrindən istifadə edə, yaxud `--logLevel silent` təyin edə bilərsiniz.

### `--stdin=uzt` {#stdin-ext}

`stdin`-dən fayl oxunan zaman virtual fayl uzantısı təyin edir. Defolt olaraq Rollup `stdin`-dən oxuduğu fayllar üçün `-` adından uzantı olmadan istifadə edəcək. Ancaq bəzi plaginlər fayllarla iş görərkən uzantılara əsaslanırlar. Həmçinin baxın: [`stdin` vasitəsilə faylın oxunması](#reading-a-file-from-stdin).

### `--no-stdin`

`stdin`-dən fayl oxunmasın. Bu parametri təyin etmək Rollup-a əlavə məzmun ötürülməsinin qarşısını alacaq və `-` fayl adı (həmçinin `-.[uzantı]`) `stdin` əvəzinə adi fayl kimi qəbul ediləcək. Həmçinin baxın: [`stdin` vasitəsilə faylın oxunması](#reading-a-file-from-stdin).

### `-v`/`--version`

Rollup-ın quraşdırılmış versiyasını çap edir.

### `--waitForBundleInput`

Bu parametr qeyd edilən zaman giriş nöqtələri fayllarından biri əlçatan olmayan zaman xəta verilməsinin qarşısını alacaq və inşaya başlamamışdan əvvəl bütün faylların mövcud olmağını gözləyəcək. Bu, xüsusilə, izləmə modunda faydalıdır, çünki bu zaman Rollup digər bir prosesin çıxışından istifadə edir.

### `-w`/`--watch`

Diskdəki fayl dəyişən zaman bandlı yenidən inşa edir.

_Qeyd: İzləmə modunda olarkən `ROLLUP_WATCH` mühit dəyişəni Rollup-ın komanda sətri interfeysi tərəfindən `"true"` kimi qeyd ediləcək və digər proseslər üçün əlçatan olacaq. Plaginlər isə komanda sətri interfeysindən müstəqil olan [`this.meta.watchMode`](../plugin-development/index.md#this-meta) datasından istifadə etməlidirlər._

### `--watch.onStart <kmd>`, `--watch.onBundleStart <kmd>`, `--watch.onBundleEnd <kmd>`, `--watch.onEnd <kmd>`, `--watch.onError <kmd>` {#watch-onstart-cmd-watch-onbundlestart-cmd-watch-onbundleend-cmd-watch-onend-cmd-watch-onerror-cmd}

İzləmə modunda olarkən baş verən hadisələr zamanı `<kmd>` shell komandasını işə salır. Həmçinin baxın: [rollup.watch](../javascript-api/index.md#rollup-watch).

```shell
rollup -c --watch --watch.onEnd="node ./afterBuildScript.js"
```

## `stdin` vasitəsilə faylın oxunması {#reading-a-file-from-stdin}

Komanda sətri interfeysindən istifadə edilərkən Rollup həmçinin `stdin`-dən kod da oxuya bilər:

```shell
echo "export const foo = 42;" | rollup --format cjs --file out.js
```

Əgər faylda idxalatlar mövcud olarsa, Rollup onları hal-hazırkı qovluğa əsasən nisbi şəkildə həll edəcək. Konfiqurasiya faylından istifadə edərkən əgər giriş nöqtəsi faylının adı `-` olarsa, Rollup giriş nöqtəsi kimi yalnızda `stdin`-dən istifadə edəcək. `stdin` vasitəsilə giriş nöqtəsi olmayan faylı oxumaq istəsəniz, adını `-` qoymaq bəs edir, hansı ki, `stdin`-ə istinad etmək üçün istifadə edilən addır. Yəni bu kod:

```js
import foo from '-';
```

Rollup-a `stdin`-dən idxal edilmiş faylı oxudub defolt ixracatı `foo` dəyişəninə yazdıracaq. `-` ifadəsinin adi fayl adı kimi qəbul edilməsi üçün [`--no-stdin`](#no-stdin) parametrindən istifadə edə bilərsiniz.

Bəzi plaginlər faylların emalı üçün uzantılardan istifadə etdiyi üçün `--stdin==uzt` ilə (`uzt` əvəzinə lazımi uzantını qeyd edərək) `stdin` üçün uzantı təyin edə bilərsiniz. Belə olan halda virtual fayl adı `-.uzt` olacaq:

```shell
echo '{"foo": 42, "bar": "ok"}' | rollup --stdin=json -p json
```

JavaScript proqramlaşdırma interfeysi isə `-` və `-.ext` ifadələrini həmişə adi fayl adı kimi qəbul edəcək.
