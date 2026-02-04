/* Shiba Neighborhood Explorer — A cute interactive game where you explore houses! */

const TILE_SIZE = 32;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 40;
const WORLD_HEIGHT = 30;

// Game state
let canvas, ctx;
let player = {
  x: 10 * TILE_SIZE,
  y: 15 * TILE_SIZE,
  dir: 0, // 0=down, 1=left, 2=right, 3=up
  isMoving: false,
  animTime: 0, // Continuous animation time
  speed: 2,
};

let keys = {};
let nearbyHouse = null;
let camera = { x: 0, y: 0 };

// Houses configuration
// Paths are relative to projects/shiba-neighborhood/
const houses = [
  {
    id: 1,
    x: 5,
    y: 5,
    name: "Javi's Town Trials",
    game: "../javi-town-trials/index.html",
    ready: true,
  },
  {
    id: 2,
    x: 15,
    y: 5,
    name: "Special Games",
    game: "../game-selector/index.html",
    ready: true,
  },
  {
    id: 3,
    x: 25,
    y: 5,
    name: "Game 3",
    game: null,
    ready: false,
  },
  {
    id: 4,
    x: 5,
    y: 20,
    name: "Game 4",
    game: null,
    ready: false,
  },
  {
    id: 5,
    x: 15,
    y: 20,
    name: "Game 5",
    game: null,
    ready: false,
  },
  {
    id: 6,
    x: 25,
    y: 20,
    name: "Game 6",
    game: null,
    ready: false,
  },
];

// Modal elements
let houseModal, houseModalTitle, houseModalDesc, houseModalEnter, houseModalCancel, houseModalClose;
let tipText, locationText, messageText;

// Mobile controls
let touchControls, mobileControlsPanel;
let joyBase, joyKnob, joyBaseInline, joyKnobInline;
let actionBtn, actionBtnInline;
let joystickActive = false;
let joystickDir = { x: 0, y: 0 };

function main() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // Modal elements
  houseModal = document.getElementById("houseModal");
  houseModalTitle = document.getElementById("houseModalTitle");
  houseModalDesc = document.getElementById("houseModalDesc");
  houseModalEnter = document.getElementById("houseModalEnter");
  houseModalCancel = document.getElementById("houseModalCancel");
  houseModalClose = document.getElementById("houseModalClose");

  // HUD elements
  tipText = document.getElementById("tipText");
  locationText = document.getElementById("locationText");
  messageText = document.getElementById("messageText");

  // Mobile controls
  touchControls = document.getElementById("touchControls");
  mobileControlsPanel = document.getElementById("mobileControlsPanel");
  joyBase = document.getElementById("joyBase");
  joyKnob = document.getElementById("joyKnob");
  joyBaseInline = document.getElementById("joyBaseInline");
  joyKnobInline = document.getElementById("joyKnobInline");
  actionBtn = document.getElementById("actionBtn");
  actionBtnInline = document.getElementById("actionBtnInline");

  // Setup event listeners
  setupKeyboard();
  setupMouse();
  setupTouch();
  setupModal();

  // Update mobile controls visibility
  updateTouchControlsLayout();

  // Start game loop
  requestAnimationFrame(tick);

  // Initial message
  showMessage("Welcome! Use arrow keys or WASD to move around. Press Enter at houses to enter!");
}

function setupKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (houseModal && !houseModal.hidden) {
      if (e.key === "Escape") {
        closeHouseModal();
      }
      return;
    }

    keys[e.key] = true;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      interact();
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });
}

function setupMouse() {
  // D-pad buttons
  document.querySelectorAll(".kbd-btn").forEach((btn) => {
    btn.addEventListener("mousedown", () => {
      const vkey = btn.dataset.vkey;
      keys[vkey] = true;
    });
    btn.addEventListener("mouseup", () => {
      const vkey = btn.dataset.vkey;
      keys[vkey] = false;
    });
    btn.addEventListener("mouseleave", () => {
      const vkey = btn.dataset.vkey;
      keys[vkey] = false;
    });
  });
}

