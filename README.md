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

To add a new year, create `docs/competition/<year>/` and
`images/competition/<year>/` and link to them from `competition.html`.
