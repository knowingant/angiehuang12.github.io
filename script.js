/*
 * MNYMO site components.
 *
 * Each custom element below works like a function: write the tag once in a
 * page and it expands into the full HTML when the page loads. Shared pieces
 * (nav, footer, banner photos) live here so they only have to be edited once.
 *
 *   <site-header></site-header>
 *   <photo-strip></photo-strip>
 *   <site-footer></site-footer>
 *   <photo-slideshow base="images/x" images="a.jpg b.jpg"></photo-slideshow>
 *   <round-links base="docs/x/2026" rounds="General Team">extra groups</round-links>
 *   <org-list> <org-card href img name size mobile-size>description</org-card> </org-list>
 *   <staff-card name role img>bio</staff-card>
 */

const NAV_LINKS = [
  ["index.html", "Home"],
  ["camp.html", "Camp"],
  ["competition.html", "Competition"],
  ["mnymoforgirls.html", "MNYMO for Girls"],
  ["sponsors.html", "Sponsors"],
  ["about.html", "About"],
  ["contact.html", "Contact"],
  ["resources.html", "Resources"],
];

const CONTACT_EMAIL = "mnyouthmathoutreach@gmail.com";
const BANNER_PHOTOS = [1, 2, 3, 4].map((n) => `images/site/photo${n}.JPG`);

/* ---------- helpers ---------- */

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Split a space- or comma-separated attribute into a list.
function attrList(el, name) {
  return (el.getAttribute(name) || "").split(/[\s,]+/).filter(Boolean);
}

// Elements that read their own children must wait until the page is parsed,
// because this script runs in <head> before the body exists.
function whenParsed(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

/* ---------- shared page chrome ---------- */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const items = NAV_LINKS.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("\n            ");
    this.innerHTML = `
    <header>
      <div class="wrapper">
        <nav>
          <h2>nav</h2>
          <ul>
            ${items}
          </ul>
        </nav>
        <a href="#"><i class="fa fa-bars" aria-hidden="true"></i></a>
      </div>

      <div class="navbar">
        <div class="container nav-container">
          <input class="checkbox" type="checkbox" name="" id="" />
          <div class="hamburger-lines">
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
          </div>
          <div class="logo"></div>
          <div class="menu-items">
            ${items}
          </div>
        </div>
      </div>
    </header>`;
  }
}

