import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./styles/TaskItem.css";

const TaskItem = (props) => {
  const {
    id,
    taskName,
    startTime,
    endTime,
    isTodaysDate,
    isTaskDone,
    onClickOfDelete,
    onClickOfEdit,
    onCheckBoxValueChanged,
  } = props;
  const onValueChange = (e) => {
    const { checked } = e.target; // Use e.target.checked to get the checkbox value
    console.log("taskId:");
    console.log(props.id);
    onCheckBoxValueChanged(checked, id);
  };
  const onClickOfEditButton = () => {
    const taskData = {
      id,
      taskName,
      startTime,
      endTime,
      isTaskDone,
    };
    console.log("Sending task data:", taskData);
    onClickOfEdit(taskData);
  };
  return (
    <div className="task-item-container">
      <input
        className="checkbox-style"
        onChange={onValueChange}
        type="checkbox"
        checked={isTaskDone}
      />
      <p className="task-style ">{taskName}</p>
      <p className="timer-style">{startTime}</p>
      <p className="timer-style">{endTime}</p>
      {isTodaysDate ? (
        <button className="delete-icon" onClick={onClickOfDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      ) : (
        <></>
      )}
      {isTodaysDate ? (
        <button className="edit-icon" onClick={onClickOfEditButton}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TaskItem;
