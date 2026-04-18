import kaboom from "kaboom";

const k = kaboom({
  width: 800,
  height: 320,
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 520;
const BIG_JUMP_FORCE = 550;
let bestScore = 0;
let currentLevel = 0;

k.setGravity(1600);
// ─── CARGAR RECURSOS ───────────────────────────────────────────────────────
// Cargar sprites
k.loadSprite("block", "sprites/block.png");
k.loadSprite("blue-block", "sprites/blue-block.png");
k.loadSprite("blue-brick", "sprites/blue-brick.png");
k.loadSprite("blue-evil-shroom", "sprites/blue-evil-shroom.png");
k.loadSprite("blue-question", "sprites/blue-question.png");
k.loadSprite("blue-steel", "sprites/blue-steel.png");
k.loadSprite("brick", "sprites/brick.png");
k.loadSprite("coin", "sprites/coin.png");
k.loadSprite("evil-shroom", "sprites/evil-shroom.png");
k.loadSprite("mario", "sprites/mario-standing.png");
k.loadSprite("mario-left", "sprites/mario-left.png");
k.loadSprite("mario-jumping", "sprites/mario-jumping.png");
k.loadSprite("mario-jumping-left", "sprites/mario-jumping-left.png");
k.loadSprite("mushroom", "sprites/mushroom.png");
k.loadSprite("pipe-left", "sprites/pipe-left.png");
k.loadSprite("pipe-right", "sprites/pipe-right.png");
k.loadSprite("pipe-top-left", "sprites/pipe-top-left.png");
k.loadSprite("pipe-top-right", "sprites/pipe-top-right.png");
k.loadSprite("question", "sprites/question.png");
k.loadSprite("unboxed", "sprites/unboxed.png");
k.loadSprite("background", "sprites/background.png");
k.loadSprite("initial", "sprites/initial.png");
k.loadSprite("flag", "sprites/flag.png");
// Cargar sonidos
k.loadSound("coin", "sounds/coin.wav");
k.loadSound("powerup", "sounds/powerup.wav");
k.loadSound("powerup-appears", "sounds/powerup-appears.wav");
k.loadSound("jump", "sounds/jump.wav");
k.loadSound("stomp", "sounds/stomp.wav");
k.loadSound("powerdown", "sounds/powerdown.wav");
k.loadSound("game-over", "sounds/game-over.wav");
k.loadSound("main-theme", "sounds/main-theme.mp3");
k.loadSound("rakata", "sounds/rakata.mp3");

// ─── LEVEL MAPS ─────────────────────────────────────────────────────────
const levels = [
  // Level 0
  {
    map: [
      "                            ",
      "                            ",
      "                            ",
      "                            ",
      "                            ",
      "                            ",
      "                            ",
      "        ?                   ",
      "                            ",
      "                            ",
      "    ? #M#?#           -+      ",
      "                      ()      -+            ",
      "            	     -+  ()      ()           ",
      "                  ()  ()      ()           ",
      "====================  =======================",
      "====================  =======================",
    ],
    exitPipeX: 630,
    isBlue: false,
    musicTrack: "main-theme",
    evilShroomPositions: [
      k.vec2(12 * 20, 13 * 20),
      k.vec2(17 * 20, 13 * 20),
      k.vec2(26 * 20, 13 * 20),
      k.vec2(29 * 20, 13 * 20),
    ],
  },
  // Level 1
  {
    map: [
      "                                            ",
      "                                            ",
      "                                            ", 
      "                                            ",
      "                                            ",
      "        B                           ",
      "                                    F ",
      "    ¿¿¿¿¿¿¿¿¿                                ",
      "                                            ",
      "                                    [",
      "   ¿¿¿¿¿¿¿¿¿¿¿        -+           [[",
      "                      ()          [[[            ",
      "            	     -+  ()        -+[[[           ",
      "                  ()  ()        ()[[[           ",
      "[[[[[[[[[[[[[   [[[[  [[[[[[[[[[[[[[[[[[[[[[[[[",
      "[[[[[[[[[[[[[   [[[[  [[[[[[[[[[[[[[[[[[[[[[[[[",
    ],
    exitPipeX: 630,
    isBlue: true,
    musicTrack: "rakata",
    evilShroomPositions: [
      k.vec2(5 * 20, 13 * 20),
      k.vec2(12 * 20, 13 * 20),
      k.vec2(25 * 20, 13 * 20),
    ],
  },
];
// ─── ESCENA PRINCIPAL ───────────────────────────────────────────────────────
k.scene("game", ({ music, playerBonus = false }) => {
  const levelData = levels[currentLevel % levels.length];
  const map = levelData.map;
  const exitPipeX = levelData.exitPipeX;
  const evilShroomPositions = levelData.evilShroomPositions;
  const isBlueLevel = levelData.isBlue;

  const levelCfg = {
    tileWidth: 20,
    tileHeight: 20,
    tiles: {
      "=": () => [
        k.sprite("brick"),
        k.area(),
        k.scale(1),
        k.body({ isStatic: true }),
      ],
      "[": () => [
        k.sprite("blue-brick"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
      ],
      $: () => [k.sprite("coin"), k.area(), k.scale(0.02), "coin"],
      "*": () => [
        k.sprite("mushroom"),
        k.area(),
        k.body(),
        k.scale(0.1),
        "mushroom",
      ],
      "?": () => [
        k.sprite("question"),
        k.area(),
        k.body({ isStatic: true }),
        "question",
      ],
      "¿": () => [
        k.sprite("blue-question"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
        "question",
      ],
      M: () => [
        k.sprite("question"),
        k.area(),
        k.body({ isStatic: true }),
        "mushroom-question",
      ],
      B: () => [
        k.sprite("blue-question"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
        "mushroom-question",
      ],
      "(": () => [
        k.sprite("pipe-left"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
        "pipe",
      ],
      ")": () => [
        k.sprite("pipe-right"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
        "pipe",
      ],
      "#": () => [
        k.sprite("block"),
        k.area(),
        k.body({ isStatic: true }),
        k.scale(0.015625),
      ],
      "{": () => [
        k.sprite("blue-block"),
        k.area(),
        k.body({ isStatic: true }),
        k.scale(0.5),
      ],
      "-": () => [
        k.sprite("pipe-top-left"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
        "pipe-top",
      ],
      "+": () => [
        k.sprite("pipe-top-right"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
        "pipe-top",
      ],
      "F": () => [
        k.sprite("flag"),
        k.area(),
        k.scale(0.25),
        k.body({ isStatic: true }),
        "flag",
      ],
    },
  };

  k.addLevel(map, levelCfg);

  k.add([
    k.sprite("background"),
    k.pos(0, 0),
    k.scale(k.width() / 800, k.height() / 320),
    k.z(-1),
  ]);

  const scoreLabel = k.add([
    k.text("score 00000", { size: 18 }),
    k.pos(40, 20),
    k.z(100),
    { value: "0" },
  ]);

  k.add([k.text("level " + currentLevel, { size: 18 }), k.pos(40, 6)]);

  const evilShrooms = [];
  evilShroomPositions.forEach((pos) => {
    const evil = k.add([
      k.sprite(isBlueLevel ? "blue-evil-shroom" : "evil-shroom"),
      k.pos(pos),
      k.area(),
      k.body(),
      k.scale(isBlueLevel ? 0.5 : 1),
      "evil-shroom",
      { dir: -1, turning: false },
    ]);

    evil.onCollide("=", () => {
      if (evil.turning) return;
      evil.turning = true;
      evil.dir *= -1;
      k.wait(0.3, () => {
        evil.turning = false;
      });
    });

    evil.onCollide("pipe", () => {
      if (evil.turning) return;
      evil.turning = true;
      evil.dir *= -1;
      k.wait(0.3, () => {
        evil.turning = false;
      });
    });

    evil.onCollide("evil-shroom", () => {
      if (evil.turning) return;
      evil.turning = true;
      evil.dir *= -1;
      k.wait(0.3, () => {
        evil.turning = false;
      });
    });
    evilShrooms.push(evil);
  });

  const player = k.add([
    k.sprite("mario"),
    k.pos(30, 0),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.scale(playerBonus ? 1 / 30 : 1 / 45),
    {
      dir: "right",
      jumping: false,
      bonus: playerBonus,
    },
  ]);

  // ─── CONTROLES ────────────────────────────────────────────────────────────
  k.onKeyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
    player.dir = "left";
  });

  k.onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0);
    player.dir = "right";
  });

  k.onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      k.play("jump");
      player.jumping = true;
    }
  });

  k.onKeyDown("down", () => {
    const pipeRange = 20; 
    if (
      Math.abs(player.pos.x - exitPipeX) < pipeRange &&
      player.isGrounded()
    ) {
      currentLevel++;
      music.stop();
      const nextLevelData = levels[currentLevel % levels.length];
      console.log("Transitioning to level", currentLevel, "with music:", nextLevelData.musicTrack);
      const nextMusic = k.play(nextLevelData.musicTrack, { loop: true, volume: 1 });
      k.go("game", { music: nextMusic, playerBonus: player.bonus });
    }
  });

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  let currentSprite = "mario";

  k.onUpdate(() => {
    let newSprite;
    if (!player.isGrounded()) {
      newSprite =
        player.dir === "right" ? "mario-jumping" : "mario-jumping-left";
    } else {
      newSprite = player.dir === "right" ? "mario" : "mario-left";
    }
    if (newSprite !== currentSprite) {
      currentSprite = newSprite;
      player.use(k.sprite(currentSprite));
    }
    if (player.pos.y > k.height() + 10) {
      music.stop();
      k.play("game-over");
      k.go("lose", { score: scoreLabel.value });
    }

    evilShrooms.forEach((shroom) => {
      shroom.move(30 * shroom.dir, 0);
    });
  });

  // ─── COLISIONES ───────────────────────────────────────────────────────────

  player.onCollide("question", (obj) => {
    if (obj.opened) return;
    const hittingFromBelow = player.pos.y > obj.pos.y;
    if (!hittingFromBelow) return;
    obj.opened = true;
    obj.use(k.sprite("unboxed"));
    if (isBlueLevel) {
      obj.use(k.scale(1));
    }
    k.add([
      k.sprite("coin"),
      k.pos(obj.pos.x, obj.pos.y - 20),
      k.area(),
      k.scale(1),
      "coin",
    ]);
  });

  player.onCollide("mushroom-question", (obj) => {
    if (obj.opened) return;
    const hittingFromBelow = player.pos.y > obj.pos.y;
    if (!hittingFromBelow) return;
    obj.opened = true;
    k.play("powerup-appears");
    obj.use(k.sprite("unboxed"));
    if (isBlueLevel) {
      obj.use(k.scale(1));
    }
    const mushroom = k.add([
      k.sprite("mushroom"),
      k.pos(obj.pos.x, obj.pos.y - 20),
      k.area(),
      k.body(),
      k.scale(isBlueLevel ? 1 : 1),
      "mushroom",
      { dir: 1 },
    ]);

    mushroom.onUpdate(() => {
      mushroom.move(30 * mushroom.dir, 0);
    });

    mushroom.onCollide("pipe", () => {
      mushroom.dir *= -1;
    });
  });

  player.onCollide("mushroom", (obj) => {
    k.destroy(obj);
    k.play("powerup");
    player.use(k.scale(1 / 30));
    player.bonus = true;
    player.jump(BIG_JUMP_FORCE);
  });

  player.onCollide("coin", (obj) => {
    k.destroy(obj);
    k.play("coin");
    scoreLabel.value = String(Number(scoreLabel.value) + 1);
    scoreLabel.text = "score " + scoreLabel.value.padStart(5, "0");
  });

  player.onCollide("flag", () => {
    music.stop();
    k.go("win");
  });

  player.onCollide("evil-shroom", (shroom) => {
    const playerFalling = player.vel.y > 0;
    const playerAbove = player.pos.y < shroom.pos.y;

    if (playerFalling && playerAbove) {
      k.destroy(shroom);
      k.play("stomp");
      player.jump(JUMP_FORCE / 10);
      scoreLabel.value = String(Number(scoreLabel.value) + 10);
      scoreLabel.text = "score " + scoreLabel.value.padStart(5, "0");
    } else {
      if (player.bonus && !playerFalling) {
        player.use(k.scale(1 / 45));
        player.bonus = false;
        k.play("powerdown");
      } else {
        if (Number(scoreLabel.value) > bestScore) {
          bestScore = Number(scoreLabel.value);
        }
        music.stop();
        k.play("game-over");
        k.go("lose", { score: scoreLabel.value });
      }
    }
  });
});



// ─── ESCENA WIN ─────────────────────────────────────────────────────────────
k.scene("win", () => {
  k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(0, 0, 0)]);

  k.add([
    k.text("YOU WIN!", { size: 60 }),
    k.pos(k.width() / 2, k.height() / 2 - 60),
    k.anchor("center"),
    k.color(255, 255, 0),
  ]);

  k.add([
    k.text("press space to play again", { size: 16 }),
    k.pos(k.width() / 2, k.height() / 2 + 90),
    k.anchor("center"),
    k.color(200, 200, 200),
  ]);
  k.wait(2.5, () => {
    k.onKeyPress("space", () => {
      currentLevel = 0;
      const music = k.play("main-theme", { loop: true, volume: 0.8 });
      k.go("game", { music });
    });
  });
});

