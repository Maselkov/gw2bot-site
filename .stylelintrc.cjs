module.exports = {
  'extends': [
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss'
  ],
  'rules': {
    // standard rules
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'blockless-after-same-name-blockless',
          'first-nested'
        ],
        ignore: [
          'after-comment',
          'inside-block'
        ]
      }
    ],
    'color-function-notation': 'legacy',
    'comment-whitespace-inside': null,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['inset', 'place-content']
      }
    ],
    'declaration-empty-line-before': 'never',
    'no-descending-specificity': [
      true,
      {
        ignore: ['selectors-within-list']
      }
    ],
    'rule-empty-line-before': [
      'always',
      {
        except: ['inside-block'],
        ignore: ['after-comment']
      }
    ],
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      {
        resolveNestedSelectors: true
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'placeholder']
      }
    ],
    'selector-pseudo-element-colon-notation': 'single',
    'value-keyword-case': [
      'lower',
      {
        camelCaseSvgKeywords: true
      }
    ],
    // scss rules
    // https://github.com/stylelint-scss/stylelint-scss
    'scss/dollar-variable-colon-space-after': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/dollar-variable-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(--[a-z0-9]+)?$',
      {
        message: 'Expected BM name syntax'
      }
    ],
    'scss/double-slash-comment-empty-line-before': [
      'always',
      {
        ignore: [
          'between-comments',
          'inside-block',
          'stylelint-commands'
        ]
      }
    ],
    'scss/percent-placeholder-pattern': [
      '^([A-Z][a-z0-9]*)(-[a-z0-9]+)*(--[a-z0-9]+)?$',
      {
        message: 'Expected BM name syntax with capital first letter'
      }
    ]
  }
}
