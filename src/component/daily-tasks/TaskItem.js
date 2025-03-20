import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import './styles/TaskItem.css'

const TaskItem = (props)=>{
    const {task,starttime,endtime,onclickOfDelete,onClickOfEdit} = props;
    return(
        <div className="task-item-container">
            <p className="task-style ">{task}</p>
            <p className="timer-style">{starttime}</p>
            <p className="timer-style">{endtime}</p>
            <button className="delete-icon" onClick={onclickOfDelete}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="edit-icon" onClick={onClickOfEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>
        </div>
    );
};

export default TaskItem;