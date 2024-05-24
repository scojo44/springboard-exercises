const express = require('express');
const fs = require('fs');
const ExpressError = require('./expressError');
const app = express();
const {mean, median, mode, all, toIntArray} = require('./stats-calc');

/** Routes ***************************/
app.get('/mean', (req, res, next) => {
  try { return res.send(handleRequest(mean, req)); }
  catch(e) { next(e); }
});

app.get('/median', (req, res, next) => {
  try { return res.send(handleRequest(median, req)); }
  catch(e) { next(e); }
});

app.get('/mode', (req, res, next) => {
  try { return res.send(handleRequest(mode, req)); }
  catch(e) { next(e); }
});

app.get('/all', (req, res, next) => {
  try { return res.send(handleRequest(all, req)); }
  catch(e) { next(e); }
})

// Return 404 if no other route matches
app.use((req, res, next) => {
  next(new(ExpressError("Not Found", 404)));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500; // Internal Server Error
  const message = err.message;
  
  if(req.headers.accept.includes("application/json"))
    res.status(status).json({
      error: {message, status, stack: err.stack.split(/\n */)} // Split so the raw JSON is easier to read
    });
  else // HTML
    res.status(status).send(`<html><body>
      <h1>${status} Error: ${message}</h1>
      <b>Stack:</b>
      <pre>${err.stack}</pre>`
    );
});

/** Server ***************************/
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

/** Support Functions ****************/
function handleRequest(operation, req) {
  const {nums, save} = parseQuery(req.query);
  const result = operation(nums);
  const json = createResponseJSON(operation, nums, result);

  record(save, json.response);

  if(req.headers.accept.includes("application/json"))
    return json;
  else
    return createResponseHTML(operation, nums, result);
}

function parseQuery(query) {
  if(!query.nums)
    throw new ExpressError('nums is required', 400);

  // Make sure nums are numbers
  for(let x of query.nums.split(","))
    if(isNaN(x))
      throw new ExpressError(`${x} is not a number`, 400);

  const nums = toIntArray(query.nums);
  const save = query.save && ['true', 1, 'yes', 'y'].includes(query.save.toLowerCase());
  return {nums, save};
}

function createResponseJSON(operation, nums, result){
  let answer = {
    operation: operation.name,
    nums: nums,
  };

  if(operation === all) // result is an object with results of all three operations.
    answer = {...answer, ...result};
  else
    answer = {...answer, value: result}; // result is simply the result of the one operation.

  return {response: answer};
}

function createResponseHTML(operation, nums, result) {
  // Convert single operation results to an all-style result. Example: {mean: 4}
  if(operation !== all)
    result = {[operation.name]: result};

  // Loop through the result keys to generate <p> elements.
  let answer = "";
  for(let key in result)
    answer += `<p>The ${key} of ${nums} is ${result[key]}.</p>`
  
  return `<html><body>
    <h1>Result</h1>
    ${answer}
    </body></html>`;
}

function record(save, result) {
  if(!save)
    return;

  const RESULTS_FILE = 'results.json';

  // Load past results
  fs.readFile(RESULTS_FILE, "utf8", (error, data) => {
    if(error)
      if(error.code !== "ENOENT") // If the file exists and there was an error
        throw new ExpressError("Error reading results file", 500, error);

    const results = data? JSON.parse(data).results : [] // Start with empty array if file was empty or missing

    // Add the new result
    result.timestamp = new Date();
    results.push(result);

    // Save the updated results
    fs.writeFile(RESULTS_FILE, JSON.stringify({results: results}, null, " "), "utf8", error => {
      if(error)
        throw new ExpressError("Error writing results file", 500, error);
    })
  })
}