function setupTouch() {
  // Joystick
  [joyBase, joyBaseInline].forEach((base) => {
    if (!base) return;

    const knob = base === joyBase ? joyKnob : joyKnobInline;
    let startX = 0,
      startY = 0;
    let baseRect = null;

    const start = (e) => {
      e.preventDefault();
      joystickActive = true;
      baseRect = base.getBoundingClientRect();
      startX = baseRect.left + baseRect.width / 2;
      startY = baseRect.top + baseRect.height / 2;
      updateJoystick(e);
    };

    const move = (e) => {
      if (!joystickActive) return;
      e.preventDefault();
      updateJoystick(e);
    };

    const end = () => {
      joystickActive = false;
      joystickDir = { x: 0, y: 0 };
      if (knob) {
        knob.style.transform = "translate(-50%, -50%)";
      }
    };

    const updateJoystick = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = baseRect.width / 2 - 25;

      if (dist > maxDist) {
        const angle = Math.atan2(dy, dx);
        joystickDir.x = Math.cos(angle) * maxDist;
        joystickDir.y = Math.sin(angle) * maxDist;
      } else {
        joystickDir.x = dx;
        joystickDir.y = dy;
      }

      if (knob) {
        const offsetX = (joystickDir.x / maxDist) * (baseRect.width / 2 - 25);
        const offsetY = (joystickDir.y / maxDist) * (baseRect.height / 2 - 25);
        knob.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      }
    };

    base.addEventListener("pointerdown", start);
    base.addEventListener("pointermove", move);
    base.addEventListener("pointerup", end);
    base.addEventListener("pointercancel", end);
    base.addEventListener("touchstart", start, { passive: false });
    base.addEventListener("touchmove", move, { passive: false });
    base.addEventListener("touchend", end);
  });

  // Action button
  [actionBtn, actionBtnInline].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      interact();
    });
  });
}

function setupModal() {
  houseModalClose.addEventListener("click", closeHouseModal);
  houseModalCancel.addEventListener("click", closeHouseModal);
  houseModalEnter.addEventListener("click", () => {
    if (nearbyHouse) {
      if (nearbyHouse.ready && nearbyHouse.game) {
        window.location.href = nearbyHouse.game;
      } else {
        closeHouseModal();
        showMessage(`Game ${nearbyHouse.id} is ready!`);
      }
    }
  });
}

function updateTouchControlsLayout() {
  const isMobile = window.innerWidth <= 768 || "ontouchstart" in window;
  if (isMobile) {
    touchControls.hidden = false;
    mobileControlsPanel.hidden = false;
  } else {
    touchControls.hidden = true;
    mobileControlsPanel.hidden = true;
  }
}

window.addEventListener("resize", updateTouchControlsLayout);

function tick(now) {
  update();
  draw();
  requestAnimationFrame(tick);
}

