import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const storiesRef = collection(window.db, "stories");

window.onload = () => {
  applySavedTheme();
  loadStories();
};

// Add Story
async function addStory() {
  const title = document.getElementById("title").value.trim();
  const story = document.getElementById("story").value.trim();
  const category = document.getElementById("category").value;
  const anonymous = document.getElementById("anonymous").checked;

  if (!title || !story) {
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

// Load Stories
async function loadStories() {
  const storiesDiv = document.getElementById("stories");
  storiesDiv.innerHTML = "<h2>Real Incidents</h2>";

  const q = query(storiesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    storiesDiv.innerHTML += "<p style='opacity:0.7'>No stories yet. Be the first to share.</p>";
    return;
  }

  snapshot.forEach(doc => renderStory(doc.data()));
}

// Render Story
function renderStory(data) {
  const shortStory =
    data.story.length > 120
      ? data.story.substring(0, 120) + "..."
      : data.story;

  const card = document.createElement("div");
  card.className = "story-card";

  card.innerHTML = `
    <h3>${data.title}</h3>
    <p class="story-text" data-full="${data.story}">${shortStory}</p>
    <button class="read-btn" onclick="toggleRead(this)">Read More</button>

    <div class="reactions">
      <button onclick="react(this)">❤️ <span>0</span></button>
      <button onclick="react(this)">🤍 <span>0</span></button>
      <button onclick="react(this)">🙏 <span>0</span></button>
    </div>

    <button class="report-btn" onclick="reportStory(this)">🚩 Report</button>

    <p class="category">
      ${data.category} · ${data.anonymous ? "Anonymous" : "Shared with name"}
    </p>
  `;

  document.getElementById("stories").appendChild(card);
}

// Read More
function toggleRead(btn) {
  const p = btn.previousElementSibling;
  const full = p.getAttribute("data-full");

  if (btn.innerText === "Read More") {
    p.innerText = full;
    btn.innerText = "Read Less";
  } else {
    p.innerText = full.substring(0, 120) + "...";
    btn.innerText = "Read More";
  }
}

// Reactions
function react(btn) {
  const span = btn.querySelector("span");
  span.innerText = parseInt(span.innerText) + 1;
}

// Report
function reportStory(btn) {
  const card = btn.closest(".story-card");
  card.innerHTML = "<p style='color:red;font-weight:bold'>🚩 This story has been reported</p>";
}

// Theme
function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggle").innerText =
    isDark ? "🌞 Day Mode" : "🌙 Night Mode";
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").innerText = "🌞 Day Mode";
  }
}
