---
title: Rollup 4-ə Keçid
---

# {{ $frontmatter.title }}

[[toc]]

Bu, Rollup 3-dən Rollup 4-ə keçən zaman rastlaşacağınız əsas nüanslardan ibarət siyahıdır. Mühüm fərqlərin tam siyahısını görmək üçün [Rollup 4 dəyişiklik qeydlərinə](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#400) nəzər yetirməyiniz tövsiyə olunur.

Daha ilkin versiyalardan keçid haqqında məlumat üçün [aşağıya baxa bilərsiniz](#migrating-to-rollup-3).

## İlkin ehtiyaclar {#prerequisites}

Hər şeydən əvvəl, Node.js-in ən aşağısı 18.0.0 versiyasını quraşdırmağınıza və bütün Rollup plaginlərinin ən yeni versiyalarından istifadə etməyinizə əmin olmalısınız.

Nisbətən böyük ölçülü konfiqurasiyalar üçün yaxşı olar ki, birinci `rollup@3.29.4` versiyasını quraşdırıb, konfiqurasiyanıza [`strictDeprecations`](../configuration-options/index.md#strictdeprecations) parametrini əlavə edib yaranan xətaları aradan götürəsiniz. Beləliklə, siz əmin ola bilərsiniz ki, Rollup 4-də etibarsız hala gələn xüsusiyyətlərdən istifadə etmirsiniz. Əgər plaginlərlə bağlı problemlər yaranarsa, plagin müəllifləri ilə əlaqə saxlaya bilərsiniz.

## Ümumi dəyişikliklər {#general-changes}

Əgər sizin platforma və arxitekturanız dəstəklənirsə, Rollup artıq avtomatik olaraq [ixtiyari npm asılılığı](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#optionaldependencies) kimi əlavə edilə və silinə bilən doğma kodları da əhatə edir. Daha dəqiq desək, Rollup-ın yalnızca bəlli [`os`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#os) və [`cpu`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#cpu) mövcud olan zaman yüklənən asılılıqlardan ibarət bir `optionalDependencies` siyahısı mövcuddur. Əgər sisteminiz dəstəklənmirsə, Rollup-ı başladan zaman sizin platformanız və arxitekturanız haqqında məlumat və dəstəklənən sistemlərin bir siyahısından ibarət xəta mesajı əldə edəcəksiniz. Belə olan halda bütün platformalar üçün əlçatan olan `@rollup/wasm-node` kitabxanasından əvəzedici kimi istifadə edə bilərsiniz.

Brauzer inşası isə (`@rollup/browser`) artıq ayrıca qeyd edilməli olan WASM artefaktına əsaslanır. Əgər siz Vite ilə birgə brauzer inşasından istifadə edirsinizsə, `optimizeDeps.exclude` siyahısına `"@rollup/browser"` asılılığını əlavə etməyiniz lazım gələcək, əks halda `npm run dev` komandası `.wasm` faylına gedən etibarsız yoldan ötürü uğursuz olacaq (həmçinin baxın: [vitejs #14609](https://github.com/vitejs/vite/issues/14609)). Bundan başqa, xüsusi bir müdaxiləyə ehtiyac duyulmadan hər şey öz qaydasında işləməlidir.

Bunlara əlavə olaraq, Rollup ilə bağlı nəzərə çarpan digər bir dəyişiklik isə əvvəlki 16-lıq say sistemli çözənəklərin ("hash") yeni 64-lük say sistemindəki çözənəklərlə əvəz olunmasıdır. Beləliklə çözənəklər artıq daha təhlükəsizdir, ancaq texniki səbəblərdən ötürü maksimal çözənək uzunluğu 22 simvoldur.

KSİ tətbiqləri hazırlayarkən əgər çıxış [`format`](../configuration-options/index.md#output-format)-ı `es`, yaxud `cjs` olarsa, Rollup avtomatik olaraq `#!` şərhlərini qoruyacaq. Əvvəllər isə bu, şərhi plagin vasitəsilə əlavə etməklə mümkün olurdu.

Sonda onu qeyd etmək istərdik ki, siz etibarsız annotasiya mövqeləri ilə bağlı bir sıra yeni xəbərdarlıqlarla qarşılaşa bilərsiniz. Bundan sonra Rollup əgər düzgün yerləşdirilmədiyi üçün işə salına bilməyən [`@__PURE__`](../configuration-options/index.md#pure), yaxud [`@__NO_SIDE_EFFECTS__`](../configuration-options/index.md#no-side-effects) şərhləri tapsa, sizə xəbərdarlıq göndərəcək. Bunlar isə debaq prosesində sizə kömək edəcəkdir. Onları susdurmaq istəsəniz, [`--filter-logs`](../command-line-interface/index.md#filterlogs-filter) KSİ parametri sizə yardım edə bilər.

## Konfiqurasiya dəyişiklikləri {#configuration-changes}

Rollup 3-də artıq köhnəlmiş bir sıra seçimlər birdəfəlik yığışdırılsa da, yeganə irihəcmli dəyişiklik `acorn` və `acornInjectPlugin` seçimlərinin əlçatan olmamağıdır. Bu isə o deməkdir ki, təəssüf ki, siz artıq dəstəklənməyən sintaksislər üçün plaginlər əlavə edə bilməyəcəksiniz. Tələbdən asılı olaraq biz JSX sintaksisini SWC təhliledicisininki kimi yenidən dəstəkləyə bilərik.

## Plagin proqramlaşdırma interfeysinə dəyişikliklər {#changes-to-the-plugin-api}

Mühüm bir dəyişiklik odur ki, [`this.resolve()`](../plugin-development/index.md#this-resolve) bundan sonra defolt şəkildə `skipSelf: true` parametrini əlavə edəcək. Bu da o deməkdir ki, [`resolveId`](../plugin-development/index.md#resolveid) qarmağından `this.resolve()` çağıran zaman qarmaq buradan, yaxud müxtəlif `source` və ya `importer` təyin edilməyibsə, digər plaginlərdəki `this.resolve()` funksiyalarından yenidən işə salınmayacaq. Aşkar edilib ki, bu, istənilməyən sonsuz döngələrin qarşısını alan, əlverişli defoltdur. Əvvəlki iş prinsipini yenidən quraşdırmaq istəyirsinizsə, `skipSelf: false` parametrini özünüz əlavə edə bilərsiniz.

Digər bir mühüm fərq isə ondadır ki, Rollup izləmə modu bundan sonra plaginlərin [`load`](../plugin-development/index.md#load) qarmağı ilə yüklənən faylların identifikatorlarını izləməyəcək. Bu, əsasən, "virtual" fayllara təsir göstərəcək, harada ki, sərt disk dəyişikliklərini izləməyə ehtiyac yoxdur. Bunun əvəzinə `load` qarmağını istifadə edən plaginlər özləri sözügedən qarmaqdan asılı olan hər bir fayl üçün ayrıca [`this.addWatchFile()`](../plugin-development/index.md#this-addwatchfile) funksiyasını işə salmalıdırlar.

Əgər sizin plagininiz idxalat yoxlamalarını yerinə yetirirsə, qeyd etmək lazımdır ki, JavaScript xüsusiyyətinin adı dəyişdiyi üçün [`resolveId`](../plugin-development/index.md#resolveid) qarmağında və digər yerlərdə `assertions` parametri `attributes` ilə əvəz olunub. Həmçinin idxalat atributlarının abstrakt sintaksisli ağac təsviri [ESTree nizamnaməsinə](https://github.com/estree/estree/blob/7a0c8fb02a33a69fa16dbe3ca35beeaa8f58f1e3/experimental/import-attributes.md) uyğunlaşdırılıb.

Əgər plaginləriniz xəbərdarlıqlar qaytaracaqsa, bundan sonra [`buildStart`](../plugin-development/index.md#buildstart) qarmağında `options.onwarn()` funksiyasını çağıra bilməzsiniz. Bunun əvəzində [`this.warn()`](../plugin-development/index.md#load) və ya [`options.onLog()`](../configuration-options/index.md#onlog) funksiyalarından istifadə edə bilərsiniz.

## Rollup 3-ə keçid {#migrating-to-rollup-3}

Bu, Rollup 2-dən Rollup 3-ə keçən zaman rastlaşacağınız əsas nüanslardan ibarət siyahıdır. Mühüm fərqlərin tam siyahısını görmək üçün [Rollup 3 dəyişiklik qeydlərinə](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#300) nəzər yetirməyiniz tövsiyə olunur.

Rollup 1, yaxud daha köhnə bir versiyadan keçid edirsinizsə, həmçinin [Rollup 2](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#200) və [Rollup 1 dəyişiklik qeydlərinə](https://github.com/rollup/rollup/blob/master/CHANGELOG.md#100) də nəzər salın.

### İlkin ehtiyaclar {#prerequisites-1}

Hər şeydən əvvəl, Node.js-in ən aşağısı 14.18.0 versiyasını quraşdırmağınıza və bütün Rollup plaginlərinin ən yeni versiyalarından istifadə etməyinizə əmin olmalısınız.

Nisbətən böyük ölçülü konfiqurasiyalar üçün yaxşı olar ki, birinci `rollup@2.79.1` versiyasını quraşdırıb, konfiqurasiyanıza [`strictDeprecations`](../configuration-options/index.md#strictdeprecations) parametrini əlavə edib yaranan xətaları aradan götürəsiniz. Beləliklə, siz əmin ola bilərsiniz ki, Rollup 3-də etibarsız hala gələn xüsusiyyətlərdən istifadə etmirsiniz. Əgər plaginlərlə bağlı problemlər yaranarsa, plagin müəllifləri ilə əlaqə saxlaya bilərsiniz.

### Konfiqurasiya fayllarından istifadə {#using-configuration-files}

Əgər konfiqurasiya faylı kimi ES modulundan, o cümlədən `import` və `export` sintaksisindən istifadə edirsinizsə, dəqiq yoxlamalısınız ki, Node sizin konfiqurasiyanızı ES modulu kimi yükləyir.

Bunun ən rahat yolu isə fayl uzantısını `.mjs` kimi təyin eləməkdir. Konfiqurasiya faylları haqqında daha ətraflı məlumatı [buradan](../command-line-interface/index.md#configuration-files) ala bilərsiniz.

Doğma Node ES modullarından istifadə edərkən bilməli olduğunuz bir sıra digər nüanslar da var; ən vacibləri bunlardır:

- `package.json` faylını birbaşa idxal edə bilməzsiniz;
- faylın mövcud olduğu qovluğun adını `__dirname` vasitəsilə əldə edə bilməzsiniz.

Bu mövzularla əlaqədar kömək lazım olarsa, [buraya](../command-line-interface/index.md#caveats-when-using-native-node-es-modules) baş çəkə bilərsiniz.

Əvvəlki konfiqurasiya formatını saxlamaq istəsəniz, [`--bundleConfigAsCjs`](../command-line-interface/index.md#bundleconfigascjs) parametrindən istifadə edə bilərsiniz.

Əgər [`--configPlugin`](../command-line-interface/index.md#configplugin-plugin) parametrindən istifadə etsəniz, Rollup konfiqurasiyanızı oxumazdan əvvəl onu CommonJS əvəzinə ES modulu kimi bandl edəcək. Beləliklə, siz asanlıqla konfiqurasiyanızdan ES modullarını idxal edə bilərsiniz. Bu zaman isə doğma ES modullarındakı nüanslarla üzləşəcəksiniz, məsələn, `__dirname`-dən istifadə etmək mümkün olmayacaq. Yenə də, ənənəvi yükləmə tərzini saxlamaq istəyirsinizsə, [`--bundleConfigAsCjs`](../command-line-interface/index.md#bundleconfigascjs) parametrindən istifadə edə bilərsiniz.

### Dəyişdirilmiş defoltlar {#changed-defaults}

Bir sıra seçimlərin defolt dəyərləri artıq dəyişib. Əgər bununla əlaqədar problemlə üzləşdiyinizi düşünürsünüzsə, aşağıdakı kodu konfiqurasiyanıza əlavə edə bilərsiniz:

```js
({
	makeAbsoluteExternalsRelative: true,
	preserveEntrySignatures: 'strict',
	output: {
		esModule: true,
		generatedCode: {
			reservedNamesAsProps: false
		},
		interop: 'compat',
		systemNullSetters: false
	}
});
```

Ümumiyyətlə isə, yeni defolt dəyərlər bizim tövsiyə etdiyimiz tənzimləmələrdir. Hər bir tənzimləmə haqqında ətraflı məlumat üçün onların dokumentasiyasına baş çəkə bilərsiniz.

### Dəyişdirilmiş digər seçimlər {#more-changed-options}

- [`output.banner/footer`](../configuration-options/index.md#output-banner-output-footer)[`/intro/outro`](../configuration-options/index.md#output-intro-output-outro) artıq blok başına işə salınır və performansa təsir göstərə biləcək, ağır iş yerinə yetirməmələri tövsiyə olunur;
- [`entryFileNames`](../configuration-options/index.md#output-entryfilenames) və [`chunkFileNames`](../configuration-options/index.md#output-chunkfilenames) funksiyalarının daha `modules` vasitəsilə yüklənmiş modul barədə informasiyaya keçidi yoxdur, ancaq `moduleIds` vasitəsilə modul identifikatorlarının siyahısından istifadə edə bilərlər;
- [`output.preserveModules`](../configuration-options/index.md#output-preservemodules) və `entryFileNames`-dən istifadə edən zaman daha `[ext]`, `[extName]` və `[assetExtName]` fayl adı şablonlarından ("placeholder") istifadə edə bilməzsiniz. Həmçinin, bir modulun mövqeyi avtomatik olaraq fayl adına yazılmır, ancaq `[name]`-in tərkibində mövcuddur.

### CommonJS çıxışında dinamik idxalat {#dynamic-import-in-commonjs-output}

Defolt olaraq `cjs` çıxışı yaradan zaman Rollup artıq hər hansı xarici — bandl olunmamış, `import(…)` kimi dinamik idxalat ifadələrini çıxışa əlavə edəcək. Bu, 14-dən başlayaraq bütün Node versiyalarında əlçatandır və yaradılmış CommonJS çıxışından həm CommonJS, həm də ES modullarını yükləməyə imkan yaradır. Daha köhnə Node versiyalarını dəstəkləmək istəsəniz, [`output.dynamicImportInCjs: false`](../configuration-options/index.md#output-dynamicimportincjs) parametrindən istifadə edə bilərsiniz.

### Plagin proqramlaşdırma interfeysinə dəyişikliklər {#changes-to-the-plugin-api-1}

Çıxış yaradılması axışı başdan yazılıb, yeni plagin qarmağı sıralaması üçün [Çıxış Yaradılması Qarmaqları](../plugin-development/index.md#output-generation-hooks) səhifəsinə baxa bilərsiniz. Ən çox gözə çarpan dəyişikliklərdən biri isə [`banner`](../plugin-development/index.md#banner)/[`footer`](../plugin-development/index.md#footer)/[`intro`](../plugin-development/index.md#intro)/[`outro`](../plugin-development/index.md#outro) artıq əvvəldə yox, blok başına işə salınır. Digər tərəfdən, çözənək yaradılan zaman [`augmentChunkHash`](../plugin-development/index.md#augmentchunkhash) daha [`renderChunk`](../plugin-development/index.md#renderchunk)-dan sonra işə salınır.

Fayl çözənəkləri faylın `renderChunk`-dan sonrakı əsl kontenti əsasında formalaşdığı üçün çözənəklər yaradılana qədər dəqiq fayl adları qeyri-məlum olur. Bunun əvəzinə, iş məntiqi `!~{001}~` formatındakı çözənək şablonlarına əsaslanır. Bu da o deməkdir ki, `renderChunk` qarmağına məlum olan fayl adları şablonlar ehtiva edə bilər və son fayl adından fərqli ola bilər. Yenə də, bu, əgər siz bu fayl adlarından bloklar daxilində istifadə edəcəksinizsə, problem yaratmayacaq, çünki Rollup [`generateBundle`](../plugin-development/index.md#generatebundle) işə salınmazdan əvvəl bütün şablonları aradan qaldıracaq.

O qədər də mühüm bir dəyişiklik olmasa da, [`renderChunk`](../plugin-development/index.md#renderchunk) daxilində idxalat əlavə edən, yaxud silən plaginlər sözügedən qarmağa ötürülən `chunk` məlumatını da yeniləməlidirlər. Bu, digər plaginlərin kod blokları haqqında onları "eşələmədən" dəqiq məlumata sahib olmalarına imkan yaradacaq. Ətraflı məlumat üçün bu qarmağın [dokumentasiyasına](../plugin-development/index.md#renderchunk) baxa bilərsiniz.
