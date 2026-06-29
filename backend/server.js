const express = require("express"); //import express, bring express into this file
//Go into the node_modules folder, grab all the pre-built code tools from the Express package, 
// and store them inside a variable called express so I can use them.

const app = express(); //created an instance 
//It fires up the Express tool and creates your actual 
// web application object, naming it app. You will use this app 
// variable to build your whole website or API.

const PORT = 3000;
//It sets a variable for the port number.

app.get("/", (req, res) => {
    res.send("Hello from CodeForge Backend!"); //it sends a response back to the client
});
//It tells the server, Listen for anyone visiting the main home address (the / slash means the root homepage) 
// using a standard web browser request (GET).The req (request) and res (response) are the inputs for
// the action that follows.

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); //it prints a confirmation message to your terminal
});

//it asks the app to listen from port number 3000