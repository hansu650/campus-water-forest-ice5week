'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../src/core.js');

test('RULE-01: new players receive independent English saves', () => {
  const first = C.fresh();
  const second = C.fresh();
  first.tiles[0] = 8;
  first.rot[0] = 0;
  first.food = 0;
  assert.equal(second.lang, 'en');
  assert.equal(second.keeper, 'Qin Tian');
  assert.equal(second.food, 3);
  assert.equal(C.points(second), 80);
  assert.deepEqual(second.tiles, [1, 0, 2, 3, 5, 4, 8, 7, 6]);
  assert.deepEqual(second.rot, [1, 1, 0, 0, 2, 1, 2, 0, 1]);
});

test('RULE-02: feeding consumes food, adds 20 XP and stops at zero', t => {
  const state = C.fresh();
  const expected = [[2, 60, 1], [1, 80, 1], [0, 0, 2]];
  for (const [food, xp, level] of expected) {
    assert.equal(C.feed(state), true);
    assert.equal(state.food, food);
    assert.equal(C.xp(state), xp);
    assert.equal(C.level(state), level);
    assert.equal(C.points(state), 80);
  }
  const empty = structuredClone(state);
  assert.equal(C.feed(state), false);
  assert.deepEqual(state, empty);
  t.diagnostic('Food 3 -> 0; level 1 -> 2; fourth feed rejected; green points stay 80.');
});

test('RULE-03: sample green points are granted once and do not create food', () => {
  const state = C.fresh();
  assert.equal(C.collect(state), true);
  assert.equal(C.points(state), 100);
  const awarded = structuredClone(state);
  for (let attempt = 0; attempt < 10; attempt++) {
    assert.equal(C.collect(state), false);
    assert.deepEqual(state, awarded);
  }
  assert.equal(state.food, 3);
  assert.equal(state.feeds, 0);
  assert.equal(state.photoWon, false);
  assert.equal(state.waterWon, false);
});

test('RULE-04: trial food adds exactly two portions only once', () => {
  const state = C.fresh();
  assert.equal(C.claimFood(state), true);
  assert.equal(state.food, 5);
  const awarded = structuredClone(state);
  assert.equal(C.claimFood(state), false);
  assert.deepEqual(state, awarded);
  assert.equal(C.points(state), 80);
});

