CREATE TABLE `enquiries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reference` varchar(32) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40),
	`event_date` date NOT NULL,
	`venue` varchar(200) NOT NULL,
	`service` varchar(100) NOT NULL,
	`package_name` varchar(100),
	`style` varchar(100),
	`coverage` varchar(100),
	`message` text,
	`status` enum('new','in-progress','booked','closed') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`),
	CONSTRAINT `enquiries_reference_unique` UNIQUE(`reference`)
);
