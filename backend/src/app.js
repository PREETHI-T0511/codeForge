
const express = require("express"); //import express, bring express into this file
//Go into the node_modules folder, grab all the pre-built code tools from the Express package, 
// and store them inside a variable called express so I can use them.

const app = express(); //created an instance 
//It fires up the Express tool and creates your actual 
// web application object, naming it app. You will use this app 
// variable to build your whole website or API.
app.use((req,res,next)=>{
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

//no need of port number here, cause server.js sets up the configuration

app.get("/", (req, res) => {
    res.send("Hello from CodeForge Backend!"); //it sends a response back to the client
});

//It tells the server, Listen for anyone visiting the main home address (the / slash means the root homepage) 
// using a standard web browser request (GET).The req (request) and res (response) are the inputs for
// the action that follows.

app.get("/api/health", (req, res) => { //another route
    res.json({
        status: "OK",
        service: "CodeForge Backend",
        version: "1.0.0",
    });
});


app.get("/api/crash", (req, res) => {
    throw new Error("Something exploded!");
});

app.use((err, req, res, next) => {
    console.log("Error Middleware Reached!");

    res.status(500).json({
        success: false,
        message: err.message
    });
});




module.exports=app;
//why?
//kitchen prepares for food, resturant opens the doors, 
//app.js creates the appln
//server.js starts listening for users


//Think of it like this:
//"Hey, if another file needs this app, here it is."