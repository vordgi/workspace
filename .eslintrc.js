// eslint-disable-next-line no-undef
module.exports = {
	'env': {
		'browser': true,
		'es2020': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 11,
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'@typescript-eslint/member-delimiter-style': ['error', {
			'multiline': {
				'delimiter': 'semi',
				'requireLast': true
			},
			'singleline': {
				'delimiter': 'semi',
				'requireLast': false
			},
			'multilineDetection': 'brackets'
		}],
	}
};
