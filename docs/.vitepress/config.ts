import alias from '@rollup/plugin-alias';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitepress';
import { moduleAliases } from '../../build-plugins/aliases';
import replaceBrowserModules from '../../build-plugins/replace-browser-modules';
import '../declarations.d';
import { examplesPlugin } from './create-examples';
import { renderMermaidGraphsPlugin } from './mermaid';
import { transposeTables } from './transpose-tables';
import { buildEnd, callback, transformPageData } from './verify-anchors';

export default defineConfig({
	buildEnd,
	description: 'JS kodunu kompilyasiya edin',
	head: [
		['link', { href: '/favicon.png', rel: 'icon', type: 'image/png' }],
		['link', { href: '/favicon.png', rel: 'apple-touch-icon', sizes: '128x128' }],
		['link', { href: '/manifest.json', rel: 'manifest' }],
		['meta', { content: '#333333', name: 'theme-color' }],
		['meta', { content: 'yes', name: 'mobile-web-app-capable' }],
		['meta', { content: 'default', name: 'apple-mobile-web-app-status-bar-style' }],
		['meta', { content: 'summary_large_image', name: 'twitter:card' }],
		['meta', { content: '@rollupjs', name: 'twitter:site' }],
		['meta', { content: '@rollupjs', name: 'twitter:creator' }],
		['meta', { content: 'Rollup', name: 'twitter:title' }],
		['meta', { content: 'The JavaScript module bundler', name: 'twitter:description' }],
		['meta', { content: 'https://rollupjs.org/twitter-card.jpg', name: 'twitter:image' }]
	],
	locales: {
		en: { label: 'İngiliscə', link: 'https://rollupjs.org' },
		root: { label: 'Azərbaycanca' },
		tr: { label: 'Türkçe', link: 'https://tr.rollupjs.org' },
		zh: { label: '简体中文', link: 'https://cn.rollupjs.org' }
	},
	markdown: {
		anchor: {
			callback,
			level: 2
		},
		codeTransformers: [
			transformerTwoslash({
				langs: [
					// defaults
					'ts',
					'tsx',
					'js',
					'jsx',
					'json',
					'vue',
					// custom
					'javascript',
					'typescript'
				],
				twoslashOptions: {
					compilerOptions: {
						moduleResolution: 100, // bundler
						types: ['node']
					}
				}
			})
		],
		config(md) {
			transposeTables(md);
		},
		linkify: false,
		toc: {
			level: [2, 3, 4]
		}
	},
	themeConfig: {
		editLink: {
			pattern: 'https://github.com/rollup/rollup-docs-az/edit/master/docs/:path',
			text: 'Bu səhifəni GitHub-da redaktə edin'
		},
		footer: {
			copyright: 'Rollup əməkdaşları © 2015-h.h. Bütün hüquqlar qorunur.',
			message: 'MIT lisenziyası altında yayımlanır.'
		},
		logo: '/rollup-logo.svg',
		nav: [
			{ link: '/introduction/', text: 'yolgöstərici' },
			{ link: '/repl/', text: 'repl' },
			{ link: 'https://is.gd/rollup_chat', text: 'söhbət' },
			{ link: 'https://opencollective.com/rollup', text: 'opencollective' }
		],
		outline: 'deep',
		search: {
			options: {
				apiKey: '233d24494bdf54811b5c3181883b5ee3',
				appId: 'V5XQ4IDZSG',
				indexName: 'rollupjs',
				translations: {
					button: {
						buttonText: 'Axtarın'
					},
					modal: {
						footer: {
							closeText: 'bağlamaq üçün',
							navigateText: 'hərəkət etmək üçün',
							selectText: 'seçmək üçün'
						}
					}
				}
			},
			provider: 'algolia'
		},
		sidebar: [
			{
				items: [
					{
						link: '/introduction/',
						text: 'Giriş'
					},
					{
						link: '/command-line-interface/',
						text: 'Komanda Sətri İnterfeysi'
					},
					{
						link: '/javascript-api/',
						text: 'JavaScript Proqramlaşdırma İnterfeysi'
					}
				],
				text: 'Başlanğıc'
			},
			{
				items: [
					{
						link: '/tutorial/',
						text: 'Öyrədici'
					},
					{
						link: '/es-module-syntax/',
						text: 'ES Modul Sintaksisi'
					},
					{
						link: '/faqs/',
						text: 'Tez-Tez Verilən Suallar'
					},
					{
						link: '/troubleshooting/',
						text: 'Xətaları Düzəltmək'
					},
					{
						link: '/migration/',
						text: 'Rollup 4-ə Miqrasiya'
					},
					{
						link: '/tools/',
						text: 'Digər Alətlər'
					}
				],
				text: 'Ətraflı məlumat'
			},
			{
				items: [
					{
						link: '/configuration-options/',
						text: 'Konfiqurasiya Seçimləri'
					},
					{
						link: '/plugin-development/',
						text: 'Plagin Tərtibatı'
					}
				],
				text: 'API'
			}
		],
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/rollup/rollup' },
			{ icon: 'mastodon', link: 'https://m.webtoo.ls/@rollupjs' }
		]
	},
	title: 'Rollup',
	transformPageData,
	vite: {
		plugins: [
			renderMermaidGraphsPlugin(),
			replaceBrowserModules(),
			{
				apply: 'build',
				enforce: 'pre',
				name: 'replace-local-rollup',
				resolveId(source) {
					if (source.includes('/browser-entry')) {
						return false;
					}
				}
			},
			examplesPlugin(),
			alias(moduleAliases) as unknown as Plugin
		]
	}
});
