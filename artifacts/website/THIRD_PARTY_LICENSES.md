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
  dependencies. Animate UI is open source; confirm its licence on the component's 21st.dev page.

## npm packages

`cobe` (MIT, the globe), `tailwindcss`, `clsx`, `tailwind-merge` and `@radix-ui/react-slot` (all MIT) are used as installed.
