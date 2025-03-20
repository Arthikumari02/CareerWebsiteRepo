import React from "react";
import "./styles/DailyTask.css";
import TaskItem from './TaskItem'

const DailyTasksButton = (props)=>{
    const {dateText,onClickOfDate} = props;
    return(
        <button className="daily-tasks-buttonStyle" onClick={onClickOfDate}>
            <p className="date-text-style">{dateText}</p>
        </button>
    );
};

const DailyTask = () => {

    const tasks = [
        { id: 1, task: "Complete React Project", starttime: "10:00 AM", endtime: "12:00 PM" },
        { id: 2, task: "Study JavaScript", starttime: "1:00 PM", endtime: "2:30 PM" },
      ];

      const handleDelete = (id) => {
        console.log(`Delete task with id: ${id}`);
      };
    
      const handleEdit = (id) => {
        console.log(`Edit task with id: ${id}`);
      };

  return (
    <div className="container">
      <div className="sidebar">
      <DailyTasksButton dateText = "19-12-2004"/>
        <hr />
        <button className="new-task-btn">Add New Task</button>
      </div>
      <main className="content">
        <div className="cards-container">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task.task}
                    starttime={task.starttime}
                    endtime={task.endtime}
                    onClickOfDelete={() => handleDelete(task.id)}
                    onClickOfEdit={() => handleEdit(task.id)}
                />
                ))}
        </div>
      </main>
    </div>
  );
};

export default DailyTask;