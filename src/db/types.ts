import { apikey, user } from "./auth.schema";
import {
  dailyCheckins,
  payment,
  trainingRecords,
  userFiles,
  userPoints,
} from "./app.schema";

export type User = typeof user.$inferSelect;
export type ApiKey = typeof apikey.$inferSelect;
export type UserFiles = typeof userFiles.$inferSelect;
export type Payment = typeof payment.$inferSelect;
export type TrainingRecord = typeof trainingRecords.$inferSelect;
export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type UserPoints = typeof userPoints.$inferSelect;
