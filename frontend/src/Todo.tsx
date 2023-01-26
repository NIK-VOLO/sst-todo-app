import { useState } from "react";
import { trpc } from "../src/trpc";

export default function TodoPage() {
  //   const hello = trpc.getUser.useQuery("input");
  const addTask = trpc.addTask.useMutation();
  const [newTask, setNewTask] = useState("");

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewTask(event.currentTarget.value);
  };

  const handleClick = () => {
    addTask.mutate({ task: newTask });
  };

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
                onChange={handleChange}
                value={newTask}
              />
            </form>
            <div>
              <button
                className="btn App-add-button"
                disabled={addTask.isLoading}
                onClick={handleClick}
              >
                {addTask.isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
        <div className="App-todo-list">
          <div className="App-todo-row">
            <div className="App-todo-item">asdfasf</div>
            <div>
              <button className="btn App-delete-button">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
