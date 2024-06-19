// script.js

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        dateAdded: new Date(),
        completed: false
    };

    const pendingTasks = getTasks('pendingTasks');
    pendingTasks.push(task);
    saveTasks('pendingTasks', pendingTasks);

    taskInput.value = '';
    renderTasks();
}

function getTasks(key) {
    const tasks = localStorage.getItem(key);
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(key, tasks) {
    localStorage.setItem(key, JSON.stringify(tasks));
}

function renderTasks() {
    const pendingTasks = getTasks('pendingTasks');
    const completedTasks = getTasks('completedTasks');

    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');

    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    pendingTasks.forEach(task => {
        pendingTasksList.appendChild(createTaskElement(task, false));
    });

    completedTasks.forEach(task => {
        completedTasksList.appendChild(createTaskElement(task, true));
    });
}

function createTaskElement(task, isCompleted) {
    const li = document.createElement('li');
    li.className = isCompleted ? 'completed' : '';
    li.dataset.id = task.id;

    const span = document.createElement('span');
    span.textContent = `${task.text} (Added: ${new Date(task.dateAdded).toLocaleString()})`;
    li.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (!isCompleted) {
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.onclick = () => completeTask(task.id);
        actions.appendChild(completeButton);
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editTask(task.id, task.text);
    actions.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task.id, isCompleted);
    actions.appendChild(deleteButton);

    li.appendChild(actions);

    return li;
}

function completeTask(taskId) {
    const pendingTasks = getTasks('pendingTasks');
    const taskIndex = pendingTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const [task] = pendingTasks.splice(taskIndex, 1);
    task.completed = true;
    task.dateCompleted = new Date();

    const completedTasks = getTasks('completedTasks');
    completedTasks.push(task);

    saveTasks('pendingTasks', pendingTasks);
    saveTasks('completedTasks', completedTasks);

    renderTasks();
}

function editTask(taskId, oldText) {
    const newText = prompt('Edit task', oldText);
    if (newText === null || newText.trim() === '') return;

    const pendingTasks = getTasks('pendingTasks');
    const taskIndex = pendingTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        pendingTasks[taskIndex].text = newText;
        saveTasks('pendingTasks', pendingTasks);
    } else {
        const completedTasks = getTasks('completedTasks');
        const taskIndex = completedTasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            completedTasks[taskIndex].text = newText;
            saveTasks('completedTasks', completedTasks);
        }
    }

    renderTasks();
}

function deleteTask(taskId, isCompleted) {
    if (isCompleted) {
        let completedTasks = getTasks('completedTasks');
        completedTasks = completedTasks.filter(task => task.id !== taskId);
        saveTasks('completedTasks', completedTasks);
    } else {
        let pendingTasks = getTasks('pendingTasks');
        pendingTasks = pendingTasks.filter(task => task.id !== taskId);
        saveTasks('pendingTasks', pendingTasks);
    }

    renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});
