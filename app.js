// selector
const todoForm = document.querySelector(".todo-form");
const todoItems = document.querySelector(".todo-items");
const todoFooter = document.querySelector(".todo-footer");
const clearCompletedBtn = document.querySelector(".clear-completed");

let tasks = [];

const handleSubmit = e => {
    e.preventDefault();

    // task edited & store global variable
    const editItemId = e.target.hidden_item.value;
    if (editItemId) {
        // clicked item
        const editedItem = tasks.find(item => item.id === +editItemId);
        // index of clicked item
        const index = tasks.findIndex(item => item.id === +editItemId);

        const newTasks = [
            ...tasks.slice(0, index),
            { ...editedItem, task: e.target.add_todo.value },
            ...tasks.slice(index + 1)
        ];
        tasks = newTasks;
        todoForm.reset();
        // custom event
        todoItems.dispatchEvent(new CustomEvent("updateTask"));
        return;
    }

    // input value
    const task = e.target.add_todo.value;
    // can't added empty input value
    if (!task) return;
    
    const item = {
        id: Math.round(Math.random() * 1000000000),
        task: task,
        isCompleted: false,
    };
    tasks.unshift(item);

    // e.target.add_todo.value = "";
    todoForm.reset();
    displayFooter();
    // custom event
    todoItems.dispatchEvent(new CustomEvent("updateTask"));
};

const displayTasks = () => {
    const html = tasks.map(item => `<li>
                <label id="${item.id}" class="todo-left ${item.isCompleted && "completed"}" for="item-${item.id}">
                    <input type="checkbox" value=${item.id} id="item-${item.id}" ${item.isCompleted && "checked"}>
                    ${item.task}
                </label>

                <div class="todo-right">
                    <button class="edit" value="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="edit-icon h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    <button class="delete" value="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
    </li>`).join("");

    todoItems.innerHTML = html;
};

const saveTasksLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayTasksFromLocalStorage = () => {
    const savedData = JSON.parse(localStorage.getItem("tasks"));
    if (Array.isArray(savedData) && savedData.length > 0) {
        tasks.push(...savedData);
        // custom event
        todoItems.dispatchEvent(new CustomEvent("updateTask"));
    }
    displayFooter();
};

// todo footer
const displayFooter = () => {
    if (tasks.length === 0) {
        todoFooter.style.display = "none";
    }
    else {
        todoFooter.style.display = "flex";
    }

    const inCompletedTasks = tasks.filter(item => !item.isCompleted).length;
    countInCompletedTask(inCompletedTasks);
};

const countInCompletedTask = (totalInCompleteTask) => {
    const leftItems = document.querySelector(".left-items");
    const count = totalInCompleteTask > 1 ? `${totalInCompleteTask} Items left` : `${totalInCompleteTask} Item left`;
    leftItems.innerHTML = count;
};

const clearCompletedTasks = () => {
    const inCompletedTasks = tasks.filter(item => !item.isCompleted);

    const completedTasks = tasks.filter(item => item.isCompleted);

    if (completedTasks.length === 0) {
        alert("Please, completed your task!!");
    }
    else {
        tasks = inCompletedTasks;
        displayFooter();
        // custom event
        todoItems.dispatchEvent(new CustomEvent("updateTask"));
    }
};

// toggle completed task
const completedTask = id => {
    const clickedItem = tasks.find((item => item.id === id));
    clickedItem.isCompleted = !clickedItem.isCompleted;
    // custom event
    todoItems.dispatchEvent(new CustomEvent("updateTask"));

    const inCompletedTasks = tasks.filter(item => !item.isCompleted).length;
    countInCompletedTask(inCompletedTasks);
};

// delete task
const deleteTask = id => {
    const deleteItem = tasks.filter(item => item.id !== id);
    tasks = deleteItem;
    // custom event
    todoItems.dispatchEvent(new CustomEvent("updateTask"));
    displayFooter();
};

// edit task
const editTask = id => {
    const editItem = tasks.find(item => item.id === id);
    todoForm.querySelector('input').value = editItem.task;
    todoForm.querySelector("[name='hidden_item']").value = editItem.id;
}

// event listener
todoForm.addEventListener("submit", handleSubmit);
todoItems.addEventListener("updateTask", displayTasks);
todoItems.addEventListener("updateTask", saveTasksLocalStorage);
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

todoItems.addEventListener("click", e => {
    // completed task
    const id = +e.target.id || +e.target.value;
    if (e.target.matches("label.todo-left") || e.target.matches("input")) {
        completedTask(id);
    }

    // delete task
    const deleteBtn = e.target.closest('.delete');
    if (deleteBtn) {
        deleteTask(+deleteBtn.value);
    }

    // edit task
    const editBtn = e.target.closest('.edit');
    if (editBtn) {
        editTask(+editBtn.value);
    }
});

displayTasksFromLocalStorage();