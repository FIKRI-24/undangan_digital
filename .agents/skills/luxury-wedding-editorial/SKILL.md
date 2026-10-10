---
name: luxury-wedding-editorial
description: Bespoke design system and critique framework for high-fashion editorial & royal heritage digital wedding invitations. Eliminates generic AI/SaaS patterns (pill badges, repetitive white boxes, flat cartoon vectors, crowded hero layouts) in favor of fine print stationery craft, museum-grade passe-partout framing, dramatic editorial typography, and tactile paper textures.
---

# Luxury Wedding Editorial & Fine Stationery Design Skill

Use this skill whenever designing, critiquing, or refactoring digital wedding invitations so they read like **bespoke physical letterpress stationery meets Vogue Weddings / Over The Moon editorial**, rather than a generic AI-generated SaaS template.

## 1. Anti-Patterns to Eliminate ("AI Slop" in Wedding Invitations)

1. **No SaaS Pill Badges Above Headings**:
   - **NEVER** put rounded pill badges with Lucide icons above wedding sections (e.g., `[Camera] OUR GALLERY`, `[Gift] WEDDING GIFT`, `[Sparkles] RSVP & UCAPAN`, `[CalendarHeart] SAVE THE DATE`). Pill badges belong on B2B SaaS landing pages, not wedding invitations.
   - **INSTEAD**: Use a delicate Roman numeral or chapter index (`I`, `II`, `III`, `IV`, `V`), a fine hairline vertical rule (`1px` height `24px`), or an italic serif overline (`The Matrimony`, `Order of Events`, `Portraits of Us`).

2. **No Repetitive SaaS White Box Cards**:
   - **NEVER** chop every section (Bride, Groom, Akad, Resepsi, Love Story, Gift, RSVP) into identical `border-radius: 24px` white cards with `box-shadow: 0 10px 30px rgba(0,0,0,0.08)`.
   - **INSTEAD**: Treat the mobile canvas as **continuous fine cotton paper (`480px` editorial sheet)** with subtle inset double-hairline frames (`1px solid` outer, `0.5px solid` inner offset by `6px`), architectural arches, overlapping serif numerals, and open editorial compositions.

3. **No Over-Crowded Cover Screens**:
   - **NEVER** stack 8 competing elements on the Cover (roof SVG + eyebrow + giant script + divider + date + small boxed photo + dark frosted glass box + 3D wax seal + shiny gradient pill button).
   - **INSTEAD**: Design the Cover like an **Architectural Magazine Cover or Fine Letterpress Envelope**:
     - Full-bleed atmospheric portrait photography (with rich editorial fallback photography, never flat vector cartoons).
     - A continuous delicate inset gold/ivory hairline border (`inset: 16px`) framing the entire viewport.
     - Refined top monogram / cultural crest, breathable center/lower-third editorial typography, and an understated, tactile invitation card for the guest (`Kepada Yth.`) with a single couture CTA button.

4. **No Flat Cartoon SVG Placeholders for Photos**:
   - When a client has not uploaded custom photos yet (or uses default paths like `/images/cover.svg`), provide **curated high-fashion editorial wedding photography fallbacks** (or rich atmospheric compositions) so the invitation immediately looks like a real luxury magazine shoot.

5. **No Gimmicky Neon/Glowing Countdown Boxes or Plastic ATM Chips**:
   - **Countdown**: Instead of 4 floating plastic boxes with glowing numbers, use an **Editorial Horology / Fine Calendar Strip** — large high-contrast serif numerals separated by delicate vertical hairlines or colons, framed inside a single bespoke stationery plaque.
   - **Wedding Gift (Tanda Kasih)**: Instead of a fake CSS ATM chip made of 2 crossed lines, design a **Couture Sovereign Registry / Fine Linen Envelope Card** with crisp typographic hierarchy, subtle watermarked crest, and a refined 1-click copy action.

## 2. Core Visual Craft & Materiality

- **Tactile Cotton Paper Grain**: Apply an ultra-subtle noise/paper grain texture (`opacity: 0.035`) across the invitation canvas so light backgrounds feel like 300gsm Cotton Letterpress paper and dark backgrounds feel like velvet/silk cardstock.
- **Double-Hairline Passe-Partout Frames**: Luxury print invitations use fine inset borders (`1px solid rgba(var(--gold), 0.35)` with an inner `1px solid rgba(var(--gold), 0.15)` at `5px` inset) and chamfered or botanical/traditional corner accents.
- **Editorial Portrait Mats**: Frame Bride & Groom portraits in tall editorial arches (`aspect-ratio: 3/4`) with an offset gold hairline arch behind or around the portrait, paired with an oversized script initial watermark (`R`, `A`) and refined genealogy typography.
- **Editorial Timeline (Kisah Cinta)**: Replace chunky left-aligned cards with a **Center-Axis or Magazine Chapter Timeline** featuring Roman numerals (`I · PERTEMUAN PERTAMA`), fine vertical gold thread, and asymmetric editorial storytelling.
- **Theme Engine Compatibility**: Always use semantic CSS variables (`var(--wine-900)`, `var(--wine-700)`, `var(--burgundy-600)`, `var(--gold-500)`, `var(--gold-300)`, `var(--ivory-50)`, `var(--cream-100)`, `var(--paper)`, `var(--font-script)`, `var(--font-heading)`, `var(--font-body)`) and preserve `data-ornament-style`, `data-frame-style`, and `data-particles` hooks so every client's custom theme adapts effortlessly.
