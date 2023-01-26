import { useEffect, useState } from "react";
import { trpc } from "../src/trpc";

export default function TodoPage() {
  const [taskList, setTaskList] = useState<TodoItem[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = trpc.addTask.useMutation();
  const getTasks = trpc.getTasks.useQuery();

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  };

  const createTask = async () => {
    try {
      const data = await addTask.mutateAsync({ task: newTask });
      const item = data.body.data;
      if (item.id === undefined) {
        throw new Error("No ID assigned to new task!");
      }
      const newList = [...taskList];
      newList.push({
        id: item.id,
        task: item.task,
      });
      setTaskList(newList);
    } catch (error) {
      console.error(error);
    } finally {
      //   console.log("Updated Task List:", taskList);
    }
  };

  const loadTasks = () => {
    const data = getTasks.data;
    console.log(data);
  };

  useEffect(() => {
    loadTasks();
  });

  return (
    <div>
      <div className="App">
        <div className="App-header">TODO List</div>
        <div className="App-todo-list">
          <div className="App-input-container">
            <form className="App-todo-input">
              <label htmlFor="input">Input a new task</label>
              <input
                type="text"
                className="input"
                id="input"
                onChange={handleInputChange}
                value={newTask}
              />
            </form>
            <div>
              <button
                className="btn App-add-button"
                disabled={addTask.isLoading}
                onClick={createTask}
              >
                {addTask.isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
        <div className="App-todo-list">
          <div className="App-todo-row">
            {taskList.map((task) => (
              <div key={task.id} className="App-todo-item">
                {task.task}
                <div>
                  <button className="btn App-delete-button">Remove</button>
                </div>
              </div>
            ))}
            {/* <div className="App-todo-item">asdfasf</div> */}
            {/* <div>
              <button className="btn App-delete-button">Remove</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
