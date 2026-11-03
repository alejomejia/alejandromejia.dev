import { describe, expect, it } from 'vitest'

import { escapeXML } from './markup'

describe('escapeXML', () => {
  it('escapes the five XML special characters', () => {
    expect(escapeXML(`Tom & Jerry <3 "quotes" 'too'`)).toBe('Tom &amp; Jerry &lt;3 &quot;quotes&quot; &apos;too&apos;')
  })

  it('escapes text that only looks like an entity, since it is text', () => {
    expect(escapeXML('&amp;')).toBe('&amp;amp;')
  })
})
