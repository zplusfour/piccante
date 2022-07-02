import kaboom from "kaboom";

let scaleFactor = window.innerWidth / 1920;

kaboom({
  background: [128, 180, 255],
  scale: scaleFactor,
});


loadSprite("mrpepper", "./sprites/mrpepper.png", {
  sliceX: 5,
	anims: {
		"idle": {
			from: 0,
			to: 1,
			speed: 3,
			loop: true
		},
		"run": {
			from: 2,
			to: 3,
			speed: 7,
			loop: true
		},
		"jump": 4
	}
});

loadSprite("chest", "./sprites/chest_Slice.png", {
	sliceX: 2,
	anims: {
		closed: 0,
		opened: 1
	}
});

loadSprite("mrtasteless", "./sprites/mrtasteless_Single.png");
loadSprite("block", "./sprites/block.png");
loadSprite("coin", "./sprites/coin.png");
loadSprite("checkpoint", "./sprites/checkpoint.png");
loadSprite("pepper", "./sprites/pepper.png");
loadSprite("trampoline", "./sprites/trampoline.png");
loadSprite("m", "./sprites/m.png");
loadSprite("golden_pepper", "./sprites/golden_pepper.png");

loadSound("checkpoint", "./sounds/checkpoint.mp3");
loadSound("hit", "./sounds/hit.mp3");
loadSound("jump", "./sounds/jump.mp3");
loadSound("collect", "./sounds/collect.mp3");

function enableFullscreen() {
  onKeyPress("f", (c) => {
    fullscreen(!isFullscreen());
  });
}

var _score = 0;

