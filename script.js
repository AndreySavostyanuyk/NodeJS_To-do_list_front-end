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
    let result = await resp.json();
    // console.log('result', result);
    allTasks = result.data;
    render();
};

onClickButton = async () => {
    // allTasks.push({
    //     text: valueInput ,
    //     isCheck: false
    // });
   

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
    let result = await resp.json();
    allTasks = result.data;
    console.log(result);
    console.log(allTasks)
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    valueInput = "";
    input.value = "";
    render();
}

updateValue = (event) => {
    valueInput = event.target.value;
}

render = async ()  => {
    // console.log(allTasks)
    const content = document.getElementById('content-page');
    while(content.firstChild) {
        content.removeChild(content.firstChild);
    };
    // allTasks.sort((a,b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
    allTasks.map((item, index) => {
       
        const container = document.createElement('div');
        container.id = `task-${index}`
        container.className = 'task-container'
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'
        checkbox.checked = item.isCheck;
        checkbox.onchange = function () {
            onChangeCheckBox(index);
        }
        container.appendChild(checkbox);



       if(index === curentIndex){
        const text = document.createElement('input');
        text.type = 'text'
        text.value = item.text;
        text.id = 'inputId'
        
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
        text.className = item.isCheck ? 'text-task done-text' : 'text-task'
        container.appendChild(text);
        
       }
      
        

       

        // const imageClear = document.createElement('img');
        // imageClear.className = flag === false ? 'displayOff' : 'displayOn';
        // imageClear.src = 'images/clear.svg';
        // container.appendChild(imageClear);
       
    
    
        // const imageOk = document.createElement('img');
        // imageClear.className = flag === false ? 'displayOff' : 'displayOn';
        // imageOk.src = 'images/ok.svg';
        // container.appendChild(imageOk);
        

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
}

EditOk = async (index) => {
    input = document.getElementById('inputId');
    
    

    input.addEventListener('change', updateValue);
    // allTasks[index].text = input.value;


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
    let result = await resp.json();
    allTasks = result.data;

    curentIndex = null;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();

}

EditClear = (index) => {
    curentIndex = null;
    render();
}

EditItem = (index, item, container) => {
    flag = true;
    curentIndex = index;
     render();
    }

DeleteItem = async (index, item) => {

    // if(allTasks[index].isCheck === true){
    //     allTasks.splice(index, 1);
    //     item.remove();
    //     console.log('hi',allTasks);
    // }
    console.log('hi',allTasks[index]._id)
    const resp = await fetch(`http://localhost:8000/deleteTasks?_id=${allTasks[index]._id}`, {
        method: 'DELETE'
    });
    let result = await resp.json();
    allTasks = result.data;
    
    // allTasks.splice(index, 1);
    //  item.remove();
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
};

DeleteAll = async () => {
    //  allTasks.splice(0, allTasks.length);

    const resp = await fetch('http://localhost:8000/deleteAllTasks', {
        method: 'DELETE'
    });
    let result = await resp.json();
    allTasks = result.data;

    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
};