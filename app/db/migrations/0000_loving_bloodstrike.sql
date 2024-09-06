CREATE TABLE `password` (
	`hash` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recording_iteration` (
	`id` integer PRIMARY KEY NOT NULL,
	`seed` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`recording_id` text NOT NULL,
	FOREIGN KEY (`recording_id`) REFERENCES `recording`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recording` (
	`id` integer PRIMARY KEY NOT NULL,
	`audio_key` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`active_iteration_id` text,
	`user_id` text,
	FOREIGN KEY (`active_iteration_id`) REFERENCES `recording_iteration`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY NOT NULL,
	`expiration_date` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_user_id_unique` ON `password` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recording_iteration_recording_id_unique` ON `recording_iteration` (`recording_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recording_user_id_unique` ON `recording` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_user_id_unique` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);