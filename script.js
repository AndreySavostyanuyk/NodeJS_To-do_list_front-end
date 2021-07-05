let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
let flag = false;
let curentIndex;
let text;

window.onload = async function init () {
input = document.getElementById('add-task');
input.addEventListener('change', updateValue);

const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
});

const result = await resp.json();
allTasks = result.data;

render();
};

onClickButton = async () => {
const resp = await fetch('http://localhost:8000/createTasks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Alow-Origin': '*'
    },
    body: JSON.stringify( {
        text: valueInput ,
        isCheck: false
    })
});

const result = await resp.json();

allTasks = result.data;
localStorage.setItem('tasks', JSON.stringify(allTasks));
valueInput = "";
input.value = "";

render();
};

updateValue = (event) => {
valueInput = event.target.value;
};

render = async ()  => {
const content = document.getElementById('content-page');

while(content.firstChild) {
    content.removeChild(content.firstChild);
};
  
allTasks.map((item, index) => {
const container = document.createElement('div');
container.id = `task-${index}`;
container.className = 'task-container';
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.checked = item.isCheck;

checkbox.onchange = function () {
    onChangeCheckBox(index);
}

container.appendChild(checkbox);
if(index === curentIndex){
const text = document.createElement('input');
text.type = 'text';
text.value = item.text;
text.id = 'inputId';
container.appendChild(text);
const imageClear = document.createElement('img'); 
imageClear.src = 'images/clear.svg';
container.appendChild(imageClear);

imageClear.onclick = function () {
    EditClear(index);
};

const imageOk = document.createElement('img');
imageOk.src = 'images/ok.svg';
container.appendChild(imageOk);
imageOk.onclick = function () {
    EditOk(index);
};

}else {
const text = document.createElement('p');
text.innerText = item.text;
text.className = item.isCheck ? 'text-task done-text' : 'text-task';
container.appendChild(text);
};
      
const imageEdit = document.createElement('img');
imageEdit.src = 'images/edit.svg';
container.appendChild(imageEdit);
imageEdit.onclick = function () {
    EditItem(index);
};

const imageDelete = document.createElement('img');
imageDelete.src = 'images/delete.svg';
container.appendChild(imageDelete);
imageDelete.onclick = function () {
    DeleteItem(index,container);
};
content.appendChild(container);
});
};

onChangeCheckBox = (index) => {
allTasks[index].isCheck = !allTasks[index].isCheck;
localStorage.setItem('tasks', JSON.stringify(allTasks));

render();
};

EditOk = async (index) => {
input = document.getElementById('inputId');
input.addEventListener('change', updateValue);
const resp = await fetch('http://localhost:8000/editTasks', {
method: 'PATCH',
headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Alow-Origin': '*'
},
body: JSON.stringify( {
    text: input.value,
    isCheck: allTasks[index].isCheck
})
});

const result = await resp.json();
allTasks = result.data;
curentIndex = null;
localStorage.setItem('tasks', JSON.stringify(allTasks));

render();
};

EditClear = (index) => {
curentIndex = null;

render();
};

EditItem = (index, item, container) => {
curentIndex = index;

render();
};

DeleteItem = async (index, item) => {
const resp = await fetch(`http://localhost:8000/deleteTasks?_id=${allTasks[index]._id}`, {
method: 'DELETE'
});
let result = await resp.json();
allTasks = result.data;
localStorage.setItem('tasks', JSON.stringify(allTasks));

render();
};

DeleteAll = async () => {
const resp = await fetch('http://localhost:8000/deleteAllTasks', {
method: 'DELETE'
});

const result = await resp.json();
allTasks = result.data;
localStorage.setItem('tasks', JSON.stringify(allTasks));

render();
};