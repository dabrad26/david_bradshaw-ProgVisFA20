# David Bradshaw Programming Visualization Fall 2020 Class

This is the repo for the programming vis class for Fall 2020 at pratt.

## Homework 6

Homework six assignment, source code can be seen in [script.js](src/script.js).  This chart is a D3 pie chart using data on COVID-19 deaths.  Colors are randomly chosen from Adobe Colors and hover was added for interactivity to show the total deaths.  Animated GIF can be found here:

![Example](example.gif)

If GIF does not play; [click here to view it directly](example.gif)

------------

## Getting started

This is a basic webpage.  Copy content of `src` onto a web server.  This project also includes a basic http server to run the site for development purposes.  To get started with this setup run `npm install` and then `npm run start` to run the server.  The server setup with this app has caching turned off to ensure latest code changes are seen. This is not optimal for a production setup.

## Running

```bash
# Start local server hosting files, normally runs on port 8080 on localhost.
npm run start

# Open the proper URL in the default browser and start the server.
npm run dev
```
