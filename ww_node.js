require('./port');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
const saltRounds = 10;

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
const sqlite3 = require('sqlite3').verbose();

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content'));

// Retrieves a key from the database
app.get('/api/admin/getkey/:adminkey/', function (req, res) {
	var adminkey = req.params.adminkey;
	var sql = 'SELECT adminKey FROM adminkeys WHERE adminKey=?;';
 	db.get(sql, [adminkey], (err, row) => {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("GET: adminkeys query failed!");
    		result["error"] = err.message;
  		} else {
			if (row === undefined) {
				res.status(400);
				console.log("GET: adminkeys failed "+adminkey+" not in database!");
				result[adminkey] = "dne";
			} else {
				res.status(200);
				console.log("GET: adminkeys success "+adminkey+" in database!");
				result[adminkey] = row.adminKey;
			}
		}
		res.json(result[adminkey]);
	});
});

// Retrieves all users
app.get('/api/admin/all/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT username,firstName,lastName,email,userType,lastLogin FROM users ORDER BY lastLogin DESC;';
	db.all(sql, [], (err, rows) => {
		var result = {};
		result["users"]=[];
  		if (err) {
				res.status(400);
				console.log("GET: all users query failed!");
    		result["error"] = err.message;
  		} else {
				res.status(200);
				console.log("GET: all users from users success!");
				for (var i = 0; i < rows.length; i++) {
  				result["users"].push(rows[i]);
				}
		}
		res.json(result);
	});
});

// Registers a user as an admin
app.post('/api/admin/upgrade/', function (req, res) {
	var username = req.body.username;
	var sql = 'UPDATE users SET userType=\'admin\' WHERE username=?;';
	db.run(sql, [username], function (err) {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("POST: user "+username+" upgrade to admin failed!");
    		result["error"] = err.message;
  		} else {
			res.status(201);
			console.log("PUT: new user "+username+" upgrade to admin success!");
			result[username] = "updated rows: "+this.changes;
		}
		res.json(result[username]);
	});
});

// Registers a user
app.post('/api/admin/newkey/', function (req, res) {
	var username = req.body.username;
	var newkey = req.body.newkey;
	var sql = 'INSERT INTO adminkeys(username,adminKey) VALUES (?,?);';
	db.run(sql, [username,newkey], function (err) {
		var result = {};
  		if (err) {
			console.log(err);
			res.status(400);
			console.log("POST: add new adminkey "+newkey+" failed!");
    		result["error"] = err.message;
  		} else {
			res.status(201);
			console.log("POST: add new adminkey "+newkey+" success!");
			result[username] = "updated rows: "+this.changes;
		}
		res.json(result[username]);
	});
});

// Deletes a specific user
app.delete('/api/admin/delete/:username', function (req, res) {
	var username = req.params.username;
	var sql = 'DELETE FROM users WHERE username=?;';
	db.run(sql, [username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("POST: delete user "+username+" failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(201);
			console.log("POST: delete user "+username+" success!");
			result[username] = username
		}
		res.json(result);
	});
});

// Deletes a specific user
app.delete('/api/admin/delete/stats/:username', function (req, res) {
	var username = req.params.username;
	var sql = 'DELETE FROM stats WHERE username=?;';
	db.run(sql, [username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("POST: delete user stats "+username+" failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(201);
			console.log("POST: delete user stats "+username+" success!");
			result[username] = username
		}
	res.json(result);
	});
});

// Deletes a specific user
app.delete('/api/admin/delete/adminkeys/:username', function (req, res) {
	var username = req.params.username;
	var sql = 'DELETE FROM adminkeys WHERE username=?;';
	db.run(sql, [username], function (err) {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("POST: delete admin keys "+username+" failed!");
    		result["error"] = err.message;
  		} else {
			res.status(201);
			console.log("POST: delete admin keys "+username+" success!");
			result[username] = username
		}
		res.json(result);
	});
});

