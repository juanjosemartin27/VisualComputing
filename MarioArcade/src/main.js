import kaboom from "kaboom";

const k = kaboom({
  width: 800,
  height: 320,
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 520;
const BIG_JUMP_FORCE = 550;

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
k.loadSprite("mushroom", "sprites/mushroom.png");
k.loadSprite("pipe-left", "sprites/pipe-left.png");
k.loadSprite("pipe-right", "sprites/pipe-right.png");
k.loadSprite("pipe-top-left", "sprites/pipe-top-left.png");
k.loadSprite("pipe-top-right", "sprites/pipe-top-right.png");
k.loadSprite("question", "sprites/question.png");
k.loadSprite("unboxed", "sprites/unboxed.png");
k.loadSprite("background", "sprites/background.png");

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
  "    ? #?#?#                 ",
  "                            ",
  "            	     -+           ",
  "            ^    ^()   ^       ",
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

    "?": () => [
      k.sprite("question"),
      k.area(),
      k.body({ isStatic: true }),
      "question",
    ],

    "(": () => [
      k.sprite("pipe-left"),
      k.area(),
      k.scale(0.5),
      k.body({ isStatic: true }),
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

    "^": () => [
      k.sprite("evil-shroom"),
      k.area(),
      k.body({ isStatic: true }),
      k.scale(1),
      "evil-shroom",
    ],
  },
};

const gameLevel = k.addLevel(map, levelCfg);

const background = k.add([
  k.sprite("background"),
  k.pos(0, 0),
  k.scale(k.width() / 800, k.height() / 320),
  k.z(-1),
]);

const scoreLabel = k.add([
  k.text("score " + "00000", { size: 18 }),
  k.pos(40, 20),
  k.z(100),
  {
    value: "0",
  },
]);

const level = k.add([k.text("level " + "0", { size: 18 }), k.pos(40, 6)]);

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
  },
]);

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

k.onUpdate(() => {
  if (!player.isGrounded()) {
    if (player.dir === "right") {
      player.use(k.sprite("mario-jumping"));
    }

    if (player.dir === "left") {
      player.use(k.sprite("mario-jumping"));
    }
  } else {
    if (player.dir === "right") {
      player.use(k.sprite("mario"));
      player.current = "right";
    }

    if (player.dir === "left") {
      player.use(k.sprite("mario-left"));
      player.current = "left";
    }
  }
});

player.on("headbump", (obj) => {
  if (obj.is("question")) {
    console.log("headbump");
  }
});
