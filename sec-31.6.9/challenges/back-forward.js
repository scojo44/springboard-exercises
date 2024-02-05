const Stack = require('../stack-ll');

class BrowserTabHistory {
  #back;
  #forward;

  constructor() {
    this.#back = new Stack();
    this.#forward = new Stack();
    this.current = null;
  }

  back() {
    if(this.#back.isEmpty()) {
      console.log("Can't go back!");
      return;
    }
    this.#forward.push(this.current);
    this.current = this.#back.pop();
    console.log("Back to", this.current);
  }

  forward() {
    if(this.#forward.isEmpty()) {
      console.log("Can't go forward!");
      return;
    }
    this.#back.push(this.current);
    this.current = this.#forward.pop();
    console.log("Forward to", this.current);
  }

  goto(url) {
    if(this.current)
      this.#back.push(this.current);
    this.current = url;
    this.#forward = new Stack(); // Going to a new page clears the forward history
    console.log("Going to", this.current);
  }
}

const history = new BrowserTabHistory();
history.goto("springboard.com");
history.goto("mozilla.org");
history.goto("jquery.com");
history.goto("python.org");
history.goto("pypi.org");
history.back();
history.back();
history.back();
history.back();
history.back();
history.forward();
history.forward();
history.goto("nodejs.org");
history.goto("expressjs.com");
history.forward();