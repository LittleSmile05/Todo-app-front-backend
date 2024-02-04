document.addEventListener('DOMContentLoaded', getTodos);

async function getTodos() {
    const response = await fetch('/todos');
    const todos = await response.json();

    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" onchange="toggleCompletion(${todo.id})" ${todo.completed ? 'checked' : ''}>
            <span>${todo.task}</span>
            <button onclick="deleteTask(${todo.id})">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById('task-input');
    const task = taskInput.value.trim();

    if (task !== '') {
        await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task }),
        });

        taskInput.value = '';
        getTodos();
    }
}

async function toggleCompletion(id) {
    await fetch(`/todos/${id}`, {
        method: 'PUT',
    });

    getTodos();
}

async function deleteTask(id) {
    await fetch(`/todos/${id}`, {
        method: 'DELETE',
    });

    getTodos();
}
