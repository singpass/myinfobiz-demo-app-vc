import { useEffect, useState } from "react";
import styled from "styled-components";

import locale from "@/config/locale";
import { applyStyleIf } from "@/utils";
import type { Task, ProgressState, TaskState } from "./types";
import type { Status } from "@/utils/types";
import Loading, { Wrapper as $Loading } from "components/svg/Loading";
import Check, { Wrapper as $Check } from "components/svg/Check";
import Cross, { Wrapper as $Cross } from "components/svg/Cross";
import TaskItem from "./components/TaskItem";
import Button from "./components/Button";

const Mask = styled.div(
  ({ $visible }: { $visible: boolean }) => `
  position: fixed;
  z-index: 100;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background: #0007;

  display: none;
  align-items: center;
  justify-content: center;

  ${applyStyleIf(
    $visible,
    `
    display: flex;
  `
  )}
`
);

const Wrapper = styled.div`
  background: white;
  padding: 35px;
  border-radius: 15px;
  width: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  p {
    font-size: 14px;
    color: #5e5e5e;
    text-align: center;
    white-space: break-spaces;
  }

  ${$Loading} {
    width: 40px;
  }
  ${$Check} {
    width: 33px;
  }
  ${$Cross} {
    width: 23px;
  }
`;

const TaskGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default ({
  loadingText,
  tasks,
  visible,
  setVisible,
}: {
  loadingText: string;
  tasks: Task;
  visible: boolean;
  setVisible: (b: boolean) => void;
}) => {
  /**
   * Hooks
   */
  const [progressState, setProgressState] =
    useState<ProgressState>("in-progress");
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    if (!visible) return;

    setProgressState(() => "in-progress");
    setErrMessage(() => "");

    const taskStates: TaskState[] = tasks.titles.map(() => "inactive");
    taskStates[0] = "in-progress";
    setTaskStates(() => taskStates);

    let index = 0;

    const update = (s: Status) => {
      if (s === "success") {
        taskStates[index++] = "success";

        if (taskStates[index]) {
          taskStates[index] = "in-progress";
        }
      } else {
        taskStates[index] = "failed";
      }

      setTaskStates(() => [...taskStates]);
    };

    tasks
      .action(update)
      .then(() => {
        setProgressState(() => "success");
      })
      .catch((e: string) => {
        setProgressState(() => "failed");
        setErrMessage(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /**
   * Render
   */
  return (
    <Mask $visible={visible} data-testid="progress-dialog">
      <Wrapper>
        <TitleContainer data-testid="progress-dialog-title-container">
          {progressState === "in-progress" && (
            <Loading data-testid="progress-dialog-loading-svg" />
          )}
          {progressState === "success" && (
            <Check data-testid="progress-dialog-success-svg" />
          )}
          {progressState === "failed" && (
            <Cross data-testid="progress-dialog-failed-svg" />
          )}

          <p data-testid="progress-dialog-title">
            {progressState === "success" && locale.dialog.title.success}
            {progressState === "failed" &&
              `${locale.dialog.title.failed}\n${errMessage}`}
            {progressState === "in-progress" && loadingText}
          </p>
        </TitleContainer>

        <TaskGroup data-testid="progress-dialog-task-group">
          {tasks.titles.map((v, i) => (
            <TaskItem key={i} order={i + 1} state={taskStates[i]}>
              {v}
            </TaskItem>
          ))}
        </TaskGroup>

        {(progressState === "success" || progressState === "failed") && (
          <Button
            onClick={() => setVisible(false)}
            data-testid="progress-dialog-close-btn"
          />
        )}
      </Wrapper>
    </Mask>
  );
};
