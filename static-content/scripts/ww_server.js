// Sets the user variables
function set_local(username) {
	let params = {
	 			method: "GET",
				url: "/api/user/retrieve/"+username,
	 		 };
  $.ajax(params).done(function(data) {
		localStorage.setItem('username',data['username']);
		localStorage.setItem('password',data['password']);
		localStorage.setItem('email',data['email']);
		localStorage.setItem('firstname',data['firstName']);
		localStorage.setItem('lastname',data['lastName']);
		localStorage.setItem('usertype',data['userType']);
	});
}

// Backend verifier to see if an admin key exists
let admin_check = function(adminkey) {
	return new Promise(function(resolve,reject) {
		let params = {
					method: "GET",
					url: "/api/admin/getkey/"+adminkey
					};
		$.ajax(params).done(function(data) {
			if (data!=="dne") {
				resolve("Valid admin key");
			} else {
				alert("Invalid admin key");
				document.getElementById("getadminkey").setCustomValidity("Invalid admin key");
				reject("Invalid admin key");
			}
		}).fail(function(err) {
			alert("Invalid admin key");
			document.getElementById("getadminkey").setCustomValidity("Invalid admin key");
			reject("Invalid admin key");
		});
	});
};

// Regex checker for usernames and double checks to see if they are in the database
let username_check = function(username) {
	return new Promise(function(resolve,reject) {
		var nonos = 0;
		var err = "Username must be:";
		if(username.length<5 || username.length>33) {
			err += "between 5 and 33 characters in size\n";
			nonos++;
		}
		user = username.match(/^[a-z0-9_\-]+$/gi);
		if(user===null){
			err+="can only contain alphanumeric characters, hypens and underscores\n";
			nonos++;
		}
		if(nonos > 0){
			alert(err);
			document.getElementById("registeruser").setCustomValidity("Invalid username");
			reject(err);
			return false;
		}
		let params = {
					method: "GET",
					url: "/api/user/"+username
					};
		$.ajax(params).done(function(data){
			if (data!=="dne") {
				alert(username+" already exists, please choose another name");
				document.getElementById("registeruser").setCustomValidity("Username already being used");
				reject("Username already being used");
				return false;
			} else {
				resolve(username);
				return true;
			}
		}).fail(function(err){
			alert(username+" already exists, please choose another name");
			document.getElementById("registeruser").setCustomValidity("Username already being used");
			reject("Username already being used");
			return false;
		});
	});
};

