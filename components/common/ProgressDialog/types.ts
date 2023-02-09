import { Status } from "@/utils/types";

export enum ProgressState {
  PROGRESS = "in-progress",
  SUCCESS = "success",
  FAILED = "failed",
  INACTIVE = "inactive",
}

export type Task = {
  titles: string[];
  action: (update: (s: Status) => void) => Promise<void>;
};
