const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const { isNull } = require("util");
const users = require("./data").userDB;

const app = express();
const server = http.createServer(app);

function validateEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
	res.status(200)
		.send("home page loading fine")
		.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/register", async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			res.status(403).send("Request is empty");
		}
		if (req.body.email == null) {
			res.status(404).send("no email specified");
		}
		if (!validateEmail(req.body.email)) {
			res.status(405).send("email format not correct");
		}
		let foundUser = users.find((data) => req.body.email === data.email);
		if (!foundUser) {
			let newUser = {
				id: Date.now(),
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
			};
			users.push(newUser);
			res.status(200).send(
				"<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>"
			);
		} else {
			res.status(401).send(
				"<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>"
			);
		}
	} catch {
		res.status(400).send("Internal server error");
	}
});

app.post("/login", async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			res.status(403).send("Request is empty");
		}
		if (req.body.email == null) {
			res.status(404).send("no email specified");
		}
		if (!validateEmail(req.body.email)) {
			res.status(405).send("email format not correct");
		}
		let foundUser = users.find((data) => req.body.email === data.email);
		if (foundUser) {
			let submittedPass = req.body.password;
			let storedPass = foundUser.password;
			if (submittedPass === storedPass) {
				let usrname = foundUser.username;
				res.status(200).send(
					`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`
				);
			} else {
				res.status(401).send(
					"<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>"
				);
			}
		} else {
			res.status(402).send(
				"<div align ='center'><h2> user not found</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>"
			);
		}
	} catch {
		res.status(400).send("Internal server error");
	}
});

app.post("/update", async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			res.status(403).send("Request is empty");
		}
		if (req.body.email == null) {
			res.status(404).send("no email specified");
		}
		if (!validateEmail(req.body.email)) {
			res.status(405).send("email format not correct");
		}
		let foundUser = users.find((data) => req.body.email === data.email);
		if (foundUser) {
			const index = users.findIndex((user) => {
				return req.body.email === user.email;
			});
			users[index].username = req.body.username;
			users[index].email = req.body.email;
			users[index].password = req.body.password;
			res.status(200).send(
				`<div align ='center'><h2>update successful</h2></div><br><br><br><div align ='center'><h3>Hello ${req.body.username}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`
			);
		} else {
			res.status(401).send(
				"<div align ='center'><h2> user not found</h2></div><br><br><div align='center'><a href='./update.html'>go back<a><div>"
			);
		}
	} catch {
		res.status(400).send("Internal server error");
	}
});

app.post("/delete", async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			res.status(403).send("Request is empty");
		}
		if (req.body.email == null) {
			res.status(404).send("no email specified");
		}
		if (!validateEmail(req.body.email)) {
			res.status(405).send("email format not correct");
		}
		let foundUser = users.find((data) => req.body.email === data.email);
		if (foundUser) {
			if (foundUser.password === req.body.password) {
				let users1 = users.filter(checkUser);
				function checkUser(a) {
					return a.email != req.body.email;
				}
				users.length = 0;
				users.push.apply(users, users1); //users=users1
				res.status(200).send(
					`<div align ='center'><h2>delete successful</h2></div><br><br><br><div align ='center'><div align='center'><a href='./login.html'>go back</a></div>`
				);
			} else {
				res.status(402).send(
					"<div align ='center'><h2> credentials wrong</h2></div><br><br><div align='center'><a href='./delete.html'>go back<a><div>"
				);
			}
		} else {
			res.status(401).send(
				"<div align ='center'><h2> user not found</h2></div><br><br><div align='center'><a href='./delete.html'>go back<a><div>"
			);
		}
	} catch {
		res.status(400).send("Internal server error");
	}
});

server.listen(3000, function () {
	console.log("server is listening on port: 3000");
});

module.exports = app;
