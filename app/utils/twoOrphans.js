/*
 * Replace the last whitespace character with a non-breaking space to force
 * a minimum of two orphan words in a given block of text
 *
 * \xA0 = non-breaking space (javascript entity)
 * $1 = capture group 1
*/
export function twoOrphans (text) {
  return text.replace(/\s+(\S+$)/, '\xA0$1')
}
