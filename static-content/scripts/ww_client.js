// Controls what elements are viewed at a time
function switch_stage(){
	switch(current_stage){
        case "stage":
            $("#stage-field").show();
            $("#login-field").hide();
            $("#register-field").hide();
			$("#update-field").show();
            break;
        case "login":
            $("#stage-field").hide();
            $("#login-field").show();
            $("#register-field").hide();
			$("#update-field").hide();
            break;
        case "register":
            $("#stage-field").hide();
            $("#login-field").hide();
		    $("#register-field").show();
			$("#update-field").hide();
            break;
		case "update":
			$("#stage-field").show();
			$("#login-field").hide();
			$("#register-field").hide();
			$("#update-field").show();
			break;
  }
}

// Logout
function logout() {
	localStorage.clear();
	current_stage="login";
	switch_stage();
	location.reload(true);
}

// Updates the dom text fields on the update page
function set_update() {
	setTimeout(() => {
		var username = localStorage.getItem('username');
		var password = localStorage.getItem('password');
		var email = localStorage.getItem('email');
		var firstname = localStorage.getItem('firstname');
		var lastname = localStorage.getItem('lastname');
		var usertype = localStorage.getItem('usertype');
		$("#greetings").html("Welcome back "+localStorage.getItem("username")+"!");
		$('#updateuser').val(username);
		$('#updatepassword').val(password);
		if (email!=="undefined"){
			$('#updateemail').val(email);
		}
		if (firstname!=="undefined"){
			$('#updatefirstname').val(firstname);
		}
		if (lastname!=="undefined"){
			$('#updatelastname').val(lastname);
		}
		console.log("Logged in as "+username);
		if (localStorage.getItem('usertype')=="admin"){
			$('#upgrade-field').hide();
		} else{
			$('#admin-options').hide();
		}
		retrieve_your_top_ten();
	}, 100);
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	$("#loginSubmit").on('click',function(){ login_account(); });
	$("#createAccountSubmit").on('click',function(){ create_account(); });
	$("#deleteSelfSubmit").on('click',function(){ delete_self_account(); });
	$("#logoutSubmit").on('click',function(){ logout(); });

	$("#updateUsernameSubmit").on('click',function(){ update_username(); });
	$("#updatePasswordSubmit").on('click',function(){ update_password(); });
	$("#updateEmailSubmit").on('click',function(){ update_email(); });
	$("#updateFirstNameSubmit").on('click',function(){ update_firstname(); });
	$("#updateLastNameSubmit").on('click',function(){ update_lastname(); });
	$("#upgradeAccountKeySubmit").on('click',function(){ upgrade_key_account(); });

	$("#createnewkeySubmit").on('click',function(){ create_adminkey(); });
	$("#retrieveAllSubmit").on('click',function(){ retrieve_all_users(); });
	$("#upgradeAccountSubmit").on('click',function(){ upgrade_account(); });
	$("#deleteOtherAccountSubmit").on('click',function(){ delete_account(); });


	retrieve_top_ten();
	$("#all-stats-login").hide();
	$("#all-stats").hide();

	$("#your-stats").hide();
	retrieve_your_top_ten();

	current_stage = "login";
  	switch_stage();
});
