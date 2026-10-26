CREATE TABLE `credit_admin_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`biz_key` text NOT NULL,
	`payload` text NOT NULL,
	`amount` integer,
	`before_balance` integer,
	`after_balance` integer,
	`transaction_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `credit_admin_audit_actor_biz_unique` ON `credit_admin_audit` (`actor_id`,`biz_key`);--> statement-breakpoint
CREATE INDEX `credit_admin_audit_user_idx` ON `credit_admin_audit` (`user_id`);--> statement-breakpoint
CREATE TABLE `credit_guard` (
	`ok` integer NOT NULL,
	CONSTRAINT "credit_guard_ok_check" CHECK("credit_guard"."ok" = 1)
);
--> statement-breakpoint
CREATE TABLE `credit_task` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tool_id` text NOT NULL,
	`biz_key` text NOT NULL,
	`input_hash` text NOT NULL,
	`input_json` text NOT NULL,
	`cost` integer NOT NULL,
	`pricing_version` text NOT NULL,
	`policy_json` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`usage_transaction_id` text,
	`refund_transaction_id` text,
	`workflow_instance_id` text,
	`external_job_id` text,
	`input_r2_key` text,
	`preset` text,
	`provider_input_url` text,
	`execution_owner` text,
	`result_ref` text,
	`error_code` text,
	`error_message` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "credit_task_positive_cost" CHECK("credit_task"."cost" > 0),
	CONSTRAINT "credit_task_valid_status" CHECK("credit_task"."status" IN ('pending','running','unknown','succeeded','failed','rejected','refund_pending')),
	CONSTRAINT "credit_task_success_has_result" CHECK("credit_task"."status" != 'succeeded' OR "credit_task"."result_ref" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `credit_task_user_biz_unique_idx` ON `credit_task` (`user_id`,`biz_key`);--> statement-breakpoint
CREATE INDEX `credit_task_user_created_idx` ON `credit_task` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `credit_task_status_updated_idx` ON `credit_task` (`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `credit_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`amount` integer NOT NULL,
	`remaining_amount` integer,
	`biz_key` text,
	`payment_id` text,
	`provider` text,
	`subscription_id` text,
	`related_transaction_id` text,
	`period_start` integer,
	`period_end` integer,
	`expiration_date` integer,
	`expired_at` integer,
	`metadata` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "credit_transaction_remaining_nonnegative_check" CHECK("credit_transaction"."remaining_amount" IS NULL OR "credit_transaction"."remaining_amount" >= 0)
);
--> statement-breakpoint
CREATE INDEX `credit_transaction_user_id_idx` ON `credit_transaction` (`user_id`);--> statement-breakpoint
CREATE INDEX `credit_transaction_type_idx` ON `credit_transaction` (`type`);--> statement-breakpoint
CREATE INDEX `credit_transaction_user_type_idx` ON `credit_transaction` (`user_id`,`type`);--> statement-breakpoint
CREATE INDEX `credit_transaction_expiration_remaining_idx` ON `credit_transaction` (`expiration_date`,`remaining_amount`);--> statement-breakpoint
CREATE INDEX `credit_transaction_user_expiration_idx` ON `credit_transaction` (`user_id`,`expiration_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `credit_transaction_user_type_biz_key_unique_idx` ON `credit_transaction` (`user_id`,`type`,`biz_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `credit_transaction_related_type_biz_key_unique_idx` ON `credit_transaction` (`related_transaction_id`,`type`,`biz_key`);--> statement-breakpoint
CREATE TABLE `redemption_code` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`credits_amount` integer NOT NULL,
	`max_redemptions` integer,
	`redemptions_count` integer DEFAULT 0 NOT NULL,
	`per_user_limit` integer DEFAULT 1 NOT NULL,
	`expires_at` integer,
	`credit_expires_at` integer,
	`credit_expire_days` integer,
	`bound_user_id` text,
	`note` text,
	`created_by` text,
	`disabled` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`bound_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redemption_code_code_unique` ON `redemption_code` (`code`);--> statement-breakpoint
CREATE INDEX `redemption_code_code_idx` ON `redemption_code` (`code`);--> statement-breakpoint
CREATE INDEX `redemption_code_bound_user_idx` ON `redemption_code` (`bound_user_id`);--> statement-breakpoint
CREATE INDEX `redemption_code_disabled_idx` ON `redemption_code` (`disabled`);--> statement-breakpoint
CREATE TABLE `redemption_record` (
	`id` text PRIMARY KEY NOT NULL,
	`code_id` text NOT NULL,
	`user_id` text NOT NULL,
	`seq` integer NOT NULL,
	`credits_granted` integer NOT NULL,
	`credit_transaction_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`code_id`) REFERENCES `redemption_code`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`credit_transaction_id`) REFERENCES `credit_transaction`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `redemption_record_code_idx` ON `redemption_record` (`code_id`);--> statement-breakpoint
CREATE INDEX `redemption_record_user_idx` ON `redemption_record` (`user_id`);--> statement-breakpoint
CREATE INDEX `redemption_record_user_code_idx` ON `redemption_record` (`user_id`,`code_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `redemption_record_code_user_seq_unique_idx` ON `redemption_record` (`code_id`,`user_id`,`seq`);--> statement-breakpoint
CREATE TABLE `user_credit` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`current_credits` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "user_credit_nonnegative_check" CHECK("user_credit"."current_credits" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_credit_user_id_unique` ON `user_credit` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_credit_user_id_idx` ON `user_credit` (`user_id`);