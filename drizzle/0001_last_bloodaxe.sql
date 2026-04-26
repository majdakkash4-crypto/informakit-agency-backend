CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320) NOT NULL,
	`clientPhone` varchar(64),
	`companyName` varchar(255),
	`companyWebsite` varchar(512),
	`serviceTypes` json NOT NULL,
	`budgetRange` varchar(64),
	`description` text NOT NULL,
	`attachments` json,
	`status` enum('new','analyzing','analyzed','in_progress','completed','archived') NOT NULL DEFAULT 'new',
	`analysisStatus` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiry_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiryId` int NOT NULL,
	`title` varchar(512) NOT NULL,
	`summary` text,
	`analysisData` json,
	`pdfKey` varchar(512),
	`pdfUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiry_reports_id` PRIMARY KEY(`id`)
);
