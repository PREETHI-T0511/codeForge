const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Because later we'll write automated tests.
//The tests need the app.
//They don't need the server running.
//Separating them makes testing much easier.