test('RULE-05: the campus photo puzzle needs three real tile swaps', () => {
  const state = C.fresh();
  assert.equal(C.swap(state, 0, 1), false);
  assert.equal(C.swap(state, 4, 5), false);
  assert.equal(C.swap(state, 6, 8), true);
  assert.deepEqual(state.tiles, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(state.moves, 3);
  assert.equal(state.food, 3);
});

test('RULE-06: invalid tile indices cannot corrupt the puzzle or count moves', () => {
  const invalidPairs = [[2, 2], [-1, 0], [0, 9], [NaN, 1],
    [1, undefined], [0.5, 1], ['0', 1], [0, Infinity], [null, 1]];
  for (const [first, second] of invalidPairs) {
    const state = C.fresh();
    const before = structuredClone(state);
    assert.equal(C.swap(state, first, second), false);
    assert.deepEqual(state, before, `Invalid indices changed state: ${first}, ${second}`);
  }
});

test('RULE-07: each challenge grants one badge and two food, including replay', t => {
  const state = C.fresh();
  assert.equal(C.award(state, 'photo'), true);
  assert.equal(state.food, 5);
  assert.equal(C.award(state, 'water'), true);
  assert.equal(state.food, 7);
  const awarded = structuredClone(state);
  for (let replay = 0; replay < 10; replay++) {
    assert.equal(C.award(state, 'photo'), false);
    assert.equal(C.award(state, 'water'), false);
    assert.deepEqual(state, awarded);
  }
  assert.equal(state.photoWon && state.waterWon, true);
  assert.equal(C.points(state), 80);
  t.diagnostic('Two first clears: food 3 -> 7; 20 replay attempts: no extra food or points.');
});

test('RULE-08: unknown challenge identifiers cannot unlock the water reward', () => {
  for (const kind of [undefined, null, '', 'phot', 'other', '__proto__', 0]) {
    const state = C.fresh();
    const before = structuredClone(state);
    assert.equal(C.award(state, kind), false, `Unknown reward kind: ${kind}`);
    assert.deepEqual(state, before);
  }
});

test('RULE-09: pipe routing rejects a broken inlet and accepts the complete route', () => {
  const state = C.fresh();
  assert.equal(C.trace(state).ok, false);
  state.rot = [1, 1, 2, 1, 3, 0, 2, 0, 0];
  assert.deepEqual(C.trace(state), { ok: true, seen: [3, 4, 1, 2, 5, 8] });
  state.rot[8] = 1;
  assert.equal(C.trace(state).ok, false, 'A broken outlet must not count as a win.');
  assert.equal(state.waterWon, false, 'Tracing alone must not grant a reward.');
  assert.equal(state.food, 3);
});

test('RULE-10: rotating a reachable pipe to a blocked orientation rejects the route', () => {
  const solution = [1, 1, 2, 1, 3, 0, 2, 0, 0];
  for (const index of [3, 4, 1, 2, 5, 8]) {
    const state = C.fresh();
    state.rot = [...solution];
    state.rot[index] = (state.rot[index] + 1) % 4;
    const result = C.trace(state);
    assert.equal(result.ok, false, `Broken route accepted at tile ${index + 1}`);
    assert.ok(result.seen.length <= 9);
    assert.equal(new Set(result.seen).size, result.seen.length);
  }
});

test('RULE-11: malformed saves reject invalid numbers, enums and boolean strings', () => {
  for (const value of [-1, 1.5, 100001, Infinity, NaN, '5', null]) {
    const state = C.sanitize({ food: value, feeds: value, moves: value });
    assert.equal(state.food, 3);
    assert.equal(state.feeds, 0);
    assert.equal(state.moves, 0);
  }
  for (const value of [0, 100000]) {
    const state = C.sanitize({ food: value, feeds: value, moves: value });
    assert.equal(state.food, value);
    assert.equal(state.feeds, value);
    assert.equal(state.moves, value);
  }
  const state = C.sanitize({ collected: 'true', photoWon: 1, fishType: 'shark', lang: 'xx' });
  assert.equal(C.points(state), 80);
  assert.equal(state.photoWon, false);
  assert.equal(state.fishType, 'clown');
  assert.equal(state.lang, 'en');
});

test('RULE-12: corrupted tile arrays and pipe rotations recover to playable defaults', () => {
  const state = C.sanitize({ tiles: [0, 0, 2, 3, 4, 5, 6, 7, 8], rot: [9] });
  assert.deepEqual(state.tiles, [1, 0, 2, 3, 5, 4, 8, 7, 6]);
  assert.deepEqual(state.rot, [1, 1, 0, 0, 2, 1, 2, 0, 1]);
  for (const raw of [null, undefined, false, 'broken']) {
    assert.equal(C.sanitize(raw).food, 3);
  }
});

test('RULE-13: a JSON save round-trip preserves progress without sharing arrays', () => {
  const original = C.fresh();
  C.feed(original);
  C.award(original, 'photo');
  C.collect(original);
  original.fishType = 'blue';
  original.fishWear = 'scarf';
  original.fishSize = 'large';
  original.name = 'Bubble';
  const raw = JSON.parse(JSON.stringify(original));
  const restored = C.sanitize(raw);
  assert.deepEqual(restored, original);
  raw.tiles[0] = 8;
  raw.rot[0] = 0;
  assert.deepEqual(restored.tiles, original.tiles);
  assert.deepEqual(restored.rot, original.rot);
  assert.equal(restored.food, 4);
  assert.equal(C.points(restored), 100);
});

test('RULE-14: guardian names remove duplicates and self, with five partners maximum', () => {
  assert.equal(C.normalizePartners('Alex, Jo;Jo\nMaya、Leo，Sam；Eve,Max', 'Alex'),
    'Jo、Maya、Leo、Sam、Eve');
  assert.equal(C.normalizePartners('  Alex , , Alex  ', 'Alex'), '');
  assert.equal(C.normalizePartners('A-very-long-guardian-name', 'Alex'), 'A-very-long-');
});

test('RULE-15: legacy outfits migrate while language and game progress survive', () => {
  const state = C.sanitize({ food: 9, feeds: 14, collected: true, photoWon: true,
    fishType: 'gold', fishWear: 'bow', lang: 'zh', keeper: 'Alex', partners: 'Alex,Jo,Jo' });
  assert.equal(state.fishWear, 'sailor');
  assert.equal(state.lang, 'zh');
  assert.equal(state.food, 9);
  assert.equal(state.feeds, 14);
  assert.equal(state.photoWon, true);
  assert.equal(state.partners, 'Jo');
  assert.equal(C.points(state), 100);
  assert.equal(C.sanitize({ fishWear: 'hat' }).fishWear, 'none');
});

test('RULE-16: restart preserves appearance but clears gameplay and claim history', () => {
  const state = C.sanitize({ name: 'Bubble', keeper: 'Alex', partners: 'Jo',
    fishType: 'blue', fishSize: 'large', fishWear: 'scarf', lang: 'zh', muted: true,
    food: 0, feeds: 18, photoWon: true, waterWon: true, collected: true,
    gift: true, certificate: true, petChosen: true, moves: 3 });
  const before = structuredClone(state);
  const reset = C.reset(state, false);
  for (const key of ['name', 'keeper', 'partners', 'fishType', 'fishSize',
    'fishWear', 'lang', 'muted', 'petChosen']) assert.equal(reset[key], state[key]);
  assert.equal(reset.started, true);
  assert.equal(reset.food, 3);
  assert.equal(reset.feeds, 0);
  assert.equal(reset.moves, 0);
  assert.equal(C.points(reset), 80);
  for (const key of ['photoWon', 'waterWon', 'collected', 'gift', 'certificate']) {
    assert.equal(reset[key], false);
  }
  assert.deepEqual(state, before, 'Reset should return a new save.');
});

test('RULE-17: full reset clears names and outfits but retains the selected language', () => {
  const state = C.sanitize({ name: 'Bubble', keeper: 'Alex', partners: 'Jo',
    fishType: 'blue', fishWear: 'scarf', lang: 'zh', muted: true, food: 0, feeds: 18 });
  const reset = C.reset(state, true);
  assert.equal(reset.lang, 'zh');
  assert.equal(reset.name, 'Xiaoman');
  assert.equal(reset.keeper, 'Qin Tian');
  assert.equal(reset.partners, '');
  assert.equal(reset.fishType, 'clown');
  assert.equal(reset.fishWear, 'none');
  assert.equal(reset.muted, false);
  assert.equal(reset.food, 3);
  assert.equal(C.points(reset), 80);
});

test('RULE-18: all six species and their outfits survive a save round-trip', () => {
  assert.equal(C.species.length, 6);
  for (const fishType of C.species) for (const fishWear of ['none', 'sailor', 'scarf']) {
    const state = C.sanitize({ fishType, fishWear, petChosen: true });
    const restored = C.sanitize(JSON.parse(JSON.stringify(state)));
    assert.equal(restored.fishType, fishType);
    assert.equal(restored.fishWear, fishWear);
  }
});

test('RULE-19: level growth is visible, bounded and separate from sample points', () => {
  const state = C.fresh();
  assert.equal(C.growthScale(state), 1);
  state.feeds = 3;
  assert.equal(C.level(state), 2);
  assert.equal(C.growthScale(state), 1.08);
  state.feeds = 8;
  assert.equal(C.level(state), 3);
  assert.equal(C.growthScale(state), 1.16);
  state.feeds = 100000;
  assert.equal(C.growthScale(state), 1.24);
  assert.equal(C.points(state), 80);
});

test('RULE-20: normal earned food reaches the baby milestone after eight feeds', () => {
  const state = C.fresh();
  C.claimFood(state);
  C.award(state, 'photo');
  C.award(state, 'water');
  assert.equal(state.food, 9);
  for (let feed = 0; feed < 7; feed++) assert.equal(C.feed(state), true);
  const before = structuredClone(state);
  assert.equal(C.welcomeBaby(state), false);
  assert.deepEqual(state, before);
  C.feed(state);
  assert.equal(C.level(state), 3);
  assert.equal(C.welcomeBaby(state), true);
  assert.equal(state.babyType, 'clown');
  assert.equal(state.food, 1);
  assert.equal(C.points(state), 80);
  const welcomed = structuredClone(state);
  assert.equal(C.welcomeBaby(state), false);
  assert.deepEqual(state, welcomed);
});

test('RULE-21: offspring retains its birth species across parent changes and reloads', () => {
  const state = C.sanitize({ feeds: 8, fishType: 'angel' });
  assert.equal(C.welcomeBaby(state), true);
  state.fishType = 'tetra';
  const restored = C.sanitize(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.fishType, 'tetra');
  assert.equal(restored.babyType, 'angel');
  assert.equal(C.welcomeBaby(restored), false);
  assert.equal(C.sanitize({ feeds: 7, babyType: 'angel' }).babyType, null);
  assert.equal(C.sanitize({ feeds: 8, babyType: 'shark' }).babyType, null);
});

test('RULE-22: restarting clears the family milestone while preserving chosen preferences', () => {
  const state = C.sanitize({ feeds: 8, babyType: 'tang', fishType: 'tang',
    companions: false, controlsPinned: true });
  const restart = C.reset(state, false);
  assert.equal(restart.babyType, null);
  assert.equal(restart.feeds, 0);
  assert.equal(restart.fishType, 'tang');
  assert.equal(restart.companions, false);
  assert.equal(restart.controlsPinned, true);
  const full = C.reset(state, true);
  assert.equal(full.babyType, null);
  assert.equal(full.companions, true);
  assert.equal(full.controlsPinned, false);
});

test('RULE-23: older saves gain safe defaults for companions, controls and the nursery', () => {
  const restored = C.sanitize({ food: 6, feeds: 2, collected: true, fishType: 'gold', lang: 'zh' });
  assert.equal(restored.food, 6);
  assert.equal(restored.feeds, 2);
  assert.equal(C.points(restored), 100);
  assert.equal(restored.fishType, 'gold');
  assert.equal(restored.lang, 'zh');
  assert.equal(restored.companions, true);
  assert.equal(restored.controlsPinned, false);
  assert.equal(restored.babyType, null);
  assert.equal(C.sanitize({ companions: 'false', controlsPinned: 'true' }).controlsPinned, false);
});
