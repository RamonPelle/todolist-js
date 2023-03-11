//Query selector config
const listsContainer = document.querySelector('[listsData]');
const newListForm = document.querySelector('[dataNewList]');
const newListInput = document.querySelector('[newListInputData]');
const listDisplayContainer = document.querySelector('[ListDisplay]');
const listTitleElement = document.querySelector('[listTitle]');
const tasksContainer =document.querySelector('[tasksDisplay]');
const newTaskForm = document.querySelector('[dataNewTask]');
const newTaskInput = document.querySelector('[newTaskInputData]');
const destroyListButton = document.querySelector('[destroyListButton]');
const taskTemplate = document.getElementById('taskTemplate');

// Event listeners config
listsContainer.addEventListener('click', handleListClick);
tasksContainer.addEventListener('click', handleTaskClick);
destroyListButton.addEventListener('click', handleDestroyListClick);
newListForm.addEventListener('submit', handleNewListSubmit);
newTaskForm.addEventListener('submit', handleNewTaskSubmit);

// Local storage config
const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

// Variables
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


// Functions
function handleListClick(e) {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
}

function handleTaskClick(e) {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    save();
  } else if (e.target.classList.contains('destroyButtonTask')) {
    const taskId = e.target.parentElement.getAttribute('for');
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => task.id !== taskId);
    saveAndRender();
  }
}

function handleDestroyListClick(e) {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
}

function handleNewListSubmit(e) {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
}

function handleNewTaskSubmit(e) {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
}


function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
    destroyListButton.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    destroyListButton.style.display = ''
    listTitleElement.innerText = selectedList.name
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}


// Render functions
function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
  
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete

    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)

    const thrashButton = document.createElement("img"); 
    thrashButton.src = './img/destroy.png'
    thrashButton.height = '20'
    thrashButton.width= '20'
    thrashButton.id = task.id
    thrashButton.classList.add("destroyButtonTask");
    label.appendChild(thrashButton);
    tasksContainer.appendChild(taskElement)
  })
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()