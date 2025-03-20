import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import './styles/TaskItem.css'

const TaskItem = (props)=>{
    const {taskName,startTime,endTime,istTodaysDate,isTaskDone, onClickOfDelete,onClickOfEdit} = props;
    return(
        <div className="task-item-container">
            <input className="checkbox-style" type="checkbox" checked ={isTaskDone}/>
            <p className="task-style ">{taskName}</p>
            <p className="timer-style">{startTime}</p>
            <p className="timer-style">{endTime}</p>
            {istTodaysDate? <button className="delete-icon" onClick={onClickOfDelete}>
                <FontAwesomeIcon icon={faTrash} />
            </button> :<></> }
            { istTodaysDate? <button className="edit-icon" onClick={onClickOfEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>:<></>}
        </div>
    );
};

export default TaskItem;