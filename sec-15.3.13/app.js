const SCOTT_API_KEY = "OYpyzhlwO2rRZ6pMXCeQB47ncmxY3Pyi";
const SPRINGBOARD_API_KEY = "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym";

console.log("Let's get this party started!");

document.querySelector("form").addEventListener("submit", async e => {
  e.preventDefault();
  const query = document.getElementById("query");

  // Search Giphy
  const response = await axios.get("https://api.giphy.com/v1/gifs/search", {
    params: {
      q: query.value,
      api_key: SPRINGBOARD_API_KEY
    }
  });

  const gifs = response.data.data;
  query.value = "";

  // What to do if no results
  if(!gifs.length){
    document.getElementById('no-results').style.visibility = "visible";
    return;
  }

  // Add a random GIF to the page
  addGIF(gifs[getRandomIndex(gifs.length)]);
});

function addGIF(gif){
  const image = document.createElement("img");
  image.src = gif.images.fixed_height.webp;
  document.getElementById("results").append(image);
  document.getElementById('no-results').style.visibility = "hidden";
}

function getRandomIndex(length){
  return Math.floor(Math.random()*length);
}

document.getElementById("clear").addEventListener("click", e => {
  document.getElementById("results").innerHTML = "";
})