// retrieve all user top ten stats
app.get('/api/stats/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT username,highscore,numGamesLost FROM stats ORDER BY highscore+numGamesWon-numGamesLost DESC LIMIT 10;';
	db.all(sql, [], (err, rows) => {
		var result = {};
		result["stats"]=[];
  		if (err) {
			res.status(400);
			console.log("GET: top ten failed!");
    		result["error"] = err.message;
  		} else {
			res.status(200);
			console.log("GET: top ten success!");
			for (var i = 0; i < rows.length; i++) {
  				result["stats"].push(rows[i]);
			}
		}
		res.json(result);
	});
});

// Retrieve a user's highscore
app.get('/api/stats/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT highscore,numGamesWon,numGamesLost FROM stats WHERE username=?;';
	db.get(sql, [username], (err,row) => {
		var result = {};
		if (err) {
			res.status(400);
			console.log("GET: failed to get highscore from "+username+"!");
			result["error"] = err.message;
		} else {
			res.status(200);
			console.log("GET: got highscore from "+username+"!");
			result[username] = row;
		}
		res.json(result);
	});
});

// Retrieve a specific user's top ten highscore
app.get('/api/stats/topten/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT highscore FROM user_stats WHERE username=? ORDER BY highscore DESC LIMIT 10;';
	db.all(sql, [username], (err,rows) => {
		var result = {};
		result["stats"]=[];
		if (err) {
			res.status(400);
			console.log("GET: failed to get top ten highscores from "+username+"!");
			result["error"] = err.message;
		} else {
			res.status(200);
			console.log("GET: got top ten scores from "+username+"!");
			for (var i = 0; i < rows.length; i++) {
  				result["stats"].push(rows[i]);
			}
		}
		res.json(result);
	});
});

// Update a user's highscore
app.post('/api/stats/hs/:username/', function (req, res) {
	var username = req.params.username;
	var highscore = req.body.highscore;
	var sql = 'UPDATE stats SET highscore=? WHERE username=?';
	db.run(sql, [highscore,username], (err,row) => {
		var result = {};
		if (err) {
			res.status(400);
			console.log("GET: failed to update highscore for "+username+"!");
			result["error"] = err.message;
		} else {
			res.status(200);
			console.log("GET: sucessfully updated highscore for "+username+"!");
			result[username]= username+" has a new highscore!"
		}
		res.json(result[username]);
	});
});

// Update a user's win and total games played
app.post('/api/stats/win/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'UPDATE stats SET numGamesWon=numGamesWon+1 WHERE username=?;';
	db.run(sql, [username], (err,row) => {
		var result = {};
		if (err) {
			res.status(400);
			console.log("GET: failed to update wins for "+username+"!");
			result["error"] = err.message;
		} else {
			res.status(200);
			console.log("GET: sucessfully updated wins for "+username+"!");
			result[username]= username+" has won a game!"
		}
		res.json(result[username]);
	});
});

// Update a user's loss and total games played
app.post('/api/stats/loss/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'UPDATE stats SET numGamesLost=numGamesLost+1 WHERE username=?;';
	db.run(sql, [username], (err,row) => {
		var result = {};
		if (err) {
			res.status(400);
			console.log("GET: failed to update losses for "+username+"!");
			result["error"] = err.message;
		} else {
			res.status(200);
			console.log("GET: sucessfully updated loss for "+username+"!");
			result[username]= username+" has lost!"
		}
		res.json(result[username]);
	});
});

// Registers a user-stats
app.put('/api/stats/', function (req, res) {
	var username = req.body.username;
	var sql = 'INSERT INTO stats(username) VALUES (?);';
	db.run(sql, [username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("PUT: new user stats "+username+" failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(201);
			console.log("PUT: new user stats "+username+" success!");
			result[username] = "updated rows: "+this.changes;
		}
	res.json(result[username]);
	});
});