function update() {
  // Handle movement input
  let dx = 0,
    dy = 0;

  // Keyboard
  if (keys["ArrowUp"] || keys["w"] || keys["W"]) dy = -1;
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) dy = 1;
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dx = -1;
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx = 1;

  // Joystick
  if (joystickActive) {
    const threshold = 10;
    if (Math.abs(joystickDir.y) > threshold) dy = joystickDir.y > 0 ? 1 : -1;
    if (Math.abs(joystickDir.x) > threshold) dx = joystickDir.x > 0 ? 1 : -1;
  }

  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  // Update player position
  if (dx !== 0 || dy !== 0) {
    player.isMoving = true;
    player.x += dx * player.speed;
    player.y += dy * player.speed;

    // Update direction
    if (dy < 0) player.dir = 3; // up
    else if (dy > 0) player.dir = 0; // down
    else if (dx < 0) player.dir = 1; // left
    else if (dx > 0) player.dir = 2; // right

    // Smooth animation time (cycles every 0.8 seconds)
    player.animTime += 0.05;
    if (player.animTime > Math.PI * 2) player.animTime -= Math.PI * 2;

    // Boundary check
    player.x = Math.max(TILE_SIZE, Math.min(WORLD_WIDTH * TILE_SIZE - TILE_SIZE, player.x));
    player.y = Math.max(TILE_SIZE, Math.min(WORLD_HEIGHT * TILE_SIZE - TILE_SIZE, player.y));
  } else {
    player.isMoving = false;
    // Continue idle animation
    player.animTime += 0.02;
    if (player.animTime > Math.PI * 2) player.animTime -= Math.PI * 2;
  }

  // Update camera to follow player
  camera.x = player.x - CANVAS_WIDTH / 2;
  camera.y = player.y - CANVAS_HEIGHT / 2;
  camera.x = Math.max(0, Math.min(WORLD_WIDTH * TILE_SIZE - CANVAS_WIDTH, camera.x));
  camera.y = Math.max(0, Math.min(WORLD_HEIGHT * TILE_SIZE - CANVAS_HEIGHT, camera.y));

  // Check for nearby house
  nearbyHouse = null;
  for (const house of houses) {
    const houseX = house.x * TILE_SIZE;
    const houseY = house.y * TILE_SIZE;
    const dist = Math.sqrt(
      Math.pow(player.x - houseX - TILE_SIZE, 2) + Math.pow(player.y - houseY - TILE_SIZE, 2)
    );
    if (dist < TILE_SIZE * 2) {
      nearbyHouse = house;
      break;
    }
  }

  // Update tip text
  if (nearbyHouse) {
    tipText.textContent = `Press Enter to enter ${nearbyHouse.name}!`;
  } else {
    tipText.textContent = "Walk to a house and press Enter to enter!";
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Apply camera transform
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // Draw grass
  ctx.fillStyle = "#90ee90";
  ctx.fillRect(0, 0, WORLD_WIDTH * TILE_SIZE, WORLD_HEIGHT * TILE_SIZE);

  // Draw paths
  ctx.fillStyle = "#d2b48c";
  for (let x = 0; x < WORLD_WIDTH; x++) {
    ctx.fillRect(x * TILE_SIZE, 10 * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillRect(x * TILE_SIZE, 15 * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillRect(x * TILE_SIZE, 20 * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    ctx.fillRect(5 * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillRect(15 * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillRect(25 * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  // Draw houses
  for (const house of houses) {
    drawHouse(house.x * TILE_SIZE, house.y * TILE_SIZE, house);
  }

  // Draw player (Shiba)
  drawShiba(player.x, player.y, player.dir, player.isMoving, player.animTime);

  // Draw interaction indicator
  if (nearbyHouse) {
    const houseX = nearbyHouse.x * TILE_SIZE;
    const houseY = nearbyHouse.y * TILE_SIZE;
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(houseX + TILE_SIZE, houseY - 10, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHouse(x, y, house) {
  // House base
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x, y, TILE_SIZE * 2, TILE_SIZE * 2);

  // Roof
  ctx.fillStyle = "#654321";
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + TILE_SIZE, y - 15);
  ctx.lineTo(x + TILE_SIZE * 2 + 5, y);
  ctx.closePath();
  ctx.fill();

  // Door
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(x + TILE_SIZE / 2, y + TILE_SIZE, TILE_SIZE / 2, TILE_SIZE);

  // Window
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(x + TILE_SIZE * 1.5, y + TILE_SIZE / 2, TILE_SIZE / 3, TILE_SIZE / 3);
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + TILE_SIZE * 1.5, y + TILE_SIZE / 2, TILE_SIZE / 3, TILE_SIZE / 3);

  // House number
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(house.id.toString(), x + TILE_SIZE, y - 20);
}

// Pixel art Shiba sprite - side view
function drawShiba(x, y, dir, isMoving, animTime) {
  ctx.save();
  ctx.translate(x, y);
  
  let scaleX = 1;
  
  // Handle direction: 0=down, 1=left, 2=right, 3=up
  // For up/down, we'll use the side view rotated
  if (dir === 3) {
    // Up - rotate 90 degrees
    ctx.rotate(-Math.PI / 2);
  } else if (dir === 0) {
    // Down - rotate 90 degrees the other way
    ctx.rotate(Math.PI / 2);
  } else if (dir === 1) {
    // Left - flip horizontally
    ctx.scale(-1, 1);
    scaleX = -1;
  }
  // Right (dir === 2) - no transform needed
  
  // Get animation frame (0-3 for walk cycle, or 0 for idle)
  const frame = isMoving ? Math.floor((animTime * 4) % 4) : 0;
  
  // Pixel size
  const px = 2; // 2x2 pixels per "pixel" for visibility
  
  // Colors
  const brown = "#8B4513";      // Dark brown
  const lightBrown = "#CD853F";  // Medium brown
  const cream = "#FFF8DC";       // Cream/off-white
  const black = "#000000";       // Black
  const darkBrown = "#654321";   // Very dark brown
  
  // Draw pixel art sprite (side view, facing right by default)
  // Sprite is approximately 16x16 pixels
  
  // Helper to draw a pixel
  const pixel = (sx, sy, color) => {
    ctx.fillStyle = color;
    ctx.fillRect((sx - 8) * px, (sy - 8) * px, px, px);
  };
  
  // Frame 0 & 2: neutral/idle pose
  // Frame 1: left legs forward
  // Frame 3: right legs forward
  const legOffset = frame === 1 ? 1 : frame === 3 ? -1 : 0;
  
  // Head (cream muzzle area)
  pixel(4, 3, cream);
  pixel(5, 3, cream);
  pixel(6, 3, cream);
  pixel(4, 4, cream);
  pixel(5, 4, cream);
  pixel(6, 4, cream);
  pixel(7, 4, cream);
  pixel(5, 5, cream);
  pixel(6, 5, cream);
  pixel(7, 5, cream);
  
  // Head (brown)
  pixel(3, 2, lightBrown);
  pixel(4, 2, lightBrown);
  pixel(5, 2, brown);
  pixel(6, 2, brown);
  pixel(7, 2, lightBrown);
  pixel(3, 3, brown);
  pixel(7, 3, lightBrown);
  pixel(3, 4, brown);
  pixel(8, 4, lightBrown);
  pixel(3, 5, brown);
  pixel(4, 5, brown);
  pixel(8, 5, lightBrown);
  pixel(3, 6, brown);
  pixel(4, 6, brown);
  
  // Ear (pointed, dark brown)
  pixel(2, 1, darkBrown);
  pixel(3, 1, darkBrown);
  pixel(2, 2, darkBrown);
  
  // Eye
  pixel(5, 4, black);
  
  // Nose
  pixel(7, 5, black);
  
  // Body (brown)
  pixel(4, 7, brown);
  pixel(5, 7, brown);
  pixel(6, 7, brown);
  pixel(7, 7, brown);
  pixel(8, 7, lightBrown);
  pixel(4, 8, brown);
  pixel(5, 8, brown);
  pixel(6, 8, brown);
  pixel(7, 8, brown);
  pixel(8, 8, lightBrown);
  pixel(9, 8, lightBrown);
  pixel(5, 9, brown);
  pixel(6, 9, brown);
  pixel(7, 9, brown);
  pixel(8, 9, lightBrown);
  pixel(9, 9, lightBrown);
  
  // Chest (cream)
  pixel(4, 8, cream);
  pixel(5, 8, cream);
  pixel(4, 9, cream);
  pixel(5, 9, cream);
  
  // Tail (curled over back)
  pixel(10, 6, brown);
  pixel(11, 6, brown);
  pixel(10, 7, brown);
  pixel(11, 7, brown);
  pixel(12, 7, lightBrown);
  pixel(11, 8, brown);
  pixel(12, 8, lightBrown);
  pixel(10, 5, lightBrown);
  
  // Front legs
  const frontLegY = 10 + (frame === 1 ? -1 : 0);
  pixel(5, frontLegY, brown);
  pixel(5, frontLegY + 1, brown);
  pixel(5, frontLegY + 2, brown);
  pixel(6, frontLegY + 2, darkBrown); // paw
  
  const frontLeg2Y = 10 + (frame === 3 ? -1 : 0);
  pixel(7, frontLeg2Y, brown);
  pixel(7, frontLeg2Y + 1, brown);
  pixel(7, frontLeg2Y + 2, brown);
  pixel(8, frontLeg2Y + 2, darkBrown); // paw
  
  // Back legs
  const backLegY = 11 + (frame === 3 ? -1 : 0);
  pixel(8, backLegY, brown);
  pixel(8, backLegY + 1, brown);
  pixel(8, backLegY + 2, brown);
  pixel(9, backLegY + 2, darkBrown); // paw
  
  const backLeg2Y = 11 + (frame === 1 ? -1 : 0);
  pixel(10, backLeg2Y, brown);
  pixel(10, backLeg2Y + 1, brown);
  pixel(10, backLeg2Y + 2, brown);
  pixel(11, backLeg2Y + 2, darkBrown); // paw
  
  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(-8 * px, 12 * px, 20 * px * Math.abs(scaleX), 2);
  
  ctx.restore();
}

function interact() {
  if (nearbyHouse) {
    openHouseModal(nearbyHouse);
  } else {
    showMessage("Walk closer to a house first!");
  }
}

function openHouseModal(house) {
  houseModalTitle.textContent = house.name;
  if (house.ready && house.game) {
    houseModalDesc.textContent = `Ready to play! Click Enter to start ${house.name}.`;
    houseModalEnter.textContent = "Enter Game";
  } else {
    houseModalDesc.textContent = `Game ${house.id} is ready!`;
    houseModalEnter.textContent = "OK";
  }
  houseModal.hidden = false;
}

function closeHouseModal() {
  houseModal.hidden = true;
}

function showMessage(text) {
  messageText.textContent = text;
  setTimeout(() => {
    if (messageText.textContent === text) {
      messageText.textContent = "";
    }
  }, 3000);
}

// Initialize
main();
