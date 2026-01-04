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

    <p class="story-text" data-full="${story}">
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
      ${category} • ${anonymous ? "Anonymous" : "Shared with name"}
    </p>
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

function react(button) {
  let countSpan = button.querySelector("span");
  let count = parseInt(countSpan.innerText);
  countSpan.innerText = count + 1;
}

function reportStory(btn) {
  let reason = prompt(
    "Why are you reporting this?\n\n1. Abuse\n2. Fake story\n3. Hate speech\n4. Other"
  );

  if (reason) {
    let card = btn.closest(".story-card");
    card.innerHTML = `
      <p style="color:red; font-weight:bold;">
        🚩 This story has been reported and hidden.
      </p>
    `;
  }
}
