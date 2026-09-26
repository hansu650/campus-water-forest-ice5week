'use strict';

// Original illustrated species and local demo companions for the class prototype.
const PondLife = (() => {
  const catalog = {
    clown: { key: 'fish', name: ['棕白小鱼', 'Clownfish'], tag: ['温柔伙伴', 'Gentle'], detail: ['熟悉的棕白条纹', 'Familiar brown and white stripes'] },
    gold: { key: 'goldfish', name: ['红白金鱼', 'Goldfish'], tag: ['活力伙伴', 'Lively'], detail: ['像一片游动的云', 'A little cloud in the water'] },
    blue: { key: 'bluefish', name: ['蓝色斗鱼', 'Blue betta'], tag: ['优雅伙伴', 'Elegant'], detail: ['蓝色尾鳍轻轻舒展', 'Flowing blue fins'] },
    tang: { key: 'tangfish', name: ['柠檬倒吊', 'Yellow tang'], tag: ['阳光伙伴', 'Sunny'], detail: ['明亮的柠檬色与扇形尾鳍', 'Lemon-yellow fins and a bright little face'] },
    angel: { key: 'angelfish', name: ['银色神仙鱼', 'Silver angelfish'], tag: ['轻盈伙伴', 'Graceful'], detail: ['银色条纹与修长的鳍', 'Silver stripes and tall, flowing fins'] },
    tetra: { key: 'tetrafish', name: ['霓虹灯鱼', 'Neon tetra'], tag: ['闪亮伙伴', 'Glowing'], detail: ['蓝红色的小小光点', 'A tiny ribbon of blue and red'] },
  };
  const companions = [
    { type: 'tang', name: 'Sunny', phase: 0.8, lane: 0.25, size: 102 },
    { type: 'blue', name: 'Ripple', phase: 2.8, lane: 0.52, size: 112 },
    { type: 'angel', name: 'Luna', phase: 4.4, lane: 0.36, size: 112 },
    { type: 'tetra', name: 'Pip', phase: 5.7, lane: 0.62, size: 90 },
  ];
  let fishNodes = [];
  let signature = '';

  const asset = (assets, type, wear = 'none') => assets[wear === 'none' ? catalog[type].key : type + '_' + wear];
  const label = (type, translate) => translate(...catalog[type].name);

  function render(state, assets, translate) {
    const host = document.getElementById('pond-companions');
    const next = JSON.stringify([state.companions, state.babyType, state.lang]);
    if (next === signature) return;
    signature = next;
    host.replaceChildren();
    fishNodes = [];
    const inhabitants = state.companions ? companions.map(fish => ({ ...fish, baby: false })) : [];
    if (state.babyType) inhabitants.push({ type: state.babyType, baby: true, size: 58 });
    for (const fish of inhabitants) {
      const node = document.createElement('div');
      node.className = fish.baby ? 'pond-fish baby-fish' : 'pond-fish demo-fish';
      node.dataset.species = fish.type;
      const img = document.createElement('img');
      img.src = asset(assets, fish.type);
      img.alt = fish.baby ? translate('幼鱼 · ', 'Baby ') + label(fish.type, translate)
        : translate('演示伙伴鱼 · ', 'Demo companion: ') + fish.name + ' · ' + label(fish.type, translate);
      img.draggable = false;
      node.append(img);
      host.append(node);
      fishNodes.push({ ...fish, node, img });
    }
    document.getElementById('pond-population').textContent =
      (state.companions ? translate('4 条演示伙伴鱼', '4 demo companions') : translate('我的小鱼塘', 'Your own little pond'))
      + (state.babyType ? translate(' · 1 条幼鱼', ' · 1 baby fish') : '');
  }

  function animate(time, width, height, parentX, parentY) {
    const compact = width < 600;
    for (const fish of fishNodes) {
      const size = fish.size * (compact ? 0.72 : 1);
      let x, y, direction;
      if (fish.baby) {
        x = parentX + (compact ? 53 : 80) + Math.sin(time * 0.9) * 7;
        y = parentY + 45 + Math.sin(time * 1.1) * 8;
        direction = Math.cos(time * 0.105) < 0 ? -1 : 1;
      } else {
        x = width * (0.5 + Math.sin(time * (0.06 + fish.phase * 0.004) + fish.phase) * 0.36);
        y = height * (fish.lane + Math.sin(time * 0.25 + fish.phase) * 0.035);
        direction = Math.cos(time * (0.06 + fish.phase * 0.004) + fish.phase) < 0 ? -1 : 1;
      }
      fish.node.style.width = size + 'px';
      fish.node.style.height = size * 0.78 + 'px';
      fish.node.style.left = Math.max(size / 2 + 8, Math.min(width - size / 2 - 8, x)) + 'px';
      fish.node.style.top = Math.max(75, Math.min(height * 0.7, y)) + 'px';
      fish.img.style.scale = direction + ' 1';
    }
  }

  return { catalog, asset, label, render, animate };
})();
