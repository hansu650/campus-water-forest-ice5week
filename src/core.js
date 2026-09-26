'use strict';

// Original campus-game logic. No Reefy source or assets are included.
const PondCore = (() => {
  const initialTiles = [1, 0, 2, 3, 5, 4, 8, 7, 6];
  const shapes = ['c', 'c', 'c', 's', 'c', 's', 'c', 's', 's'];

  const species = ['clown', 'gold', 'blue', 'tang', 'angel', 'tetra'];
  const nurseryLevel = 3;

  function fresh() {
    return {
      version: 5, lang: 'en', started: false,
      food: 3, feeds: 0, collected: false,
      photoWon: false, waterWon: false, gift: false,
      certificate: false, muted: false, companions: true, controlsPinned: false, babyType: null,
      keeper: 'Qin Tian', partners: '', name: 'Xiaoman',
      fishType: 'clown', fishSize: 'normal', fishWear: 'none',
      petChosen: false, tiles: [...initialTiles], moves: 0,
      rot: [1, 1, 0, 0, 2, 1, 2, 0, 1], photo: 'aerial',
    };
  }

  // Keep valid saved progress; replace damaged fields with playable defaults.
  function sanitize(raw) {
    const state = fresh();
    if (!raw || typeof raw !== 'object') return state;

    const flags = ['started', 'collected', 'photoWon', 'waterWon',
      'gift', 'certificate', 'muted', 'petChosen', 'companions', 'controlsPinned'];
    for (const key of flags) {
      if (typeof raw[key] === 'boolean') state[key] = raw[key];
    }
    for (const key of ['food', 'feeds', 'moves']) {
      if (Number.isSafeInteger(raw[key]) && raw[key] >= 0 && raw[key] <= 100000) {
        state[key] = raw[key];
      }
    }
    const options = {
      lang: ['zh', 'en'], fishType: species,
      fishSize: ['small', 'normal', 'large'],
      fishWear: ['none', 'sailor', 'scarf'], photo: ['aerial', 'walkway'],
    };
    for (const [key, values] of Object.entries(options)) {
      if (values.includes(raw[key])) state[key] = raw[key];
    }
    for (const [key, length] of [['keeper', 12], ['partners', 80], ['name', 8]]) {
      if (typeof raw[key] === 'string' && raw[key].trim()) {
        state[key] = raw[key].trim().slice(0, length);
      }
    }
    if (raw.fishWear === 'bow') state.fishWear = 'sailor';

    if (Array.isArray(raw.tiles) && raw.tiles.length === 9
      && new Set(raw.tiles).size === 9
      && raw.tiles.every(value => Number.isInteger(value) && value >= 0 && value < 9)) {
      state.tiles = [...raw.tiles];
    }
    if (Array.isArray(raw.rot) && raw.rot.length === 9
      && raw.rot.every(value => Number.isInteger(value) && value >= 0 && value < 4)) {
      state.rot = [...raw.rot];
    }
    if (species.includes(raw.babyType) && level(state) >= nurseryLevel) state.babyType = raw.babyType;
    state.partners = normalizePartners(state.partners, state.keeper);
    return state;
  }

  function normalizePartners(names, keeper) {
    const unique = new Set(String(names).split(/[，,、;；\n]+/)
      .map(name => name.trim().slice(0, 12))
      .filter(name => name && name !== keeper));
    return [...unique].slice(0, 5).join('、');
  }

  // Game XP and food are separate from the sample water-record points.
  const points = state => state.collected ? 100 : 80;
  const level = state => Math.floor((40 + state.feeds * 20) / 100) + 1;
  const xp = state => (40 + state.feeds * 20) % 100;

  const growthScale = state => 1 + Math.min(3, Math.max(0, level(state) - 1)) * 0.08;

  // A single saved offspring is a game milestone; it is independent of green points.
  function welcomeBaby(state) {
    if (level(state) < nurseryLevel || state.babyType || !species.includes(state.fishType)) return false;
    state.babyType = state.fishType;
    return true;
  }

  function feed(state) {
    if (state.food <= 0) return false;
    state.food--;
    state.feeds++;
    return true;
  }

  function collect(state) {
    if (state.collected) return false;
    state.collected = true;
    return true;
  }

  function claimFood(state) {
    if (state.gift) return false;
    state.gift = true;
    state.food += 2;
    return true;
  }

  // Reject unknown challenges before looking up or changing reward state.
  function award(state, kind) {
    if (kind !== 'photo' && kind !== 'water') return false;
    const key = kind === 'photo' ? 'photoWon' : 'waterWon';
    if (state[key]) return false;
    state[key] = true;
    state.food += 2;
    return true;
  }

  const ports = (state, index) => (shapes[index] === 's' ? [0, 2] : [0, 1])
    .map(direction => (direction + state.rot[index]) % 4);

  // Follow connected ports from the middle-left inlet to the bottom-right outlet.
  function trace(state) {
    let index = 3;
    let entry = 3;
    const seen = [];
    while (!seen.includes(index)) {
      const ends = ports(state, index);
      if (!ends.includes(entry)) return { ok: false, seen };
      seen.push(index);
      const out = ends.find(direction => direction !== entry);
      if (index === 8 && out === 2) return { ok: true, seen };
      const row = Math.floor(index / 3) + [-1, 0, 1, 0][out];
      const column = index % 3 + [0, 1, 0, -1][out];
      if (row < 0 || row > 2 || column < 0 || column > 2) {
        return { ok: false, seen };
      }
      index = row * 3 + column;
      entry = (out + 2) % 4;
    }
    return { ok: false, seen };
  }

  function swap(state, first, second) {
    if (!Number.isInteger(first) || !Number.isInteger(second)
      || first === second || first < 0 || first > 8 || second < 0 || second > 8) {
      return false;
    }
    [state.tiles[first], state.tiles[second]] = [state.tiles[second], state.tiles[first]];
    state.moves++;
    return state.tiles.every((piece, index) => piece === index);
  }

  function reset(state, all) {
    const next = fresh();
    next.started = true;
    if (!all) {
      const appearance = ['lang', 'muted', 'keeper', 'partners', 'name',
        'fishType', 'fishSize', 'fishWear', 'petChosen', 'companions', 'controlsPinned'];
      for (const key of appearance) next[key] = state[key];
    } else {
      next.lang = state.lang;
    }
    return next;
  }

  return { fresh, sanitize, normalizePartners, species, nurseryLevel, growthScale, welcomeBaby, points, level, xp, feed,
    collect, claimFood, award, ports, trace, swap, reset };
})();

if (typeof module !== 'undefined') module.exports = PondCore;
