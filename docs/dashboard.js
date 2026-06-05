/* TAXONOMY */

const TAXONOMY = {
  difficulties: [
    { level: 1, label: 'Warmup', color: '#4ade80', meaning: 'Trivial warmup — pure format learning.' },
    { level: 2, label: 'Easy', color: '#a3e635', meaning: 'Easy / straightforward implementation.' },
    {
      level: 3,
      label: 'Medium',
      color: '#facc15',
      meaning: 'Medium — needs a known algorithm or careful implementation.',
    },
    {
      level: 4,
      label: 'Hard',
      color: '#fb923c',
      meaning: 'Hard — a non-obvious insight, heavy implementation, or a real part-2 scaling trick.',
    },
    {
      level: 5,
      label: 'Expert',
      color: '#ef4444',
      meaning: 'Expert / notorious — multiple insights, very heavy implementation, or famously brutal.',
    },
  ],
  techniqueTags: [
    {
      tag: 'Warmup',
      meaning: 'Trivial early puzzle; the real point is learning the input/IO format. Minimal algorithmic content.',
    },
    {
      tag: 'Parsing',
      meaning: 'A significant part of the challenge is parsing irregular / structured / nested input.',
    },
    { tag: 'Simulation', meaning: 'Advance a system state step-by-step by following the rules literally.' },
    { tag: 'Grid', meaning: 'Operates on a 2D grid of cells/coordinates (movement, neighbors, mutation, flood fill).' },
    { tag: 'Pathfinding', meaning: 'Find a shortest / optimal path: BFS, Dijkstra, A*, weighted graphs.' },
    { tag: 'Graph', meaning: 'Model as nodes/edges: connectivity, components, topological sort, cycles, trees.' },
    { tag: 'Dynamic Programming', meaning: 'Optimal substructure built up from subproblem solutions.' },
    { tag: 'Memoization', meaning: 'Caching repeated recursive states to make an exponential problem tractable.' },
    { tag: 'Recursion', meaning: 'Naturally recursive structure / divide & conquer / recursive descent.' },
    { tag: 'Backtracking', meaning: 'DFS through choices with pruning and undo (constraint-guided search).' },
    {
      tag: 'Search',
      meaning: 'Explore a large abstract state space for a goal/best state, not a literal path on a map.',
    },
    { tag: 'Greedy', meaning: 'A greedy / local-optimal-choice strategy yields the answer.' },
    {
      tag: 'Math',
      meaning: 'Number theory, modular arithmetic, CRT, LCM/GCD, algebraic insight, closed-form formula.',
    },
    { tag: 'Geometry', meaning: 'Areas, polygons, shoelace, Pick\'s theorem, intersection, coordinate geometry.' },
    { tag: 'Combinatorics', meaning: 'Counting arrangements: permutations, combinations, partitions.' },
    { tag: 'Bit Manipulation', meaning: 'Bitmasks / bitwise operations as the central mechanic.' },
    {
      tag: 'Cellular Automata',
      meaning: 'Game-of-Life-style: cells update simultaneously from neighbors over generations.',
    },
    { tag: 'Cycle Detection', meaning: 'Detect a repeating state/period and fast-forward enormous iteration counts.' },
    { tag: 'Intervals', meaning: 'Reasoning over numeric ranges: merging, splitting, mapping, overlap.' },
    { tag: 'Optimization', meaning: 'Maximize/minimize an objective under constraints (beyond plain shortest path).' },
    { tag: 'Virtual Machine', meaning: 'Implement/run an instruction-set interpreter (assembly-like, Intcode).' },
    { tag: 'State Machine', meaning: 'Model behavior as discrete states and transitions.' },
    { tag: 'Hashing', meaning: 'MD5/cryptographic hashing or a custom hash is the core mechanic.' },
    {
      tag: 'Constraint Solving',
      meaning: 'Logic deduction / CSP / matching / SAT-like elimination to satisfy constraints.',
    },
    { tag: 'Spatial 3D', meaning: 'Genuinely 3D (or 4D) reasoning, not reducible to a flat grid.' },
    { tag: 'String Processing', meaning: 'Substantive string algorithms beyond simple parsing.' },
  ],
  modifierTags: [
    {
      tag: 'Scaling',
      meaning: 'Naive solves part 1, part 2 explodes; the puzzle is really about a non-brute-force method.',
    },
    {
      tag: 'Reverse Engineering',
      meaning: 'Inspect and exploit the structure of your specific input, or disassemble given code.',
    },
    {
      tag: 'Implementation Heavy',
      meaning: 'No single clever trick, but long, fiddly, careful implementation is the difficulty.',
    },
  ],
};

