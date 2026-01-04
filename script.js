// 🔥 Firebase imports
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔗 Reference to Firestore collection
const storiesRef = collection(window.db, "stories");

// 🚀 App start
window.onload = async function () {
  applySavedTheme();
  loadStories();
};

// ➕ Add story
async function addStory() {
  const title = document.getElementById("title").value.trim();
  const story = document.getElementById("story").value.trim();
  const category = document.getElementById("category").value;
  const anonymous = document.getElementById("anonymous").checked;

  if (title === "" || story === "") {
    alert("Please write the incident");
    return;
  }

  await addDoc(storiesRef, {
    title,
    story,
    category,
    anonymous,
    createdAt: serverTimestamp()
  });

  document.getElementById("title").value = "";
  document.getElementById("story").value = "";

  loadStories();
}

// 📥 Load stories
async function loadStories() {
  const storiesDiv = document.getElementById("stories");
  storiesDiv.innerHTML = "<h2>Real Incidents</h2>";

  const q = query(storiesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  // Empty state
  if (snapshot.empty) {
    storiesDiv.innerHTML +=
      "<p style='opacity:0.7'>No stories yet. Be the first to share.</p>";
    return;
  }

  // Render stories
  snapshot.forEach(doc => {
    renderStory(doc.data());
  });
}

// 🧱 Render story card
function renderStory(data) {
  const shortStory =
    data.story.length > 120
      ? data.story.substring(0, 120) + "..."
      : data.story;

  const card = document.createElement("div");
  card.className = "story-card";

  card.innerHTML = `
    <h3>${data.title}</h3>

    <p class="story-text" data-full="${data.story}">
      ${shortStory}
    </p>

    <button class="read-btn" onclick="toggleRead(this)">Read More</button>

    <div class="reactions">
      <button onclick="react(this)">❤️ <span>0</span></button>
      <button onclick="react(this)">🤍 <span>0</span></button>
      <button onclick="react(this)">🙏 <span>0</span></button>
    </div>

    <button class="report-btn" onclick="reportStory(this)">🚩 Report</button>

    <p class="category">
      ${data.category} • ${data.anonymous ? "Anonymous" : "Shared with name"}
    </p>
  `;

  document.getElementById("stories").appendChild(card);
}

// 📖 Read more / less
function toggleRead(btn) {
  const p = btn.previousElementSibling;
  const fullText = p.getAttribute("data-full");

  if (btn.innerText === "Read More") {
    p.innerText = fullText;
    btn.innerText = "Read Less";
  } else {
    p.innerText = fullText.substring(0, 120) + "...";
    btn.innerText = "Read More";
  }
}

// ❤️ Reactions (local only)
function react(button) {
  const span = button.querySelector("span");
  span.innerText = parseInt(span.innerText) + 1;
}

// 🚩 Report story
function reportStory(btn) {
  const reason = prompt(
    "Why are you reporting this?\n\n1. Abuse\n2. Fake\n3. Hate\n4. Other"
  );

  if (reason) {
    const card = btn.closest(".story-card");
    card.innerHTML =
      "<p style='color:red;font-weight:bold'>🚩 This story has been reported.</p>";
  }
}

// 🌙 Day / Night theme
function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  localStorage.setItem("manualTheme", "true");

  document.getElementById("themeToggle").innerText =
    isDark ? "☀️ Day Mode" : "🌙 Night Mode";
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  const manual = localStorage.getItem("manualTheme");

  if (saved) {
    document.body.classList.toggle("dark", saved === "dark");
    document.getElementById("themeToggle").innerText =
      saved === "dark" ? "☀️ Day Mode" : "🌙 Night Mode";
  } else if (!manual) {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      document.body.classList.add("dark");
      document.getElementById("themeToggle").innerText = "☀️ Day Mode";
    }
  }
}
