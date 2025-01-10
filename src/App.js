import { useEffect, useState } from "react";

const App = () => {
  const [todoItem, setTodoItem] = useState([]);
  const [originalTodoItem, setOriginalTodoItem] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [priority, setPriority] = useState("Urgent");
  const [taskStatus, setTaskStatus] = useState("all");

  // local storage feature
  // getting value from local storage
  useEffect(() => {
    let response = JSON.parse(localStorage.getItem("todoItem"));
    setTodoItem(response || []);
    setOriginalTodoItem(response || []);
  }, []);

  // when ctrl+r or tab closed it should sent todoItem value to local storage
  window.addEventListener("unload", () => {
    localStorage.setItem("todoItem", JSON.stringify(todoItem) || "[]");
  });

  function handleUserData(e) {
    setUserInput(e.target.value);
  }

  function handlePriority(e) {
    setPriority(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // checking duplicate body content
    let toggle = false;
    todoItem.forEach((item) => {
      if (item.body === userInput) {
        toggle = true;
        return;
      }
    });

    if (toggle) return;
    // checking user Input not empty or not only consisting spaces
    if (!userInput.trim()) return;

    let alpha = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;
    let randomKey = "";

    for (let t of alpha) {
      randomKey += alpha[Math.floor(Math.random() * (alpha.length - 1))];
    }

    let obj = {
      id: randomKey,
      body: userInput.trim(),
      taskLevel: priority,
      status: "pending",
    };

    setTodoItem([...todoItem, obj]);
    setOriginalTodoItem([...originalTodoItem, obj]);
    setUserInput("");
  }

  function handleDelete(currentId) {
    setTodoItem(todoItem.filter((item) => item.id !== currentId));
  }

  function handleEdit(currentId, bodyValue) {
    setUserInput(bodyValue);
    setTodoItem(todoItem.filter((item) => item.id !== currentId));
  }

  function handelTaskStatus(e) {
    setTaskStatus(e.target.value);
    console.log(e.target.value);
    if (e.target.value === "pending") {
      setTodoItem(todoItem.filter((item) => item.status === "pending"));
    } else if (e.target.value === "completed") {
      setTodoItem(todoItem.filter((item) => item.status === "completed"));
    } else {
      setTodoItem(originalTodoItem);
    }
  }

  function handleTask(e, id) {
    setTodoItem(
      todoItem.map((item) =>
        item.id === id ? { ...item, status: e.target.value } : item
      )
    );
    setOriginalTodoItem(
      originalTodoItem.map((item) =>
        item.id === id ? { ...item, status: e.target.value } : item
      )
    );
  }

  function handleDragStart(e, item, currentId) {
    let data = JSON.stringify([currentId, item]);
    e.dataTransfer.setData("text", data);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, currentId, currentBody) {
    e.preventDefault();
    let [dragId, dragBody] = JSON.parse(e.dataTransfer.getData("text"));

    if (dragId === "" && dragBody === "") return;
    if (e.target.id === dragId) return;

    let updatedItems = todoItem.map((item) => {
      if (item.id === dragId) {
        return { ...item, id: currentId, body: currentBody };
      } else if (item.id === currentId) {
        return { ...item, id: dragId, body: dragBody };
      } else {
        return item;
      }
    });
    setTodoItem(updatedItems);
  }
  return (
    <div className="todo-app min-h-screen bg-gray-100 p-6">
      <div className="user-input bg-white p-4 rounded-md shadow-md mb-6">
        <form className="flex gap-4 items-center" onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={handleUserData}
            placeholder="Enter task"
            className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <select
            value={priority}
            onChange={handlePriority}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="Urgent">Urgent</option>
            <option value="Easy">Easy</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </form>
      </div>
      <div className="task-status mb-6">
        <label
          htmlFor="taskStatus"
          className="block text-gray-700 font-medium mb-2"
        >
          Task Status
        </label>
        <select
          id="taskStatus"
          value={taskStatus}
          onChange={handelTaskStatus}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="todo-list space-y-4">
        {todoItem.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="todo-item bg-white p-4 rounded-md shadow-md flex justify-between items-center"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, item.body, item.id)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, item.id, item.body)}
          >
            <div className="userDetails text-gray-800">{item.body}</div>
            <div className="priority text-sm text-gray-500">
              Priority: {item.taskLevel}
            </div>
            <div className="edit-action flex gap-4 items-center">
              <span
                onClick={() => handleEdit(item.id, item.body)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Edit
              </span>
              <span
                onClick={() => handleDelete(item.id)}
                className="text-red-500 cursor-pointer hover:underline"
              >
                Delete
              </span>
              <select
                value={item.status}
                onChange={(e) => handleTask(e, item.id)}
                className="border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
