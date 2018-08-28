// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion:6
    },
    env: {
        browser: true,
        es6:true,
        commonjs:true,
        amd:true,
        worker:true,
        node:true
    },
    // global variables settings
    globals: {
        Piwik: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    // extends: 'standard',
    extends: [
        'eslint:recommended',
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vuefix',
        'import',
        'promise'
    ],
    // add your custom rules here
    'rules': {
        // 'eqeqeq':0,
        'arrow-parens': 0,
        // allow paren-less arrow functions
        'promise/param-names':0,
        'eqeqeq':0,
        'one-var':0,
        'camelcase':0,
        "indent": ["error", 4, { "SwitchCase": 1 }],
        // allow async-await
        'generator-star-spacing': 0,
        'no-undef': 2,
        // 'arrow-spacing':2,
        'no-extra-semi':2,
        'use-isnan':1,
        'strict' : 2,
        'no-new':1,
        'no-unused-vars': [1, { "vars": "all", "args": "none", "ignoreRestSiblings": true }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-console':process.env.NODE_ENV === 'production' ? 2 : 0,
    }
}
