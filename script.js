function addStory() {
  let title = document.getElementById("title").value;
  let story = document.getElementById("story").value;
  let category = document.getElementById("category").value;
  let anonymous = document.getElementById("anonymous").checked;

  if (title === "" || story === "") {
    alert("Please write the incident");
    return;
  }

  let card = document.createElement("div");
  card.className = "story-card";

  card.innerHTML = `
    <h3>${title}</h3>
    <p>${story}</p>
    <p class="category">${category} • ${anonymous ? "Anonymous" : "Shared with name"}</p>
  `;

  document.getElementById("stories").prepend(card);

  document.getElementById("title").value = "";
  document.getElementById("story").value = "";
}