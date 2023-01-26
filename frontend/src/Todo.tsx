import { useCallback, useEffect, useState } from "react";
import { trpc } from "../src/trpc";

export default function TodoPage() {
  const [taskList, setTaskList] = useState<TodoItem[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = trpc.addTask.useMutation();
  const getTasks = trpc.getTasks.useQuery();
  const deleteTask = trpc.deleteTask.useMutation();

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
    }
  };

  const removeTask = async (id: number) => {
    try {
      var newList: TodoItem[] = [];
      taskList.forEach((element) => {
        if (element.id !== id) {
          newList.push(element);
        }
        setTaskList(newList);
      });

      const res = await deleteTask.mutateAsync({ id: id });
      console.log(res);
    } catch (error) {}
  };

  const loadTasks = useCallback(() => {
    try {
      const data = getTasks.data;
      if (data === undefined) {
        throw new Error("No data returned from getTasks");
      }
      console.log(data);
      var newList: TodoItem[] = [];
      data.body.forEach((task: TodoItem) => {
        newList.push({
          id: task.id,
          task: task.task,
        });
      });
      setTaskList(newList);
    } catch (error) {}
  }, [getTasks.data]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

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
          {getTasks.isLoading ? "Loading..." : ""}
          <div className="App-todo-row">
            {taskList.map((task) => (
              <div key={task.id} className="App-todo-item">
                {task.task}
                <div>
                  <button
                    className="btn App-delete-button"
                    onClick={() => removeTask(task.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