// Registers a user-stats
app.put('/api/user_stats/', function (req, res) {
	console.log(req.body.highscore)
	var username = req.body.username;
	var highscore = req.body.highscore;
	var sql = 'INSERT INTO user_stats(username, highscore) VALUES (?,?);';
	db.run(sql, [username,highscore], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("PUT: new user_stats "+username+" failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(201);
			console.log("PUT: new user_stats "+username+" success!");
			result[username] = "Added rows: "+this.changes;
		}
	res.json(result[username]);
	});
});

// Update a user's highscore
app.delete('/api/stats/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'DELETE FROM stats WHERE username=?';
	db.run(sql, [username], (err,row) => {
		var result = {};
		if (err) {
			res.status(400);
			console.log("GET: failed to delete stats for "+username+"!");
			result["error"] = err.message;
		} else {
			res.status(200);
			console.log("GET: success to delete stats for "+username+"!");
			result[username]= "deleted"
		}
		res.json(result[username]);
	});
});

// retrieve specific user info for sessionStorage (idempotent)
app.get('/api/user/retrieve/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT * FROM users WHERE username=?;';
	db.get(sql, [username], (err, row) => {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("GET: username from username info query failed!");
    		result["error"] = err.message;
  		} else {
			if (row == undefined) {
				res.status(400);
				console.log("GET: username info "+username+" from users failure!");
				result = null;
			} else {
				res.status(200);
				console.log("GET: username info "+username+" from users success!");
				result = row;
			}
		}
		res.json(result);
	});
});

// Creates a user
app.put('/api/user/', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var usertype = req.body.usertype;
	var lastlogin = req.body.date;
	var sql = 'insert into users(username,password,firstName,lastName,email,userType,lastLogin) VALUES (?,?,?,?,?,?,?);';
	db.run(sql, [username,password,firstname,lastname,email,usertype,lastlogin], function (err) {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("PUT: new user "+username+" failed!");
    		result["error"] = err.message;
  		} else {
			res.status(201);
			console.log("PUT: new user "+username+" success!");
			result[username] = "updated rows: "+this.changes;
		}
		res.json(result[username]);
	});
});

// For user login
app.post('/api/user/login/', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var sql = 'SELECT username FROM users WHERE username=? AND password=?;';
	db.get(sql, [username,password], (err,row) => {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("POST: login user "+username+" failed!");
    		result["error"] = err.message;
  		} else {
	        if (row === undefined) {
	          res.status(400);
	          console.log("POST: login user "+username+" failed!");
	          result[username] = "dne";
	        } else {
	  			res.status(202);
	  			console.log("POST: login user "+username+" success!");
	  			result[username] = "Logged In";
	        }
		}
		res.json(result[username]);
	});
});

// For updating last login 
app.post('/api/user/lastlogin/', function (req, res) {
	var username = req.body.username;
  	var lastlogin = req.body.date;
	var sql = 'UPDATE users SET lastLogin=? WHERE username=?;';
	db.run(sql, [lastlogin,username], function (err) {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("POST: login user "+username+" last login updated failed!");
    		result["error"] = err.message;
  		} else {
			res.status(202);
			console.log("POST: login user "+username+" last login updated success!");
			result[username] = "Logged In";
		}
		res.json(result[username]);
	});
});

// retrieve specific user for username_check (idempotent)
app.get('/api/user/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT username FROM users WHERE username=?;';
	db.get(sql, [username], (err, row) => {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("GET: username from users query failed!");
    		result["error"] = err.message;
  		} else {
			if (row == undefined) {
				res.status(200);
				console.log("GET: username "+username+"(DNE) from users success!");
				result[username] = "dne";
			} else {
				res.status(400);
				console.log("GET: username "+username+"(DNE) from users failure!");
				result[username] = row.username;
			}
		}
		res.json(result[username]);
	});
});

// retrieve specific user (idempotent)
app.get('/api/user/exists/:username/', function (req, res) {
	var username = req.params.username;
	var sql = 'SELECT username FROM users WHERE username=?;';
	db.get(sql, [username], (err, row) => {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("GET: username from users query failed!");
    		result["error"] = err.message;
  		} else {
			if (row != undefined) {
				res.status(200);
				console.log("GET: username "+username+" exists from users success!");
				result[username] = row.username;
			} else {
				res.status(400);
				console.log("GET: username "+username+" exists from users failure!");
				result[username] = "dne";
			}
		}
		res.json(result[username]);
	});
});

