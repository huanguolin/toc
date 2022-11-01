// eslint-disable-next-line no-undef
module.exports = {
    ignorePatterns: ['tests/**/*.ts'],
    extends: ['eslint:recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'unused-imports', 'prettier'],
    rules: {
        'prettier/prettier': 2,
        'unused-imports/no-unused-imports': 2,
        'no-trailing-spaces': 2,
        'no-unused-vars': 0,
        semi: ['error', 'always'],

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
