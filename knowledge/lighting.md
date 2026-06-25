# Lighting & grade

The other half of "looks intentional, not pasted." Light and color are what the
eye reads first; a perfect composition with mismatched light still looks
composited. This guides the extension prompt alongside `composition.md`.

## Match the light

- **Direction.** Find the key light in the original (where shadows fall) and keep
  it. Shadows in the extension fall the same way, the same length. A shadow that
  flips direction across the seam is an instant tell.
- **Quality.** Hard light (crisp shadows, bright highlights) stays hard; soft,
  overcast light (diffuse, low-contrast) stays soft. Don't add dappled sunlight
  to a flat grey day.
- **No new sources.** Don't introduce a sun, lamp, or window glow that wasn't
  implied by the original.

## Match the color

- **White balance / temperature.** Warm golden-hour stays warm; cool shade stays
  cool. The extended sky, ground, and walls carry the same cast as the original.
- **Ambient bounce.** Surfaces pick up color from their surroundings (green from
  grass, blue from sky). Keep that consistent in the new region.

## Match the medium

- **Grain & noise.** Continue the original's grain/noise _amount and character_
  into the extension. A clean AI-smooth region next to grainy film is a tell.
- **Grade.** Match contrast curve, black level, saturation, and any color
  grade (teal-orange, faded film, crushed blacks). The extension lives in the
  same grade as the original, not a fresh, untoned render.
- **Vignette & optics.** If the lens vignettes or softens at the edges, the
  extended edges should too.
