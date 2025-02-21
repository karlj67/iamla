-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-iamla.alwaysdata.net
-- Generation Time: Feb 21, 2025 at 09:57 AM
-- Server version: 10.11.11-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iamla_base`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`iamla`@`%` PROCEDURE `sp_get_user_objectives` (IN `p_user_id` INT, IN `p_year` INT)   BEGIN
    SELECT 
        mo.*,
        COALESCE(v.completed_visits, 0) as completed_visits,
        COALESCE(vv.total_value, 0) as achieved_value
    FROM monthly_objectives mo
    LEFT JOIN (
        SELECT 
            visitor_id,
            DATE_FORMAT(planned_date, '%Y-%m-01') as month,
            COUNT(*) as completed_visits
        FROM visits
        WHERE status = 'executed'
        GROUP BY visitor_id, DATE_FORMAT(planned_date, '%Y-%m-01')
    ) v ON mo.user_id = v.visitor_id AND mo.month = v.month
    LEFT JOIN (
        SELECT 
            v.visitor_id,
            DATE_FORMAT(v.planned_date, '%Y-%m-01') as month,
            SUM(vv.amount) as total_value
        FROM visits v
        JOIN visit_values vv ON v.id = vv.visit_id
        WHERE v.status = 'executed'
        GROUP BY v.visitor_id, DATE_FORMAT(v.planned_date, '%Y-%m-01')
    ) vv ON mo.user_id = vv.visitor_id AND mo.month = vv.month
    WHERE mo.user_id = p_user_id
    AND YEAR(mo.month) = p_year;
END$$

CREATE DEFINER=`iamla`@`%` PROCEDURE `sp_set_monthly_objective` (IN `p_user_id` INT, IN `p_month` DATE, IN `p_visit_objective` INT, IN `p_financial_objective` DECIMAL(10,2))   BEGIN
    INSERT INTO monthly_objectives (user_id, month, visit_objective, financial_objective)
    VALUES (p_user_id, p_month, p_visit_objective, p_financial_objective)
    ON DUPLICATE KEY UPDATE
        visit_objective = p_visit_objective,
        financial_objective = p_financial_objective;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `location_tracking`
--

CREATE TABLE `location_tracking` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_objectives`
--

