## Authentification API ##
This is an api to manage simple authentification. It's based on [JWT](https://jwt.io).
You may ask for a token, authentificate thanks to this token and manage users too. The database is Mysql.

# **Requirements** #

You need any latest version of
- MySql Database
- NodeJS

You have to configure the API by creating a JSON configuration file in /conf directory (**do not change the name**  *configuration.json*).

**/conf/configuration.conf** example
~~~
{
    "mySql": 
    {
    "host": "localhost",
        "user": "admin",
        "port": "3306",
        "password": "admin",
        "database": "authentification"
    },
    "authentification": 
    {
        "secret": "your JWT secret here",
        "salt": "Your hash salt here to encrypt passwords starts with '$2a$10$' (salt version compatible), total salt length must be >= 29",
        "userRequestEmail": "your email here",
        "adminToken": "For new user request operation enter you admin token here"
    },
    "common":
    {
        "port": 4000,
        "logToFile": true,
        "logToConsole": true,
        "logFile" : "authentification.log"
    }
}
~~~    

# **How does it work?** #

JWT is very convinient because for authentification request no need to access the database.
Indeed, first create a user then get a token out of it and store that token. Everytime a user wants to perfom an action check the token again the server, no database access is need, only the validity of the token is check (what is not time or resource consuming). Learn more [here](https://jwt.io).

For example you could call:
1. PUT /user (creates the user)
2. POST /get (gets the token)
3. POST /check (verifies the token)

**Note:** *In configuration file, admin token is used to create new user without any connection (signup functionality).*

# **How to install?** #

- Create the MySql database

~~~
CREATE SCHEMA authentification;

CREATE TABLE `user` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(300) NOT NULL,
  `password` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `country` varchar(5) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `phone1` varchar(45) DEFAULT NULL,
  `phone2` varchar(45) DEFAULT NULL,
  `phone3` varchar(45) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `availability` varchar(45) DEFAULT NULL,
  `language` varchar(5) DEFAULT NULL,
  `office` varchar(100) DEFAULT NULL,
  `postalcode` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address1` varchar(1000) DEFAULT NULL,
  `address2` varchar(1000) DEFAULT NULL,
  `application` varchar(45) NOT NULL,
  `validated` tinyint(4) NOT NULL DEFAULT '0',
  `organisation` varchar(300) DEFAULT NULL,
  `creationdate` datetime NOT NULL,
  `updatedate` datetime NOT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
~~~
- **Set the configuration.json**
Set all database parameters and also *secret* and *salt* parameters
- **Create admin user, user type must be 1**
1. Get encrypted admin user password: call */encrypt* (body : {"text": "password"})
2. Insert user admin with:
~~~
INSERT INTO `user` (`login`, `type`, `country`, `lastName`, `firstName`, `password`, `email`, `validated`, `application`, `creationdate`, `updatedate`) VALUES 
('admin', '1', 'FR', 'Admin', 'Admin', 'encrypted password', 'my.emal@email.com', 1, 'authentification', '2017-01-01 12:00:00', '2017-01-01 12:00:00');
~~~
- **Get the token: call** */get* (body : {login: "admin", password: "plain password"})
- **Set admin token** in /conf/configuration.json

**You're good to go!**