const DIFFS = {};
(TAXONOMY.difficulties || []).forEach(d => DIFFS[d.level] = d);

const TAGINFO = {};
[...(TAXONOMY.techniqueTags || []), ...(TAXONOMY.modifierTags || [])].forEach(t => TAGINFO[t.tag] = t.meaning);

/* DATA FETCHING */

const START_YEAR = 2015;
const END_YEAR = 2025;
const MAX_DAYS = 25;

const REPO = 'MilanFox/Advent-of-Code';
const BRANCH = 'main';
const dataUrl = (year) => `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/${year}/data.json`;

const loadYears = async () => {
  const results = await Promise.allSettled(
    Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) =>
      fetch(dataUrl(START_YEAR + i), { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }),
    ),
  );

  return results
    .reduce((acc, res, i) => {
      if (res.status === 'fulfilled' && Array.isArray(res.value?.days)) {
        acc.push({ ...res.value, year: res.value.year });
      }
      return acc;
    }, [])
    .sort((a, b) => a.year - b.year);
};

const lastDayOf = (year) => year.days.reduce((m, d) => Math.max(m, d.day), 0);
const maxStarsFor = (year, day) => day.day === lastDayOf(year) ? 1 : 2;
const isComplete = (year, day) => day.stars >= maxStarsFor(year, day);

/* RENDER */

const render = (years) => {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  let totalEarned = 0;
  let totalPossible = 0;
  let fullDays = 0;
  let attemptedDays = 0;
  let puzzleCount = 0;

  const perYear = [];
  const catAgg = {};
  const diffAgg = {};
  for (let l = 1; l <= 5; l++) diffAgg[l] = { earned: 0, possible: 0, days: 0 };

  years.forEach(yr => {
    let yEarned = 0, yPossible = 0;
    yr.days.forEach(d => {
      const mx = maxStarsFor(yr, d);
      totalEarned += d.stars;
      totalPossible += mx;
      yEarned += d.stars;
      yPossible += mx;
      puzzleCount++;
      if (d.stars > 0) attemptedDays++;
      if (isComplete(yr, d)) fullDays++;

      const lvl = d.difficulty || 0;
      if (diffAgg[lvl]) {
        diffAgg[lvl].earned += d.stars;
        diffAgg[lvl].possible += mx;
        diffAgg[lvl].days++;
      }

      (d.categories && d.categories.length ? d.categories : [d.primaryCategory]).forEach(c => {
        if (!c) return;
        if (!catAgg[c]) catAgg[c] = { earned: 0, possible: 0, appear: 0 };
        catAgg[c].earned += d.stars;
        catAgg[c].possible += mx;
        catAgg[c].appear++;
      });
    });

    perYear.push({ year: yr.year, earned: yEarned, possible: yPossible });
  });

  const pct = totalPossible ? Math.round((totalEarned / totalPossible) * 100) : 0;

  let wall = 0;
  for (let d = 1; d <= MAX_DAYS; d++) {
    const ok = years.every(yr => {
      const day = yr.days.find(x => x.day === d);
      return day && isComplete(yr, day);
    });

    if (ok) wall = d;
    else break;
  }

  const stats = [
    {
      label: 'Total Stars',
      value: totalEarned,
      unit: '/ ' + totalPossible,
      sub: pct + '% of all available',
      gold: true,
    },
    { label: 'Days Fully Solved', value: fullDays, unit: '/ ' + puzzleCount, sub: attemptedDays + ' days attempted' },
    {
      label: 'Years on the Calendar',
      value: years.length,
      unit: '',
      sub: years[0].year + '–' + years[years.length - 1].year,
    },
    { label: 'The Wall', value: wall ? 'Day ' + wall : '—', unit: '', sub: 'solved across every year' },
  ];

  document.getElementById('statGrid').innerHTML = stats.map(s => `
    <div class="stat-card ${s.gold ? 'stat-card--gold' : ''}">
      <div class="stat-card__label">${s.label}</div>
      <div class="stat-card__value">${s.value} <span class="stat-card__unit">${s.unit}</span></div>
      <div class="stat-card__sub">${s.sub}</div>
    </div>`).join('');

  document.getElementById('subtitle').innerHTML =
    `<b>${totalEarned}</b> stars collected across <b>${years.length}</b> years — your wall stands at <b>Day ${wall || 0}</b>.`;

  buildCalendar(years, wall);

  document.getElementById('yearBars').innerHTML = perYear.map(y => {
    const yp = y.possible ? Math.round((y.earned / y.possible) * 100) : 0;
    return `<div class="year-bars__col" title="${y.year}: ${y.earned}/${y.possible} stars (${yp}%)">
      <div class="year-bars__value">${y.earned}</div>
      <div class="year-bars__track"><div class="year-bars__fill" style="height:${yp}%"></div></div>
      <div class="year-bars__label">'${String(y.year).slice(2)}</div>
    </div>`;
  }).join('');

  document.getElementById('diffPanel').innerHTML = [1, 2, 3, 4, 5].map(l => {
    const a = diffAgg[l], info = DIFFS[l] || { label: 'L' + l, color: '#888' };
    const rate = a.possible ? Math.round((a.earned / a.possible) * 100) : 0;
    return `<div class="diff-row" title="${info.meaning || ''}">
      <div class="diff-row__name" style="color:${info.color}">${info.label}</div>
      <div class="diff-row__bar-wrap"><div class="diff-row__bar" style="width:${rate}%;background:linear-gradient(90deg,${info.color}cc,${info.color})"></div></div>
      <div class="diff-row__count"><b>${rate}%</b> · ${a.days} puzzles</div>
    </div>`;
  }).join('');

  buildCategories(catAgg);

  document.getElementById('genTime').textContent = '· loaded ' + new Date().toLocaleString();
};

