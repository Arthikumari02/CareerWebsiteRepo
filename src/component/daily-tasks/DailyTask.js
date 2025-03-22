import React from "react";
import "./styles/DailyTask.css";
import TaskItem from "./TaskItem";
import { v4 as uuidv4 } from "uuid";

const DailyTasksButton = (props) => {
  const { id, dateText, onClickOfDate } = props;
  return (
    <button className="daily-tasks-buttonStyle" onClick={onClickOfDate}>
      <p className="date-text-style">{dateText}</p>
    </button>
  );
};

class DailyTask extends React.Component {
  constructor(props) {
    super(props);

    // Try to load tasks from localStorage first
    let savedTasks = [];
    try {
      const savedTasksString = localStorage.getItem("listOfTasks");
      if (savedTasksString) {
        savedTasks = JSON.parse(savedTasksString);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }

    this.state = {
      listOfDailyTasks: [
        {
          id: "",
          dateText: props.listOfDailyTasks?.dateText || "",
          listOfTasks: props.listOfDailyTasks?.listOfTasks || savedTasks,
        },
      ],
      TaskItem: {
        taskName: "",
        startTime: "",
        endTime: "",
        isTaskDone: false,
      },
    };
  }

  componentDidMount() {
    // Save initial tasks to localStorage
    this.updateLocalStorage();
  }

  updateLocalStorage = () => {
    localStorage.setItem(
      "listOfTasks",
      JSON.stringify(this.state.allTasks) // Store all tasks, not filtered ones
    );
    console.log(localStorage.getItem("listOfTasks"));
  };

  handleDelete = (id) => {
    console.log(`Delete task with id: ${id}`);
    this.setState(
      (prevState) => ({
        listOfDailyTasks: {
          ...prevState.listOfDailyTasks,
          listOfTasks: prevState.listOfDailyTasks.listOfTasks.filter(
            (task) => task.id !== id
          ),
        },
      }),
      this.updateLocalStorage // Update localStorage after state change
    );
  };

  // Fix the handleEdit function
  handleEdit = (needToUpdateTaskItem) => {
    console.log("Received task item:", needToUpdateTaskItem);

    // Update state correctly using the task object
    this.setState(
      {
        TaskItem: needToUpdateTaskItem,
      },
      () => {
        // This callback runs after the state is updated
        console.log("State updated with task:", this.state.TaskItem);
      }
    );
  };

  onClickOfAddButton = (taskData) => {
    if (taskData.id) {
      // Editing an existing task
      const updatedTasks = this.state.listOfDailyTasks.listOfTasks.map((task) =>
        task.id === taskData.id
          ? {
              ...task,
              taskName: taskData.taskName,
              startTime: taskData.startTime,
              endTime: taskData.endTime,
              isTaskDone: taskData.isTaskDone,
            }
          : task
      );

      this.setState(
        (prevState) => ({
          listOfDailyTasks: {
            ...prevState.listOfDailyTasks,
            listOfTasks: updatedTasks,
          },
          // Clear the TaskItem after update
          TaskItem: {
            taskName: "",
            startTime: "",
            endTime: "",
            id: "",
            isTaskDone: false,
          },
        }),
        this.updateLocalStorage // Update localStorage after state change
      );
    } else {
      // Creating a new task
      const newTask = {
        id: uuidv4(),
        taskName: taskData.taskName,
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        isTodaysDate: true,
        isTaskDone: false,
      };

      this.setState(
        (prevState) => ({
          listOfDailyTasks: {
            ...prevState.listOfDailyTasks,
            listOfTasks: [...prevState.listOfDailyTasks.listOfTasks, newTask],
          },
        }),
        this.updateLocalStorage // Update localStorage after state change
      );
    }
  };
  onTaskDone = (checked, id) => {
    const stringifiedlistOfTasks = localStorage.getItem("listOfTasks");
    let listOfTasksToUpdate = JSON.parse(stringifiedlistOfTasks);
    const updatedList = listOfTasksToUpdate.map((item) =>
      item.id === id ? { ...item, isTaskDone: checked } : item
    );
    console.log("Task Status:");
    console.log(checked);
    console.log(id);

    this.setState(
      (prevState) => ({
        listOfDailyTasks: {
          ...prevState.listOfDailyTasks,
          listOfTasks: updatedList,
        },
      }),
      this.updateLocalStorage // Update localStorage after state change
    );
  };
  render() {
    const { sidebarTitle, onClickOfAddTodayTasks, AddTodayTaskButtonText } =
      this.props;

    return (
      <div className="container">
        <div className="sidebar">
          <h1 className="sidebar-heading">{sidebarTitle || "Add task"}</h1>
          <div className="list-of-daily-tasks-container">
            <ul className="list-of-daily-tasks">
              {this.state.listOfDailyTasks.map((item) => (
                <DailyTask
                  key={item.id}
                  id={item.id}
                  dateText={item.dateText}
                />
              ))}
            </ul>
          </div>
          <button
            className="new-task-btn"
            onClick={onClickOfAddTodayTasks || (() => {})}
          >
            {AddTodayTaskButtonText || "Add Task"}
          </button>
        </div>
        <main className="content">
          {/* Pass the onClickOfAddButton prop to TaskInput */}
          <TaskInput
            onClickOfAddButton={this.onClickOfAddButton}
            TaskItem={this.state.TaskItem}
          />
          <div className="created-tasks-and-remaining-tasks-container">
            <h2 className="tasks-text">Tasks</h2>
            <div className="titles-container">
              <p className="title-text">Task Name</p>
              <p className="title-text starttime-title-text">Start Time</p>
              <p className="title-text endtime-title-text">End Time</p>
            </div>
            <ul className="list-of-created-tasks">
              {this.state.listOfDailyTasks.listOfTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  taskName={task.taskName}
                  startTime={task.startTime}
                  endTime={task.endTime}
                  isTaskDone={task.isTaskDone}
                  isTodaysDate={task.isTodaysDate}
                  onClickOfDelete={() => this.handleDelete(task.id)}
                  onClickOfEdit={() => this.handleEdit(task)}
                  onCheckBoxValueChanged={this.onTaskDone}
                />
              ))}
            </ul>
            <div className="tasksleftbutton-and-checklistbutton">
              <button className="tasks-left-button">Tasks Left</button>
              <button
                className="tasks-left-button"
                onClick={this.toggleTasksFilter}
              >
                {this.state.showOnlyIncompleteTasks
                  ? "Show All Tasks"
                  : "Tasks Left"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

class TaskInput extends React.Component {
  constructor(props) {
    super(props);
    console.log("Edit Task Item", this.props.TaskItem);
    this.state = {
      taskName: props.TaskItem?.taskName || "",
      startTime: props.TaskItem?.startTime || "",
      endTime: props.TaskItem?.endTime || "",
      id: props.TaskItem?.id || "",
      isTaskDone: props.TaskItem?.isTaskDone || false,
      errors: {
        taskName: false,
        startTime: false,
        endTime: false,
      },
    };
  }

  // Add this method to update state when props change
  componentDidUpdate(prevProps) {
    // Only update if the TaskItem prop has changed
    if (this.props.TaskItem !== prevProps.TaskItem) {
      console.log("TaskItem prop changed:", this.props.TaskItem);
      this.setState({
        taskName: this.props.TaskItem?.taskName || "",
        startTime: this.props.TaskItem?.startTime || "",
        endTime: this.props.TaskItem?.endTime || "",
        id: this.props.TaskItem?.id || "",
        isTaskDone: this.props.TaskItem?.isTaskDone || false,
      });
    }
  }

  handleInputChange = (event) => {
    const { id, value, type, checked } = event.target;
    const inputValue = type === "checkbox" ? checked : value;
    this.setState({
      [id === "TaskName"
        ? "taskName"
        : id === "StartTime"
        ? "startTime"
        : "endTime"]: inputValue,
      errors: {
        ...this.state.errors,
        [id === "TaskName"
          ? "taskName"
          : id === "StartTime"
          ? "startTime"
          : "endTime"]: false,
      },
    });
  };

  onClickOfAdd = () => {
    // Validate fields
    const errors = {
      taskName: !this.state.taskName,
      startTime: !this.state.startTime,
      endTime: !this.state.endTime,
    };

    // Update error state
    this.setState({ errors });

    // If there are no errors, send the data to parent component
    if (!errors.taskName && !errors.startTime && !errors.endTime) {
      // Send data to parent component via prop
      if (this.props.onClickOfAddButton) {
        this.props.onClickOfAddButton({
          taskName: this.state.taskName,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          isTaskDone: this.state.isTaskDone,
          id: this.state.id, // Include the id for editing existing tasks
        });

        // Clear form after submission
        this.setState({
          taskName: "",
          startTime: "",
          endTime: "",
          id: "",
          isTaskDone: false,
        });
      }
    }
  };

  render() {
    const isEditing = !!this.state.id;

    return (
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
              value={this.state.taskName}
              onChange={this.handleInputChange}
            />
            <p
              className="input-fields-error-message"
              style={{
                visibility: this.state.errors.taskName ? "visible" : "hidden",
                height: "20px", // Set a fixed height
                margin: "5px 0", // Keep consistent margins
              }}
            >
              Fill The Task Name
            </p>
          </div>
          <div className="input-field-container">
            <label className="input-label-style" htmlFor="StartTime">
              StartTime
            </label>
            <input
              id="StartTime"
              className="input-time-style"
              type="time"
              value={this.state.startTime}
              onChange={this.handleInputChange}
            />
            <p
              className="input-fields-error-message"
              style={{
                visibility: this.state.errors.startTime ? "visible" : "hidden",
                height: "20px", // Set a fixed height
                margin: "5px 0", // Keep consistent margins
              }}
            >
              Fill The Start time
            </p>
          </div>

          <div className="input-field-container">
            <label className="input-label-style" htmlFor="EndTime">
              End Time
            </label>
            <input
              id="EndTime"
              className="input-time-style"
              type="time"
              value={this.state.endTime}
              onChange={this.handleInputChange}
            />
            <p
              className="input-fields-error-message"
              style={{
                visibility: this.state.errors.endTime ? "visible" : "hidden",
                height: "20px", // Set a fixed height
                margin: "5px 0", // Keep consistent margins
              }}
            >
              Fill The End time
            </p>
          </div>
        </div>
        <button
          className="add-new-task-button-style"
          onClick={this.onClickOfAdd}
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    );
  }
}

export default DailyTask;