class PhotoStrip extends HTMLElement {
  connectedCallback() {
    const items = (srcs) => srcs.map((s) => `<li><img src="${s}"></li>`).join("");
    this.innerHTML = `
    <section id="imgs"><ul>${items(BANNER_PHOTOS)}</ul></section>
    <section id="imgsphone"><ul>${items(BANNER_PHOTOS.slice(0, 2))}</ul></section>
    <section id="imgsphone"><ul>${items(BANNER_PHOTOS.slice(2))}</ul></section>`;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer>
      <div class="wrap">
        <ul>
          <li><h3>Why Us?</h3></li>
          <li>Summer is a great time to get back into competition math preparation! We believe that our teaching and resources will not only help prepare students, but also inspire them to take on their own initiatives.</li>
        </ul>
        <ul>
          <li><h3>Contact Us</h3></li>
          <li><p><a href="mailto:${CONTACT_EMAIL}">Email: ${CONTACT_EMAIL}</a></p></li>
        </ul>
      </div>
    </footer>

    <section id="copyright">
      <div class="wrap">
        <p>&copy; Copyright 2024. All rights reserved. <br> Website by Angie Huang. Background art by Sophia Soo.</p>
      </div>
    </section>`;
  }
}

/* ---------- content blocks ---------- */

// <photo-slideshow base="images/competition/2026" images="a.png b.png ...">
class PhotoSlideshow extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute("base");
    const images = attrList(this, "images").map((f) => (base ? `${base}/${f}` : f));
    if (!images.length) return;

    this.innerHTML = `
    <div class="slideshow-container">
      ${images.map((src) => `<div class="mySlides fade"><img src="${esc(src)}" style="width:100%"></div>`).join("\n      ")}
      <a class="prev">&#10094;</a>
      <a class="next">&#10095;</a>
    </div>
    <br>
    <div style="text-align:center">${images.map(() => '<span class="dot"></span>').join("")}</div>`;

    const slides = this.querySelectorAll(".mySlides");
    const dots = this.querySelectorAll(".dot");
    let index = 0;
    const show = (n) => {
      index = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.style.display = i === index ? "block" : "none"; });
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    };
    this.querySelector(".prev").addEventListener("click", () => show(index - 1));
    this.querySelector(".next").addEventListener("click", () => show(index + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
    show(0);
  }
}

// <round-links base="docs/competition/2026" rounds="General Mastery Team">
// Each round expands to base/<round>/problems.pdf and base/<round>/solutions.pdf.
// Any <div class="comp-link-group"> written inside the tag is kept as an extra group.
class RoundLinks extends HTMLElement {
  connectedCallback() {
    whenParsed(() => {
      const base = this.getAttribute("base") || "";
      const extra = this.innerHTML.trim();
      const groups = attrList(this, "rounds").map((round) => {
        const dir = `${base}/${round.toLowerCase()}`;
        return `
        <div class="comp-link-group">
          <h3>${esc(round)}</h3>
          <ul>
            <li><a href="${dir}/problems.pdf">Problems</a></li>
            <li><a href="${dir}/solutions.pdf">Solutions</a></li>
          </ul>
        </div>`;
      });
      this.innerHTML = `<div class="comp-links">${groups.join("")}
        ${extra}
      </div>`;
    });
  }
}

// <org-list> of <org-card href="..." img="..." name="..." size="80%" mobile-size="40%">description</org-card>
// Renders the two-column desktop layout (.peoplee) and the stacked mobile layout (.persons).
class OrgList extends HTMLElement {
  connectedCallback() {
    whenParsed(() => {
      const cards = [...this.querySelectorAll("org-card")].map((c) => ({
        href: c.getAttribute("href") || "#",
        img: c.getAttribute("img") || "",
        name: c.getAttribute("name") || "",
        size: c.getAttribute("size"),
        mobileSize: c.getAttribute("mobile-size"),
        body: c.innerHTML.trim(),
      }));

      const logo = (c, size) =>
        `<a href="${esc(c.href)}"><img src="${esc(c.img)}"${size ? ` style="width:${esc(size)}; height:${esc(size)}"` : ""}></a>`;
      const title = (c) => `<p style="padding-top:30px;font-weight:bold; font-size:20px">${esc(c.name)}</p>`;

      let html = "";
      for (let i = 0; i < cards.length; i += 2) {
        const pair = cards.slice(i, i + 2).map((c) => `
          <li>${logo(c, c.size)}
            ${title(c)}
            <p style="width:100%">${c.body}</p>
          </li>`).join("");
        html += `
      <section class="peoplee">
        <ul>${pair}
        </ul>
      </section>`;
      }
      html += cards.map((c) => `
      <section class="persons">
        ${logo(c, c.mobileSize)}
        ${title(c)}
        <p>${c.body}</p>
      </section>`).join("");
      this.innerHTML = html;
    });
  }
}

// <staff-card name="..." role="..." img="...">bio text</staff-card>
// Clicking the photo opens a shared modal with the bio.
class StaffCard extends HTMLElement {
  connectedCallback() {
    whenParsed(() => {
      const name = this.getAttribute("name") || "";
      const role = this.getAttribute("role") || "";
      const img = this.getAttribute("img") || "";
      const bio = this.textContent.trim().replace(/\s+/g, " ");
      this.innerHTML = `
      <div class="staff-card">
        <button class="staff-photo"><img src="${esc(img)}" alt="${esc(name)}"></button>
        <div class="staff-info">
          <h3>${esc(name)}</h3>
          <p class="role">${esc(role)}</p>
        </div>
      </div>`;
      this.querySelector(".staff-photo").addEventListener("click", () => StaffCard.openModal(name, role, bio));
    });
  }

  static modal() {
    let modal = document.getElementById("staff-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "staff-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="closebtn">&times;</span>
        <h3 id="modal-name"></h3>
        <p id="modal-role"></p>
        <p id="modal-bio"></p>
      </div>`;
    document.body.appendChild(modal);
    const close = () => { modal.style.display = "none"; };
    modal.querySelector(".closebtn").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    return modal;
  }

  static openModal(name, role, bio) {
    const modal = StaffCard.modal();
    modal.querySelector("#modal-name").textContent = name;
    modal.querySelector("#modal-role").textContent = role;
    modal.querySelector("#modal-bio").textContent = bio;
    modal.style.display = "block";
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("photo-strip", PhotoStrip);
customElements.define("site-footer", SiteFooter);
customElements.define("photo-slideshow", PhotoSlideshow);
customElements.define("round-links", RoundLinks);
customElements.define("org-list", OrgList);
customElements.define("staff-card", StaffCard);
