# ************************************************************
# Sequel Ace SQL dump
# Version 20094
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.42)
# Database: academic_app
# Generation Time: 2025-07-27 14:43:52 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `literature_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `literature_id` (`literature_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`literature_id`) REFERENCES `literature` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;

INSERT INTO `comments` (`id`, `literature_id`, `user_id`, `username`, `comment`, `created_at`)
VALUES
	(1,1,3,NULL,'This is a test comment','2025-07-24 18:36:04'),
	(2,1,3,NULL,'test','2025-07-25 22:46:20'),
	(3,1,3,'testadmin','test','2025-07-25 23:00:27'),
	(4,4,3,'testadmin','comment first','2025-07-27 21:31:44'),
	(5,1,7,'fontana','test','2025-07-27 21:32:48'),
	(6,4,7,'fontana','test','2025-07-27 21:32:52');

/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table literature
# ------------------------------------------------------------

DROP TABLE IF EXISTS `literature`;

CREATE TABLE `literature` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `file_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `literature_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `literature` WRITE;
/*!40000 ALTER TABLE `literature` DISABLE KEYS */;

INSERT INTO `literature` (`id`, `title`, `description`, `file_url`, `created_by`, `approved`, `created_at`)
VALUES
	(1,'New Literature','A new piece of academic literature','http://example.com/file.pdf',3,1,'2025-07-24 16:34:08'),
	(2,'New Literature','A new piece of academic literature','http://example.com/file.pdf',3,0,'2025-07-25 18:23:23'),
	(3,'Testing Literature','yow','http://example.com/file.pdf',3,0,'2025-07-25 23:22:44'),
	(4,'first literature','test','https://e-journal.uac.ac.id/index.php/iijse/article/download/5660/2227/',3,1,'2025-07-27 21:30:56'),
	(5,'my first literature','this is my first','http://example.com/file.pdf',8,1,'2025-07-27 21:34:36');

/*!40000 ALTER TABLE `literature` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`)
VALUES
	(1,'testuser','test@example.com','$2a$12$eG5FP4.r2dS4d3z1C9Ap6ukdKCep6Q4E5eL90V8LdiRDDSSseHkji',3),
	(3,'testadmin','admin@example.com','$2a$12$eG5FP4.r2dS4d3z1C9Ap6ukdKCep6Q4E5eL90V8LdiRDDSSseHkji',1),
	(4,'testteacher','teacher@example.com','$2a$12$eG5FP4.r2dS4d3z1C9Ap6ukdKCep6Q4E5eL90V8LdiRDDSSseHkji',2),
	(6,'Kafabih','kafabih@test.com','$2b$10$MyE0eDJ3gFa5.e4dylAcueTndD29Ck6fML26T/rvUNGvGox2pIIJK',3),
	(7,'fontana','fontana@test.com','$2b$10$PInpN3oi2mO2.XScViQt/.Jswwtt2Q4GzH387zSVkIxeUtSQDR7lW',3),
	(8,'teacher1','teacher1@teacher.com','$2b$10$BKVlCt3RDl2nCOV7dJHtOuc3uxhnhlP/VbH9x7QKLDSILSh3gqzF.',2);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
