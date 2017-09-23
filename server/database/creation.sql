CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin'

GRANT ALL ON *.* to admin@'localhost' IDENTIFIED BY 'admin';

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

/* admin password = dere123469*/
INSERT INTO `user` (`login`, `type`, `country`, `lastName`, `firstName`, `password`, `email`, `validated`, `application`, `creationdate`, `updatedate`) VALUES 
('admin', '1', 'FR', 'Admin', 'Admin', '$2a$10$Vn/zPCM8sSSaYnRmggV4COfC7PVXsyhRfL0AYmEadkwfBqJBqxDrS', 'bernard.deregnaucourt@vidal.fr', 1, 'authentification', '2017-01-01 12:00:00', '2017-01-01 12:00:00');