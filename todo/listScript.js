// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('add');
const todoList = document.getElementById('todo');
const completedList = document.getElementById('completed');
const clearTasksBtn = document.getElementById('clearTasks');
const clearCompletedBtn = document.getElementById('clearComplete');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render all tasks on page load
tasks.forEach(task => addTask(task.text, task.completed, false));

// Add new task
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) addTask(text, false, true);
});

// Clear buttons
clearTasksBtn.addEventListener('click', () => {
    clearList(todoList);
    tasks = tasks.filter(t => t.completed);
    saveTasks();
});
clearCompletedBtn.addEventListener('click', () => {
    clearList(completedList);
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
});

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create task element
function createTaskItem(text, completed = false) {
    const taskItem = document.createElement('div');
    taskItem.className = 'taskItem';

    const taskContent = document.createElement('div');
    taskContent.className = 'taskContent';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'taskCheckbox';
    checkbox.checked = completed;

    const taskLabel = document.createElement('span');
    taskLabel.className = 'taskLabel';
    taskLabel.textContent = text;

    taskContent.append(checkbox, taskLabel);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'Delete';

    // Delete handler
    deleteButton.addEventListener('click', () => {
        taskItem.parentElement.removeChild(taskItem);
        tasks = tasks.filter(t => !(t.text === text && t.completed === checkbox.checked));
        saveTasks();
    });

    // Checkbox toggle
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            completedList.appendChild(taskItem);
        } else {
            todoList.appendChild(taskItem);
        }
        
        // Update tasks array
        const taskObj = tasks.find(t => t.text === text && t.completed !== checkbox.checked);
        if (taskObj) taskObj.completed = checkbox.checked;
        saveTasks();
    });

    taskItem.append(taskContent, deleteButton);
    return taskItem;
}

// Add task to the list and optionally save
function addTask(text, completed = false, save = true) {
    const taskItem = createTaskItem(text, completed);
    if (completed) {
        completedList.appendChild(taskItem);
    } else {
        todoList.appendChild(taskItem);
    }

    if (save) {
        tasks.push({ text, completed });
        saveTasks();
    }

    taskInput.value = '';
}

// Clear all tasks from a list
function clearList(list) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}
