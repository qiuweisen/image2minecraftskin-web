CREATE TABLE `ai_waitlist` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`locale` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_waitlist_email_unique` ON `ai_waitlist` (`email`);