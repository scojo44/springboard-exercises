/** Further Study: Fun With Pokemon */
POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";
POKEMON_COUNT = 10;//1302;

const catchButton = document.getElementById("pokemon-button");
let pokezoo;

// 1. Get the names and URLs for every pokemon in the database with a single request.
axios.get(POKEMON_API + "?limit=" + POKEMON_COUNT)
  .then(res => {
    pokezoo = res.data.results;
    out = new OutPut("pokezoo");

    catchButton.disabled = false;

    for(let pokemon of pokezoo)
      out.appendLine(`<a href="${pokemon.url}">${pokemon.name}</a>`);

    // 2. Pick three at random and request their URLs, console.logging the data for each pokemon.
    const randomIDs = [];
    for(let i = 0; i<3; i++){
      randomIDs.push(getRandomNumber(POKEMON_COUNT)-1);
    }
    return Promise.all(randomIDs.map(id => axios.get(pokezoo[id].url)));
  })
  .then(results => {
    const chosenPokemon = [];
    out = new OutPut("pokemon-chosen");

    for(let res of results){
      console.log(res.data.name, res.data);
      out.append(`<h5>#${res.data.id}: ${res.data.name}</h5>`)
      out.appendLine(`<strong>Height:</strong> ${res.data.height}`)
      out.appendLine(`<strong>Weight:</strong> ${res.data.weight}`)
      out.appendLine(`<strong>Order:</strong> ${res.data.order}`)
      out.appendLine(`<strong>Base Experience:</strong> ${res.data.base_experience}`)
      chosenPokemon.push(res.data);
    }

    // 3. Continuing from #2, console.log the pokemon's name, species and species description.
    return Promise.all(chosenPokemon.map(pokemon => axios.get(pokemon.species.url)))
  })
  .then(results => {
    out = new OutPut("pokemon-species");

    for(let res of results){
      let description;

      for(let entry of res.data.flavor_text_entries)
        if(entry.language.name == "en")
          description = entry.flavor_text;

      out.appendLine(`<strong>${res.data.name}:</strong> ${description}`);
    }
  })
  .catch(error => console.log(error));

catchButton.addEventListener("click", e => {
  catchButton.disabled = true;

  const randomIDs = [];
  let capturedPokemon;

  for(let i = 0; i<3; i++){
    randomIDs.push(getRandomNumber(POKEMON_COUNT)-1);
  }
  Promise.all(randomIDs.map(id => axios.get(pokezoo[id].url)))
    .then(pokeData => {
      capturedPokemon = pokeData.map(res => {
        return {
          name: res.data.name,
          image: res.data.sprites.front_default || "https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
        }
      });

      return Promise.all(pokeData.map(res => axios.get(res.data.species.url)));
    })
    .then(specData => {
      specData.forEach((s, i) => {
        const englishDesc = s.data.flavor_text_entries.find(desc => desc.language.name == "en");
        capturedPokemon[i].description = englishDesc? englishDesc.flavor_text : "[description not provided]";
      });

      const pokemonCards = new OutPut("pokemon-cards");
      capturedPokemon.map(pm => pokemonCards.append(generatePokeHTML(pm)));
    })
    .catch(error => console.log(error));

    catchButton.disabled = false;
});

function generatePokeHTML(pokemon){
  return `<div class="pokemon-card">
  <h5>${pokemon.name}</h5>
  <img src="${pokemon.image}">
  <p>${pokemon.description}</p>
</div>`
}