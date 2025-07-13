function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

const photoInput = document.getElementById('photoInput');
const previewContainer = document.getElementById('previewContainer');
const resultImage = document.getElementById('resultImage');
const resultText = document.getElementById('resultText');
const accuracyScore = document.getElementById('accuracyScore');
const dayPrediction = document.getElementById('dayPrediction');

let capturedImageData = null;
let usingCamera = false;

const personalityTraits = [
  "You're a natural leader 🔥",
  "You think deeply and wisely 🧠",
  "People find you trustworthy 🤝",
  "You spread positivity 😊",
  "You’re calm under pressure 🧘",
  "You're emotionally intelligent 💖",
  "You value honesty 💬",
  "You have creative thinking 🎨",
  "You observe small details 👀",
  "You inspire others 🌟"
];

const wrongImageMessages = [
  "🚫 Please upload a valid face image!",
  "⛔ That doesn’t look like a face. Try again!",
  "⚠️ No face detected. Use a clearer image!"
];

const fakeDays = [
  "Today brings new adventures! 🚀",
  "Focus on personal growth 🌱",
  "Laugh more today! 😂",
  "Trust your intuition 🧭",
  "Good news is coming 📩"
];

photoInput.addEventListener('change', function () {
  previewContainer.innerHTML = '';
  const file = this.files[0];
  if (file) {
    usingCamera = false;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    previewContainer.appendChild(img);
    capturedImageData = img.src;
  }
});

function openCamera() {
  const video = document.getElementById('cameraFeed');
  const container = document.getElementById('cameraContainer');
  container.style.display = 'block';

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert('Camera access denied.');
    });
}

function capturePhoto() {
  const video = document.getElementById('cameraFeed');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  capturedImageData = canvas.toDataURL('image/png');

  previewContainer.innerHTML = '';
  const img = document.createElement('img');
  img.src = capturedImageData;
  previewContainer.appendChild(img);
  usingCamera = true;
}

function analyzePhoto() {
  if (!capturedImageData) {
    alert('Please upload or capture a photo first!');
    return;
  }

  // Fake face detection (simulate 25% fail chance)
  const isFace = Math.random() > 0.25;
  if (!isFace) {
    alert(wrongImageMessages[Math.floor(Math.random() * wrongImageMessages.length)]);
    return;
  }

  goToScreen('loadingScreen');

  setTimeout(() => {
    resultImage.innerHTML = `<img src="${capturedImageData}" alt="Face Result" />`;

    const shuffled = personalityTraits.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8).map(trait => `<li>${trait}</li>`).join('');
    resultText.innerHTML = `<ul>${selected}</ul>`;

    accuracyScore.textContent = Math.floor(70 + Math.random() * 20);
    dayPrediction.textContent = fakeDays[Math.floor(Math.random() * fakeDays.length)];

    goToScreen('resultScreen');
  }, 3000);
}

function shareResult() {
  const text = `${resultText.innerText}\nScore: ${accuracyScore.textContent}%\n${dayPrediction.textContent}`;
  if (navigator.share) {
    navigator.share({
      title: 'My Face Analyzer Result',
      text: text,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(text);
    alert('Result copied to clipboard!');
  }
}