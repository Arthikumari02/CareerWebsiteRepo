import React from "react";
import "./styles/DailyTask.css";
import TaskItem from "./TaskItem";

const DailyTasksButton = (props) => {
  const { dateText, onClickOfDate } = props;
  return (
    <button className="daily-tasks-buttonStyle" onClick={onClickOfDate}>
      <p className="date-text-style">{dateText}</p>
    </button>
  );
};

class DailyTask extends React.Component {
  constructor(props) {
    super(props);

    // Initialize with default empty values or with props if they exist
    this.state = {
      listOfDailyTasks: {
        dateText: props.listOfDailyTasks?.dateText || "",
        listOfTasks: props.listOfDailyTasks?.listOfTasks || [],
        onClickOfChecklist:
          props.listOfDailyTasks?.onClickOfChecklist || (() => {}),
      },
      tasks: [
        {
          id: 1,
          taskName: "Complete React Project",
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          istTodaysDate: true,
          isTaskDone: true,
        },
        {
          id: 2,
          taskName: "Study JavaScript",
          startTime: "1:00 PM",
          endTime: "2:30 PM",
          istTodaysDate: false,
          isTaskDone: false,
        },
      ],
    };
  }

  handleDelete = (id) => {
    console.log(`Delete task with id: ${id}`);
  };

  handleEdit = (id) => {
    console.log(`Edit task with id: ${id}`);
  };

  render() {
    const {
      sidebarTitle,
      onClikcOfAddTodayTasks,
      AddTodayTaskButtonText,
      listOfDailyTasks,
    } = this.props;

    return (
      <div className="container">
        <div className="sidebar">
          <h1 className="sidebar-heading">{sidebarTitle || "Add task"}</h1>
          <div className="list-of-daily-tasks-container">
            <ul className="list-of-daily-tasks">
              <DailyTasksButton dateText="19-12-2004" />
              <DailyTasksButton dateText="19-12-2004" />
              <DailyTasksButton dateText="19-12-2004" />
              <DailyTasksButton dateText="19-12-2004" />
            </ul>
          </div>
          <button
            className="new-task-btn"
            onClick={onClikcOfAddTodayTasks || (() => {})}
          >
            {AddTodayTaskButtonText || "Add Task"}
          </button>
        </div>
        <main className="content">
          <div className="input-fields-and-addbutton-container">
            <div className="task-adding-container">
              <div className="input-field-container">
                <label className="input-label-style" htmlFor="TaskName">
                  Task Name
                </label>
                <input
                  className="input-field-style"
                  type="text"
                  id="TaskName"
                  placeholder="Task Name"
                />
                <p className="input-fields-error-message">Fill The Task Name</p>
              </div>
              <div className="input-field-container">
                <label className="input-label-style" htmlFor="StartTime">
                  StartTime
                </label>
                <input
                  id="StartTime"
                  className="input-time-style"
                  type="time"
                />
                <p className="input-fields-error-message">
                  Fill The Start time
                </p>
              </div>

              <div className="input-field-container">
                <label className="input-label-style" htmlFor="EndTime">
                  End Time
                </label>
                <input id="EndTime" className="input-time-style" type="time" />
                <p className="input-fields-error-message">Fill The End time</p>
              </div>
            </div>
            <button className="add-new-task-button-style">Add</button>
          </div>
          <div className="created-tasks-and-remaining-tasks-container">
            <h2 className="tasks-text">Tasks</h2>
            <div className="titles-container">
              <p className="title-text">Task Name</p>
              <p className="title-text starttime-title-text">Start Time</p>
              <p className="title-text endtime-title-text">End Time</p>
            </div>
            <ul className="list-of-created-tasks">
              {this.state.tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  taskName={task.taskName}
                  startTime={task.startTime}
                  endTime={task.endTime}
                  isTaskDone={task.isTaskDone}
                  istTodaysDate={task.istTodaysDate}
                  onClickOfDelete={() => this.handleDelete(task.id)}
                  onClickOfEdit={() => this.handleEdit(task.id)}
                />
              ))}
            </ul>
            <div className="tasksleftbutton-and-checklistbutton">
              <button className="tasks-left-button">Tasks Left</button>
              <button
                className="checklist-button"
                onClick={this.state.listOfDailyTasks.onClickOfChecklist}
              >
                Create Checklist
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
export default DailyTask;