let CURRENT_MODE = 'stars';
let CAL_YEARS = null, CAL_WALL = 0;

const buildCalendar = (years, wall) => {
  CAL_YEARS = years;
  CAL_WALL = wall;
  renderCalendar();

  document.querySelectorAll('.toggle').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.toggle').forEach(b => b.classList.remove('toggle--active'));
      btn.classList.add('toggle--active');
      CURRENT_MODE = btn.dataset.mode;
      renderCalendar();
    };
  });
};

const renderCalendar = () => {
  const years = CAL_YEARS;
  let html = '<table class="calendar"><thead><tr><th class="calendar__year"></th>';
  for (let d = 1; d <= MAX_DAYS; d++) {
    html += `<th class="calendar__daynum">${d % 5 === 0 || d === 1 ? d : ''}</th>`;
  }
  html += '</tr></thead><tbody>';

  years.forEach(yr => {
    const earned = yr.days.reduce((s, d) => s + d.stars, 0);
    const poss = yr.days.reduce((s, d) => s + maxStarsFor(yr, d), 0);
    const yp = poss ? Math.round((earned / poss) * 100) : 0;
    html += `<tr><th class="calendar__year">${yr.year}<br><span class="calendar__year-pct">${yp}%</span></th>`;
    for (let d = 1; d <= MAX_DAYS; d++) {
      const td = CAL_WALL && d === CAL_WALL ? '<td class="calendar__wall-mark">' : '<td>';
      const day = yr.days.find(x => x.day === d);
      if (!day) {
        html += `${td}<div class="cell cell--absent"></div></td>`;
        continue;
      }
      const mx = maxStarsFor(yr, day);
      const finale = day.day === lastDayOf(yr);
      const complete = day.stars >= mx;
      let cls = 'cell', style = '';
      if (finale) cls += ' cell--finale';

      if (CURRENT_MODE === 'stars') {
        if (day.stars === 0) cls += ' cell--empty';
        else
          if (day.stars >= mx) cls += ' cell--full';
          else cls += ' cell--part';
      } else {
        const info = DIFFS[day.difficulty] || { color: '#445' };
        cls += complete ? ' cell--diff-complete' : ' cell--diff-incomplete';
        style = `background:linear-gradient(135deg, ${info.color}, ${info.color}bb);`;
      }
      html += `${td}<div class="${cls}" style="${style}" data-year="${yr.year}" data-day="${day.day}"></div></td>`;
    }
    html += '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('calWrap').innerHTML = html;

  legendFor(CURRENT_MODE);
  attachTips(years);
};

const legendFor = (mode) => {
  const el = document.getElementById('legend');
  if (mode === 'stars') {
    el.innerHTML = `
      <div class="legend__item"><span class="legend__swatch" style="background:#0e1626"></span>No star</div>
      <div class="legend__item"><span class="legend__swatch" style="background:linear-gradient(135deg,#9fb0c9,#6c7e9c)"></span>Part 1 only</div>
      <div class="legend__item"><span class="legend__swatch" style="background:linear-gradient(135deg,#ffe173,#f0b429)"></span>Complete</div>
      <div class="legend__item"><span class="legend__swatch" style="background:linear-gradient(135deg,#ffe173,#f0b429);border-radius:50%"></span>Finale (1-part day)</div>`;
  } else {
    el.innerHTML = (TAXONOMY.difficulties || []).map(d =>
      `<div class="legend__item" title="${d.meaning}"><span class="legend__swatch" style="background:${d.color}"></span>${d.label}</div>`,
    ).join('') + `<div class="legend__item"><span class="legend__swatch" style="background:#445;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55)"></span>solved (ring)</div>`;
  }
};

const attachTips = (years) => {
  const tip = document.getElementById('tip');
  const byKey = {};
  years.forEach(yr => yr.days.forEach(d => byKey[yr.year + '_' + d.day] = { yr, d }));

  document.querySelectorAll('.cell[data-day]').forEach(cell => {
    cell.addEventListener('mouseenter', e => {
      const { yr, d } = byKey[cell.dataset.year + '_' + cell.dataset.day];
      const mx = maxStarsFor(yr, d);
      const starStr = '★'.repeat(d.stars) + '☆'.repeat(mx - d.stars);
      const diff = DIFFS[d.difficulty] || { label: '?', color: '#888' };
      const statusLabel = {
                            complete: 'Complete',
                            part1: 'Part 1',
                            unsolved: 'Unsolved',
                          }[d.solveStatus] || d.solveStatus;
      tip.innerHTML = `
        <div class="tip__head">
          <span class="tip__title">${d.title || 'Day ' + d.day}</span>
          <span class="tip__day">${yr.year} · Day ${d.day}</span>
        </div>
        <div class="tip__meta">
          <span class="tip__stars">${starStr}</span>
          <span class="tip__badge" style="border-color:${diff.color}66;color:${diff.color}">${diff.label}</span>
          <span class="tip__badge">${statusLabel}</span>
        </div>
        <div class="tip__essence">${d.essence || ''}</div>
        <div class="tip__cats">${(d.categories || []).join(' · ')}</div>`;
      tip.classList.add('tip--visible');
    });

    cell.addEventListener('mousemove', e => {
      const pad = 16, tw = tip.offsetWidth, th = tip.offsetHeight;
      let x = e.clientX + pad, y = e.clientY + pad;
      if (x + tw > window.innerWidth - 10) x = e.clientX - tw - pad;
      if (y + th > window.innerHeight - 10) y = e.clientY - th - pad;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    });

    cell.addEventListener('mouseleave', () => tip.classList.remove('tip--visible'));
  });
};

const buildCategories = (catAgg) => {
  const rows = Object.entries(catAgg).map(([tag, a]) => ({
    tag, appear: a.appear,
    rate: a.possible ? a.earned / a.possible : 0,
    earned: a.earned, possible: a.possible,
    meaning: TAGINFO[tag] || '',
  })).filter(r => r.appear >= 2);

  rows.sort((a, b) => b.rate - a.rate || b.appear - a.appear);

  const rateColor = r => {
    if (r >= 0.85) return '#4ade80';
    if (r >= 0.6) return '#a3e635';
    if (r >= 0.4) return '#facc15';
    if (r >= 0.2) return '#fb923c';
    return '#ef4444';
  };

  const rowHtml = r => `
    <div class="cat-row" title="${r.meaning}">
      <div class="cat-row__name">${r.tag}</div>
      <div class="cat-row__bar-wrap"><div class="cat-row__bar" style="width:${Math.round(r.rate * 100)}%;background:${rateColor(r.rate)}"></div></div>
      <div class="cat-row__value"><b>${Math.round(r.rate * 100)}%</b> ·${r.appear}×</div>
    </div>`;

  const mid = Math.ceil(rows.length / 2);
  document.getElementById('catLeft').innerHTML = rows.slice(0, mid).map(rowHtml).join('');
  document.getElementById('catRight').innerHTML = rows.slice(mid).map(rowHtml).join('');

  const sample = rows.filter(r => r.appear >= 3);
  const best = sample.slice(0, 3);
  const worst = sample.slice(-3).reverse();
  document.getElementById('catSummary').innerHTML =
    best.map(r => `<span class="pill pill--good">💪 ${r.tag} · ${Math.round(r.rate * 100)}%</span>`).join('') +
    worst.map(r => `<span class="pill pill--bad">🎯 ${r.tag} · ${Math.round(r.rate * 100)}%</span>`).join('');
};

(async () => {
  if (typeof TAXONOMY === 'undefined') {
    showError('Could not load <code>ressources/taxonomy.js</code>. Make sure it sits next to this page.');
    return;
  }
  try {
    const years = await loadYears();

    if (!years.length) {
      showError('No <code>data.json</code> files could be loaded.<br><br>');
      return;
    }

    render(years);
  } catch (e) {
    showError('Something went wrong while loading: ' + e.message);
  }
})();

const showError = (msg) => {
  document.getElementById('loading').classList.add('hidden');
  const el = document.getElementById('error');
  el.classList.remove('hidden');
  el.innerHTML = msg;
};
