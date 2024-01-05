/** Further Study: Fun With Pokemon */
POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";
POKEMON_COUNT = 1302;

const catchButton = document.getElementById("pokemon-button");
let pokezoo;

// 1. Get the names and URLs for every pokemon in the database with a single request.
async function catchThemAll() {
  try {
    const res = await axios.get(POKEMON_API + "?limit=" + POKEMON_COUNT);
    out = new OutPut("pokezoo");

    catchButton.disabled = false;

    for(let {name, url} of res.data.results)
      out.appendLine(`<a href="${url}">${name}</a>`);

    pokezoo = res.data.results;
  }
  catch(error) {
    console.log("1. Error catching all the pokemon: ", error);
  }
}

// 2. Pick three at random and request their URLs, console.logging the data for each pokemon.
async function catchThreePokemon() {
  const randomIDs = [];

  for(let i = 0; i<3; i++){
    randomIDs.push(getRandomNumber(pokezoo.length-1));
  }

  let responses;

  try {
    responses = await Promise.all(randomIDs.map(id => axios.get(pokezoo[id].url)));
  }
  catch(error) {
    console.log("2. Error catching three pokemon: ", error);
    return;
  }

  const threePokemon = [];
  out = new OutPut("pokemon-chosen");

  for(let {data: pokemon} of responses){
    console.log(pokemon.name, pokemon);
    out.append(`<h5>#${pokemon.id}: ${pokemon.name}</h5>`)
    out.appendLine(`<strong>Height:</strong> ${pokemon.height}`)
    out.appendLine(`<strong>Weight:</strong> ${pokemon.weight}`)
    out.appendLine(`<strong>Order:</strong> ${pokemon.order}`)
    out.appendLine(`<strong>Base Experience:</strong> ${pokemon.base_experience}`)
    threePokemon.push(pokemon);
  }

  return threePokemon;
}

// 3. Continuing from #2, console.log the pokemon's name, species and species description.
async function getPokemonSpeciesInfo(chosenPokemon) {
  let responses;

  try {
    responses = await Promise.all(chosenPokemon.map(pokemon => axios.get(pokemon.species.url)))
  }
  catch(error) {
    console.log("3. Error getting pokemon species info: ", error);
    return;
  }

  out = new OutPut("pokemon-species");

  for(let {data: species} of responses){
    const description = species.flavor_text_entries.find(desc => desc.language.name == "en");
    out.appendLine(`<strong>${species.name}:</strong> ${description.flavor_text || "[description not provided]"}`);
  }
}

async function catchPokemon() {
  await catchThemAll();
  const chosenPokemon = await catchThreePokemon();
  await getPokemonSpeciesInfo(chosenPokemon);
}
catchPokemon();

catchButton.addEventListener("click", async e => {
  catchButton.disabled = true;

  let capturedPokemon;

  const randomIDs = [];
  for(let i = 0; i<3; i++){
    randomIDs.push(getRandomNumber(pokezoo.length-1));
  }

  let pokeData;

  try {
    pokeData = await Promise.all(randomIDs.map(id => axios.get(pokezoo[id].url)));
  }
  catch(error) {
    console.log("4. Error getting chosen pokemon: ", error);
    return;
  }

  capturedPokemon = pokeData.map(res => {
    return {
      name: res.data.name,
      image: res.data.sprites.front_default || "https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
    }
  });

  let specData;

  try {
    specData = await Promise.all(pokeData.map(res => axios.get(res.data.species.url)));
  }
  catch(error) {
    console.log("4. Error getting chosen pokemon species info: ", error);
    return;
  }

  specData.forEach((s, i) => {
    const englishDesc = s.data.flavor_text_entries.find(desc => desc.language.name == "en");
    capturedPokemon[i].description = englishDesc? englishDesc.flavor_text : "[description not provided]";
  });

  const pokemonCards = new OutPut("pokemon-cards");
  capturedPokemon.map(pm => pokemonCards.append(generatePokeHTML(pm)));

  catchButton.disabled = false;
});

function generatePokeHTML(pokemon){
  return `<div class="pokemon-card">
  <h5>${pokemon.name}</h5>
  <img src="${pokemon.image}">
  <p>${pokemon.description}</p>
</div>`
}