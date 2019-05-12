const data = JSON.parse(localStorage.getItem('data'));

function showTaskFromListId(object, listId) {
	const taskTitle = document.querySelector('.task-container').querySelector('h1');

	object.data.forEach(element => {
		const key = element.id;

		if (key == listId) {
			const taskData = element.task;
			const task = document.getElementById('tasks');
			task.innerHTML = '';

			taskTitle.innerHTML = element.listname;
			taskTitle.setAttribute('data-list-id', key);

			taskData.forEach(element => {	
				task.innerHTML += 
				`<div class="task" data-list-id="${key}" data-task-id="${element.id}" data-task-done="${element.done}">
					<div class="task-name">${element.taskName}</div>
					<div class="task-actions">
						<div class="task-edit" data-list-id="${key}" data-task-id="${element.id}"><i class="fas fa-pen"></i></div>
						<div class="task-delete" data-list-id="${key}" data-task-id="${element.id}"><i class="fas fa-trash-alt"></i></div>
					</div>
				</div>`;
			});
		}
	});
}

function updateLocalstorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

function refreshList(object, lastVisit) {
	if (!lastVisit) {
		location.reload();
	}
	document.querySelectorAll('.list').forEach(element => {
		if (element.dataset.listId == lastVisit.id) {
			document.getElementById('add-task').style.display = 'flex';
			showTaskFromListId(object, lastVisit.id);
			element.classList.add('active-list');
			document.querySelector('.title-button-container').style.visibility = 'visible';
		}
	});
}

function taskDone(object, taskId, listId) {
	object.data.forEach(element => {
		const objectListId = element.id;
		
		element.task.forEach(elementTask => {
			const objectTaskId = elementTask.id;

			if (objectListId == listId && objectTaskId == taskId) {
				switch (elementTask.done){
					case true:
						elementTask.done = false;
						break;
					case false:
						elementTask.done = true;
						break;
				}
			}
		});
	});
}

function checkDone() {
	const tasks = document.querySelectorAll('.task');

	tasks.forEach(element => {
		switch(element.dataset.taskDone) {
			case 'true':
				element.querySelector('.task-name').classList.add('task-done');
				element.querySelector('.task-name').parentNode.classList.add('task-done-parent');
				break;
			case 'false':
				element.querySelector('.task-name').classList.remove('task-done');
				element.querySelector('.task-name').parentNode.classList.remove('task-done-parent');
				break;
		}
	});
}

function save(data) {
	updateLocalstorage('data', data);
	location.reload();
}

function deleteItem(type, object, listId, taskId) {
	switch(type) {
		case 'list':
			object.data.forEach((element, index) => {
				const objectListId = element.id;
				
				if (objectListId == listId) {
					object.data.splice(index, 1);
				}
			});
			break;
		case 'task':
			object.data.forEach(element => {
				if (element.id == listId) {
					element.task.forEach((taskElement, index) => {
						if (taskElement.id == taskId) {
							element.task.splice(index, 1);
		
							updateLocalstorage('data', data);
							location.reload();
		
						}
					});
				}
			});
			break;
	}
}

function todoConsoleStart(id) {
	const todoConsole = document.querySelector('.add-console');
	const todoContent = document.querySelector('.todo-content');
	
	todoConsole.style.display = 'flex';
	todoContent.style.display = 'none';
	document.getElementById(id).classList.add('adding-list');
}

