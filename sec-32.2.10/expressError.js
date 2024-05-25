class ExpressError extends Error {
  constructor(message, status, error) {
    super();
    this.message = message;
    this.status = status;
    this.error = error;
    // console.error(this.stack);
  }
}

module.exports = ExpressError;
