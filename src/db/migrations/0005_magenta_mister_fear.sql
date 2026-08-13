CREATE TABLE `ai_analysis_daily_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`day` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ai_analysis_daily_usage_user_id_idx` ON `ai_analysis_daily_usage` (`user_id`);--> statement-breakpoint
CREATE INDEX `ai_analysis_daily_usage_day_idx` ON `ai_analysis_daily_usage` (`day`);--> statement-breakpoint
CREATE INDEX `ai_analysis_daily_usage_user_day_idx` ON `ai_analysis_daily_usage` (`user_id`,`day`);--> statement-breakpoint
CREATE TABLE `user_chart_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`studies` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_chart_settings_user_id_unique` ON `user_chart_settings` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_chart_settings_user_id_idx` ON `user_chart_settings` (`user_id`);--> statement-breakpoint
ALTER TABLE `user` ADD `is_premium` integer DEFAULT false;