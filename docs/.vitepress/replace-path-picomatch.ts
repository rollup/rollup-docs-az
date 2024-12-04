import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
export function replacePathPicomatch(): Plugin {
	return {
		enforce: 'pre',
		load(id) {
			if (id === 'picomatch') {
				return 'export default {}';
			}
		},
		name: 'replace-picomatch',
		resolveId(source) {
			if (source === 'picomatch') {
				return { id: 'picomatch' };
			}
			if (source === 'path') {
				return path.resolve(
					path.dirname(fileURLToPath(import.meta.url)),
					'../../browser/src/path.ts'
				);
			}
		}
	};
}
