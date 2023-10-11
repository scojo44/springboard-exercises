const movies = [];

$(function(){
  // Add a new movie
  $("#rating-form").on("submit", (e) => {
    e.preventDefault();
    
    const movie = {
      title:  $("#in-title").val(),
      rating: $("#in-rating").val()
    };

    if(movie.title.length < 2)
      return;

    movies.push(movie);
    $("#movies tbody").append(addMovie(movie));
    $("#rating-form").trigger("reset");
    showOrHideNoMoviesMsg();
  });

  // Delete a movie
  $("#movies tbody").on("click", (e) => {
    if(!$(e.target).is("button.delete-button"))
      return;

    const row = $(e.target).closest("tr");
    movies.splice(row.index(), 1);
    row.remove();
    showOrHideNoMoviesMsg();
  });

  // Sort the movie list
  $("#movies th").on("click", (e) => {
    const sortKey = $(e.target).attr("id");
    const sortOrder = $(e.target).hasClass("sort-asc")? "desc":"asc";
    const sortCode = sortOrder === "asc"? 1 : -1; // Reverses 1 and -1 for Array.sort()

    // Update sort arrow
    $("#movies th").removeClass().not(e.target).addClass("sort-none"); // Reset sort arrows for all other columns
    $(e.target).addClass("sort-" + sortOrder);

    movies.sort((a,b) => {
      // Convert rating to integers
      if(sortKey === "rating"){
        a[sortKey] = +a[sortKey];
        b[sortKey] = +b[sortKey];
      }

      // Compare for sorting
      if(a[sortKey] > b[sortKey]) return sortCode;
      if(a[sortKey] < b[sortKey]) return -sortCode;
      return 0; // a === b
    });

    rebuildMovieTable();
  });

});

function rebuildMovieTable(){
  $("#movies tbody").empty();
  for(movie of movies)
    $("#movies tbody").append(addMovie(movie));
}

function addMovie({title, rating}){
  const row = $("<tr>");
  row.append(`<td class="rating">${rating}</td>`);
  row.append(`<td class="title">${title}</td>`);
  row.append(`<td class="delete"><button class="delete-button">Delete</button></td>`);
  return row;
}

// Hide the "no movies" message when there are movies in the table
function showOrHideNoMoviesMsg(){
  if($("#movies tbody tr").length)
    $("#no-movies").hide();
  else
    $("#no-movies").show();
}