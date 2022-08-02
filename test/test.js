const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const users = require("../data").userDB;
const casual = require("casual");

describe("user login", () => {
	it("Should login correct user", (done) => {
		// one way of writing async mocha test (done).
		request(app)
			.post("/login")
			.send(
				new URLSearchParams({
					email: users[0].email,
					password: users[0].password,
				}).toString()
			)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(200);
				done(); //don't forget to call done()
			});
	});

	it("should reject login of wrong password of actual user", (done) => {
		request(app)
			.post("/login")
			.send(
				new URLSearchParams({
					email: users[0].email,
					password: "",
				}).toString()
			)
			.expect(401) //another version of first way of writing async mocha tests
			.expect((res) => {
				expect(res.status).to.eql(401);
			})
			.end(done);
	});

	it("should reject login of non existent user", async () => {
		//another way of writing async mocha test(async).
		const response = await request(app) //async and await
			.post("/login")
			.send(
				new URLSearchParams({
					email: "",
					password: "pass",
				}).toString()
			);
		expect(response.status).to.eql(402);
	});
});

describe("user registration", () => {
	const mockData = {
		email: casual.email,
		username: casual.first_name,
		password: casual.password,
	};

	it("succesful registration", async () => {
		const response = await request(app)
			.post("/register")
			.send(new URLSearchParams(mockData).toString());
		expect(response.status).to.eql(200);
		expect(users[users.length - 1].email).to.equal(mockData.email);
		users.pop();
	});

	it("reject registration if user is already there", async () => {
		const response = await request(app)
			.post("/register")
			.send(
				new URLSearchParams({
					email: users[0].email,
					password: users[0].password,
				}).toString()
			);
		expect(response.status).to.eql(401);
	});
});

describe("update user details", () => {
	it("should upddate users details correctly", (done) => {
		request(app)
			.post("/update")
			.send(
				new URLSearchParams({
					email: users[0].email,
					password: casual.password,
					name: casual.first_name,
				}).toString()
			)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(200);
				done();
			});
	});

	it("should not update if the user does not exist", (done) => {
		request(app)
			.post("/update")
			.send(
				new URLSearchParams({
					email: casual.email,
					name: casual.first_name,
					password: casual.password,
				}).toString()
			)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(401);
				done();
			});
	});
});

describe("delete user", () => {
	it("should delete user if credentials are correct", (done) => {
		request(app)
			.post("/delete")
			.send(
				new URLSearchParams({
					email: users[0].email,
					password: users[0].password,
				}).toString()
			)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(200);
				done();
			});
	});

	it("should not delete user if credentials are wrong", (done) => {
		request(app)
			.post("/delete")
			.send(
				new URLSearchParams({
					email: users[0].email,
					password: casual.password,
				}).toString()
			)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(402);
				done();
			});
	});

	it("should not delete user if user is not found", (done) => {
		request(app)
			.post("/delete")
			.send(
				new URLSearchParams({
					email: casual.email,
					password: casual.password,
				}).toString()
			)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(401);
				done();
			});
	});
});
