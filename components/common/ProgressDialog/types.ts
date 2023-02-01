import { Status } from "@/utils/types";

export type ProgressState = "in-progress" | "success" | "failed";
export type TaskState = ProgressState | "inactive";

export type Task = {
  titles: string[];
  action: (update: (s: Status) => void) => Promise<void>;
};
