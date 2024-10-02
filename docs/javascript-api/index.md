---
title: JavaScript Proqramlaşdırma İnterfeysi
---

# {{ $frontmatter.title }}

[[toc]]

Rollup sizə Node.js-də istifadə edə biləcəyiniz JavaScript proqramlaşdırma interfeysi təqdim edir. Bu, sıravi istifadəçi kimi sizə o qədər də lazım olmayacaq; əgər Rollup-ın özünü genişləndirmək, yaxud bandlları proqramlaşdırma üsulları ilə yaratmaq kimi mürəkkəb işlər görməyəcəksinizsə, komanda sətri interfeysi sizə kifayət edəcək.

## rollup.rollup

`rollup.rollup` funksiyası arqument kimi giriş parametrləri obyekti qəbul edir və aşağıda göstərilən müxtəlif parametrlər və metodların mövcud olduğu `bundle` obyektinə həll olan bir vəd ("Promise") qaytarır. Bu zaman Rollup modul qrafikini yaradır və tri-şeykinqi işə salır, ancaq hər hansı bir çıxış qaytarmır.

`bundle` obyektində siz müxtəlif yaddaşdaxili bandllar yaratmaq üçün fərqli çıxış seçimləri ilə bir neçə dəfə `bundle.generate` funksiyasını işə sala bilərsiniz. Əgər siz onları birbaşa diskə yazmaq istəyirsinizsə, `bundle.write` funksiyasından istifadə edə bilərsiniz.

