import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const storiesRef = collection(window.db, "stories");
const adminDiv = document.getElementById("adminStories");

async function loadPendingStories() {
  adminDiv.innerHTML = "<h2>Pending Stories</h2>";

  const q = query(storiesRef, where("approved", "==", false));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    adminDiv.innerHTML += "<p>No pending stories 🎉</p>";
    return;
  }

  snapshot.forEach(d => {
    const data = d.data();
    const card = document.createElement("div");
    card.className = "story-card";

    card.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.story}</p>
      <p class="category">${data.category}</p>
      <button onclick="approveStory('${d.id}')">✅ Approve</button>
      <button onclick="deleteStory('${d.id}')">🗑 Delete</button>
    `;

    adminDiv.appendChild(card);
  });
}

window.approveStory = async (id) => {
  await updateDoc(doc(window.db, "stories", id), {
    approved: true
  });
  loadPendingStories();
};

window.deleteStory = async (id) => {
  if (confirm("Delete this story?")) {
    await deleteDoc(doc(window.db, "stories", id));
    loadPendingStories();
  }
};

loadPendingStories();
