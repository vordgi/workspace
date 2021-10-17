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
		'indent': [0, 'tab'],
		'linebreak-style': [0, 'unix'],
		'quotes': [0, 'single'],
		'semi': [0, 'always'],
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/member-delimiter-style': [0, {
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
