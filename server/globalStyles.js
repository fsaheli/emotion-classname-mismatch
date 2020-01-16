import emotionNormalize from "emotion-normalize";
import { css } from "@emotion/core";

export const basicGlobalCSS = activeApp => `
/*
 * General font-face
 */


/*
 * Remove text-shadow in selection highlight:
 * https://twitter.com/miketaylr/status/12228805301
 *
 * These selection rule sets have to be separate.
 * Customize the background color to match your design.
 */

::-moz-selection {
  text-shadow: none;
}

/*
 * Print styles
 * Inlined to avoid the additional HTTP request:
 * http://www.phpied.com/delay-loading-your-print-css/
 * ========================================================================== */

@media print {
  *,
  *::before,
  *::after {
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  a,
  a:visited {
    text-decoration: underline;
  }

  a[href]::after {
    content: ' (' attr(href) ')';
  }

  abbr[title]::after {
    content: ' (' attr(title) ')';
  }

  /*
   * Don't show links that are fragment identifiers,
   * or use the javascript: pseudo protocol
   */

  a[href^='#']::after,
  a[href^='javascript:']::after {
    content: '';
  }

  pre,
  blockquote {
    page-break-inside: avoid;
  }

  /*
   * Printing Tables:
   * http://css-discuss.incutio.com/wiki/Printing_Tables
   */

  thead {
    display: table-header-group;
  }

  tr,
  img {
    page-break-inside: avoid;
  }

  img {
    max-width: 100% !important;
  }

  p,
  h2,
  h3 {
    orphans: 3;
    widows: 3;
  }

  h2,
  h3 {
    page-break-after: avoid;
  }
}

html {
  box-sizing: border-box;
}


*,
*::before,
*::after {
  box-sizing: border-box;
}

*::before,
*::after {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bold {
  font-weight: bold;
}

.italic {
  font-style: italic;
}
`;

export default ({ activeApp }) => css`
  ${emotionNormalize};
  ${basicGlobalCSS(activeApp)}
`;
