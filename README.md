# MNYMO website

Static site for MN Youth Math Outreach, deployed through Vercel to
https://www.mnyouthmathoutreach.org. There is no build step: every `.html`
file in the root is a page, styled by `style.css` and `script.js`.

## Layout

```
docs/                      PDFs hosted on the site (linked from the pages)
  competition/<year>/      open competition: <round>/problems.pdf, <round>/solutions.pdf
                           2026 also has schedule.pdf and closing-ceremony.pdf
  girls/<year>/            MNYMO for Girls: individual/, lightning/
  camp/                    diagnostic-problems.pdf
images/
  competition/<year>/      open competition photos
  girls/<year>/            MNYMO for Girls photos
  camp/<year>/             camp images
  instructors/             staff headshots (about.html)
  logos/                   sponsor and resource logos
  site/                    logo, background, banner photos
```

## Reusable pieces

`script.js` defines custom HTML elements so shared or repetitive markup is
written once. Use them like tags:

| Tag | What it expands to |
| --- | --- |
| `<site-header></site-header>` | nav bar (desktop + hamburger) |
| `<photo-strip></photo-strip>` | the four banner photos above the footer |
| `<site-footer></site-footer>` | footer and copyright line |
| `<photo-slideshow base="images/x" images="a.jpg b.jpg">` | slideshow with arrows and dots |
| `<round-links base="docs/x/2026" rounds="General Team">` | Problems/Solutions link groups; extra `<div class="comp-link-group">` children are kept |
| `<org-list><org-card href img name size mobile-size>text</org-card></org-list>` | sponsor / resource cards in both desktop and mobile layouts |
| `<staff-card name role img>bio</staff-card>` | staff photo with click-to-open bio |

Edit the nav links or footer text in `script.js` and every page picks it up.

## Adding a year

Create `docs/competition/<year>/<round>/problems.pdf` and `solutions.pdf`,
put photos in `images/competition/<year>/`, then add to `competition.html`:

```html
<round-links base="docs/competition/<year>" rounds="General Mastery Team Guts Estimathon"></round-links>
<photo-slideshow base="images/competition/<year>" images="1.png 2.png"></photo-slideshow>
```