// Updates the username
app.post('/api/user/edit_username/:username', function (req, res) {
	var username = req.params.username;
	var newUsername = req.body.username;
	var sql = 'UPDATE users SET username=? WHERE username=?;';
	db.run(sql, [newUsername,username], function (err) {
		var result = {};
  	if (err) {
			res.status(400);
			console.log("POST: update user "+username+" failed!");
    	result["error"] = err.message;
  	} else {
			res.status(202);
			console.log("POST: update user "+newUsername+" success!");
			result[username] = "updated rows: "+this.changes;
		}
		res.json(result);
	});
});

// Updates the username in stats
app.post('/api/user/edit_userstats/:username', function (req, res) {
	var username = req.params.username;
	var newUsername = req.body.username;
	var sql = 'UPDATE stats SET username=? WHERE username=?;';
	db.run(sql, [newUsername,username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("POST: update username in stats "+username+" failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(202);
			console.log("POST: update username in stats "+newUsername+" success!");
			result[username] = "updated rows: "+this.changes;
		}
	res.json(result);
	});
});

// Updates the username in stats
app.post('/api/user/edit_userkeys/:username', function (req, res) {
	var username = req.params.username;
	var newUsername = req.body.username;
	var sql = 'UPDATE adminkeys SET username=? WHERE username=?;';
	db.run(sql, [newUsername,username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("POST: update username in adminkeys "+username+" failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(202);
			console.log("POST: update username in adminkeys "+newUsername+" success!");
			result[username] = "updated rows: "+this.changes;
		}
	res.json(result);
	});
});

// Updates the password
app.post('/api/user/edit_password/:username', function (req, res) {
	var username = req.params.username;
	var password = req.body.password;
	var sql = 'UPDATE users set password=? WHERE username=?;';
	db.run(sql, [password,username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("POST: update "+username+" password failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(202);
			console.log("POST: update "+username+" password success!");
			result[username] = "updated rows: "+this.changes;
		}
	res.json(result);
	});
});

// Updates the email
app.post('/api/user/edit_email/:username', function (req, res) {
	var username = req.params.username;
	var email = req.body.email;
	var sql = 'UPDATE users set email=? WHERE username=?;';
	db.run(sql, [email,username], function (err) {
		var result = {};
	  	if (err) {
			res.status(400);
			console.log("POST: update "+username+" email failed!");
	    	result["error"] = err.message;
	  	} else {
			res.status(202);
			console.log("POST: update "+username+" email success!");
			result[username] = "updated rows: "+this.changes;
		}
	res.json(result);
	});
});

// Updates the first name
app.post('/api/user/edit_firstname/:username', function (req, res) {
	var username = req.params.username;
	var firstname = req.body.firstname;
	var sql = 'UPDATE users set firstName=? WHERE username=?;';
	db.run(sql, [firstname,username], function (err) {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("POST: update "+username+" first name failed!");
    		result["error"] = err.message;
  		} else {
			res.status(202);
			console.log("POST: update "+username+" first name success!");
			result[username] = "updated rows: "+this.changes;
		}
		res.json(result);
	});
});

// Updates the last name
app.post('/api/user/edit_lastname/:username', function (req, res) {
	var username = req.params.username;
	var lastname = req.body.lastname;
	var sql = 'UPDATE users SET lastName=? WHERE username=?;';
	db.run(sql, [lastname,username], function (err) {
		var result = {};
  		if (err) {
			res.status(400);
			console.log("POST: update "+username+" last name failed!");
    		result["error"] = err.message;
  		} else {
			res.status(202);
			console.log("POST: update "+username+" last name success!");
			result[username] = "updated rows: "+this.changes;
		}
		res.json(result);
	});
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

// db.close();