// Regex'r for passwords
let password_check = function(password) {
	return new Promise(function(resolve,reject) {
		var nonos = 0;
		var err = "You password must:\n";
		if (password.length < 5) {
			err+="be at least 5 characters\n";
			nonos++;
		}
		if (password.search(/[a-z]/g) < 0) {
			err+="contain at least one lowercase letter\n";
			nonos++;
		}
		if (password.search(/[A-Z]/g) < 0) {
			err+="contain at least one uppercase letter\n";
			nonos++;
		}
		if (password.search(/[0-9]/g) < 0) {
			err+="contain at least one digit\n";
			nonos++;
		}
		if (password.search(/[!#$%&?\/\\]/g) < 0) {
			err+="contain at least one special character like !#$%&?\/\\\n";
			nonos++;
		}
		if (nonos > 0){
			document.getElementById("registerpassword").setCustomValidity("Invalid password");
			reject("Invalid password");
			alert(err);
		}
		resolve("Valid password");
	});
};

// Regex'r for emails to see if it's valid or not
let email_check = function(email) {
	return new Promise(function(resolve,reject) {
		var nonos = 0;
		if (email.length <= 0) {
			resolve("No email");
			return;
		}
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var emailgex = email.match(re)
		if (emailgex!==null) {
			resolve("Valid email");
		} else {
			alert("Invalid email");
			reject("Invalid email");
		}
	});
};

// Adminkey validator for registration page
let verify_admin = function() {
	var adminkey = $("#getadminkey").val();
	if ($.trim(adminkey)===""){
		return new Promise(function(resolve,reject) {
			resolve("No adminkey provided");
			return "gamer";
		});
	} else {
		return admin_check(adminkey);
	}

};

// Username validator for registration page
let verify_user = function() {
	var username = $("#registeruser").val();
	return username_check(username);
};

// Password validator for registration page
let valid_password = function() {
	var password = $("#registerpassword").val();
	return password_check(password);
};

// Email validator for registration page
let verify_email = function() {
	var email = $("#registeremail").val();
	return email_check(email);
};

let register_user = function(res) {
	return new Promise(function(resolve,reject) {
		var date;
		date = new Date();
		date = date.getUTCFullYear() + '-' +
					 ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
					 ('00' + date.getUTCDate()).slice(-2) + ' ' +
					 ('00' + date.getUTCHours()).slice(-2) + ':' +
					 ('00' + date.getUTCMinutes()).slice(-2) + ':' +
					 ('00' + date.getUTCSeconds()).slice(-2);
		var input = {
					username: $("#registeruser").val(),
					password: $("#registerpassword").val(),
					email: $("#registeremail").val(),
					firstname: $("#registerfirstname").val(),
					lastname: $("#registerlastname").val(),
					date: date,
					usertype: res
					};
		let params = {
					method: "PUT",
					url: "/api/user/",
					data: input
					};
		$.ajax(params).done(function(data) {
			resolve("User Created");
		});
	});
}

// Creates a new account
function create_account(){
	verify_admin().then(function(res){
		var usertype = (res==="Valid admin key") ? "admin" : "gamer";
		verify_user().then(function(){
			verify_email().then(function(){
				valid_password().then(function(){
					register_user(usertype).then(function(){
						var input = {
											username: $("#registeruser").val()
										};
						var params = {
											method: "PUT",
											url: "/api/stats/",
											data: input
										};
						$.ajax(params).done(function(data) {
							console.log($("#registeruser").val()+" registered into Warehouse Wars!");
							set_local($("#registeruser").val());
							set_update();
							current_stage="stage";
							switch_stage();
						}).fail(function(err) {
							console.log($("#registeruser").val()+" failed to register into Warehouse Wars!");
						});
					}).catch(function (err) {
						console.log(err);
					})
				}).catch(function (err) {
					console.log(err);
				})
			}).catch(function (err) {
				console.log(err);
			})
		}).catch(function (err) {
			console.log(err);
		})
	}).catch(function (err) {
		console.log(err);
	});
}

// Validates if the account (username + password) exists in the db
let db_account_exists = function () {
	return new Promise(function(resolve,reject) {
		let inputs = {
					username: $("#loginuser").val(),
					password: $("#loginpassword").val()
					};
		let params = {
					method: "POST",
					url: "/api/user/login",
					data: inputs
					};
		$.ajax(params).done(function(data) {
				if (data!=="dne") {
					resolve("User credentials OK!")
				} else {
					alert("Invalid username/password");
					document.getElementById("loginuser").setCustomValidity("Invalid username/password");
					document.getElementById("loginpassword").setCustomValidity("Invalid username/password");
					reject("User credentials BAD!")
				}
			}).fail(function(err) {
				alert("Invalid username/password");
				document.getElementById("loginuser").setCustomValidity("Invalid username/password");
				document.getElementById("loginpassword").setCustomValidity("Invalid username/password");
				reject("User credentials BAD!")
			});
		});
}

// Gets you own stats
function your_stats(username) {
	let params = {
				method: "GET",
				url: "/api/stats/"+username
				};
	$.ajax(params).done(function(data) {
		var stats = '<div style="border:1px solid black"><table><tr><th> High Score </th>'+
	'<th> Wins </th><th> Losses </th><th> Win:Loss </th></tr>';
		stats += "<tr><th>"+data[username].highscore+"</th><th>"+data[username].numGamesWon
		+"</th><th>"+data[username].numGamesLost+"</th><th>"
		+(data[username].numGamesWon/data[username].numGamesLost).toFixed(2)+"</th></tr>";
		stats += '</table>' ;
		$("#user-score").html(stats);
	});
}

// Logs in a user and updates last login date
function login_account () {
	db_account_exists().then(function() {
		var date;
		date = new Date();
		date = date.getUTCFullYear() + '-' +
					 ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
					 ('00' + date.getUTCDate()).slice(-2) + ' ' +
					 ('00' + date.getUTCHours()).slice(-2) + ':' +
					 ('00' + date.getUTCMinutes()).slice(-2) + ':' +
					 ('00' + date.getUTCSeconds()).slice(-2);
		let inputs = {
					username: $("#loginuser").val(),
					date: date
					};
		let params = {
					method: "POST",
					url: "/api/user/lastlogin",
					data: inputs
					};
		$.ajax(params).done(function(data) {
				document.getElementById("greetings").innerHTML = "Welcome back "+localStorage.getItem('username')+"!";
				set_local($("#loginuser").val());
				set_update();
				your_stats($("#loginuser").val());
				current_stage="stage";
				switch_stage();
			});
		}).catch(function (err) {
			console.log(err);
		});
};

function post_newscore(newscore) {
	var username = localStorage.getItem('username');
	// Compares db score with new score
	var input = {
				highscore: newscore
				}
	params = {
			method: "POST",
		 	url: "/api/stats/hs/"+username,
			data: input
			}
	$.ajax(params).done(function(data) {
		console.log("Check out "+username+" he got a new highscore of "+newscore);
	});
}

// Increments wins for user in db
function update_highscore(gamestate) {
	var username = localStorage.getItem('username');
	var newscore = $('#GameScore').val();
	var params = {
					method: "GET",
					url: "/api/stats/"+username
				}
	$.ajax(params).done(function(data) {
		if (data[username].highscore < newscore) { 
			post_newscore(newscore); 
		}
	});
	 var url = "";

	 // Updates db scores
	 url = (gamestate==="win") ? "/api/stats/win/"+username : "/api/stats/loss/"+username;
	 params = {
				method: "POST",
				url: url
				};
	$.ajax(params).done(function(data){
		console.log("Final Score: "+newscore);
		update_score(newscore); // Adds game score to user_stats
		retrieve_your_top_ten();
		your_stats(username); // Updates user stats
		retrieve_top_ten(); // Updates top 10 stats
	});
}


// Adds a game score in user_stats db
function update_score(gamescore) {
	var username = localStorage.getItem('username');
	var input = {
				username: username,
				highscore: gamescore
				}
	var params = {
					method: "PUT",
					url: "/api/user_stats/",
					data: input
				}
	$.ajax(params).done(function(data) {});
}



// Gets a list of top ten players
function retrieve_top_ten(){
	let params = {
				 method: "GET",
				 url: "/api/stats/"
				}
	$.ajax(params).done(function(data) {
		var allStats = '<div style="border:1px solid black"><h3> Top 10 Players </h3><table><tr>'+
		'<th> Username </th><th> High Score </th></tr>';
		for(i=0;i<data["stats"].length;i++){
			allStats += "<tr><th>"+data["stats"][i].username+"</th><th>"
			+data["stats"][i].highscore+"</th></tr>";
		}
		allStats+= "</table>";
		allStats+= '<input id="collapse" type="button" value="Collapse" onclick=\'$("#all-stats-login").hide(); $("#all-stats").hide();\' />'
		$("#all-stats-login").html(allStats);
		$("#all-stats").html(allStats);
	});
}

// Gets a list of top ten scores for a specific user
function retrieve_your_top_ten(){
	var username = localStorage.getItem('username');
	let params = {
				 method: "GET",
				 url: "/api/stats/topten/"+username
				}
	$.ajax(params).done(function(data) {
		var tenSelf = '<div style="border:1px solid black"><h3> Your High Scores </h3><table><tr></tr>';
		for(i=0;i<data["stats"].length;i++){
			tenSelf += "<tr><th>"+data["stats"][i].highscore+"</th></tr>";
		}
		tenSelf+= "</table>";
		// Add a collapse button to save screen estate
		tenSelf+= '<input id="collapse" type="button" value="Collapse" onclick=\'$("#your-stats").hide()\' />';
		$("#your-stats").html(tenSelf);
	});
}

// Deletes the user in the db
let delete_user = function(username) {
	return new Promise(function(resolve,reject) {
		let params = {
						method: "DELETE",
						url: "/api/admin/delete/"+username
					};
		$.ajax(params).done(function(data) {
			resolve("User deleted");
		}).fail(function(err) {
			reject("User was not deleted");
		});
	});
};

// Deletes the stats of a user in the db
let delete_stats = function(username) {
	return new Promise(function(resolve,reject) {
		let params = {
					method: "DELETE",
					url: "/api/admin/delete/stats/"+username
					};
		$.ajax(params).done(function(data) {
			resolve("Stats deleted");
		}).fail(function(err) {
			console.log(err);
			reject("Failed to delete the stats of "+username);
		});
	});
}

// Deletes an account
function delete_self_account() {
	var username = localStorage.getItem('username');
	delete_user(username).then(function() { // Delete the user
		delete_stats(username).then(function() { // Delete their stats
			delete_adminkey(username).then(function() { // Delete the adminkeys they created
				logout();
			}).catch(function(err) {
				console.log(err);
			})
		}).catch(function(err) {
			console.log(err);
		})
	}).catch(function(err) {
		console.log(err);
	});
};

// Adds a new adminkey to the db
function create_adminkey() {
	if ($('#newupgradekey').val().trim()!=="") {
		var input = {
					username: localStorage.getItem('username'),
					newkey: $('#newupgradekey').val()
					};
		let params = {
					method: "POST",
					url: "/api/admin/newkey/",
					data: input
					};
		$.ajax(params).done(function(data) {
			alert("New adminkey created");
			console.log("New key made");
		}).fail(function(err) {
			alert("Admin key added already exists in database");
			console.log("Admin key added already exists in database");
		});
	} else {
		alert("Adminkey cannot be all spaces or empty");
	}
}

// Gets a list of all the user and info
function retrieve_all_users(){
	let params = {
				 method: "GET",
				 url: "/api/admin/all/"
   				}
	$.ajax(params).done(function(data) {
		var allUsers = '<div style="border:1px solid black"><h3>All users</h3><table><tr><th>Username</th>'+
		'<th>First Name</th><th>Last Name</th><th>e-mail</th><th>Account Type</th><th>Last Login</th></tr>';
		console.log(data["users"].length);
		for(i=0;i<data["users"].length;i++){
			allUsers += "<tr><th>"+data["users"][i].username+"</th><th>"+
			data["users"][i].firstName+"</th><th>"+data["users"][i].lastName+
			"</th><th>"+data["users"][i].email+"</th><th>"+data["users"][i].userType+
			"</th><th>"+data["users"][i].lastLogin+"</th></tr>";
		}
		allUsers+= "</table>";
		$("#allUsers").html(allUsers);
	});
}

// Upgrades an account
function upgrade_account() {
	var username = $('#directupgrade').val();
	username_exist(username).then(function() {
		var input = {
					username: username
					};
		let params = {
					method: "POST",
					url: "/api/admin/upgrade/",
					data: input
					};
		$.ajax(params).done(function(data) {
			alert(username+" is now an admin!");
			console.log(username+" is now an admin!");
		});
	}).catch(function(err) {
		alert(err);
		console.log(err);
	});
}

//  Checks if a user exists for deletion
let username_exist = function(username){
	return new Promise(function(resolve,reject) {
		let params = {
					method: "GET",
					url: "/api/user/exists/"+username
					};
		$.ajax(params).done(function(data){
			if (data === "dne") {
				reject(username+" does not exist");
			} else {
				resolve("User exists");
			}
		}).fail(function(err){
			reject(username+" does not exist");
		});
	});
}

// Deletes the adminkeys that a specific user created
let delete_adminkey = function (username) {
	return new Promise(function(resolve,reject) {
		let params = {
					method: "DELETE",
					url: "/api/admin/delete/adminkeys/"+username
					};
		$.ajax(params).done(function(data) {
			resolve("Deleted adminkeys from "+username)
		}).fail(function(err) {
			reject("Failed to delete adminkeys from "+username)
		});
	});
}

// Delete a targeted account
function delete_account() {
	var username = $('#deleteuser').val();
	username_exist(username).then(function() {
		delete_user(username).then(function() {
			if (username===localStorage.getItem('username')) {
				current_stage="login";
				switch_stage();
				logout();
			}
			delete_stats(username).then(function() {
				alert(username+ " deleted!");
				delete_adminkey(username).then(function() {
					current_stage="login";
					switch_stage();
				}).catch(function(err) {
					console.log(err);
				})
			}).catch(function(err) {
				console.log(err);
			})
		}).catch(function(err) {
			console.log(err);
		})
	}).catch(function(err) {
		alert("Can't delete "+username+" does not exist");
		console.log("Can't delete "+username+" does not exist");
	});
}

// Updates the username in stats db
let update_userstats = function(newUsername,username) {
	return new Promise(function(resolve,reject) {
		let inputs = {
						username: newUsername
					};
		let params = {
						method: "POST",
						url: "/api/user/edit_userstats/"+username,
						data: inputs
					};
		$.ajax(params).done(function(data) {
			resolve("Updated user stats");
		}).fail(function(err) {
			reject("Failed to update user stats");
		});
	});
}

// Updates the username in adminkeys db
let update_userkeys = function(newUsername,username) {
	return new Promise(function(resolve,reject) {
		let inputs = {
						username: newUsername
					};
		let params = {
						method: "POST",
						url: "/api/user/edit_userkeys/"+username,
						data: inputs
					};
		$.ajax(params).done(function(data) {
			resolve("Updated user in adminkeys");
		}).fail(function(err) {
			reject("Failed to update user keys");
		});
	});
}

// Renames the user in users db
let user_rename = function(newUsername) {
	var username = localStorage.getItem('username');
	return new Promise(function(resolve,reject) {
		let inputs = {
						username: newUsername
					};
		let params = {
						method: "POST",
						url: "/api/user/edit_username/"+username,
						data: inputs
					};
		$.ajax(params).done(function(data) {
			resolve("Username updated");
		});
	});
}

// Updates a users username
function update_username(){
	var newUsername = $("#updateuser").val();
	var username = localStorage.getItem('username');
	if (username.trim()!==newUsername.trim()) {
		username_check(newUsername).then(function() {
			user_rename(newUsername).then(function() {
				document.getElementById("greetings").innerHTML = "Howdy "+newUsername+"!";
				console.log("Username changed");
				localStorage.setItem('username',newUsername);
				update_userstats(newUsername,username).then(function() {
					update_userkeys(newUsername,username).then(function() {
						console.log("Everything changed");
					}).catch(function(err) {
						console.log(err);
					})
				}).catch(function(err) {
					console.log(err);
				})
			}).catch(function(err) {
				console.log(err);
			})
		}).catch(function(err) {
			console.log(err);
		});
	} else {
		document.getElementById("greetings").innerHTML = "Still "+username+"...";
	}
}

// Updates a users password
function update_password(){
	var username = localStorage.getItem('username');
	var password = localStorage.getItem('password');
	var newPassword = $("#updatepassword").val();
	if (password.trim()!==newPassword){
		password_check(newPassword).then(function(){
			let inputs = {
							password: newPassword
						};
			let params = {
							method: "POST",
							url: "/api/user/edit_password/"+username,
							data: inputs
						};
			$.ajax(params).done(function(data) {
				localStorage.setItem('password', newPassword);
				document.getElementById("greetings").innerHTML = "Word is that you changed your pass...";
				console.log("Password changed")
			})
		}).catch(function (err) {
			console.log(err);
		});
	} else {
		document.getElementById("greetings").innerHTML = "Pass is still the same...";
	}
}

// Updates a users email address
function update_email(){
	var username = localStorage.getItem('username');
	var email = localStorage.getItem('email');
	var newEmail = $("#updateemail").val();
	if (email.trim()!==newEmail.trim()){
		email_check(newEmail).then(function(){
			let inputs = {
							email: newEmail
						};
			let params = {
							method: "POST",
							url: "/api/user/edit_email/"+username,
							data: inputs
						};
			$.ajax(params).done(function(data) {
				localStorage.setItem('email', newEmail);
				document.getElementById("greetings").innerHTML = "Hope that's not a burner email...";
				console.log("email changed")
			})
		}).catch(function (err) {
			console.log(err);
		});
	} else {
		document.getElementById("greetings").innerHTML = "That's the same email tho :C";
	}
}

// Updates a users first name
function update_firstname(){
	var username = localStorage.getItem('username');
	var firstName = localStorage.getItem('firstname');
	var newFirstName = $("#updatefirstname").val();
	if (firstName.trim()!==newFirstName.trim()){
		let inputs = {
						firstname: newFirstName
					};
		let params = {
						method: "POST",
						url: "/api/user/edit_firstname/"+username,
						data: inputs
					};
		$.ajax(params).done(function(data) {
			localStorage.setItem('firstname', newFirstName);
			document.getElementById("greetings").innerHTML = "Dzień dobry "+newFirstName+"!";
			console.log("first name changed")
		});
	} else {
		document.getElementById("greetings").innerHTML = firstName.toUpperCase()+" "+firstName.toUpperCase()+" "+firstName.toUpperCase()+" "+firstName.toUpperCase()+"!?";
	}
}

// Updates a users last name
function update_lastname(){
	var username = localStorage.getItem('username');
	var lastName = localStorage.getItem('lastname');
	var newLastName = $("#updatelastname").val();
	if (lastName.trim()!==newLastName.trim()){
		let inputs = {
						lastname: newLastName
					};
		let params = {
						method: "POST",
						url: "/api/user/edit_lastname/"+username,
						data: inputs
					};
		$.ajax(params).done(function(data) {
			localStorage.setItem('lastname', newLastName);
			document.getElementById("greetings").innerHTML = "rm -rf "+lastName+" && mkdir "+newLastName;
			console.log("last name changed")
		});
	} else {
		var rln = lastName.toUpperCase().split("").reverse().join("");
		document.getElementById("greetings").innerHTML = "?!"+rln+" "+rln+" "+rln+" "+rln;
	}
}

// Upgrades an account with an adminkey
function upgrade_key_account(){
	var username = localStorage.getItem('username');
	var adminkey = $("#upgradekey").val();

	admin_check(adminkey).then(function(){
		let input = {
						username: username
					};
		let params = {
						method: "POST",
						url: "/api/admin/upgrade/",
						data: input
					};
		$.ajax(params).done(function(data) {
			if (data!=null) {
				localStorage.setItem('usertype', "admin");
				document.getElementById("greetings").innerHTML = "A D M I N";
				console.log("account type changed");
				$('#upgrade-field').hide();
				$('#admin-options').show();
			}
		});
	}).catch(function(err) {
		document.getElementById("greetings").innerHTML = "You tried but I'm not upgrading you...";
		console.log(err);
	});
}