CREATE TABLE `monthly_objectives` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `month` date NOT NULL,
  `visit_objective` int(11) NOT NULL,
  `financial_objective` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monthly_objectives`
--

INSERT INTO `monthly_objectives` (`id`, `user_id`, `month`, `visit_objective`, `financial_objective`, `created_at`) VALUES
(1, 3, '2024-02-01', 50, 1000000.00, '2025-02-19 11:35:30'),
(2, 4, '2024-02-01', 45, 900000.00, '2025-02-19 11:35:30'),
(3, 5, '2024-02-01', 48, 950000.00, '2025-02-19 11:35:30');

-- --------------------------------------------------------

--
-- Table structure for table `prescribers`
--

CREATE TABLE `prescribers` (
  `id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescriber_types`
--

CREATE TABLE `prescriber_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `laboratory_name` varchar(100) NOT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `laboratory_name`, `supervisor_id`, `created_at`) VALUES
(1, 'Bial1', 'Bial', 3, '2025-02-19 09:03:41'),
(2, 'Bial2', 'Bial', 4, '2025-02-19 09:03:41'),
(3, 'Bottu', 'Bottu', 5, '2025-02-19 09:03:41'),
(4, 'Gilbert', 'Gilbert', 6, '2025-02-19 09:03:41'),
(5, 'UPM', 'UPM', 7, '2025-02-19 09:03:41'),
(6, 'Merinal', 'Merinal', 8, '2025-02-19 09:03:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('admin','supervisor','medical_visitor') NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `role`, `team_id`, `profile_photo`, `created_at`, `updated_at`) VALUES
(2, 'karlj67@gmail.com', '$2a$10$RcAvnKEiuzZ/9AKg7TbM7.Mcch.n9RDWcZP5B3ugC5F86PmzKuz.e', 'Bobby', 'Bob', 'admin', NULL, NULL, '2025-02-18 20:57:25', '2025-02-19 08:35:39'),
(3, 'moustapha.coulibaly@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Moustapha', 'Coulibaly', 'supervisor', 1, NULL, '2025-02-19 09:03:41', '2025-02-19 09:03:41'),
(4, 'desire.kouassi@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Desire', 'Kouassi', 'supervisor', 2, NULL, '2025-02-19 09:03:41', '2025-02-19 09:03:41'),
(5, 'narcisse.koutou@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Narcisse', 'Koutou', 'supervisor', 3, NULL, '2025-02-19 09:03:41', '2025-02-19 09:03:41'),
(6, 'blaise.niamkey@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Blaise', 'Niamkey', 'supervisor', 4, NULL, '2025-02-19 09:03:41', '2025-02-19 09:03:41'),
(7, 'franck.konan@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Franck', 'Konan', 'supervisor', 5, NULL, '2025-02-19 09:03:41', '2025-02-19 09:03:41'),
(8, 'marcel.yapi@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Marcel', 'Yapi', 'supervisor', 6, NULL, '2025-02-19 09:03:41', '2025-02-19 09:03:41'),
(9, 'ruth.kablan@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Ruth', 'Kablan', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(10, 'bamba.mme@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Mme', 'Bamba', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(11, 'solange.bieto@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Solange', 'Bieto', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(12, 'cedrick.tra@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Cedrick', 'Tra Bi', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(13, 'ella.boka@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Ella', 'Boka', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(14, 'georges.lathro@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Georges', 'Lathro', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(15, 'chimène.tano@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Chimène', 'Tano', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(16, 'euphrem.bidi@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Euphrem', 'Bidi', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19'),
(17, 'marthe.koffi@rycapharma.com', '$2a$10$3IKYk1yYW4bKxvNqYbUOrOPBs8rz9QPZZ9M3E5uQZuHrKwxyIcEAG', 'Aya Marthe', 'Koffi', 'medical_visitor', 5, NULL, '2025-02-19 09:12:19', '2025-02-19 09:12:19');

-- --------------------------------------------------------

--
-- Table structure for table `visits`
--

CREATE TABLE `visits` (
  `id` int(11) NOT NULL,
  `visitor_id` int(11) NOT NULL,
  `prescriber_id` int(11) NOT NULL,
  `planned_date` datetime NOT NULL,
  `execution_date` datetime DEFAULT NULL,
  `outcome` enum('positive','neutral','negative') DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `status` enum('planned','executed','cancelled') NOT NULL DEFAULT 'planned',
  `location_latitude` decimal(10,8) DEFAULT NULL,
  `location_longitude` decimal(11,8) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `visits`
--
DELIMITER $$
CREATE TRIGGER `tr_visits_after_insert` AFTER INSERT ON `visits` FOR EACH ROW BEGIN
    INSERT INTO visits_history (
        visit_id, visitor_id, prescriber_id, 
        status, action, changed_by
    )
    VALUES (
        NEW.id, NEW.visitor_id, NEW.prescriber_id,
        NEW.status, 'INSERT', @user_id
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_visits_after_update` AFTER UPDATE ON `visits` FOR EACH ROW BEGIN
    INSERT INTO visits_history (
        visit_id, visitor_id, prescriber_id, 
        status, action, changed_by
    )
    VALUES (
        NEW.id, NEW.visitor_id, NEW.prescriber_id,
        NEW.status, 'UPDATE', @user_id
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `visits_history`
--

CREATE TABLE `visits_history` (
  `id` int(11) NOT NULL,
  `visit_id` int(11) NOT NULL,
  `visitor_id` int(11) NOT NULL,
  `prescriber_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `action` varchar(10) DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT current_timestamp(),
  `changed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visit_values`
--

CREATE TABLE `visit_values` (
  `id` int(11) NOT NULL,
  `visit_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`products`)),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_team_performance`
-- (See below for the actual view)
--
CREATE TABLE `vw_team_performance` (
`team_id` int(11)
,`team_name` varchar(100)
,`laboratory_name` varchar(100)
,`month` varchar(7)
,`total_visitors` bigint(21)
,`completed_visits` bigint(21)
,`total_value` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_visitor_performance`
-- (See below for the actual view)
--
CREATE TABLE `vw_visitor_performance` (
`visitor_id` int(11)
,`first_name` varchar(100)
,`last_name` varchar(100)
,`team_name` varchar(100)
,`month` varchar(7)
,`completed_visits` bigint(21)
,`cancelled_visits` bigint(21)
,`visit_objective` int(11)
,`total_value` decimal(32,2)
,`financial_objective` decimal(10,2)
,`completion_rate` decimal(26,2)
);

-- --------------------------------------------------------

--
-- Structure for view `vw_team_performance`
--
DROP TABLE IF EXISTS `vw_team_performance`;

CREATE ALGORITHM=UNDEFINED DEFINER=`iamla`@`%` SQL SECURITY DEFINER VIEW `vw_team_performance`  AS SELECT `t`.`id` AS `team_id`, `t`.`name` AS `team_name`, `t`.`laboratory_name` AS `laboratory_name`, date_format(`v`.`planned_date`,'%Y-%m') AS `month`, count(distinct `u`.`id`) AS `total_visitors`, count(case when `v`.`status` = 'executed' then 1 end) AS `completed_visits`, coalesce(sum(`vv`.`amount`),0) AS `total_value` FROM (((`teams` `t` join `users` `u` on(`t`.`id` = `u`.`team_id`)) left join `visits` `v` on(`u`.`id` = `v`.`visitor_id`)) left join `visit_values` `vv` on(`v`.`id` = `vv`.`visit_id`)) WHERE `u`.`role` = 'medical_visitor' GROUP BY `t`.`id`, `t`.`name`, `t`.`laboratory_name`, date_format(`v`.`planned_date`,'%Y-%m') ;

-- --------------------------------------------------------

--
-- Structure for view `vw_visitor_performance`
--
DROP TABLE IF EXISTS `vw_visitor_performance`;

CREATE ALGORITHM=UNDEFINED DEFINER=`iamla`@`%` SQL SECURITY DEFINER VIEW `vw_visitor_performance`  AS SELECT `u`.`id` AS `visitor_id`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `t`.`name` AS `team_name`, date_format(`v`.`planned_date`,'%Y-%m') AS `month`, count(case when `v`.`status` = 'executed' then 1 end) AS `completed_visits`, count(case when `v`.`status` = 'cancelled' then 1 end) AS `cancelled_visits`, `mo`.`visit_objective` AS `visit_objective`, coalesce(sum(`vv`.`amount`),0) AS `total_value`, `mo`.`financial_objective` AS `financial_objective`, round(count(case when `v`.`status` = 'executed' then 1 end) / `mo`.`visit_objective` * 100,2) AS `completion_rate` FROM ((((`users` `u` left join `teams` `t` on(`u`.`team_id` = `t`.`id`)) left join `visits` `v` on(`u`.`id` = `v`.`visitor_id`)) left join `monthly_objectives` `mo` on(`u`.`id` = `mo`.`user_id` and date_format(`v`.`planned_date`,'%Y-%m-01') = `mo`.`month`)) left join `visit_values` `vv` on(`v`.`id` = `vv`.`visit_id`)) WHERE `u`.`role` = 'medical_visitor' GROUP BY `u`.`id`, `u`.`first_name`, `u`.`last_name`, `t`.`name`, date_format(`v`.`planned_date`,'%Y-%m'), `mo`.`visit_objective`, `mo`.`financial_objective` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `location_tracking`
--
ALTER TABLE `location_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_timestamp` (`user_id`,`timestamp`);

--
-- Indexes for table `monthly_objectives`
--
ALTER TABLE `monthly_objectives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_month` (`user_id`,`month`);

--
-- Indexes for table `prescribers`
--
ALTER TABLE `prescribers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `prescriber_types`
--
ALTER TABLE `prescriber_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supervisor_id` (`supervisor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescriber_id` (`prescriber_id`),
  ADD KEY `idx_visitor_date` (`visitor_id`,`planned_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `visits_history`
--
ALTER TABLE `visits_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visit_values`
--
ALTER TABLE `visit_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `visit_id` (`visit_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `location_tracking`
--
ALTER TABLE `location_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monthly_objectives`
--
ALTER TABLE `monthly_objectives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `prescribers`
--
ALTER TABLE `prescribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescriber_types`
--
ALTER TABLE `prescriber_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `visits`
--
ALTER TABLE `visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visits_history`
--
ALTER TABLE `visits_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visit_values`
--
ALTER TABLE `visit_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `location_tracking`
--
ALTER TABLE `location_tracking`
  ADD CONSTRAINT `location_tracking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `monthly_objectives`
--
ALTER TABLE `monthly_objectives`
  ADD CONSTRAINT `monthly_objectives_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `prescribers`
--
ALTER TABLE `prescribers`
  ADD CONSTRAINT `prescribers_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `prescriber_types` (`id`);

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`prescriber_id`) REFERENCES `prescribers` (`id`);

--
-- Constraints for table `visit_values`
--
ALTER TABLE `visit_values`
  ADD CONSTRAINT `visit_values_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
