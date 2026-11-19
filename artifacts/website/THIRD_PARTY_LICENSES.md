# Third-party code

## Corsair UI (components published on 21st.dev as @kevingirelli)

The files in `src/components/corsair/`, `src/hooks/` and `src/lib/utils.ts` are from
https://github.com/KevinGirelli/corsair-ui, used under the MIT License. Only their import paths were changed.
`src/styles/corsair.css` is generated from the same components' registry entries.

```
MIT License

Copyright (c) 2026 Kevin Girelli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Components the site owner pasted from 21st.dev

- `src/components/fx/ChromeArcs.tsx`: Chrome Arcs by Louis Studios (https://studios.lou15.com). The shader and motion are
  theirs; this site added a pixel-ratio cap and a way to follow the pointer over a section. Licence for the 21st.dev copy
  is not confirmed (the author's own site gives free copies a personal-use licence and says a 21st.dev copy follows
  21st.dev's terms). Confirm commercial use with the author before relying on it.
- `src/components/fx/GlyphField.tsx`: the Animate UI glyph background, ported without its `motion` and `@animate-ui`
  dependencies. Animate UI is published as MIT with the Commons Clause (use in a website is fine, selling the component itself is not).

## npm packages

`cobe` (MIT, the globe), `tailwindcss`, `clsx`, `tailwind-merge` and `@radix-ui/react-slot` (all MIT) are used as installed.

## React Bits (free, open source)

`src/components/rb/GradientASCII`, `LetterGlitch`, `DotField`, `HalftoneReveal` and `PixelCard` are from React Bits by David Haz
(https://reactbits.dev, source https://github.com/DavidHDev/react-bits), taken unchanged from its public registry. They have no
dependencies beyond React. The licence allows use inside a website or product; it does not allow selling the components
themselves as a library. Licence text:

```
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