// ─── ESCENA LOSE ────────────────────────────────────────────────────────────
k.scene("lose", ({ score } = { score: "0" }) => {
  if (Number(score) > bestScore) {
    bestScore = Number(score);
  }

  k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(0, 0, 0)]);

  k.add([
    k.text("GAME OVER", { size: 48 }),
    k.pos(k.width() / 2, k.height() / 2 - 60),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  k.add([
    k.text("score        " + String(score).padStart(5, "0"), { size: 24 }),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  k.add([
    k.text("best score   " + String(bestScore).padStart(5, "0"), { size: 24 }),
    k.pos(k.width() / 2, k.height() / 2 + 40),
    k.anchor("center"),
    k.color(255, 255, 0),
  ]);

  k.add([
    k.text("press space to play again", { size: 16 }),
    k.pos(k.width() / 2, k.height() / 2 + 90),
    k.anchor("center"),
    k.color(200, 200, 200),
  ]);
  k.wait(2.5, () => {
    k.onKeyPress("space", () => {
      currentLevel = 0;
      const music = k.play("main-theme", { loop: true, volume: 0.8 });
      k.go("game", { music });
    });
  });
});

// ─── INICIAR ────────────────────────────────────────────────────────────────
k.scene("start", () => {
  k.add([
    k.sprite("initial"),
    k.pos(0, 0),
    k.scale(k.width() / 800, k.height() / 320),
    k.z(-1),
  ]);

  k.add([
    k.text("SUPER MARIO", { size: 40 }),
    k.pos(k.width() / 2, k.height() / 2 - 40),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  k.add([
    k.text("press space to start", { size: 20 }),
    k.pos(k.width() / 2, k.height() / 2 + 20),
    k.anchor("center"),
    k.color(200, 200, 200),
  ]);

  k.onKeyPress("space", () => {
    currentLevel = 0;
    const music = k.play("main-theme", { loop: true, volume: 1 });
    k.go("game", { music });
  });
});

k.go("start");
