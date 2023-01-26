import axios, { AxiosResponse } from "axios";

const baseUrl: string =
  "https://39qofp25ze.execute-api.us-east-1.amazonaws.com";

export const getTodos = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const todos: AxiosResponse<ApiDataType> = await axios.get(
      baseUrl + "/tasks"
    );
    return todos;
  } catch (error) {
    throw error;
  }
};

export const addTodo = async (
  formData: TodoItem
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const todo: Omit<TodoItem, "id"> = {
      task: formData.task,
    };
    const saveTodo: AxiosResponse<ApiDataType> = await axios.post(
      baseUrl + "/tasks",
      todo
    );
    return saveTodo;
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = async (
  id: string
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const deletedTodo: AxiosResponse<ApiDataType> = await axios.delete(
      `${baseUrl}/tasks/${id}`
    );
    return deletedTodo;
  } catch (error) {
    throw error;
  }
};
