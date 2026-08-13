CREATE TABLE `user_indicator_profiles` (
	`user_id` text NOT NULL,
	`scope` text NOT NULL,
	`template_json` text NOT NULL,
	`template_hash` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `scope`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
