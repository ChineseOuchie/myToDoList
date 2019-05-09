// const data = {
// 	data: [
// 		{
// 			id: 1,
// 			listname: 'List 1',
// 			task: [
// 				{id: 1, taskName: 'task1', done: false,},
// 				{id: 2, taskName: 'task2', done: false,},
// 			],
// 			param: '',
// 		},
// 		{
// 			id: 2,
// 			listname: 'List 2',
// 			task: [
// 				{id: 1, taskName: 'task4', done: false,},
// 				{id: 2, taskName: 'task5', done: true,},
// 			],
// 			param: '',
// 		}
// 	]
// };

// localStorage.setItem('data', JSON.stringify(data));

const data = JSON.parse(localStorage.getItem('data'));

function showLists(object, list) {
	object.data.forEach(element => {
		const listName = element.listname;

		list.innerHTML += `<li class="list" data-list-id="${element.id}">${listName}</li>`;
	});
}

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
						<div class="task-edit" data-list-id="${key}" data-task-id="${element.id}"><i class="fas fa-edit"></i></div>
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

function removeTask(taskId, listId, data) {
	data.data.forEach(element => {
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
}

function saveLastVisited() {
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
}

function refreshList(object, lastVisit) {
	document.querySelectorAll('.list').forEach(element => {
		if (element.dataset.listId == lastVisit.id) {
			document.getElementById('add-task').style.display = 'flex';
			showTaskFromListId(object, lastVisit.id);
			element.classList.add('active-list');
			document.querySelector('.title-button-container').style.visibility = 'visible';
		}
	});
}

function editTask(object, taskId, listId, value) {
	object.data.forEach(element => {
		const objectListId = element.id;
		
		element.task.forEach(elementTask => {
			const objectTaskId = elementTask.id;

			if (objectListId == listId && objectTaskId == taskId) {
				elementTask.taskName = value;
			}
		});
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
				element.querySelector('.task-name').classList.add('taskDone');
				element.querySelector('.task-name').parentNode.classList.add('taskDoneParent');
				break;
			case 'false':
				element.querySelector('.task-name').classList.remove('taskDone');
				element.querySelector('.task-name').parentNode.classList.remove('taskDoneParent');
				break;
		}
	});
}

function editListName(object, listId, value) {
	object.data.forEach(element => {
		const objectListId = element.id;
		
		if (objectListId == listId) {
			element.listname = value;
		}
	});
}

function save(inputClear, data) {
	if (inputClear) {
		inputClear.value = '';
	}

	updateLocalstorage('data', data);
	location.reload();
}

function deleteList(object, listId) {
	object.data.forEach((element, index) => {
		const objectListId = element.id;
		
		if (objectListId == listId) {
			object.data.splice(index, 1);
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const listButtonAdd = document.getElementById('add-list');
	const listContainer = document.getElementById('lists');
	const listAddConsole = document.getElementById('add-list-console');
	const listButtonSave = document.getElementById('save-new-list');
	const listButtonCancel = document.getElementById('cancel-new-list');
	const listNameInput = document.getElementById('add-list-name');

	const taskContainer = document.getElementById('tasks');
	const taskButtonAdd = document.getElementById('add-task');
	const taskAddConsole = document.getElementById('add-task-console');
	const taskButtonSave = document.getElementById('save-new-task');
	const taskButtonCancel = document.getElementById('cancel-new-task');
	const taskInputValue = document.getElementById('add-task-name');

	if (data) {
		const lastVisitedList = JSON.parse(localStorage.getItem('lastList'));
		// Show all list from Localstorage
		showLists(data, listContainer, taskContainer);
	
		refreshList(data, lastVisitedList);
		checkDone(data);
		
		
	
		listButtonAdd.addEventListener('click', () => {
			listAddConsole.classList.add('adding-list');
		});
		
		listButtonSave.addEventListener('click', () => {
			listAddConsole.classList.remove('adding-list');
			const nextId = data.data.length + 1;
	
			if (listNameInput.value === '') {
				data.data.push({id: nextId, listname: `New List ${nextId}`, task: [], param: ''});
			} else {
				data.data.push({id: nextId, listname: listNameInput.value, task: [], param: ''});
			}
	
			save(listNameInput, data);
		});
	
		listButtonCancel.addEventListener('click', () => {
			listAddConsole.classList.remove('adding-list');
			listNameInput.value = '';
		});
	
	
		taskButtonAdd.addEventListener('click', () => {
			taskAddConsole.classList.add('adding-list');
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
	
				save(taskInputValue, data);
			}
		});
	
		taskButtonCancel.addEventListener('click', () => {
			taskAddConsole.classList.remove('adding-list');
			taskInputValue.value = '';
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
	
				removeTask(taskId, listId, data);
			});
		});
		
		// Edit task
		const editTaskButtons = document.querySelectorAll('.task-edit');
		const editTaskConsole = document.getElementById('edit-task-console');
		editTaskButtons.forEach(element => {
			element.addEventListener('click', () => {
				const editTaskSave = document.getElementById('save-edit-task');
				const editTaskCancel = document.getElementById('cancel-edit-task');
				editTaskConsole.style.visibility = 'visible';
	
				editTaskSave.addEventListener('click', () => {
					const editTaskSaveValue = document.getElementById('edit-task-name').value;
					const taskId = element.dataset.taskId;
					const listId = element.dataset.listId;
		
					editTask(data, taskId, listId, editTaskSaveValue);
					save(editTaskSaveValue, data);
				});
	
				editTaskCancel.addEventListener('click', () => {
					editTaskConsole.style.visibility = 'hidden';
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
				save('', data);
			});
		});
	
		// Edit list
		const editListButton = document.querySelectorAll('.edit-list-title')[0];
		editListButton.addEventListener('click', () => {
			const editListConsole = document.getElementById('edit-list-console');
			const editListSaveButton = document.getElementById('save-edit-list');
	
			editListConsole.style.visibility = 'visible';
			editListSaveButton.addEventListener('click', () => {
				const editListNameValue = document.getElementById('edit-list-name').value;
				const editListId = document.querySelector('.list-title').dataset.listId;
	
				editListName(data, editListId, editListNameValue);
	
				editListConsole.style.visibility = 'hidden';
	
				save(editListConsole, data);
			});
		});
	
		// Delete list
		const deleteListButton = document.querySelectorAll('.edit-delete-title')[0];
		deleteListButton.addEventListener('click', () => {
			const listId = document.querySelector('.list-title').dataset.listId;
	
			deleteList(data, listId);
			save('', data);
		});
	} else {
		let data = {
			data: []
		};

		listButtonAdd.addEventListener('click', () => {
			listAddConsole.classList.add('adding-list');
		});
		
		listButtonSave.addEventListener('click', () => {
			listAddConsole.classList.remove('adding-list');
			const nextId = data.data.length + 1;
	
			if (listNameInput.value === '') {
				data.data.push({id: nextId, listname: `New List ${nextId}`, task: [], param: ''});
			} else {
				data.data.push({id: nextId, listname: listNameInput.value, task: [], param: ''});
			}
	
			save(listNameInput, data);
			location.reload();
		});
	
		listButtonCancel.addEventListener('click', () => {
			listAddConsole.classList.remove('adding-list');
			listNameInput.value = '';
		});
	}
});

window.onbeforeunload = function(){
	saveLastVisited();
};
