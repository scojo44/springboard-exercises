How the Web Works Exercise
==========================

Part One: Solidify Terminology
------------------------------

> What is HTTP?

HyperText Transfer Protocol is for communicating with web servers to download resources
and submit data.  An interesting difference from other common protocols all the info is
sent at once rather than with a back-and-forth process like with FTP and POP3.

> What is a URL?

The Uniform Resource Locator is the address of a resource available on the Internet.

> What is DNS?

The Domain Name System translates human-friendly hostnames to IP addresses used by computers.

> What is a query string?

The portion of a URL after the '?' contains name=value pairs separated by '&' that a
server uses to respond with a customized resource.

> What are two HTTP verbs and how are they different?

GET and POST.  GET simply gets a resource without changing anything while POST is meant
for modifying data on the server end.  POST submits data in the body of the HTTP request
while GET just includes the data in the URL's query string.

> What is an HTTP request?

The client's communication to the server to request resources via HTTP.

> What is an HTTP response?

What the server returns via HTTP to the client after receiving a request.

> What is an HTTP header? Give a couple examples of request and response headers you have seen.

Headers are extra information about the request or response.

Example Request Headers:

    Referer: http://www.example.com/
    Host: www.springboard.com
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0

Example Response Headers

    Content-Type: text/html
    Server: nginx/1.23.4
    Set-Cookie: tracking-id=123456789

> What are the processes that happen when you type “http://somesite.com/some/page.html” into a browser?

- Use DNS to lookup somesite.com and get the IP address
- Connect to somesite.com's IP address on port 80
- Submit HTTP GET request for /some/page.html with any necessary headers
- Servers sends back page.html with some headers and (hopefully) a 200 status code
- The browser generates a DOM from the HTML and scans for any images, stylesheets, fonts, scripts, etc.
- While rendering the HTML on the screen, the browser makes separate requests for the extra resources needed.
- Server sends those extra resources and the browser updates the HTML rendering (images inserted, styles changed, etc.).

Part Two: Practice Tools
------------------------
> 1. Using curl, make a GET request to the icanhazdadjoke.com API to find all jokes involving the word “pirate”
    user@mypc:~$ curl https://icanhazdadjoke.com/search?term=pirate
    What does a pirate pay for his corn? A buccaneer!
    What did the pirate say on his 80th birthday? Aye Matey!
    Why couldn't the kid see the pirate movie? Because it was rated arrr!
    Why are pirates called pirates? Because they arrr!
    Why do pirates not know the alphabet? They always get stuck at "C"

> 2. Use dig to find what the IP address is for icanhazdadjoke.com

    ;; ANSWER SECTION:
    icanhazdadjoke.com.     69      IN      A       104.21.66.15
    icanhazdadjoke.com.     69      IN      A       172.67.198.173

> 3. Make a simple web page and serve it using python3 -m http.server. Visit the page in a browser.

    Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
    127.0.0.1 - - [15/Oct/2023 16:16:15] "GET /pyserver.html HTTP/1.1" 200 -

Part Three: Explore Dev Tools
-----------------------------

POST data appears in the body of the request.

Part Four: Explore the URL API
------------------------------

Played with the URL API a bit.