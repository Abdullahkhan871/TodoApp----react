Project Start Timing / Date : 08/01/2024 Wed Morning

### **Implemented Features**

1. **Add tasks**: Tasks can be added through the form.
2. **Edit tasks**: Tasks can be edited using the edit functionality.
3. **Delete tasks**: Tasks can be deleted.
4. **Mark tasks as complete**: Tasks have a status that can be updated to "completed."
5. **Filter tasks**: Tasks can be filtered (all, pending, completed).
6. **Priority level**: Tasks include a priority level that can be selected during task creation.
7. **Persist tasks using local storage**: Currently, tasks are not saved to local storage. Add functionality to load and save tasks to/from local storage.
8. **Edge case handling for duplicate tasks**: There is check for duplicate tasks before adding them.
9. **Drag-and-drop functionality for task reordering**: Tasks cannot currently be reordered by dragging and dropping.


### **Missing Features**
2. **Set reminders for tasks with notifications**: There is no implementation for reminders or notifications for tasks.

### **Challenges Remaining**
1. **State management for task items**: While state management exists, you could explore ways to optimize it (e.g., using a state management library or simplifying the current logic).
2. **Reusable components**: Break down the app into smaller reusable components (e.g., `TaskItem`, `TaskForm`, `TaskFilter`) to improve code organization and readability.

                              Done
                           
3. **Edge cases**: Handle scenarios such as:
   - Empty task submission (already prevented but could provide user feedback).
   - Tasks with the same name (duplicate handling).
   - Handling priority conflicts or invalid data.



                  MY OWN CODE EXPLAINATION BY CHATGPT

Here’s the explanation of your code exactly as it is:

---

### **Code Overview**
Your code is a React application that manages a **To-Do List** with features like adding tasks, deleting tasks, editing tasks, changing their statuses, filtering based on status, and reordering them using drag-and-drop. It also saves the tasks to `localStorage` to ensure they persist even after refreshing or closing the browser.

---

### **Explanation**

#### **State Variables**
1. **`todoItem`**: Stores the current tasks to be displayed.
2. **`originalTodoItem`**: A backup of the tasks list, used to reset the filtered list.
3. **`userInput`**: Stores the current input entered by the user.
4. **`priority`**: Stores the selected priority of the task (`Urgent` or `Easy`).
5. **`taskStatus`**: Tracks the selected filter option (`all`, `pending`, or `completed`).

---

#### **useEffect Hook**
- **Purpose**: Initializes the tasks from `localStorage` when the app loads.
- Fetches the data using `localStorage.getItem` and parses it.
- If no data exists, it initializes the list as an empty array.

```js
useEffect(() => {
  let response = JSON.parse(localStorage.getItem("todoItem"));
  setTodoItem(response || []);
  setOriginalTodoItem(response || []);
}, []);
```

---

#### **Event Listener for Page Unload**
- **Purpose**: Saves the current tasks (`todoItem`) to `localStorage` when the tab is closed or refreshed.

```js
window.addEventListener("unload", () => {
  localStorage.setItem("todoItem", JSON.stringify(todoItem) || "[]");
});
```

---

#### **Functions for Task Management**

1. **`handleUserData`**: Updates the `userInput` state with the value typed in the input field.

2. **`handlePriority`**: Updates the `priority` state when a user selects a priority.

3. **`handleSubmit`**:
   - Prevents duplicate tasks by checking if `userInput` already exists in `todoItem`.
   - Ensures the task input is not empty or just spaces.
   - Creates a random `id` using alphabet characters.
   - Creates a new task object (`id`, `body`, `taskLevel`, `status`).
   - Adds the new task to both `todoItem` and `originalTodoItem`.
   - Resets `userInput` to an empty string.

```js
function handleSubmit(e) {
  e.preventDefault();
  let toggle = false;

  // Check for duplicate tasks
  todoItem.forEach((item) => {
    if (item.body === userInput) {
      toggle = true;
      return;
    }
  });

  if (toggle) return;
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
```

4. **`handleDelete`**: Removes the task with the matching `id` from `todoItem`.

```js
function handleDelete(currentId) {
  setTodoItem(todoItem.filter((item) => item.id !== currentId));
}
```

5. **`handleEdit`**: Moves a task to the input field for editing and removes it temporarily from the list.

```js
function handleEdit(currentId, bodyValue) {
  setUserInput(bodyValue);
  setTodoItem(todoItem.filter((item) => item.id !== currentId));
}
```

6. **`handelTaskStatus`**:
   - Filters tasks based on their status (`pending`, `completed`, or `all`).
   - Updates the `taskStatus` state and displays tasks accordingly.

```js
function handelTaskStatus(e) {
  setTaskStatus(e.target.value);
  if (e.target.value === "pending") {
    setTodoItem(originalTodoItem.filter((item) => item.status === "pending"));
  } else if (e.target.value === "completed") {
    setTodoItem(originalTodoItem.filter((item) => item.status === "completed"));
  } else {
    setTodoItem(originalTodoItem);
  }
}
```

7. **`handleTask`**: Updates the `status` of a task (`pending` or `completed`) for both `todoItem` and `originalTodoItem`.

```js
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
```

---

#### **Drag-and-Drop Feature**
1. **`handleDragStart`**: 
   - Stores the `id` and `body` of the dragged task in `dataTransfer`.

```js
function handleDragStart(e, item, currentId) {
  let data = JSON.stringify([currentId, item]);
  e.dataTransfer.setData("text", data);
}
```

2. **`handleDragOver`**: Prevents the default browser behavior to allow dropping.

```js
function handleDragOver(e) {
  e.preventDefault();
}
```

3. **`handleDrop`**:
   - Swaps the IDs and `body` of the dragged and dropped tasks.
   - Updates `todoItem` with the new order.

```js
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
```

---

#### **UI Components**

1. **Task Input Form**:
   - Input for the task name.
   - Dropdown for priority.
   - Button to add the task.

2. **Filter Dropdown**:
   - Filters tasks by status (`all`, `pending`, `completed`).

3. **Task List**:
   - Displays tasks with options to:
     - Edit
     - Delete
     - Change Status
   - Supports drag-and-drop reordering.

---

### **Conclusion**
Your code implements a complete to-do list application with state management, local storage persistence, and advanced features like drag-and-drop reordering and filtering. It efficiently handles user input, updates task states dynamically, and provides an interactive interface for task management.