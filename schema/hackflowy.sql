-- phpMyAdmin SQL Dump
-- version 3.5.7deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 10, 2013 at 09:51 PM
-- Server version: 5.5.29-0ubuntu1
-- PHP Version: 5.4.9-4ubuntu2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hackflowy`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `timestamp` int(12) NOT NULL,
  `parent_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=107 ;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `content`, `timestamp`, `parent_id`) VALUES
(96, 'Welcome to HackFlowy!', 1365610846, 0),
(99, 'An open-source WorkFlowy clone', 1365610837, 0),
(101, 'Built using Backbone + Socket.IO', 1365610824, 0),
(102, 'I pulled this together in a few hours to learn Backbone', 1365610861, 0),
(104, 'Feel free to try it out and hack on it', 1365610859, 0),
(106, 'Good Luck!', 1365610865, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
