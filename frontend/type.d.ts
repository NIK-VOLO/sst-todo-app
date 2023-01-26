interface TodoItem {
  id: number;
  task: string;
}

type ApiDataType = {
  statusCode: number;
  body: TodoItem[];
};
