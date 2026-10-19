import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Keep the existing standard-like style
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/space-before-function-paren': ['error', 'always'],
    // Allows one-line guards such as if (!x) { return }
    '@stylistic/max-statements-per-line': ['error', { max: 2 }],
    '@stylistic/quote-props': ['warn', 'consistent', { keywords: true }],
    'vue/max-attributes-per-line': ['warn', { singleline: { max: 3 }, multiline: { max: 1 } }],
    'vue/singleline-html-element-content-newline': ['warn', {
      ignores: ['ExternalLink', 'NuxtLink', 'a', 'abbr', 'pre', 'span', 'td']
    }]
  }
})
