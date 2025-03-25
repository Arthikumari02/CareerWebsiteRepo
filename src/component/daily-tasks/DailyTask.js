import React from "react";
import "./styles/DailyTask.css";
import TaskItem from "./TaskItem";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash} from "@fortawesome/free-solid-svg-icons";

const DailyTasksButton = (props) => {
  const { dateText, onClickOfDate, onCllickOfDelete } = props;
  return (
    <div className="daily-task-buttons-container">
      <button className="daily-tasks-buttonStyle" onClick={onClickOfDate}>
        <p className="date-text-style">{dateText}</p>
      </button>
      <button className="delete-icon" onClick={onCllickOfDelete}>
        <FontAwesomeIcon icon={faTrash} style={{width:"20px", height:"20px", marginRight:"20px"}} />
      </button>
    </div>
  );
};

class DailyTask extends React.Component {
  constructor(props) {
    super(props);

    // Try to load daily task lists from localStorage first
    let savedDailyTasks = [];
    try {
      const savedTasksString = localStorage.getItem("listOfDailyTasks");
      if (savedTasksString) {
        savedDailyTasks = JSON.parse(savedTasksString);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }

    // If no saved tasks or empty array, initialize with a default empty task list
    const initialDailyTasks = savedDailyTasks.length > 0 ? savedDailyTasks : [];

    this.state = {
      listOfDailyTasks: initialDailyTasks,
      activeDailyTaskId:
        initialDailyTasks.length < 0 ? initialDailyTasks[0].id : "", // Track which daily task is currently active
      TaskItem: {
        taskName: "",
        startTime: "",
        endTime: "",
        isTaskDone: false,
      },
      showOnlyIncompleteTasks: false, // Flag to track filter state
    };
  }

  componentDidMount() {
    // Save initial tasks to localStorage
    this.updateLocalStorage();
  }

  updateLocalStorage = () => {
    localStorage.setItem(
      "listOfDailyTasks",
      JSON.stringify(this.state.listOfDailyTasks)
    );
    console.log(
      "Updated localStorage:",
      localStorage.getItem("listOfDailyTasks")
    );
  };

  // Get the currently active task list
  getActiveTaskList = () => {
    const activeDaily =
      this.state.listOfDailyTasks.find(
        (daily) => daily.id === this.state.activeDailyTaskId
      ) || this.state.listOfDailyTasks[0];

    return activeDaily;
  };

  // Get filtered tasks based on current filter setting
  getFilteredTasks = () => {
    const activeDaily = this.getActiveTaskList();
    if (!activeDaily) return [];

    if (this.state.showOnlyIncompleteTasks) {
      return activeDaily.listOfTasks.filter((task) => !task.isTaskDone);
    }
    return activeDaily.listOfTasks;
  };

  toggleTasksFilter = () => {
    this.setState((prevState) => ({
      showOnlyIncompleteTasks: !prevState.showOnlyIncompleteTasks,
    }));
  };

  handleDelete = (taskId) => {
    this.setState((prevState) => {
      // Find the active daily task
      const updatedDailyTasks = prevState.listOfDailyTasks.map((daily) => {
        if (daily.id === prevState.activeDailyTaskId) {
          // Remove the task from this daily task list
          return {
            ...daily,
            listOfTasks: daily.listOfTasks.filter((task) => task.id !== taskId),
          };
        }
        return daily;
      });

      return {
        listOfDailyTasks: updatedDailyTasks,
      };
    }, this.updateLocalStorage);
  };

  handleEdit = (taskToEdit) => {
    console.log("Received task item for editing:", taskToEdit);
    this.setState({
      TaskItem: taskToEdit,
    });
  };

  onClickOfAddButton = (taskData) => {
    if (taskData.id) {
      // Editing an existing task
      this.setState((prevState) => {
        const updatedDailyTasks = prevState.listOfDailyTasks.map((daily) => {
          if (daily.id === prevState.activeDailyTaskId) {
            // Update the specific task in this daily task list
            return {
              ...daily,
              listOfTasks: daily.listOfTasks.map((task) =>
                task.id === taskData.id
                  ? {
                      ...task,
                      taskName: taskData.taskName,
                      startTime: taskData.startTime,
                      endTime: taskData.endTime,
                      isTaskDone: taskData.isTaskDone,
                    }
                  : task
              ),
            };
          }
          return daily;
        });

        return {
          listOfDailyTasks: updatedDailyTasks,
          TaskItem: {
            taskName: "",
            startTime: "",
            endTime: "",
            id: "",
            isTaskDone: false,
          },
        };
      }, this.updateLocalStorage);
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

      this.setState((prevState) => {
        const updatedDailyTasks = prevState.listOfDailyTasks.map((daily) => {
          if (daily.id === prevState.activeDailyTaskId) {
            // Add the new task to this daily task list
            return {
              ...daily,
              listOfTasks: [...daily.listOfTasks, newTask],
            };
          }
          return daily;
        });

        return {
          listOfDailyTasks: updatedDailyTasks,
        };
      }, this.updateLocalStorage);
    }
  };

  onTaskDone = (checked, taskId) => {
    this.setState((prevState) => {
      const updatedDailyTasks = prevState.listOfDailyTasks.map((daily) => {
        if (daily.id === prevState.activeDailyTaskId) {
          // Update the task status in this daily task list
          return {
            ...daily,
            listOfTasks: daily.listOfTasks.map((task) =>
              task.id === taskId ? { ...task, isTaskDone: checked } : task
            ),
          };
        }
        return daily;
      });

      return {
        listOfDailyTasks: updatedDailyTasks,
      };
    }, this.updateLocalStorage);
  };

  OnClickOfAddTodayTasks = () => {
    const newDailyTask = {
      id: uuidv4(),
      dateText: new Date().toISOString().split("T")[0],
      listOfTasks: [],
    };

    this.setState(
      (prevState) => ({
        listOfDailyTasks: [...prevState.listOfDailyTasks, newDailyTask],
        activeDailyTaskId: newDailyTask.id,
      }),
      this.updateLocalStorage
    );
  };

  setActiveDaily = (dailyId) => {
    this.setState({
      activeDailyTaskId: dailyId,
    });
  };

  OnClickOfDeleteDayTask = (id) => {
    const { listOfDailyTasks } = this.state;
    const updatedListOfDailyTask = listOfDailyTasks.filter(
      (dayItem) => dayItem.id !== id
    );
    this.setState((prevState) => {
      return {
        listOfDailyTasks: updatedListOfDailyTask,
      };
    }, this.updateLocalStorage);
    this.setState({ listOfDailyTasks: updatedListOfDailyTask });
  };

  render() {
    const { sidebarTitle, AddTodayTaskButtonText } = this.props;
    const activeDaily = this.getActiveTaskList();
    const filteredTasks = this.getFilteredTasks();
    const todayDate = new Date().toISOString().split("T")[0];
    const isTodaysTasksCreated = this.state.listOfDailyTasks.some(
      (dailyTasks) => dailyTasks.dateText === todayDate
    );
    const isListOfDailyTasksEmpty = this.state.listOfDailyTasks.length === 0;

    return (
      <div className="container">
        <div className="sidebar">
          <h1 className="sidebar-heading">{sidebarTitle || "Add task"}</h1>
          <div className="list-of-daily-tasks-container">
            <ul className="list-of-daily-tasks">
              {this.state.listOfDailyTasks.map((daily) => (
                <DailyTasksButton
                  key={daily.id}
                  id={daily.id}
                  dateText={daily.dateText}
                  onClickOfDate={() => this.setActiveDaily(daily.id)}
                  onCllickOfDelete={() => this.OnClickOfDeleteDayTask(daily.id)}
                  tasks={daily.listOfTasks.length}
                />
              ))}
            </ul>
          </div>
          {isTodaysTasksCreated ? (
            <></>
          ) : (
            <button
              className="new-task-btn"
              onClick={this.OnClickOfAddTodayTasks}
            >
              {AddTodayTaskButtonText || "Add Task List"}
            </button>
          )}
        </div>
        {isListOfDailyTasksEmpty ? (
          <h1 className="add-today-tasks-description">Add Today Tasks</h1>
        ) : (
          <div className="tasks-content-container">
            {/* Pass the onClickOfAddButton prop to TaskInput */}
            <TaskInput
              onClickOfAddButton={this.onClickOfAddButton}
              TaskItem={this.state.TaskItem}
            />
            <div className="created-tasks-and-remaining-tasks-container">
              <h2 className="tasks-text">
                Tasks for {activeDaily ? activeDaily.dateText : "Today"}
              </h2>
              <div className="titles-container">
                <p className="title-text">Task Name</p>
                <p className="title-text starttime-title-text">Start Time</p>
                <p className="title-text endtime-title-text">End Time</p>
              </div>
              <ul className="list-of-created-tasks">
                {filteredTasks.map((task) => (
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
          </div>
        )}
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