scene("game", async ({ levelId, score } = { levelId: 0, score: 0 }) => {
  var SPEED = 300;
  var JUMP_FORCE = 0;
  var FALL_DEATH = 2400;

  if (scaleFactor <= 1) {
    JUMP_FORCE = 500;
  } else {
    JUMP_FORCE = 800;
  }

  gravity(640);
  add([rect(width(), 24), area(), outline(1), pos(0, height() - 24), solid()]); // ground
	
  const spicyMode = () => {
    let isSpicy = false;
    return {
      id: "spicy",
      require: ["scale", "color"],
      update() {
        if (!isSpicy) return;
        this.color = rgb(245, 85, 73);
        this.scale = 1.3;
				SPEED = 470;
      },
      isSpicyA() {
        return isSpicy;
      },
      becomeSpicy() {
        isSpicy = true;
      },
    };
  };
  const player = add([
    sprite("mrpepper"),
    pos(100, 100),
    // origin("center"),
    area(),
		scale(1),
		color(),
    body(),
    spicyMode(),
    "mrpepper",
  ]);

  player.play("idle");
  player.onGround(() => {
    if (!isKeyDown("left") && !isKeyDown("right")) {
      player.play("idle");
    } else {
      player.play("run");
    }
  });

  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      player.play("jump");
    }
  });

  onKeyDown("left", () => {
    player.move(-SPEED, 0);
    player.flipX(true);
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
    }
  });

  onKeyDown("a", () => {
    player.move(-SPEED, 0);
    player.flipX(true);
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
    }
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
    player.flipX(false);
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
    }
  });

  onKeyDown("d", () => {
    player.move(SPEED, 0);
    player.flipX(false);
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
    }
  });

  onKeyRelease(["left", "right"], () => {
    if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
      player.play("idle");
    }
  });

  onKeyRelease(["a", "d"], () => {
    if (player.isGrounded() && !isKeyDown("a") && !isKeyDown("d")) {
      player.play("idle");
    }
  });

  function patrol(speed = 60, dir = 1) {
    return {
      id: "patrol",
      require: ["pos", "area"],
      add() {
        this.on("collide", (obj, col) => {
          if (col.isLeft() || col.isRight()) {
            dir = -dir;
          }
        });
      },
      update() {
        this.move(speed * dir, 0);
      },
    };
  }
  // currently my favorite kaboom feature
  const levels = [
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "																					%",
      "																						",
      "																			X X X X X X",
      "",
      "",
      "",
      "       				$$$",
      "								X X X X X X",
      "																																															 								@",
      "																																					X   >   X   		$$$$ ",
    ],
    [
      "",
      "",
      "",
      "",
      "																																																																						@",
      "",
      "																																			^																			$$$",
      "																																			X X X X X									X X X X      				X X",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "																					^",
      "																					X X X X X",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "															^",
    ],[
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"																																																													@",
			"																																																																					",
			"																				%",
			"																			X X X X												X X X              X X X X X               ",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"											^																																																	",
		],
		[
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"																																																																																																								@",
			"																																																																																													",
			"",
			"																													#",
			"																									X X X X X    X X X X X    X X X X X    X X X X X    X X X X X    X X X X X    X X X X X    X X X X X    X X X X X    X X X X X   ",
			"",
			"",
			"",
			"																$$$",
			"															X X X X X",
			"",
			"",
			"",
			"",
			"",
			"",
			"						X 	>  X",
		],
		[
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"																																																					m",
		]
  ];
  const levelsConfig = {
    width: 32,
    height: 32,
    X: () => [sprite("block"), area(), solid()],
    $: () => [sprite("coin"), area(), body(), "coin"],
    "%": () => [sprite("chest"), area(), solid(), body(), "chest"],
    "#": () => [sprite("pepper"), area(), body(), "pepper"],
    ">": () => [sprite("mrtasteless"), area(), body(), patrol(), "enemy"],
		"m": () => [sprite("m"), area(), body(), "m"],
    "@": () => [
      sprite("checkpoint"),
      area({ scale: 0.5 }),
      pos(0, -12),
      "checkpoint",
    ],
    "^": () => [sprite("trampoline"), area(), body(), "trampoline"],
		"G": () => [sprite("golden_pepper"), area(), body(), "G"]
  };

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go("lose");
    }
  });

  const level = addLevel(levels[levelId ?? 0], levelsConfig);
  player.onCollide("checkpoint", () => {
		play('checkpoint');
    if (levelId + 1 < levels.length) {
      go("game", {
        levelId: levelId + 1,
        score,
      });
    } else {
      go("win");
    }
  });

  player.onGround((l) => {
    if (l.is("enemy")) {
			play("hit");
      player.jump(JUMP_FORCE * 1.2);
      player.play("jump");
      score += 200;
			_score += 200;
      scoreLabel.text = `Score: ${score}`;
      destroy(l);
    } else if (l.is("trampoline")) {
			play("jump");
      player.jump(JUMP_FORCE * 1.5);
      player.play("jump");
    }
  });

  player.onCollide("enemy", (e, col) => {
    if (!col.isBottom()) {
      go("lose");
    }
  });

  let spicy = false;
  player.onCollide("chest", (c) => {
    if (!spicy) {
			const prizes = ["#", "$"];
			level.spawn(prizes[Math.floor(Math.random() * prizes.length)], c.gridPos.sub(0, 7));
      // prize.jump();
			destroy(c);
    }
  });

  player.onCollide("pepper", (p) => {
    score += 200;
		_score += 200;
    spicy = true;
		play("collect");
    scoreLabel.text = `Score: ${score}`;
		spicyLabel.text = `SPICY MODE: ${spicy ? 'on' : 'off'}`;
    destroy(p);
    player.becomeSpicy();
  });

	player.onCollide("m", (m) => {
		level.spawn("G", m.gridPos.sub(0, 7));
		destroy(m);
	});

	player.onCollide("G", (G) => {
		go("special");
	});

  var scoreLabel = add([
    text(`Score: ${score}`, { font: "sinko", size: 20 }),
    pos(24, 24),
    fixed(),
  ]);

	var spicyLabel = add([
		text(`SPICY MODE: ${spicy ? 'on' : 'off'}`, { font: "sinko", size: 20 }),
		pos(24, 60),
		fixed()
	]);


  player.onCollide("coin", (c) => {
    destroy(c);
    score += 100;
		_score += 100;
		play("collect");
    scoreLabel.text = `Score: ${score}`;
  });
});

scene("special", async () => {
	add([
		text("Congratulations, player! You found the GOLDEN PEPPER!\nMeaning that you won the game, have a great day!", { font: "sinko" }),
		pos(100, 400),
		scale(4)
	]);
	onKeyPress(() => go("main"));
});

scene("lose", async () => {
  add([text("You Lost!", { font: "sinko" }), pos(825, 400), scale(4)]);
  onKeyPress(() => go("main"));
});

scene("win", async () => {
  add([text(`You Won!`, { font: "sinko" }), pos(825, 400), scale(4)]);
	add([text(`Score: ${_score}`, { font: "sinko" }), pos(825, 500), scale(4)]);
	_score = 0;
  onKeyPress(() => go("main"));
});

scene("main", async () => {
  enableFullscreen();
  const titleComps = [
    text("Piccante", { font: "sinko" }),
    pos(825, 400),
    scale(4),
  ];

  add(titleComps);
  add([
    text("press any key to start the game!", { font: "sinko" }),
    pos(center()),
    origin("center"),
    scale(2),
  ]);

  add([
    text("press f to go fullscreen!", { font: "sinko" }),
    pos(10, 20),
    scale(2),
  ]);

  onKeyPress(() => go("game"));
});

go("main");
