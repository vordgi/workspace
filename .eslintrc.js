module.exports = {
	root: true,
	env: {
		browser: false,
		es6: true,
		node: true
	},
	extends: [
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended'
	],
	parser: '@typescript-eslint/parser', // or "babel-eslint" (without ts)
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			modules: true,
			legacyDecorators: true
		},
		ecmaVersion: 6,
		sourceType: 'module'
	},
	plugins: [
		// for sort imports
		'import',
		// with ts only
		'@typescript-eslint'
	],
	settings: {
		fixOnSave: true
	},
	rules: {
		semi: 2,
		indent: [
			2,
			'tab',
			{
				SwitchCase: 1,
				ArrayExpression: 1,
				ObjectExpression: 1,
				CallExpression: { arguments: 1 },
				FunctionExpression: { parameters: 1 },
				MemberExpression: 1
			}
		],
		'comma-dangle': [
			2,
			{
				arrays: 'only-multiline',
				objects: 'only-multiline',
				imports: 'only-multiline',
				exports: 'only-multiline',
				functions: 'ignore'
			}
		],
		'no-tabs': 0,
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				ts: 'never'
			}
		],
		'import/no-extraneous-dependencies': 'off',
		'no-console': 0,
		'linebreak-style': 0,
		'no-useless-escape': 0,
		'max-len': 0,
		'no-plusplus': 0,
		'import/prefer-default-export': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0
	}
};
