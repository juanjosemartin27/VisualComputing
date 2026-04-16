import kaboom from "kaboom";

const k = kaboom({
  width: 800,
  height: 320,
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 520;
const BIG_JUMP_FORCE = 550;
let bestScore = 0;

k.setGravity(1600);

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

// ─── ESCENA PRINCIPAL ───────────────────────────────────────────────────────
k.scene("game", () => {
  const map = [
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
  ];

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
      $: () => [k.sprite("coin"), k.area(), k.scale(0.02), "coin"],
      "*": () => [
        k.sprite("mushroom"),
        k.area(),
        k.body(),
        k.scale(0.5),
        "mushroom",
      ],
      "?": () => [
        k.sprite("question"),
        k.area(),
        k.body({ isStatic: true }),
        "question",
      ],
      M: () => [
        k.sprite("question"),
        k.area(),
        k.body({ isStatic: true }),
        "mushroom-question",
      ],
      "¿": () => [
        k.sprite("blue-question"),
        k.area(),
        k.body({ isStatic: true }),
        "question",
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
      ],
      "#": () => [
        k.sprite("block"),
        k.area(),
        k.body({ isStatic: true }),
        k.scale(0.015625),
      ],
      "-": () => [
        k.sprite("pipe-top-left"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
      ],
      "+": () => [
        k.sprite("pipe-top-right"),
        k.area(),
        k.scale(0.5),
        k.body({ isStatic: true }),
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

  k.add([k.text("level 0", { size: 18 }), k.pos(40, 6)]);

  [k.vec2(12 * 20, 13 * 20), k.vec2(17 * 20, 13 * 20)].forEach((pos) => {
    k.add([
      k.sprite("evil-shroom"),
      k.pos(pos),
      k.area(),
      k.body(),
      k.scale(1),
      "evil-shroom",
      { dir: -1 },
    ]);
  });

  const player = k.add([
    k.sprite("mario"),
    k.pos(30, 0),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.scale(1 / 45),
    {
      dir: "right",
      jumping: false,
      bonus: false,
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
      player.jumping = true;
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

    k.get("evil-shroom").forEach((shroom) => {
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
    obj.use(k.sprite("unboxed"));

    const mushroom = k.add([
      k.sprite("mushroom"),
      k.pos(obj.pos.x, obj.pos.y - 20),
      k.area(),
      k.body(),
      k.scale(1),
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
    player.use(k.scale(1 / 30));
    player.bonus = true;
    player.jump(BIG_JUMP_FORCE);
  });

  player.onCollide("coin", (obj) => {
    k.destroy(obj);
    scoreLabel.value = String(Number(scoreLabel.value) + 1);
    scoreLabel.text = "score " + scoreLabel.value.padStart(5, "0");
  });

  player.onCollide("evil-shroom", (shroom) => {
    const playerFalling = player.vel.y > 0;
    const playerAbove = player.pos.y < shroom.pos.y;

    if (playerFalling && playerAbove) {
      k.destroy(shroom);
      player.jump(JUMP_FORCE / 10);
      scoreLabel.value = String(Number(scoreLabel.value) + 10);
      scoreLabel.text = "score " + scoreLabel.value.padStart(5, "0");
    } else {
      if (player.bonus && !playerFalling) {
        player.use(k.scale(1 / 45));
        player.bonus = false;
        k.destroy(shroom);
      } else {
        if (Number(scoreLabel.value) > bestScore) {
          bestScore = Number(scoreLabel.value);
        }
        k.go("lose", { score: scoreLabel.value });
      }
    }
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

  k.onKeyPress("space", () => {
    k.go("game");
  });
});

// ─── INICIAR ────────────────────────────────────────────────────────────────
k.go("game");
