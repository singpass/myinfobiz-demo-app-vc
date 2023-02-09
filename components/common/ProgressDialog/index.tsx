import { useEffect, useState } from "react";
import styled from "styled-components";

import locale from "@/config/locale";
import { applyStyleIf } from "@/utils";
import { Task, ProgressState } from "./types";
import { Status } from "@/utils/types";
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
  const [progressState, setProgressState] = useState<ProgressState>(
    ProgressState.PROGRESS
  );
  const [taskStates, setTaskStates] = useState<ProgressState[]>([]);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    if (!visible) return;

    setProgressState(() => ProgressState.PROGRESS);
    setErrMessage(() => "");

    const taskStates = tasks.titles.map(() => ProgressState.INACTIVE);
    taskStates[0] = ProgressState.PROGRESS;
    setTaskStates(() => taskStates);

    let index = 0;

    const update = (s: Status) => {
      if (s === Status.SUCCESS) {
        taskStates[index++] = ProgressState.SUCCESS;

        if (taskStates[index]) {
          taskStates[index] = ProgressState.PROGRESS;
        }
      } else {
        taskStates[index] = ProgressState.FAILED;
      }

      setTaskStates(() => [...taskStates]);
    };

    tasks
      .action(update)
      .then(() => {
        setProgressState(() => ProgressState.SUCCESS);
      })
      .catch((e: string) => {
        setProgressState(() => ProgressState.FAILED);
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
          {progressState === ProgressState.PROGRESS && (
            <Loading data-testid="loading-svg" />
          )}
          {progressState === ProgressState.SUCCESS && (
            <Check data-testid="check-svg" />
          )}
          {progressState === ProgressState.FAILED && (
            <Cross data-testid="cross-svg" />
          )}

          <p data-testid="progress-dialog-title">
            {progressState === ProgressState.SUCCESS &&
              locale.dialog.title.success}
            {progressState === ProgressState.FAILED &&
              `${locale.dialog.title.failed}\n${errMessage}`}
            {progressState === ProgressState.PROGRESS && loadingText}
          </p>
        </TitleContainer>

        <TaskGroup data-testid="progress-dialog-task-group">
          {tasks.titles.map((v, i) => (
            <TaskItem key={i} order={i + 1} state={taskStates[i]}>
              {v}
            </TaskItem>
          ))}
        </TaskGroup>

        {(progressState === ProgressState.SUCCESS ||
          progressState === ProgressState.FAILED) && (
          <Button
            onClick={() => setVisible(false)}
            data-testid="progress-dialog-close-btn"
          />
        )}
      </Wrapper>
    </Mask>
  );
};
