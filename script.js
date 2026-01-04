function addStory() {
  let title = document.getElementById("title").value;
  let story = document.getElementById("story").value;
  let category = document.getElementById("category").value;
  let anonymous = document.getElementById("anonymous").checked;

  if (title === "" || story === "") {
    alert("Please write the incident");
    return;
  }

  let shortStory = story.length > 120 ? story.substring(0, 120) + "..." : story;

  let card = document.createElement("div");
  card.className = "story-card";

  card.innerHTML = `
    <h3>${title}</h3>
    <p class="story-text" data-full="${story}">${shortStory}</p>
    <button class="read-btn" onclick="toggleRead(this)">Read More</button>
    <p class="category">${category} • ${anonymous ? "Anonymous" : "Shared with name"}</p>
  `;

  document.getElementById("stories").prepend(card);

  document.getElementById("title").value = "";
  document.getElementById("story").value = "";
}

function toggleRead(btn) {
  let p = btn.previousElementSibling;
  let fullText = p.getAttribute("data-full");

  if (btn.innerText === "Read More") {
    p.innerText = fullText;
    btn.innerText = "Read Less";
  } else {
    p.innerText = fullText.substring(0, 120) + "...";
    btn.innerText = "Read More";
  }
}
