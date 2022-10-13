const dts = require('@qiwi/dts-bundle');

dts.bundle({
	name: 'toc',
	main: '../../type-toc/index.d.ts',
	out: './toc.d.ts',
});