`bundle` obyekti ilə işiniz bitəndən sonra isə `bundle.close` funksiyasını işə salmalısınız ki, plaginlər [`closeBundle`](../plugin-development/index.md#closebundle) qarmağı ("hook") ilə xarici prosesləri və xidmətləri təmizləyə bilsin.

Əgər haradasa xəta baş versə, Rollup `Error` ilə imtina edilmiş vəd qaytaracaq, siz də bu zaman `code` parametri vasitəsilə problemi müəyyənləşdirə biləcəksiniz. Bir çox xətalar xüsusi raportlaşdırma zamanı istifadə edə bilməyiniz üçün `code` və `message`-dən başqa parametlərə də sahibdir. Xətaların və qeydlərin kodları və parametrləri ilə birlikdə tam siyahısına [`utils/logs.ts`](https://github.com/rollup/rollup/blob/master/src/utils/logs.ts) faylında baxa bilərsiniz.

<!-- prettier-ignore-start -->
```javascript twoslash
import { rollup } from 'rollup';

// bu seçimlər haqqında daha ətraflı aşağıda
// ---cut-start---
/** @type {import('rollup').InputOptions} */
// ---cut-end---
const inputOptions = {
	/* ... */
};

// siz eyni girişdən bir neçə müxtəlif — məsələn, 
// CommonJS və ESM kimi ayrı-ayrı formatlarda çıxış yarada bilərsiniz
// ---cut-start---
/** @type {import('rollup').OutputOptions[]} */
// ---cut-end---
const outputOptionsList = [
	{
		/* ... */
	},
	{
		/* ... */
	}
];

build();

async function build() {
// ---cut-start---
	/** @type {import('rollup').RollupBuild} */
// ---cut-end---
	let bundle;
	let buildFailed = false;
	try {
		// bandl yaradın
		bundle = await rollup(inputOptions);

		// bandlın asılı olduğu fayl adlarından ibarət siyahı
		console.log(bundle.watchFiles);

		await generateOutputs(bundle);
	} catch (error) {
		buildFailed = true;
		// xətanın raport edilməsi
		console.error(error);
	}
	if (bundle) {
		// bandl bağlanır
		await bundle.close();
	}
	process.exit(buildFailed ? 1 : 0);
}

// ---cut-start---
/** @param {import('rollup').RollupBuild} [bundle] */
// ---cut-end---
async function generateOutputs(bundle) {
	for (const outputOptions of outputOptionsList) {
		// xüsusi yaddaşdaxili çıxış kodu yaradın
		// bu funksiyanı eyni bandl obyekti üzərində bir neçə dəfə işə salmaq mümkündür
		// birbaşa diskə yazmaq üçün "bundle.generate" əvəzinə "bundle.write" funksiyasından istifadə edə bilərsiniz
		const { output } = await bundle.generate(outputOptions);

		for (const chunkOrAsset of output) {
			if (chunkOrAsset.type === 'asset') {
				// resurs ("asset") tipli obyektə daxildir:
				// {
				//   fileName: string,              // resurs faylının adı
				//   source: string | Uint8Array    // resurs mənbəyi
				//   type: 'asset'                  // obyektin resurs olduğunu vurğulayır
				// }
				console.log('Asset', chunkOrAsset);
			} else {
				// blok ("chunk") tipli obyektə daxildir:
				// {
				//   code: string,                  // yaradılan JS kodu
				//   dynamicImports: string[],      // blok tərəfindən dinamik idxal edilən xarici modullar
				//   exports: string[],             // ixrac edilən dəyişkən adları
				//   facadeModuleId: string | null, // blokun uyğun gəldiyi müvafiq modulun identifikator nömrəsi
				//   fileName: string,              // blokun fayl adı
				//   implicitlyLoadedBefore: string[]; // yalnız bu blokdan sonra yüklənə biləcək daxiletmələr
				//   imports: string[],             // blok tərəfindən statik idxal edilən xarici modullar
				//   importedBindings: {[imported: string]: string[]} // hər asılılığın idxal etdiyi qoşmalar
				//   isDynamicEntry: boolean,       // bu blok dinamik giriş nöqtəsidir?
				//   isEntry: boolean,              // bu blok statik giriş nöqtəsidir?
				//   isImplicitEntry: boolean,      // bu blok yalnız digərlərindən sonra yüklənə bilər?
				//   map: string | null,            // varsa, mənbə xəritəsi
				//   modules: {                     // blokdakı modullar haqqında məlumat
				//     [id: string]: {
				//       renderedExports: string[]; // ixrac edilən dəyişkənlərdən saxlanılanların adları
				//       removedExports: string[];  // ixrac edilən dəyişkənlərdən silinənlərin adları
				//       renderedLength: number;    // moduldakı qalan kodun uzunluğu
				//       originalLength: number;    // moduldakı əsl kodun uzunluğu
				//       code: string | null;       // modulda qalan kod
				//     };
				//   },
				//   name: string                   // adlandırma sxemlərində blokun adı
				//   preliminaryFileName: string    // çözənək ("hash") şablonlar ("placeholder") daxil edilməklə faylın ilkin adı
				//   referencedFiles: string[]      // "import.meta.ROLLUP_FILE_URL_<id>" ilə istinad edilən fayllar
				//   type: 'chunk',                 // obyektin blok olduğunu göstərir
				// }
				console.log('Chunk', chunkOrAsset.modules);
			}
		}
	}
}
```
<!-- prettier-ignore-end -->

### inputOptions obyekti {#inputoptions-object}

`inputOptions` obyektində aşağıdakı parametrlər mövcuddur (daha ətraflı [bu siyahıda](../configuration-options/index.md)):

```js twoslash
// ---cut-start---
/** @type {import('rollup').InputOptions} */
// ---cut-end---
const inputOptions = {
	// əsas giriş seçimləri
	external,
	input, // şərti məcbur
	plugins,

	// yüksək səviyyəli giriş seçimləri
	cache,
	logLevel,
	makeAbsoluteExternalsRelative,
	maxParallelFileOps,
	onLog,
	onwarn,
	preserveEntrySignatures,
	strictDeprecations,

	// təhlükəli
	context,
	moduleContext,
	preserveSymlinks,
	shimMissingExports,
	treeshake,

	// eksperimental
	experimentalCacheExpiry,
	experimentalLogSideEffects,
	perf
};
```

### outputOptions obyekti {#outputoptions-object}

`outputOptions` obyektində aşağıdakı parametrlər mövcuddur (daha ətraflı [bu siyahıda](../configuration-options/index.md)):

```js twoslash
// ---cut-start---
/** @type {import('rollup').OutputOptions} */
// ---cut-end---
const outputOptions = {
	// əsas çıxış seçimləri
	dir,
	file,
	format,
	globals,
	name,
	plugins,

	// yüksək səviyyəli çıxış seçimləri
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
	sourcemapExcludeSources,
	sourcemapFile,
	sourcemapFileNames,
	sourcemapIgnoreList,
	sourcemapPathTransform,
	validate,

	// təhlükəli
	amd,
	esModule,
	exports,
	externalLiveBindings,
	freeze,
	indent,
	noConflict,
	reexportProtoFromExternal,
	sanitizeFileName,
	strict,
	systemNullSetters,

	// eksperimental
	experimentalMinChunkSize
};
```

## rollup.watch

Rollup sizə həmçinin diskdə modulların dəyişdiyini aşkar edəndə yeni bandl yaradan `rollup.watch` funksiyası da təqdim edir. Bu funksiya Rollup komanda sətrindən `--watch` parametri ilə işə salınanda daxili şəkildə istifadə edilir. Qeyd etmək lazımdır ki, izləmə modundan JavaScript proqramlaşdırma interfeysi vasitəsilə istifadə edəndə plaginlərin [`closeBundle`](../plugin-development/index.md#closebundle) qarmağındakı resursları təmizləməsinə imkan yaratmaq üçün `BUNDLE_END` hadisəsinə cavab olaraq `event.result.close` funksiyasını işə salmaq sizin məsuliyyətinizdədir.

```js twoslash
const rollup = require('rollup');

// ---cut-start---
/** @type {import('rollup').RollupWatchOptions} */
// ---cut-end---
const watchOptions = {
	/*...*/
};
const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
	// event.code bunlardan biri ola bilər:
	//   START        — izləyici başlayır
	//   BUNDLE_START — bir ədəd bandl yaradılır
	//                  * event.input — əgər giriş seçimləri varsa, onların obyekti
	//                  * event.output — "file", yaxud "dir" seçimlərinin
	//                  dəyərlərindən ibarət siyahı
	//   BUNDLE_END   — bandlın biri yaradılıb qurtarılıb
	//                  * event.input — əgər giriş seçimləri varsa, onların obyekti
	//                  * event.output — yaradılan çıxışların "file", yaxud "dir"
	//                    seçimlərinin dəyərlərindən ibarət siyahı
	//                  * event.duration — inşa müddəti (millisaniyə ilə)
	//                  * event.result — "bundle.generate", yaxud "bundle.write"
	//                    işə salınaraq əlavə çıxışlar yaratmaq üçün
	//                    istifadə edilə biləcək bandl obyekti. Bu, "watch.skipWrite"
	//                    aktiv olan zaman xüsusi əhəmiyyət kəsb edir.
	//                  Əgər daha yeni çıxış yaratmayacaqsınızsa, gərək
	//                  "event.result.close" funksiyasını işə salasınız.
	//                  Beləliklə, plaginlər "closeBundle" qoşması ilə
	//                  resursları təmizləyə biləcəklər.
	//   END          — bütün bandlların yaradılması bitib
	//   ERROR        — bandllar yaradılan zaman xəta baş verdi
	//                  * event.error — baş verən xəta
	//                  * event.result — inşa zamanı yaranan xətalarda "null";
	//                    çıxış yaradılan zaman baş verən xətalarda isə bandl obyekti.
	//                    "BUNDLE_END" zamanı baş verərse, bandl prosesi sona çatanda
	//                    "event.result.close" funksiyasını işə salmalısınız.
	// Əgər hadisə emalçısı ("event handler") vəd qaytarsa,
	// Rollup həmin vəd həll olana qədər gözləyəcək.
});

// Hər dəfə sona çatanda bandlların düzgün şəkildə bağlanmağını dəqiqləşdirmək üçün
watcher.on('event', ({ result }) => {
	if (result) {
		result.close();
	}
});

// İstəsəniz, aşağıdakı variantlardan da istifadə edə bilərsiniz.
// Əgər Rollup-ın gözləməyini istəyirsinizsə, vəd qaytarmağınız kifayət edir.
watcher.on('change', (id, { event }) => {
	/* hansısa fayl redaktə ediləndə */
});
watcher.on('restart', () => {
	/* yenidən işə salınanda */
});
watcher.on('close', () => {
	/* izləyici bağlananda (aşağıya nəzər yetirin) */
});

// izləmə prosesini dayandırmaq üçün
watcher.close();
```

### watchOptions

`watchOptions` arqumenti konfiqurasiya faylından ixrac edilən bir, yaxud siyahı halında bir neçə konfiqurasiya qəbul edir.

```js twoslash
// ---cut-start---
/** @type {import('rollup').RollupWatchOptions} */
// ---cut-end---
const watchOptions = {
	...inputOptions,
	output: [outputOptions],
	watch: {
		buildDelay,
		chokidar,
		clearScreen,
		skipWrite,
		exclude,
		include
	}
};
```

`inputOptions` və `outputOptions` haqqında daha ətraflı məlumatı yuxarıdan; `chokidar`, `include` və `exclude` haqqında isə [seçimlərin geniş siyahısından](../configuration-options/index.md) əldə edə bilərsiniz.

## Konfiqurasiya faylını proqramla yükləmək {#programmatically-loading-a-config-file}

Belə bir konfiqurasiyanın yaradılmasında sizə kömək etmək üçün Rollup öz komanda sətri interfeysində konfiqurasiya fayllarını yükləyərkən istifadə etdiyi köməkçini ayrı bir giriş nöqtəsində ixrac edir. Bu köməkçi həll olunmuş `fileName` — fayl adı və ixtiyari olaraq komanda sətri parametrlərindən ibarət obyekt qəbul edir.

```js twoslash
const { loadConfigFile } = require('rollup/loadConfigFile');
const path = require('node:path');
const rollup = require('rollup');

// hal-hazırkı skript ilə eyni qovluqdakı konfiqurasiya faylını yükləyir;
// daxil edilmiş konfiqurasiya obyekti komanda sətrində "--format es"in
// təyin olunması ilə eynigüclüdür; həmçinin bütün çıxışların formatlarına şamil olunur
loadConfigFile(path.resolve(__dirname, 'rollup.config.js'), {
	format: 'es'
}).then(async ({ options, warnings }) => {
	// "warnings" parametri KSİ-dəki ("CLI") defolt "onwarn" emalçısı ilə eynigüclüdür.
	// Bu kod indiyə qədərki bütün xəbərdarlıqları çap eləyir:
	console.log(`We currently have ${warnings.count} warnings`);

	// Bu isə bütün təxirə salınmış xəbərdarlıqları çap edir:
	warnings.flush();

	// "options" — "inputOptions" obyektləri, əlavə olaraq da
	// "outputOptions" obyektləri siyahısı — "output" parametrindən ibarət siyahı.
	// Aşağıdakı kod hər bir giriş üçün mümkün olan bütün çıxışları yaradacaq,
	// və KSİ kimi onların hamısını diskə yazacaq.
	for (const optionsObj of options) {
		const bundle = await rollup.rollup(optionsObj);
		await Promise.all(optionsObj.output.map(bundle.write));
	}

	// İstəsəniz, bunu — seçimləri birbaşa "rollup.watch" funksiyasına da ötürə bilərsiniz:
	rollup.watch(options);
});
```

## Yüksək səviyyəli qeydiyyat filtrlərinin tətbiqi {#applying-advanced-log-filters}

Komanda sətri interfeysi [`--filterLogs`](../command-line-interface/index.md#filterlogs-filter) sayəsində qeydləri filtrləməyə şərait yaratsa da, bu xüsusiyyət JavaScript proqramlaşdırma interfeysində əlçatan deyil. Buna baxmayaraq, JavaScript proqramlaşdırma interfeysində komanda sətrindəki ilə eyni sintaksisdən istifadə edərək filtrləşdirmə əməliyyatı aparmağınız üçün Rollup `getLogFilter` köməkçisini sizə ixrac edir. Bu, öz fərdi `onLog` emalçınız olan zaman, yaxud üçüncü tərəf sistemlərdə Rollup-ın komanda sətri interfeysi ilə bənzər filtrləmə mexanizmi yaratmaq istəyəndə sizə kifayət qədər kömək edəcək. Funksiya mətn tipli verilənlərdən ibarət siyahı qəbul edir. Qeyd etmək lazımdır ki, bu köməkçi KSİ-dən fərqli olaraq, vergüllə ayrılan filtr siyahılarını bölüşdürmür.

```js twoslash
// rollup.config.mjs
import { getLogFilter } from 'rollup/getLogFilter';

const logFilter = getLogFilter(['code:FOO', 'code:BAR']);

export default {
	input: 'main.js',
	output: { format: 'es' },
	onLog(level, log, handler) {
		if (logFilter(log)) {
			handler(level, log);
		}
	}
};
```

## Təhliledici ilə əlaqə yaratmaq {#accessing-the-parser}

Rollup-ın təhliledicisi ilə ixtiyari kodu təhlil etmək üçün plaginlərdə [`this.parse`](../plugin-development/index.md#this-parse) funksiyasından istifadə edilə bilər. Rollup-dan kənar yerdə bu funksiyadan istifadə etmək istəyirsinizsə, təhliledici `this.parse` funksiyası ilə eyni sintaksislə ayrıca da ixrac edilir.

```js twoslash
import { parseAst } from 'rollup/parseAst';
import assert from 'node:assert';

assert.deepEqual(
	parseAst('return 42;', { allowReturnOutsideFunction: true }),
	{
		type: 'Program',
		start: 0,
		end: 10,
		body: [
			{
				type: 'ReturnStatement',
				start: 0,
				end: 10,
				argument: {
					type: 'Literal',
					start: 7,
					end: 9,
					raw: '42',
					value: 42
				}
			}
		],
		sourceType: 'module'
	}
);
```

Təhliledicinin həmçinin kodu Rollup-ın qeyri-vasm inşalarında ayrı treddə təhlil edən asinxron versiyası da mövcuddur:

```js twoslash
import { parseAstAsync } from 'rollup/parseAst';
import assert from 'node:assert';

assert.deepEqual(
	await parseAstAsync('return 42;', { allowReturnOutsideFunction: true }),
	{
		type: 'Program',
		start: 0,
		end: 10,
		body: [
			{
				type: 'ReturnStatement',
				start: 0,
				end: 10,
				argument: {
					type: 'Literal',
					start: 7,
					end: 9,
					raw: '42',
					value: 42
				}
			}
		],
		sourceType: 'module'
	}
);
```
