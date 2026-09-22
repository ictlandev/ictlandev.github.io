const intro = document.getElementById("introScreen");
const flowerScreen = document.getElementById("flowerScreen");
const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");
const song = document.getElementById("song");

const heartsCanvas = document.getElementById("hearts");
const heartsCtx = heartsCanvas.getContext("2d");

const petalsCanvas = document.getElementById("petals");
const petalsCtx = petalsCanvas.getContext("2d");

let hearts = [];
let petals = [];
let audioContext = null;

function resizeCanvas(canvas, ctx) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * ratio);
  canvas.height = Math.floor(innerHeight * ratio);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function resizeAll() {
  resizeCanvas(heartsCanvas, heartsCtx);
  resizeCanvas(petalsCanvas, petalsCtx);
}

function heart(fromBottom = false) {
  return {
    x: Math.random() * innerWidth,
    y: fromBottom ? innerHeight + 25 : Math.random() * innerHeight,
    size: 5 + Math.random() * 11,
    speed: .25 + Math.random() * .8,
    drift: (Math.random() - .5) * .4,
    wave: Math.random() * Math.PI * 2,
    alpha: .12 + Math.random() * .35,
    rotation: (Math.random() - .5) * .6
  };
}

function petal(fromTop = false) {
  return {
    x: Math.random() * innerWidth,
    y: fromTop ? -30 : Math.random() * innerHeight,
    size: 4 + Math.random() * 7,
    speed: .4 + Math.random() * .9,
    drift: (Math.random() - .5) * .7,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - .5) * .04,
    alpha: .16 + Math.random() * .4
  };
}

function drawHeart(h) {
  heartsCtx.save();
  heartsCtx.translate(h.x, h.y);
  heartsCtx.rotate(h.rotation);
  heartsCtx.globalAlpha = h.alpha;
  heartsCtx.beginPath();
  const s = h.size;
  heartsCtx.moveTo(0, s * .8);
  heartsCtx.bezierCurveTo(-s * 1.05, s * .05, -s * .7, -s * .65, 0, -s * .22);
  heartsCtx.bezierCurveTo(s * .7, -s * .65, s * 1.05, s * .05, 0, s * .8);
  heartsCtx.fillStyle = "#f16b8e";
  heartsCtx.fill();
  heartsCtx.restore();
}

function drawPetal(p) {
  petalsCtx.save();
  petalsCtx.translate(p.x, p.y);
  petalsCtx.rotate(p.angle);
  petalsCtx.globalAlpha = p.alpha;
  petalsCtx.beginPath();
  petalsCtx.ellipse(0, 0, p.size * .55, p.size, .4, 0, Math.PI * 2);
  petalsCtx.fillStyle = "#ffd84b";
  petalsCtx.fill();
  petalsCtx.restore();
}

function animate() {
  heartsCtx.clearRect(0, 0, innerWidth, innerHeight);
  petalsCtx.clearRect(0, 0, innerWidth, innerHeight);

  hearts.forEach((h, i) => {
    h.y -= h.speed;
    h.wave += .012;
    h.x += h.drift + Math.sin(h.wave) * .16;
    drawHeart(h);
    if (h.y < -40) hearts[i] = heart(true);
  });

  petals.forEach((p, i) => {
    p.y += p.speed;
    p.x += p.drift + Math.sin(p.angle) * .25;
    p.angle += p.spin;
    drawPetal(p);
    if (p.y > innerHeight + 40) petals[i] = petal(true);
  });

  requestAnimationFrame(animate);
}

function seedParticles() {
  hearts = Array.from({length: 24}, () => heart());
  petals = Array.from({length: 18}, () => petal());
}

function burst() {
  for (let i = 0; i < 28; i++) {
    const h = heart(true);
    h.x = innerWidth / 2 + (Math.random() - .5) * 300;
    h.y = innerHeight * .72 + Math.random() * 50;
    h.speed = 1 + Math.random() * 1.7;
    h.alpha = .3 + Math.random() * .5;
    hearts.push(h);
  }

  for (let i = 0; i < 35; i++) {
    const p = petal(true);
    p.x = innerWidth / 2 + (Math.random() - .5) * 280;
    p.y = innerHeight * .38 + Math.random() * 70;
    p.speed = .7 + Math.random() * 1.5;
    p.alpha = .4 + Math.random() * .35;
    petals.push(p);
  }

  hearts = hearts.slice(-65);
  petals = petals.slice(-60);
}

function playGenericClip() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 523.25, 392];

    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      const t = now + i * .20;
      gain.gain.setValueAtTime(.0001, t);
      gain.gain.exponentialRampToValueAtTime(.055, t + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, t + .18);

      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(t);
      osc.stop(t + .19);
    });
  } catch (e) {
    console.log("Audio de demostración no disponible.", e);
  }
}

async function playSong() {
  // iOS Safari requiere interacción del usuario para iniciar audio.
  // Como esta función se llama desde el toque del botón, se puede reproducir aquí.
  try {
    song.currentTime = 0;
    await song.play();
  } catch (e) {
    // Si no existe el MP3 o el navegador lo rechaza, usa un sonido genérico.
    playGenericClip();
  }
}

function openExperience() {
  intro.classList.add("hide");
  flowerScreen.classList.add("show");
  flowerScreen.setAttribute("aria-hidden", "false");

  burst();
  playSong();
}

function replayExperience() {
  burst();
  playSong();
}

startButton.addEventListener("click", openExperience, {passive: true});
replayButton.addEventListener("click", replayExperience, {passive: true});
window.addEventListener("resize", resizeAll);

resizeAll();
seedParticles();
animate();
