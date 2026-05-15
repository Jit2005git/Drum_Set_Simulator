const kits = [
  {
    name: "crash",
    key: "c",
    caption: "Bright accent cymbal for explosive transitions.",
  },
  {
    name: "kick",
    key: "k",
    caption: "Low-end punch that drives the groove forward.",
  },
  {
    name: "snare",
    key: "s",
    caption: "Sharp backbeat to lock the rhythm in place.",
  },
  {
    name: "tom",
    key: "t",
    caption: "Warm fills that add movement and momentum.",
  },
];

const containerEl = document.querySelector(".container");
const activeTimers = new Map();
const kitMap = new Map();

function createSpark(buttonEl, x, y) {
  const sparkEl = document.createElement("span");
  sparkEl.className = "spark";
  sparkEl.style.setProperty("--spark-x", `${x}px`);
  sparkEl.style.setProperty("--spark-y", `${y}px`);
  buttonEl.appendChild(sparkEl);

  setTimeout(() => {
    sparkEl.remove();
  }, 550);
}

function animateKit(buttonEl, pointerX, pointerY) {
  buttonEl.classList.add("active");

  if (activeTimers.has(buttonEl)) {
    clearTimeout(activeTimers.get(buttonEl));
  }

  const timer = setTimeout(() => {
    buttonEl.classList.remove("active");
    activeTimers.delete(buttonEl);
  }, 180);

  activeTimers.set(buttonEl, timer);
  createSpark(buttonEl, pointerX, pointerY);
}

function playKit(kitName, event) {
  const currentKit = kitMap.get(kitName);

  if (!currentKit) {
    return;
  }

  currentKit.audio.currentTime = 0;
  currentKit.audio.play();

  const rect = currentKit.button.getBoundingClientRect();
  const pointerX = event?.clientX ? event.clientX - rect.left : rect.width / 2;
  const pointerY = event?.clientY ? event.clientY - rect.top : rect.height / 2;

  animateKit(currentKit.button, pointerX, pointerY);
}

kits.forEach((kit) => {
  const btnEl = document.createElement("button");
  btnEl.className = "btn";
  btnEl.type = "button";
  btnEl.setAttribute("aria-label", `Play ${kit.name} drum`);
  btnEl.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.1)), url(images/${kit.name}.png)`;
  btnEl.innerHTML = `
    <span class="btn-top">
      <span class="drum-key">${kit.key.toUpperCase()}</span>
      <span class="drum-type">Drum Pad</span>
    </span>
    <span class="btn-bottom">
      <span class="drum-name">${kit.name}</span>
      <span class="drum-caption">${kit.caption}</span>
    </span>
  `;

  const audioEl = document.createElement("audio");
  audioEl.src = `sounds/${kit.name}.mp3`;
  audioEl.preload = "auto";

  containerEl.appendChild(btnEl);
  containerEl.appendChild(audioEl);

  kitMap.set(kit.name, {
    button: btnEl,
    audio: audioEl,
    key: kit.key,
  });

  btnEl.addEventListener("click", (event) => {
    playKit(kit.name, event);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.repeat) {
    return;
  }

  const keyPressed = event.key.toLowerCase();
  const matchedKit = kits.find((kit) => kit.key === keyPressed);

  if (matchedKit) {
    playKit(matchedKit.name);
  }
});
