const express = require('express');
const path = require('path');

const app = express();

//Build in middleware to handle urlencoded data (form data)
app.use(express.urlencoded({ extended: false }));

//Built in middleware for json
app.use(express.json());

//Used to serve static files
//app.use(express.static(path.join(__dirname, 'someFolder')));

//Simple route for home page - file path will be changed
app.get("/", (req, res) => {
	res.sendFile('./index.html', { root: __dirname });
});

//Needs to be updated if we decide to add this
app.get("/Upcoming-Games", (req, res) => {
	res.send("Under Construction - List of Games");
});

//Form Pages - need to be added
app.get("/Prediction-Form", (req, res) => {
	res.send("test");
});

app.post("/Prediction-Form", (req, res) => {
	res.send("test");
});

//Port 8080
const port = 8080;
/*process.env.PORT*/ 

app.listen(port, () => console.log(`Listening on port: ${port}`));