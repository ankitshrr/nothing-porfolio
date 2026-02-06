// script.js
const themeBtn = document.getElementById("themeBtn");
const html = document.documentElement;

// Footer stamps
document.getElementById("yearNow").textContent = new Date().getFullYear();
document.getElementById("buildStamp").textContent = new Date().toISOString().slice(0, 10);

// Nav expand
const brandBtn = document.getElementById("brandBtn");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");

// NAV_ONLY GLYPH EFFECT
function triggerNavGlyphs() {
  const segments = mainNav.querySelectorAll(".ng-segment");
  segments.forEach((seg) => {
    seg.classList.remove("active");
    void seg.offsetWidth;
    const randomDelay = Math.floor(Math.random() * 150);
    setTimeout(() => seg.classList.add("active"), randomDelay);
  });
}
window.triggerNavGlyphs = triggerNavGlyphs;

// Theme toggle
themeBtn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);

  themeBtn.innerHTML =
    newTheme === "dark"
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  triggerNavGlyphs();
});

// Mini glyph trigger
function triggerGlyph(element) {
  const glyphs = element.querySelectorAll(".p-glyph");
  glyphs.forEach((glyph, i) => {
    glyph.classList.remove("triggered");
    void glyph.offsetWidth;
    setTimeout(() => glyph.classList.add("triggered"), i * 50);
    setTimeout(() => glyph.classList.remove("triggered"), 700);
  });
}
window.triggerGlyph = triggerGlyph;

// Hero glyph
function runGlyphSequence() {
  const segments = document.querySelectorAll(".glyph-segment");
  segments.forEach((seg, i) => {
    const delay = i === 0 ? 0 : i * 120 + Math.random() * 100;
    setTimeout(() => {
      seg.classList.add("active");
      setTimeout(() => seg.classList.remove("active"), 150);
      if (seg.classList.contains("gs-arc") || seg.classList.contains("gs-bottom-bar")) {
        setTimeout(() => {
          seg.classList.add("active");
          setTimeout(() => seg.classList.remove("active"), 100);
        }, 250);
      }
    }, delay);
  });
  setTimeout(() => segments.forEach((seg) => seg.classList.add("idle")), 1200);
}

function heroGlyphBurst() {
  const segments = document.querySelectorAll(".glyph-segment");
  segments.forEach((seg) => seg.classList.remove("idle", "active"));
  void document.getElementById("glyphSystem").offsetWidth;
  runGlyphSequence();
}

let heroAutoTimer = null;
function startHeroAutoplay() {
  if (heroAutoTimer) clearInterval(heroAutoTimer);
  heroAutoTimer = setInterval(() => {
    const home = document.getElementById("home");
    if (!home) return;
    const rect = home.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.2) heroGlyphBurst();
  }, 2300);
}

brandBtn.addEventListener("click", () => heroGlyphBurst());

navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("expanded");
  const expanded = mainNav.classList.contains("expanded");
  navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
});

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    mainNav.classList.remove("expanded");
    navToggle.setAttribute("aria-expanded", "false");
    triggerNavGlyphs();
  }),
);

