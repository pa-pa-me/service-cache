'use strict';

const transform = process.env.BABEL_TRANSFORM || 'off';
const src = transform === 'on' ? './src/index' : './build/index';

if (transform === 'on') {
    console.log('babel transform enabled');
    require('babel-register')({
        plugins: [
            'transform-es2015-modules-commonjs',
            'transform-async-to-generator'
        ],
        sourceMaps: true,
        retainLines: true
    });
}

const app = module.exports = require(src);

if (!module.parent) {
    const port = 10123;
    let listener = app.listen(port);
    console.log('listening on port ' + listener.address().port);
}
