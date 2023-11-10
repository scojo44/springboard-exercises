document.querySelector("button").addEventListener("click", e => {
  e.preventDefault();
  location.href = "/prompt/" + document.querySelector("select").value;
});