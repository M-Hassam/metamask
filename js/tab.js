document.addEventListener("DOMContentLoaded", () => {
  // Your code here
  const tabs = document.querySelector(".wrapper");
  const tabButton = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".content");

  tabs.onclick = (e) => {
    const id = e.target.dataset.id;
    if (id) {
      tabButton.forEach((btn) => {
        btn.classList.remove("enable");
      });
      e.target.classList.add("enable");

      contents.forEach((content) => {
        content.classList.remove("enable");
      });

      const element = document.getElementById(id);
      element.classList.add("enable");
    }
  };
});
