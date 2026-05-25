const CATEGORIES = [
  { id: "all", label: "All", zh: "全部", count: 850 },
  { id: "op", label: "Operations", zh: "操作词 · 动词、介词、代词、连词等", count: 100 },
  { id: "gt", label: "General Things", zh: "一般事物 · 抽象名词", count: 400 },
  { id: "pt", label: "Picturable Things", zh: "可画名词 · 具体可视的事物", count: 200 },
  { id: "qg", label: "Qualities — General", zh: "一般性质 · 形容词", count: 100 },
  { id: "qo", label: "Qualities — Opposites", zh: "对立性质 · 反义形容词", count: 50 }
];

const TAGS = { op: "OP", gt: "GT", pt: "PT", qg: "QG", qo: "OPP" };
const SPEAKER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';

const state = {
  words: [],
  cat: "all",
  q: "",
  audioSource: "youdao-uk",
  chosenVoice: null,
  currentAudio: null,
  currentBtn: null,
  learned: new Set(JSON.parse(localStorage.getItem("ogden-learned") || "[]"))
};

const els = {
  q: document.getElementById("q"),
  pills: document.getElementById("pills"),
  sections: document.getElementById("sections"),
  status: document.getElementById("status"),
  empty: document.getElementById("empty")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPills() {
  els.pills.innerHTML = CATEGORIES.map((cat) => `
    <button class="pill ${state.cat === cat.id ? "active" : ""}" type="button" data-cat="${cat.id}">
      ${cat.label} <span class="count">${cat.count}</span>
    </button>
  `).join("");
}

function matches(word) {
  const inCat = state.cat === "all" || word.c === state.cat;
  if (!inCat) return false;
  if (!state.q) return true;
  const haystack = [
    word.w,
    word.zh,
    word.en,
    word.ex,
    word.exz,
    ...(word.s || [])
  ].join(" ").toLowerCase();
  return haystack.includes(state.q);
}

function visibleWords() {
  return state.words.filter(matches);
}

function renderSections() {
  renderPills();
  const words = visibleWords();
  const grouped = Object.fromEntries(CATEGORIES.filter((cat) => cat.id !== "all").map((cat) => [cat.id, []]));
  for (const word of words) {
    if (grouped[word.c]) grouped[word.c].push(word);
  }

  els.status.hidden = true;
  els.empty.classList.toggle("show", words.length === 0);
  els.sections.innerHTML = CATEGORIES
    .filter((cat) => cat.id !== "all" && grouped[cat.id]?.length)
    .map((cat) => renderSection(cat, grouped[cat.id]))
    .join("");
}

function renderSection(cat, words) {
  return `
    <section class="section" id="sec-${cat.id}" data-cat="${cat.id}">
      <div class="section-header">
        <h2>${cat.label}</h2>
        <span class="zh">${cat.zh}</span>
        <span class="count">${words.length} WORDS</span>
      </div>
      <div class="grid">
        ${words.map(renderCard).join("")}
      </div>
    </section>
  `;
}

function renderCard(word) {
  const syns = (word.s || []).map((syn) => `
    <button class="syn" type="button" data-syn="${escapeHtml(syn)}" data-main="${escapeHtml(word.w)}">${escapeHtml(syn)}</button>
  `).join("");
  return `
    <article class="card ${state.learned.has(word.w) ? "learned" : ""}" data-cat="${word.c}" data-w="${escapeHtml(word.w)}">
      <div class="card-head">
        <div class="word-row">
          <div class="word">${escapeHtml(word.w)}</div>
          <button class="speak" type="button" data-text="${escapeHtml(word.w)}" data-rate="0.85" aria-label="读单词">${SPEAKER_SVG}</button>
        </div>
        <span class="tag">${TAGS[word.c] || word.c}</span>
      </div>
      <div class="def-zh">${escapeHtml(word.zh)}</div>
      <div class="def-en">${escapeHtml(word.en)}</div>
      <div class="example">
        <button class="speak" type="button" data-text="${escapeHtml(word.ex)}" data-rate="1" aria-label="读例句">${SPEAKER_SVG}</button>
        <div class="en">${escapeHtml(word.ex)}</div>
        <div class="zh">${escapeHtml(word.exz)}</div>
      </div>
      <div class="syns">${syns}</div>
      <div class="syn-panel" hidden></div>
    </article>
  `;
}

async function loadWords() {
  const response = await fetch("/api/words?limit=1000", { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`API ${response.status}`);
  const payload = await response.json();
  state.words = payload.words || [];
  renderSections();
}

async function loadProgress() {
  const response = await fetch("/api/progress", { headers: { accept: "application/json" } });
  if (!response.ok) return;
  const payload = await response.json();
  if (Array.isArray(payload.learned)) {
    state.learned = new Set(payload.learned);
    localStorage.setItem("ogden-learned", JSON.stringify([...state.learned]));
  }
}

async function saveProgress() {
  const learned = [...state.learned];
  localStorage.setItem("ogden-learned", JSON.stringify(learned));
  await fetch("/api/progress", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ learned })
  }).catch(() => {});
}

