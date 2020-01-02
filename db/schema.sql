--- drop tables if there exist tables
drop table if exists users;
drop table if exists adminkeys;
drop table if exists stats;
drop table if exists user_stats;


--- User table
create table users (
	username varchar(34) PRIMARY KEY NOT NULL UNIQUE,
	password varchar(50) NOT NULL,
	firstName varchar(50),
	lastName varchar(50),
	email varchar(50),
	lastLogin date,
	userType varchar(6) NOT NULL,
    CHECK (userType = 'gamer' or userType = 'admin')
);

--- Adminkeys table
create table adminkeys (
	username varchar(15) NOT NULL,
	adminKey varchar(50) NOT NULL UNIQUE,
	CONSTRAINT fk_username
		FOREIGN KEY (username)
		REFERENCES users(username)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

create table user_stats (
	username varchar(15),
	highscore int DEFAULT 0,
	CONSTRAINT fk_username
		FOREIGN KEY (username)
		REFERENCES users(username)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

create table stats (
	username varchar(15) NOT NULL UNIQUE,
	numGamesWon int DEFAULT 0,
	numGamesLost int DEFAULT 0,
	highscore int DEFAULT 0,
	CONSTRAINT fk_username
		FOREIGN KEY (username)
		REFERENCES users(username)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

-- Populate base userbase
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('admin', '123','Admin', 'Admin', 'admin@info.com', 'admin', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe1', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe2', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe3', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe4', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe5', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe6', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe7', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe8', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe9', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe10', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe11', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe12', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe13', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe14', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');
insert into users(username,password,firstName,lastName,email,userType,lastLogin) values ('johndoe15', '123','John', 'Doe', 'john@i.com', 'gamer', '2015-03-02');


insert into stats(username,numGamesWon,numGamesLost,highscore) values ('admin',7,3,20);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe1',7,10,1500);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe2',7,11,1600);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe3',7,12,1700);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe4',7,13,1800);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe5',7,14,1900);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe6',7,15,1100);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe7',7,16,1200);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe8',7,17,1300);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe9',7,18,1400);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe10',7,19,1500);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe11',7,20,1700);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe12',7,11,2500);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe13',7,2,3500);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe14',7,1,4700);
insert into stats(username,numGamesWon,numGamesLost,highscore) values ('johndoe15',7,1,5500);

insert into user_stats(username,highscore) values ('admin',    20);
insert into user_stats(username,highscore) values ('johndoe1', 1500);
insert into user_stats(username,highscore) values ('johndoe2', 1600);
insert into user_stats(username,highscore) values ('johndoe3', 1700);
insert into user_stats(username,highscore) values ('johndoe4', 1800);
insert into user_stats(username,highscore) values ('johndoe5', 1900);
insert into user_stats(username,highscore) values ('johndoe6', 1100);
insert into user_stats(username,highscore) values ('johndoe7', 1200);
insert into user_stats(username,highscore) values ('johndoe8', 1300);
insert into user_stats(username,highscore) values ('johndoe9', 1400);
insert into user_stats(username,highscore) values ('johndoe10',1500);
insert into user_stats(username,highscore) values ('johndoe11',1700);
insert into user_stats(username,highscore) values ('johndoe12',2500);
insert into user_stats(username,highscore) values ('johndoe13',3500);
insert into user_stats(username,highscore) values ('johndoe14',4700);
insert into user_stats(username,highscore) values ('johndoe15',5500);

insert into adminkeys(username,adminKey) values ('admin', 'adminkey');
insert into adminkeys(username,adminKey) values ('admin', 'SPAGHETTI');
insert into adminkeys(username,adminKey) values ('admin', 'password');
