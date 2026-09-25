'use strict';
// Original Canvas aquarium planting; decorative only, with no game-state writes.
const PondScenery = (() => {
  const tau = Math.PI * 2;
  const palettes = [
    ['#98b69b', '#5c9788', '#357c72'],
    ['#b0c398', '#80a583', '#4e8877'],
    ['#7eb6a5', '#50998b', '#32766f']
  ];
  function layout(w, h) {
    const compact = w < 620;
    return { compact, s: Math.min(h / 760, w / (compact ? 560 : 1250), 1.65),
      lx: w * (compact ? .065 : .115), ly: h * .765,
      rx: w * (compact ? .965 : .875), ry: h * .785 };
  }
  function ellipse(c, x, y, rx, ry, fill) {
    c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, tau); c.fill();
  }
  function shadow(c, x, y, rx, ry) {
    c.save(); c.translate(x, y); c.scale(rx, ry);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, '#496d5540'); g.addColorStop(.5, '#617b4d20'); g.addColorStop(1, '#617b4d00');
    ellipse(c, 0, 0, 1, 1, g); c.restore();
  }
  function leaf(c, x, y, length, breadth, angle, colors) {
    c.save(); c.translate(x, y); c.rotate(angle);
    const g = c.createLinearGradient(-breadth, -length, breadth * .5, 0);
    g.addColorStop(0, colors[0]); g.addColorStop(.5, colors[1]); g.addColorStop(1, colors[2]);
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(-breadth, -length * .32, -breadth * .68, -length * .8, 0, -length);
    c.bezierCurveTo(breadth * .75, -length * .73, breadth, -length * .24, 0, 0); c.fill();
    c.strokeStyle = '#d5e3ad36'; c.lineWidth = .8;
    c.beginPath(); c.moveTo(0, -3); c.quadraticCurveTo(-2, -length * .46, 0, -length * .88); c.stroke(); c.restore();
  }
  function ribbons(c, x, y, scale, t, phase, colors) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const lengths = [127, 225, 180, 281, 212, 254, 156, 192, 112];
    lengths.forEach((length, i) => {
      const root = (i - 4) * 4.3;
      const bend = (i - 4) * 14 + Math.sin(i * 1.8) * 18 + Math.sin(t * .58 + phase + i * .7) * 6;
      const breadth = 6 + i % 3 * 2.4;
      const g = c.createLinearGradient(0, -length, 0, 0);
      g.addColorStop(0, colors[0]); g.addColorStop(.55, colors[1]); g.addColorStop(1, colors[2]);
      c.fillStyle = g; c.beginPath(); c.moveTo(root - breadth / 2, 0);
      c.bezierCurveTo(root + bend * .8 - breadth, -length * .32, root - bend * .18, -length * .68, root + bend, -length);
      c.bezierCurveTo(root + bend * .33 + breadth, -length * .68, root + bend * .95 + breadth, -length * .3, root + breadth / 2, 0); c.fill();
      c.strokeStyle = '#e2edbd25'; c.lineWidth = .8; c.beginPath(); c.moveTo(root, -3);
      c.bezierCurveTo(root + bend * .83, -length * .31, root + bend * .05, -length * .7, root + bend, -length); c.stroke();
    }); c.restore();
  }
  function stem(c, x, y, scale, length, lean, t, phase, colors) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const sway = Math.sin(t * .62 + phase) * 4;
    const bend = lean + sway;
    c.strokeStyle = colors[2]; c.lineWidth = 2.3; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(bend * .15, -length * .5, bend, -length); c.stroke();
    for (let i = 1; i <= 6; i++) {
      const u = i / 7, px = bend * u * u, py = -length * u;
      const size = (42 - i * 3) * (length / 200);
      const angle = .92 - i * .045;
      leaf(c, px, py, size, size * .29, -angle + bend * .002, colors);
      leaf(c, px + 1, py - 6, size * .91, size * .26, angle + bend * .002, colors);
    }
    leaf(c, bend, -length + 8, 25, 7, lean * .006, colors); c.restore();
  }
  function rosette(c, x, y, scale, t, colors) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    [-1.15, -.7, -.29, .24, .72, 1.12].forEach((a, i) => {
      const length = [58, 86, 109, 94, 78, 54][i];
      leaf(c, (i - 2.5) * 2, 0, length, length * .17, a + Math.sin(t * .7 + i) * .028, colors);
    }); c.restore();
  }
  function stone(c, x, y, sx, sy, warm = false) {
    c.save(); c.translate(x, y); c.scale(sx, sy);
    const g = c.createLinearGradient(-.5, -1, .3, .3);
    g.addColorStop(0, warm ? '#d4ccb3' : '#bfcac0');
    g.addColorStop(.44, warm ? '#b5b09b' : '#9baea4');
    g.addColorStop(1, warm ? '#918e7a' : '#748e87');
    c.fillStyle = g; c.beginPath(); c.moveTo(-.98, -.12);
    c.bezierCurveTo(-1.04, -.6, -.54, -1.03, -.13, -.97);
    c.bezierCurveTo(.32, -1.09, .85, -.79, 1, -.29);
    c.bezierCurveTo(1.15, .19, .56, .26, -.02, .26);
    c.bezierCurveTo(-.64, .31, -1.05, .18, -.98, -.12); c.fill();
    c.strokeStyle = '#eef0d954'; c.lineWidth = .02; c.beginPath(); c.moveTo(-.79, -.43);
    c.bezierCurveTo(-.53, -.87, -.02, -.91, .31, -.83); c.stroke();
    c.fillStyle = '#ebecd527'; c.beginPath(); c.moveTo(-.78, -.27); c.lineTo(-.3, -.57); c.lineTo(.19, -.47); c.lineTo(-.08, -.25); c.closePath(); c.fill();
    c.restore();
  }
  function wood(c, x, y, scale) {
    c.save(); c.translate(x, y); c.scale(scale, scale); c.lineCap = 'round'; c.lineJoin = 'round';
    const g = c.createLinearGradient(0, -80, 0, 20);
    g.addColorStop(0, '#b5a88b'); g.addColorStop(.42, '#998f72'); g.addColorStop(1, '#6f7760');
    c.strokeStyle = g; c.lineWidth = 23; c.beginPath(); c.moveTo(-113, 6);
    c.bezierCurveTo(-69, -22, -32, -16, 10, -41); c.bezierCurveTo(37, -55, 70, -36, 99, -75); c.stroke();
    c.lineWidth = 12; c.beginPath(); c.moveTo(-36, -20); c.quadraticCurveTo(-64, -55, -55, -100); c.stroke();
    c.lineWidth = 7; c.beginPath(); c.moveTo(-58, -68); c.quadraticCurveTo(-77, -76, -84, -91); c.moveTo(28, -45); c.quadraticCurveTo(52, -11, 87, -13); c.stroke();
    c.lineWidth = 2; c.strokeStyle = '#e6d5aa56'; c.beginPath(); c.moveTo(-99, 0);
    c.bezierCurveTo(-63, -24, -30, -21, 12, -47); c.quadraticCurveTo(51, -60, 86, -68); c.moveTo(-43, -30); c.quadraticCurveTo(-59, -63, -58, -89); c.stroke();
    c.strokeStyle = '#555e4b38'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-85, 11);
    c.bezierCurveTo(-44, -3, -11, -19, 22, -36); c.quadraticCurveTo(56, -44, 68, -49); c.stroke();
    c.restore();
  }
  function paintStatic(back, front, w, h) {
    const {compact, s, lx, ly, rx, ry} = layout(w, h);
    // Distant planting is quieter and smaller than the foreground clusters.
    back.save(); back.globalAlpha = .28;
    ribbons(back, w * .025, h * .702, s * .76, 0, 2, palettes[0]);
    ribbons(back, w * .977, h * .708, s * .69, 0, 3, palettes[2]);
    if (!compact) {
      rosette(back, w * .235, h * .704, s * .54, 0, palettes[1]);
      rosette(back, w * .733, h * .7, s * .49, 0, palettes[0]);
    }
    back.restore();
    shadow(back, lx + 17 * s, ly + 10 * s, 139 * s, 23 * s);
    shadow(back, rx - 19 * s, ry + 8 * s, 160 * s, 28 * s);
    back.save(); back.strokeStyle = '#fff7d943'; back.lineWidth = 1.3;
    for (const [x, y, a] of [[lx, ly, 1], [rx, ry, -1]]) {
      for (let i = 0; i < 3; i++) {
        back.beginPath(); back.ellipse(x + a * 22 * s, y + (14 + i * 15) * s, (114 + i * 19) * s, (13 + i * 4) * s, -.06 * a, .15, 2.95); back.stroke();
      }
    } back.restore();
    // These cached foreground objects hide plant roots and anchor them in the sand.
    wood(front, rx - 29 * s, ry - 8 * s, s * (compact ? .76 : 1));
    stone(front, lx - 37 * s, ly + 2 * s, 38 * s, 27 * s, true);
    stone(front, lx + 16 * s, ly + 12 * s, 61 * s, 36 * s);
    stone(front, lx + 71 * s, ly + 19 * s, 31 * s, 18 * s, true);
    stone(front, rx + 20 * s, ry + 5 * s, 49 * s, 33 * s);
    stone(front, rx - 27 * s, ry + 15 * s, 34 * s, 20 * s, true);
    rosette(front, lx + 56 * s, ly + 18 * s, s * .43, 0, palettes[1]);
    rosette(front, rx + 45 * s, ry + 7 * s, s * .38, 0, palettes[2]);
    for (const [x, y, size] of [[.24,.807,11],[.277,.82,6],[.19,.847,5],[.727,.858,9],[.755,.839,5],[.828,.903,7]]) {
      if (compact && x > .2 && x < .8) continue;
      shadow(front, w*x, h*y+2*s, size*s*1.6, size*s*.36);
      stone(front, w*x, h*y, size*s, size*s*.55, true);
    }
  }
  function paintPlants(c, w, h, t) {
    const {s, lx, ly, rx, ry} = layout(w, h);
    c.save(); c.globalAlpha = .84;
    ribbons(c, lx - 27*s, ly, s, t, .7, palettes[0]);
    ribbons(c, rx + 28*s, ry - 4*s, s*.87, t, 3.2, palettes[2]);
    c.globalAlpha = .94;
    stem(c, rx - 30*s, ry, s, 214, -27, t, 1.7, palettes[0]);
    stem(c, rx - 52*s, ry + 5*s, s, 165, -54, t, 3.1, palettes[1]);
    stem(c, rx - 9*s, ry, s, 254, 24, t, .2, palettes[2]);
    rosette(c, lx + 40*s, ly + 7*s, s, t, palettes[1]);
    rosette(c, lx - 55*s, ly + 4*s, s*.7, t + 2, palettes[2]);
    rosette(c, rx - 75*s, ry + 7*s, s*.64, t + 1, palettes[0]);
    c.restore();
  }
  return {paintStatic, paintPlants};
})();