function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferred = ["Ava (Premium)", "Ava (Enhanced)", "Ava", "Samantha", "Allison", "Karen", "Daniel (Enhanced)", "Daniel", "Alex", "Google US English"];
  for (const name of preferred) {
    const voice = voices.find((item) => item.name === name);
    if (voice) return voice;
  }
  return voices.find((voice) => voice.lang?.startsWith("en-US")) ||
    voices.find((voice) => voice.lang?.startsWith("en")) ||
    voices[0];
}

function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio = null;
  }
  if (state.currentBtn) {
    state.currentBtn.classList.remove("playing");
    state.currentBtn = null;
  }
}

function speak(text, rate, btn) {
  stopSpeaking();
  if (btn) {
    btn.classList.add("playing");
    state.currentBtn = btn;
  }
  const clear = () => {
    if (btn) btn.classList.remove("playing");
    if (state.currentBtn === btn) state.currentBtn = null;
  };
  const isSentence = text.trim().includes(" ");
  if (!isSentence && (state.audioSource === "youdao-uk" || state.audioSource === "youdao-us")) {
    const type = state.audioSource === "youdao-us" ? 2 : 1;
    state.currentAudio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${type}`);
    state.currentAudio.onended = clear;
    state.currentAudio.onerror = () => speakLocal(text, rate, btn, clear);
    state.currentAudio.play().catch(() => speakLocal(text, rate, btn, clear));
    return;
  }
  speakLocal(text, rate, btn, clear);
}

function speakLocal(text, rate, btn, clear) {
  if (!("speechSynthesis" in window)) {
    clear();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate || 1;
  if (state.chosenVoice) utterance.voice = state.chosenVoice;
  utterance.onend = clear;
  utterance.onerror = clear;
  speechSynthesis.speak(utterance);
}

function renderSynPanel(syn, main) {
  return `
    <div class="syn-panel-head">
      <span class="sp-word">${escapeHtml(syn)}</span>
      <span class="sp-vs">related to ${escapeHtml(main)}</span>
    </div>
    <div class="sp-row"><span class="sp-label">提示</span><span class="sp-val">点击词条可发音；D1 中可继续补充更细的同义词辨析。</span></div>
  `;
}

els.q.addEventListener("input", (event) => {
  state.q = event.target.value.trim().toLowerCase();
  renderSections();
});

document.addEventListener("click", (event) => {
  const pill = event.target.closest(".pill");
  if (pill) {
    state.cat = pill.dataset.cat;
    renderSections();
    return;
  }

  const toggle = event.target.closest("#audio-toggle button");
  if (toggle) {
    document.querySelectorAll("#audio-toggle button").forEach((button) => button.classList.remove("active"));
    toggle.classList.add("active");
    state.audioSource = toggle.dataset.src;
    stopSpeaking();
    return;
  }

  const speakButton = event.target.closest(".speak");
  if (speakButton) {
    event.stopPropagation();
    if (speakButton.classList.contains("playing")) {
      stopSpeaking();
      return;
    }
    speak(speakButton.dataset.text, parseFloat(speakButton.dataset.rate) || 1, speakButton);
    return;
  }

  const synButton = event.target.closest(".syn");
  if (synButton) {
    const card = synButton.closest(".card");
    const panel = card.querySelector(".syn-panel");
    const wasActive = synButton.classList.contains("active");
    card.querySelectorAll(".syn.active").forEach((button) => button.classList.remove("active"));
    if (wasActive) {
      panel.hidden = true;
      panel.innerHTML = "";
    } else {
      synButton.classList.add("active");
      panel.hidden = false;
      panel.innerHTML = renderSynPanel(synButton.dataset.syn, synButton.dataset.main);
      speak(synButton.dataset.syn, 0.85, null);
    }
  }
});

document.addEventListener("dblclick", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  const word = card.dataset.w;
  if (state.learned.has(word)) {
    state.learned.delete(word);
  } else {
    state.learned.add(word);
  }
  saveProgress();
  renderSections();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement.tagName !== "INPUT") {
    event.preventDefault();
    els.q.focus();
  }
  if (event.key === "Escape") {
    els.q.value = "";
    state.q = "";
    renderSections();
    els.q.blur();
  }
});

if ("speechSynthesis" in window) {
  state.chosenVoice = pickVoice();
  speechSynthesis.onvoiceschanged = () => {
    state.chosenVoice = pickVoice();
  };
}

renderPills();
Promise.all([loadWords(), loadProgress()]).then(renderSections).catch((error) => {
  els.status.textContent = `加载失败：${error.message}`;
});
