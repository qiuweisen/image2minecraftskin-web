import { apikey, user } from "./auth.schema";
import {
  userFiles,
  payment,
  userCredit,
  creditTransaction,
  creditTask,
  redemptionCode,
  redemptionRecord,
} from "./app.schema";

export type User = typeof user.$inferSelect;
export type ApiKey = typeof apikey.$inferSelect;
export type UserFiles = typeof userFiles.$inferSelect;
export type Payment = typeof payment.$inferSelect;
export type UserCredit = typeof userCredit.$inferSelect;
export type CreditTransaction = typeof creditTransaction.$inferSelect;
export type CreditTask = typeof creditTask.$inferSelect;
export type RedemptionCode = typeof redemptionCode.$inferSelect;
export type RedemptionRecord = typeof redemptionRecord.$inferSelect;
