# SB-28 Primary CTA semantic-token review candidate — 2026-10-23
Figma UI Master: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
Original component set 109:111 is preserved unchanged. New REVIEW component set 141:2, `REVIEW / Primary CTA / Semantic Tokens / SB28`, is not approved for promotion.

## Verified live result
- Review set contains 12 Apple/Android x Light/Dark x Enabled/Disabled/Focused component variants.
- Enabled and Focused variants: 8 of 8 have bound background `action/primary` and label `action/on-primary` semantic variables.
- Disabled variants: 4 remain unbound; no approved disabled semantic token verified. Do not infer a token or claim compliance.
- Original set still has 12 variants and 0 bound background fills; source was not changed.
- No Auto Layout conversion, additional states, logo replacement, native QA, Code Connect or owner approval performed.

## Next gates
1. Review disabled contrast and semantic role before token creation/binding.
2. Make isolated responsive Auto Layout candidate and test text scaling and visual geometry.
3. Confirm state matrix, focus/pressed/loading/error behavior and device accessibility.
4. Obtain explicit owner acceptance before replacing original component references.