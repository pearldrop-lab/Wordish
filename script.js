/* Wordish Unlimited Ñ script.js (patched)
   - Cache-busts words.txt fetch (fresh load each time)
   - Shows the solution in the Stats dialog when you lose
*/
(() => {
  const q = (sel, el=document) => el.querySelector(sel);
  const qa = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const ls = (k,v) => v===undefined ? JSON.parse(localStorage.getItem(k)||"null") : localStorage.setItem(k, JSON.stringify(v));
  const randItem = arr => arr[Math.floor(Math.random()*arr.length)];

  const settings = Object.assign({
    guessLimit: 6,
    hardMode: false,
    allowAnyGuess: false,
    wordSource: "built-in",
    dark: matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? false : true,
  }, ls('wordish:settings') || {});

  const stats = Object.assign({
    played: 0, wins: 0, streak: 0, best: 0, lastWin: null
  }, ls('wordish:stats') || {});

  // Small built-in backup list
  const BUILTIN_WORDS = [
    "about","other","which","there","their","would","could","after","first","those",
    "again","every","think","three","small","place","great","right","still","world",
    "house","under","never","water","point","woman","young","story","money","maybe"
  ];

  let words = [...BUILTIN_WORDS];
  let solution = "";
  let row = 0, col = 0;
  let grid = [];
  let locks = [];

  const els = {
    board: q('#board'),
    newGameBtn: q('#newGameBtn'),
    settingsBtn: q('#settingsBtn'),
    statsBtn: q('#statsBtn'),
    helpBtn: q('#helpBtn'),
    settingsDlg: q('#settingsDialog'),
    statsDlg: q('#statsDialog'),
    helpDlg: q('#helpDialog'),
    guessLimit: q('#guessLimit'),
    hardMode: q('#hardMode'),
    allowAnyGuess: q('#allowAnyGuess'),
    wordSource: q('#wordSource'),
    shareBtn: q('#shareBtn'),
    darkToggle: q('#darkToggle'),
    sGames: q('#sGames'),
    sWins: q('#sWins'),
    sStreak: q('#sStreak'),
    sBest: q('#sBest'),
    kbRows: qa('.kb-row'),
    toast: q('#toast')
  };

  function showToast(msg, ms=1800) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    setTimeout(() => els.toast.classList.remove('show'), ms);
  }
  const saveSettings = () => ls('wordish:settings', settings);
  const saveStats = () => ls('wordish:stats', stats);

  function makeBoard() {
    els.board.innerHTML = "";
    grid = Array.from({length: settings.guessLimit}, () => Array(5).fill(""));
    locks = Array.from({length: settings.guessLimit}, () => Array(5).fill(""));
    els.board.style.gridTemplateRows = `repeat(${settings.guessLimit}, 56px)`;
    for (let r=0; r<settings.guessLimit; r++) {
      for (let c=0; c<5; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        els.board.appendChild(tile);
      }
    }
  }
  function updateBoard() {
    qa('.tile', els.board).forEach((tile, i) => {
      const r = Math.floor(i/5), c = i % 5;
      tile.textContent = grid[r][c].toUpperCase();
      tile.classList.toggle('filled', !!grid[r][c]);
      tile.classList.remove('correct','present','absent','reveal');
      if (locks[r][c]) tile.classList.add(locks[r][c]);
    });
  }
  function buildKeyboard() {
    const rows = ["qwertyuiop","asdfghjkl","?zxcvbnm?"];
    els.kbRows.forEach((rowEl, idx) => {
      rowEl.innerHTML = "";
      const rowStr = rows[idx];
      for (const ch of rowStr) {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'key';
        key.dataset.key = ch;
        key.textContent = ch === "?" ? "Enter" : (ch === "?" ? "Back" : ch.toUpperCase());
        if (ch === "?" || ch === "?") key.classList.add('wide');
        key.addEventListener('click', () => handleInput(ch));
        rowEl.appendChild(key);
      }
    });
  }

  async function loadWords() {
    if (settings.wordSource === "words.txt") {
      try {
        const res = await fetch('words.txt?v=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const list = text.split(/\\s+/).map(w => w.trim().toLowerCase()).filter(w => /^[a-z]{5}$/.test(w));
        if (list.length >= 50) {
          words = list;
          showToast(`Loaded ${list.length} words`);
          return;
        } else {
          showToast("words.txt too small Ñ using built-in list");
        }
      } catch (e) {
        console.error("Failed to load words.txt", e);
        showToast("Couldn't load words.txt Ñ using built-in");
      }
    }
    words = [...BUILTIN_WORDS];
  }

  function pickSolution() {
    solution = randItem(words);
    row = 0; col = 0;
    grid.forEach(r => r.fill("")); locks.forEach(r => r.fill(""));
    qa('.key').forEach(k => k.classList.remove('correct','present','absent'));
    updateBoard();
  }

  function scoreGuess(guess) {
    const res = Array(5).fill("absent");
    const counts = {};
    for (const ch of solution) counts[ch] = (counts[ch]||0)+1;
    for (let i=0;i<5;i++) if (guess[i]===solution