function editItem(type, object, value, listId, taskId) {
	switch(type) {
		case 'list':
			object.data.forEach(element => {
				const objectListId = element.id;
				
				if (objectListId == listId) {
					element.listname = value;
				}
			});
			break;
		case 'task':
			object.data.forEach(element => {
				const objectListId = element.id;
				
				element.task.forEach(elementTask => {
					const objectTaskId = elementTask.id;
		
					if (objectListId == listId && objectTaskId == taskId) {
						elementTask.taskName = value;
					}
				});
			});
			break;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const listButtonAdd = document.getElementById('add-list');
	const listContainer = document.getElementById('lists');
	const listAddConsole = document.getElementById('add-list-console');
	const listButtonSave = document.getElementById('save-new-list');
	const listButtonCancel = document.getElementById('cancel-new-list');
	const listNameInput = document.getElementById('add-list-name');

	const taskButtonAdd = document.getElementById('add-task');
	const taskButtonSave = document.getElementById('save-new-task');
	const taskButtonCancel = document.getElementById('cancel-new-task');
	const taskInputValue = document.getElementById('add-task-name');

	if (data) {
		const lastVisitedList = JSON.parse(localStorage.getItem('lastList'));

		// Show all list from Localstorage
		data.data.forEach(element => {
			const listName = element.listname;
			listContainer.innerHTML += `<li class="list" data-list-id="${element.id}">${listName}</li>`;
		});
	
		refreshList(data, lastVisitedList);
		checkDone(data);
		

		listButtonAdd.addEventListener('click', () => {
			todoConsoleStart('add-list-console');
		});
		
		listButtonSave.addEventListener('click', () => {
			listAddConsole.classList.remove('adding-list');
			const nextId = data.data.length + 1;
	
			if (listNameInput.value === '') {
				data.data.push({id: nextId, listname: `New List ${nextId}`, task: [], param: ''});
			} else {
				data.data.push({id: nextId, listname: listNameInput.value, task: [], param: ''});
			}
	
			save(data);
		});
	
		listButtonCancel.addEventListener('click', () => {
			location.reload();
		});
	
	
		taskButtonAdd.addEventListener('click', () => {
			todoConsoleStart('add-task-console');
		});
	
		taskButtonSave.addEventListener('click', () => {
			const activeList = document.querySelector('.active-list');
	
			if (activeList) {
				const listId = activeList.dataset.listId;
				data.data.forEach(element => {
					if (element.id == listId) {
						let nextId = '';
						if (element.task.length) {
							nextId = element.task[element.task.length - 1].id + 1;
						} else {
							nextId = element.task.length + 1;
						}
	
						element.task.push({id: nextId, taskName: taskInputValue.value, done: false});
	
						updateLocalstorage('data', data);
	
					}
				});
	
				save(data);
			}
		});
	
		taskButtonCancel.addEventListener('click', () => {
			location.reload();
		});
	
	
		const lists = document.querySelectorAll('.list');
	
		// Show all task from selected list.
		lists.forEach(element => {	
			element.addEventListener('click', () => {
				taskButtonAdd.style.display = 'flex';
				lists.forEach(element => {
					element.classList.remove('active-list');
				});
	
				const listId = element.dataset.listId;
	
				showTaskFromListId(data, listId);
				element.classList.add('active-list');
				location.reload();
			});
		});
	
		// Delete task
		const deleteButtons = document.querySelectorAll('.task-delete');
		deleteButtons.forEach(element => {
			element.addEventListener('click', () => {
				const taskId = element.dataset.taskId;
				const listId = element.dataset.listId;
	
				// removeTask(taskId, listId, data);
				deleteItem('task', data, listId, taskId);
			});
		});
		
		// Edit task
		const editTaskButtons = document.querySelectorAll('.task-edit');
		const editTaskConsole = document.getElementById('edit-task-console');
		editTaskButtons.forEach(element => {
			element.addEventListener('click', () => {
				const editTaskSave = document.getElementById('save-edit-task');
				const editTaskCancel = document.getElementById('cancel-edit-task');
				// editTaskConsole.style.visibility = 'visible';
				todoConsoleStart('edit-task-console');
	
				editTaskSave.addEventListener('click', () => {
					const editTaskSaveValue = document.getElementById('edit-task-name').value;
					const taskId = element.dataset.taskId;
					const listId = element.dataset.listId;

		
					editItem('task', data, editTaskSaveValue, listId, taskId);
					save(data);
				});
	
				editTaskCancel.addEventListener('click', () => {
					location.reload();
				});
			});
		});
	
		
		// Done task.
		const tasks = document.querySelectorAll('.task-name');
		tasks.forEach(element => {
			element.addEventListener('click', () => {
				const taskId = element.parentNode.dataset.taskId;	
				const listId = element.parentNode.dataset.listId;
	
				taskDone(data, taskId, listId);
				save(data);
			});
		});
	
		// Edit list
		const editListButton = document.querySelectorAll('.edit-list-title')[0];
		editListButton.addEventListener('click', () => {
			const editListSaveButton = document.getElementById('save-edit-list');
			const editListCancelButton = document.getElementById('cancel-edit-list');
	
			todoConsoleStart('edit-list-console');

			editListSaveButton.addEventListener('click', () => {
				const editListNameValue = document.getElementById('edit-list-name').value;
				const editListId = document.querySelector('.list-title').dataset.listId;
	
				editItem('list', data, editListNameValue, editListId);
				save(data);
			});

			editListCancelButton.addEventListener('click', () => {
				location.reload();
			});
		});
	
		// Delete list
		const deleteListButton = document.querySelectorAll('.edit-delete-title')[0];
		deleteListButton.addEventListener('click', () => {
			const listId = document.querySelector('.list-title').dataset.listId;
	
			deleteItem('list', data, listId);
			save(data);
		});
	} else {
		let data = {
			data: []
		};

		listButtonAdd.addEventListener('click', () => {
			todoConsoleStart('add-list-console');
		});
		
		listButtonSave.addEventListener('click', () => {
			listAddConsole.classList.remove('adding-list');
			const nextId = data.data.length + 1;
	
			if (listNameInput.value === '') {
				data.data.push({id: nextId, listname: `New List ${nextId}`, task: [], param: ''});
			} else {
				data.data.push({id: nextId, listname: listNameInput.value, task: [], param: ''});
			}
	
			save(data);
			location.reload();
		});
	
		listButtonCancel.addEventListener('click', () => {
			location.reload();
		});
	}
});

window.onbeforeunload = function(){
	let lastList = '';
	let listId = '';
	if (document.querySelector('.active-list')) {
		lastList = document.querySelector('.active-list');
		listId = lastList.dataset.listId;	
		
	} else {
		lastList = document.querySelector('.list');
		listId = lastList.dataset.listId;	
	}

	localStorage.setItem('lastList', JSON.stringify({id: listId, title: lastList.innerHTML}));
};