document.addEventListener("click", (e) => {
  if (!mainNav.contains(e.target)) {
    mainNav.classList.remove("expanded");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

mainNav.addEventListener("click", (e) => {
  if (e.target.closest("a") || e.target.closest("button")) return;
  triggerNavGlyphs();
});

// Active link on scroll
const sectionEls = Array.from(document.querySelectorAll("section.widget"));
function setActiveByScroll() {
  const y = window.scrollY + 140;
  let currentId = sectionEls[0]?.id || "home";
  for (const s of sectionEls) {
    if (s.offsetTop <= y) currentId = s.id;
  }
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`);
  });
}
window.addEventListener("scroll", setActiveByScroll, { passive: true });

// Playground logic
const board = document.getElementById("playBoard");
const boardLabel = document.getElementById("boardLabel");
const boardSegs = Array.from(board.querySelectorAll(".play-seg"));
const modeLabel = document.getElementById("modeLabel");
const speedLabel = document.getElementById("speedLabel");
const autoToggle = document.getElementById("autoToggle");

let playTimer = null;
let speedMs = 160;
let mode = "SWEEP";
let autoMode = true;

function setMode(m) {
  mode = m;
  modeLabel.textContent = m;
}
function setSpeed(s) {
  if (s === "slow") {
    speedMs = 260;
    speedLabel.textContent = "SLOW";
  }
  if (s === "med") {
    speedMs = 160;
    speedLabel.textContent = "MED";
  }
  if (s === "fast") {
    speedMs = 90;
    speedLabel.textContent = "FAST";
  }
  if (autoMode) startPlayAuto();
}

function allOff() {
  boardSegs.forEach((seg) => seg.classList.remove("on"));
}
function light(indexes) {
  allOff();
  indexes.forEach((i) => boardSegs[i]?.classList.add("on"));
}
function stopPlay() {
  if (playTimer) clearInterval(playTimer);
  playTimer = null;
  allOff();
}

function runSweep() {
  stopPlay();
  let i = 0;
  playTimer = setInterval(() => {
    light([i, (i + 3) % boardSegs.length]);
    i = (i + 1) % boardSegs.length;
  }, speedMs);
}
function runPulse() {
  stopPlay();
  let on = false;
  playTimer = setInterval(() => {
    on = !on;
    if (on) boardSegs.forEach((seg) => seg.classList.add("on"));
    else allOff();
  }, Math.max(120, speedMs * 1.35));
}
function runChaos() {
  stopPlay();
  playTimer = setInterval(() => {
    const picks = new Set();
    while (picks.size < 3) picks.add(Math.floor(Math.random() * boardSegs.length));
    light([...picks]);
  }, speedMs);
}
function runHeartbeat() {
  stopPlay();
  const beat = () => {
    light([0, 2, 4, 7, 8]);
    setTimeout(() => light([1, 3, 5, 6, 8]), 120);
    setTimeout(() => allOff(), 240);
  };
  beat();
  playTimer = setInterval(beat, Math.max(800, speedMs * 6));
}
function runStairs() {
  stopPlay();
  const steps = [[0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8]];
  let i = 0;
  playTimer = setInterval(() => {
    light(steps[i]);
    i = (i + 1) % steps.length;
  }, Math.max(90, speedMs));
}

function runCurrentPattern() {
  if (mode === "SWEEP") runSweep();
  if (mode === "PULSE") runPulse();
  if (mode === "CHAOS") runChaos();
  if (mode === "HEARTBEAT") runHeartbeat();
  if (mode === "STAIRS") runStairs();
}

function startPlayAuto() {
  autoMode = true;
  autoToggle.classList.add("on");
  autoToggle.setAttribute("aria-checked", "true");
  boardLabel.textContent = "AUTO_RUNNING";
  runCurrentPattern();
}
function setPlayManual() {
  autoMode = false;
  autoToggle.classList.remove("on");
  autoToggle.setAttribute("aria-checked", "false");
  boardLabel.textContent = "CLICK_TO_TRIGGER";
  stopPlay();
}
function toggleAuto() {
  if (autoMode) setPlayManual();
  else startPlayAuto();
}

autoToggle.addEventListener("click", toggleAuto);
autoToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleAuto();
  }
});

document.getElementById("btnStopPlay").addEventListener("click", () => {
  stopPlay();
  boardLabel.textContent = autoMode ? "AUTO_RUNNING" : "CLICK_TO_TRIGGER";
});

function setActiveButton(activeId) {
  ["btnSweep", "btnPulse", "btnChaos", "btnBeat", "btnStairs"].forEach((id) => {
    const b = document.getElementById(id);
    if (!b) return;
    if (id === activeId) b.classList.remove("btn-ghost");
    else b.classList.add("btn-ghost");
  });
}

document.getElementById("btnSweep").addEventListener("click", () => {
  setMode("SWEEP");
  setActiveButton("btnSweep");
  if (autoMode) startPlayAuto();
});
document.getElementById("btnPulse").addEventListener("click", () => {
  setMode("PULSE");
  setActiveButton("btnPulse");
  if (autoMode) startPlayAuto();
});
document.getElementById("btnChaos").addEventListener("click", () => {
  setMode("CHAOS");
  setActiveButton("btnChaos");
  if (autoMode) startPlayAuto();
});
document.getElementById("btnBeat").addEventListener("click", () => {
  setMode("HEARTBEAT");
  setActiveButton("btnBeat");
  if (autoMode) startPlayAuto();
});
document.getElementById("btnStairs").addEventListener("click", () => {
  setMode("STAIRS");
  setActiveButton("btnStairs");
  if (autoMode) startPlayAuto();
});

document.querySelectorAll("[data-speed]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setSpeed(btn.getAttribute("data-speed"));
    document.querySelectorAll("[data-speed]").forEach((b) => b.classList.add("btn-ghost"));
    btn.classList.remove("btn-ghost");
  });
});

board.addEventListener("click", () => {
  if (!autoMode) {
    runCurrentPattern();
    setTimeout(stopPlay, 1800);
  }
  heroGlyphBurst();
});

// Copy email
const copyBtn = document.getElementById("copyEmailBtn");
const copyToast = document.getElementById("copyToast");
copyBtn.addEventListener("click", () => {
  const email = "ankitprogressx@gmail.com";
  const t = document.createElement("textarea");
  t.value = email;
  t.style.position = "fixed";
  t.style.left = "-9999px";
  document.body.appendChild(t);
  t.focus();
  t.select();
  document.execCommand("copy");
  document.body.removeChild(t);

  copyToast.style.opacity = "1";
  copyToast.style.transform = "translateY(0)";
  setTimeout(() => {
    copyToast.style.opacity = "0";
    copyToast.style.transform = "translateY(4px)";
  }, 900);
});

// =========================
// GITHUB TRACKER
// =========================
const GH_USERNAME = "ankitshrr";
const ghUserEl = document.getElementById("ghUser");
const ghRepoCountEl = document.getElementById("ghRepoCount");
const ghFollowersEl = document.getElementById("ghFollowers");
const ghStatusEl = document.getElementById("ghStatus");
const ghReposEl = document.getElementById("ghRepos");

const GH_CACHE_KEY = `gh_repos_cache_${GH_USERNAME}_v1`;
const GH_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

const LANG_CACHE_KEY = "gh_lang_cache_v4";
const LANG_CACHE_TTL_MS = 60 * 60 * 1000;

function fmtDate(iso) {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch (e) {
    return "--";
  }
}

function safeText(s) {
  return (s ?? "")
    .toString()
    .replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]);
}

function ogRepoImage(owner, repo) {
  const buster = Date.now().toString(36);
  return `https://opengraph.githubassets.com/1/${buster}/${owner}/${repo}`;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function loadRepoCache() {
  const obj = loadJSON(GH_CACHE_KEY, { ts: 0, user: null, repos: [] });
  const fresh = Date.now() - (obj.ts || 0) < GH_CACHE_TTL_MS;
  return { fresh, ...obj };
}
function saveRepoCache(user, repos) {
  saveJSON(GH_CACHE_KEY, { ts: Date.now(), user, repos });
}

function loadLangCache() {
  try {
    const raw = localStorage.getItem(LANG_CACHE_KEY);
    if (!raw) return { ts: 0, data: {} };
    const parsed = JSON.parse(raw);
    return { ts: parsed.ts || 0, data: parsed.data || {} };
  } catch (e) {
    return { ts: 0, data: {} };
  }
}

function saveLangCache(cache) {
  try {
    localStorage.setItem(LANG_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

async function fetchRepoLanguages(owner, repo) {
  const key = `${owner}/${repo}`;
  const cache = loadLangCache();
  const fresh = Date.now() - (cache.ts || 0) < LANG_CACHE_TTL_MS;

  if (fresh && cache.data && Array.isArray(cache.data[key])) return cache.data[key];

  const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const obj = await res.json();
  const items = Object.entries(obj || {});
  items.sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const langs = items.map(([name]) => name).slice(0, 3);

  const next = loadLangCache();
  next.ts = Date.now();
  next.data = next.data || {};
  next.data[key] = langs;
  saveLangCache(next);

  return langs;
}

function normalizeLangForDevicon(lang) {
  const L = (lang || "").trim();
  const map = {
    HTML: "html5",
    CSS: "css3",
    JavaScript: "javascript",
    TypeScript: "typescript",
    Python: "python",
    Java: "java",
    C: "c",
    "C++": "cplusplus",
    "C#": "csharp",
    Go: "go",
    PHP: "php",
    Rust: "rust",
    Ruby: "ruby",
    Kotlin: "kotlin",
    Swift: "swift",
    Dart: "dart",
    Scala: "scala",
    R: "r",
    Shell: "bash",
    PowerShell: "powershell",
    "Jupyter Notebook": "jupyter",
    Vue: "vuejs",
    "Vue.js": "vuejs",
    Svelte: "svelte",
    Dockerfile: "docker",
  };
  if (map[L]) return map[L];
  return L.toLowerCase().replace(/\./g, "").replace(/\s+/g, "").replace(/#/g, "sharp").replace(/\+/g, "plus");
}

function deviconUrl(lang) {
  const key = normalizeLangForDevicon(lang);
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
}

function renderLangChips(langs, fallbackPrimary) {
  const list = Array.isArray(langs) ? langs.filter(Boolean) : [];
  const primary = (fallbackPrimary || "").trim();

  let final = list.length ? list.slice(0, 3) : primary ? [primary] : [];
  if (primary && !final.some((x) => x.toLowerCase() === primary.toLowerCase()) && final.length < 3) {
    final.push(primary);
  }
  if (!final.length) return `<span class="chip">LANG: <b>—</b></span>`;

  const fallbackSvg =
    "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' width='16' height='16'>" +
    "<path d='M8 9l-3 3 3 3'/><path d='M16 9l3 3-3 3'/><path d='M14 7l-4 10'/>" +
    "</svg>";

  const items = final
    .map((lang, idx) => {
      const safe = safeText(lang);
      const url = deviconUrl(lang);

      const itemHTML = `
        <span class="lang-item" title="Language: ${safe}">
          <span class="lang-ico">
            <img src="${url}" alt="${safe}"
              onerror="this.remove(); this.parentElement.insertAdjacentHTML('beforeend','${fallbackSvg.replace(/'/g, "&#39;")}');" />
          </span>
          <span class="lang-text"><b>${safe}</b></span>
        </span>
      `;

      if (idx === final.length - 1) return itemHTML;
      return itemHTML + `<span class="lang-sep" aria-hidden="true"></span>`;
    })
    .join("");

  return `<span class="lang-strip">${items}</span>`;
}

function repoCard(repo, langs) {
  const name = safeText(repo.name);
  const desc = safeText(repo.description || "");
  const stars = repo.stargazers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  const updated = fmtDate(repo.updated_at);
  const url = repo.html_url;

  const img = ogRepoImage(GH_USERNAME, repo.name);
  const langHTML = renderLangChips(langs, repo.language);

  return `
    <div class="work-card-inner" onclick="triggerGlyph(this)">
      <span class="label">REPO</span>

      <div class="project-img-container">
        <div class="p-glyph pg-arc"></div><div class="p-glyph pg-bar"></div><div class="p-glyph pg-dot"></div>
        <img src="${img}" alt="${name}" loading="lazy" />
      </div>

      <h3 style="word-break:break-word">${name}</h3>
      ${desc ? `<p class="card-desc">${desc}</p>` : ``}

      <div class="lang-row">
        ${langHTML}
        <span class="chip">UPDATED: <b>${updated}</b></span>
        <span class="chip">★ <b>${stars}</b></span>
        <span class="chip">FORKS: <b>${forks}</b></span>
      </div>

      <div class="card-actions">
        <a href="${url}" target="_blank" rel="noopener" class="btn-system btn-ghost btn-tiny">Open Repo</a>
        <a href="https://github.com/${GH_USERNAME}" target="_blank" rel="noopener" class="btn-system btn-ghost btn-tiny">Profile</a>
      </div>
    </div>
  `;
}

async function fetchGitHubLive() {
  const userUrl = `https://api.github.com/users/${GH_USERNAME}`;
  const reposUrl = `https://api.github.com/users/${GH_USERNAME}/repos?sort=updated&per_page=9`;
  const [userRes, reposRes] = await Promise.all([fetch(userUrl), fetch(reposUrl)]);
  if (!userRes.ok || !reposRes.ok) {
    const rateLimited = userRes.status === 403 || reposRes.status === 403;
    throw new Error(rateLimited ? "RATE_LIMIT" : "ERROR");
  }
  const user = await userRes.json();
  const repos = await reposRes.json();
  return { user, repos };
}

function renderGitHub(user, repos) {
  ghUserEl.textContent = `@${GH_USERNAME}`;
  ghRepoCountEl.textContent = user?.public_repos ?? "--";
  ghFollowersEl.textContent = user?.followers ?? "--";
  ghStatusEl.textContent = "LIVE";

  const visible = (Array.isArray(repos) ? repos : []).filter((r) => !r.fork).slice(0, 9);

  if (!visible.length) {
    ghReposEl.innerHTML = `
      <div class="work-card-inner" style="cursor:default">
        <span class="label">EMPTY</span>
        <h3>No repos found</h3>
        <p class="card-desc">Create a repo and push something. This section will auto-fill.</p>
        <div class="card-actions">
          <a href="https://github.com/new" target="_blank" rel="noopener" class="btn-system btn-ghost btn-tiny">Create Repo</a>
        </div>
      </div>
    `;
    return;
  }

  // Render fast first (no langs)
  ghReposEl.innerHTML = visible.map((r) => repoCard(r, [])).join("");

  // Then enhance with langs
  Promise.allSettled(visible.map((r) => fetchRepoLanguages(GH_USERNAME, r.name))).then((langResults) => {
    ghReposEl.innerHTML = visible
      .map((r, idx) => {
        const langs = langResults[idx] && langResults[idx].status === "fulfilled" ? langResults[idx].value : [];
        return repoCard(r, langs);
      })
      .join("");
  });
}

async function loadGitHub() {
  ghUserEl.textContent = `@${GH_USERNAME}`;

  // 1) Try cache first
  const cache = loadRepoCache();
  if (cache.user && Array.isArray(cache.repos) && cache.repos.length) {
    ghStatusEl.textContent = cache.fresh ? "CACHED" : "STALE";
    renderGitHub(cache.user, cache.repos);
  } else {
    ghStatusEl.textContent = "LOADING";
  }

  // 2) Refresh live
  try {
    const { user, repos } = await fetchGitHubLive();
    saveRepoCache(user, repos);
    renderGitHub(user, repos);
  } catch (err) {
    const msg = (err && err.message) || "ERROR";
    const rateLimited = msg === "RATE_LIMIT";
    ghStatusEl.textContent = rateLimited ? "RATE_LIMIT" : "ERROR";

    const cache2 = loadRepoCache();
    const hasCache = cache2.user && Array.isArray(cache2.repos) && cache2.repos.length;
    if (!hasCache) {
      ghRepoCountEl.textContent = "--";
      ghFollowersEl.textContent = "--";
      ghReposEl.innerHTML = `
        <div class="work-card-inner" style="cursor:default">
          <span class="label">STATUS</span>
          <h3>GitHub data unavailable</h3>
          <p class="card-desc">${rateLimited ? "GitHub API rate limit hit. Refresh later." : "Could not fetch GitHub right now."}</p>
          <div class="card-actions">
            <a href="https://github.com/${GH_USERNAME}" target="_blank" rel="noopener" class="btn-system btn-ghost btn-tiny">Open GitHub</a>
          </div>
        </div>
      `;
    }
  }
}

// Typewriter
function initTypewriter() {
  const target = document.getElementById("status-text");
  const phrases = [
    "Okay",
  "Here",
  "Now",
  "Fine",
  "Ready",
  ];

  let i = 0;
  let j = 0;
  let isDeleting = false;
  let speed = 80;

  function cycle() {
    const fullText = phrases[i];

    if (isDeleting) {
      target.textContent = fullText.substring(0, j - 1);
      j--;
      speed = 40;
    } else {
      target.textContent = fullText.substring(0, j + 1);
      j++;
      speed = 80;
    }

    if (!isDeleting && j === fullText.length) {
      isDeleting = true;
      speed = 2000;
    } else if (isDeleting && j === 0) {
      isDeleting = false;
      i = (i + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(cycle, speed);
  }

  cycle();
}

window.addEventListener("load", () => {
  runGlyphSequence();
  startHeroAutoplay();

  setSpeed("med");
  setMode("SWEEP");
  setActiveButton("btnSweep");

  startPlayAuto();
  setActiveByScroll();
  setTimeout(triggerNavGlyphs, 500);

  loadGitHub();
  initTypewriter();

  setInterval(loadGitHub, 10 * 60 * 1000);
});
