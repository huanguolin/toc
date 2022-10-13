// eslint-disable-next-line no-undef
module.exports = {
    extends: 'eslint:recommended',
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'unused-imports'],
    rules: {
        'unused-imports/no-unused-imports': 2,
        'no-trailing-spaces': 2,
        'no-unused-vars': 0,
        'semi': ["error", "always"],

        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'parent', 'sibling'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                },
            },
        ],
    },
};
