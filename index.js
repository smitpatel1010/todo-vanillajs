var todoList=[];
var todoCount=0,activeCount=0;

function init(){
    document.getElementById('todos').addEventListener("dblclick", onDoubleClickForTodoInput);
    document.getElementById('all').addEventListener("click", showAll);
    document.getElementById('active').addEventListener("click", showActive);
    document.getElementById('completed').addEventListener("click", showCompleted);
    document.getElementById('clear-completed').addEventListener("click", clearCompleted);
    document.getElementById('todo-arrow').addEventListener("click", onArrowClick);
    getLocalStorage();
    window.onbeforeunload=()=>{setLocalStorage()}
    document.addEventListener("visibilitychange", function() {
        if (document.hidden){
            setLocalStorage();
        } else {
            getLocalStorage();
        }
    });
}

init()

function setLocalStorage(){
    localStorage.setItem('todoList',JSON.stringify(todoList));
    if(document.getElementById('active').classList[0]==='active')
    {
        localStorage.setItem('pageName','active');
    }
    if(document.getElementById('completed').classList[0]==='active')
    {
        localStorage.setItem('pageName','completed');
    }
    if(document.getElementById('all').classList[0]==='active')
    {
        localStorage.setItem('pageName','all');
    }
}

function getLocalStorage(){
    window.todoList=[];window.todoCount=0,window.activeCount=0;
    document.getElementById('todos').innerHTML='';
    var List = JSON.parse(localStorage.getItem('todoList'));
    if(List){
        List.forEach((element)=>{
            element.id=todoCount;
            document.getElementById('todo-input').onkeypress({keyCode:13,target:{value:element.value}});
        });
        List.forEach((element)=>{
            if(element.completed===true){
                document.getElementById('check-'+element.id).click();
            }
        });
    }
    if(localStorage.getItem('pageName'))
    {
        document.getElementById(localStorage.getItem('pageName')).click();
    }
}

function replaceAll(str, find, replace) {
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function enterPressOnMainInput(e){
    var code = e.keyCode;
    if(code == 13 && e.target.value.trim()!=='') {
        e.target.value=replaceAll(e.target.value,"'","&#039");
        var newcontent = document.createElement('div');
        newcontent.id=todoCount;
        newcontent.classList.add("todo");
        newcontent.innerHTML='<div id="checkdiv-'+ todoCount +'" class="checkbox"><img id="check-'+ todoCount +'" class="tick" src="tick.svg"></div><div id="input-'+ todoCount +'">'+e.target.value+'</div><div class="todo-cancel"><img id="cancel-'+ todoCount +'" src="cross.svg"></div>';
        document.getElementById('todos').appendChild(newcontent);
        todoList.push({id:todoCount,value:e.target.value,completed:false});
        document.getElementById("todo-input").value="";
        document.getElementById(todoCount).addEventListener('mouseenter',onMouseEnterDivForCancel);
        document.getElementById(todoCount).addEventListener('mouseleave',onMouseLeaveDivForCancel);
        document.getElementById("cancel-"+todoCount).addEventListener('click',onCancelClick);
        document.getElementById("check-"+todoCount).addEventListener('click',onCheckBoxClick);
        todoCount++;
        activeCount++;
        document.getElementById('log').innerHTML=activeCount+" items left";
        document.getElementById('todo-arrow').style.opacity=0.1;
        if(document.getElementById('completed').classList[0]==='active')
        {
            document.getElementById("completed").click();
        }
        document.getElementById('todo-footer').classList.remove('hide');
    }
}

function onMouseEnterDivForCancel(e){
    document.getElementById('cancel-'+e.target.id).style.opacity=1;
}

function onMouseLeaveDivForCancel(e){
    document.getElementById('cancel-'+e.target.id).style.opacity=0;
}

function onOutsideClick(e){
    let id=Number(e.target.id.slice(6)),preffix=e.target.id.slice(0,6);
    if(preffix==='input-')
    {
      let value=document.getElementById(e.target.id).value;
      var textnode = document.createElement("div");
      textnode.id=e.target.id;
      textnode.innerHTML=value;
      todoList.forEach((element)=>{
          if(element.id===id && element.completed===true){
              textnode.style.textDecoration='line-through';
              textnode.style.opacity=0.3;
          }
      }) 
      document.getElementById(id).replaceChild(textnode,document.getElementById(id).childNodes[1]);
    }
}

function onEnterClickForTodoInput(e){
    if(e.keyCode===13){
        let id=Number(e.target.id.slice(6)),preffix=e.target.id.slice(0,6);
        if(preffix==='input-')
        {
            document.getElementById(e.target.id).removeEventListener('focusout',onOutsideClick);
            let value=document.getElementById(e.target.id).value;
            var textnode = document.createElement("div");
            textnode.id=e.target.id;
            textnode.innerHTML=value;
            todoList.forEach((element)=>{
                if(element.id===id && element.completed===true){
                    textnode.style.textDecoration='line-through';
                    textnode.style.opacity=0.3;
                }
            }) 
            document.getElementById(id).replaceChild(textnode,document.getElementById(id).childNodes[1]);
        }
    }
}


function onDoubleClickForTodoInput(e){
  let id=e.target.id.slice(6),preffix=e.target.id.slice(0,6);
  if(preffix==='input-')
  {
    let value=document.getElementById(e.target.id).innerHTML;
    var textnode = document.createElement("input");
    textnode.id=e.target.id;
    textnode.type="text";
    textnode.value=value;
    document.getElementById(id).replaceChild(textnode,document.getElementById(id).childNodes[1]);
    document.getElementById(e.target.id).addEventListener('focusout',onOutsideClick);
    document.getElementById(e.target.id).addEventListener('keydown',onEnterClickForTodoInput);
    document.getElementById(e.target.id).addEventListener('change',onInputChange);
    document.getElementById(e.target.id).focus();
  }
}

function onInputChange(e){
    var id=Number(e.target.id.slice(6));
    if(e.target.value.trim()==='')
    {
        activeCount--;
        document.getElementById('log').innerHTML=activeCount+" items left";
        todoList=todoList.filter((element)=>element.id!==id);
        if(todoList.length===0){
            document.getElementById('todo-arrow').style.opacity=0;
            document.getElementById('todo-footer').classList.add('hide');
        }
        document.getElementById(id).innerHTML='';
        document.getElementById(id).outerHTML='';
    }
    else
    {
        todoList.forEach((element)=>{
            if(element.id===id)
            {
                element.value=e.target.value;
            }
        });
    }
}

function onArrowClick(e){
    todoList.forEach((element)=>{
        element.completed=activeCount>0?true:false;
        document.getElementById("check-"+element.id).style.opacity=activeCount>0?0.6:0;
        document.getElementById("checkdiv-"+element.id).style.borderColor=activeCount>0?'#BDDAD5':'#EDEDED';
        document.getElementById("input-"+element.id).style.textDecoration=activeCount>0?"line-through":'none';
        document.getElementById("input-"+element.id).style.opacity=activeCount>0?0.3:1;
    });
    activeCount=activeCount>0?0:todoList.length;
    document.getElementById('clear-completed').style.opacity=todoList.length>activeCount?0.6:0;
    document.getElementById('log').innerHTML=activeCount+" items left";
    if(document.getElementById('completed').classList[0]==='active')
    {
        document.getElementById("completed").click();
    }
    if(document.getElementById('active').classList[0]==='active')
    {
        document.getElementById("active").click();
    }
    document.getElementById('todo-arrow').style.opacity=activeCount>0?0.1:0.5;
}

function onCheckBoxClick(e){
    var id=Number(e.target.id.slice(6));
    var checked = e.target.style.opacity>0 ? false : true;
    e.target.style.opacity=0.6-e.target.style.opacity;
    document.getElementById("checkdiv-"+id).style.borderColor=checked?'#BDDAD5':'#EDEDED';
    todoList.forEach((element)=>{
        if(element.id===id)
        {
            element.completed=e.target.style.opacity>0?true:false;
            activeCount-=e.target.style.opacity>0?1:-1;
            document.getElementById('clear-completed').style.opacity=todoList.length>activeCount?0.6:0;
            document.getElementById('log').innerHTML=activeCount+" items left";
            if(checked===true && document.getElementById('active').classList[0]==='active')
            {
                document.getElementById("active").click();
            }
            if(checked===false && document.getElementById('completed').classList[0]==='active')
            {
                document.getElementById("completed").click();
            }
        }
    });
    document.getElementById("input-"+id).style.textDecoration=checked?"line-through":'none';
    document.getElementById("input-"+id).style.opacity=checked?0.3:1;
    document.getElementById('todo-arrow').style.opacity=activeCount>0?0.1:0.5;
}

function onCancelClick(e){
    var id=Number(e.target.id.slice(7));
    todoList=todoList.filter((element)=>{
        if(element.id===id && element.completed===false) {
           activeCount--;
        }
        return element.id!==id
    });
    document.getElementById('log').innerHTML=activeCount+" items left";
    if(todoList.length===0){
        document.getElementById('todo-arrow').style.opacity=0;
        document.getElementById('todo-footer').classList.add('hide');
    }
    document.getElementById(id).innerHTML='';
    document.getElementById(id).outerHTML='';
    document.getElementById('clear-completed').style.opacity=todoList.length>activeCount?0.6:0;
}


function showAll(){
    todoList.forEach((element)=>{
        document.getElementById(element.id).style.display='flex';
    });
    document.getElementById('all').classList.add('active');
    document.getElementById('active').classList.remove('active');
    document.getElementById('completed').classList.remove('active');
    localStorage.setItem('pageName','all');
}

function showActive(){
    todoList.forEach((element)=>{
        if(element.completed===true)
            document.getElementById(element.id).style.display='none';
        else
            document.getElementById(element.id).style.display='flex';
    });
    document.getElementById('all').classList.remove('active');
    document.getElementById('active').classList.add('active');
    document.getElementById('completed').classList.remove('active');
    localStorage.setItem('pageName','active');
}

function showCompleted(){
    todoList.forEach((element)=>{
        if(element.completed===false)
            document.getElementById(element.id).style.display='none';
        else
            document.getElementById(element.id).style.display='flex';
    });
    document.getElementById('all').classList.remove('active');
    document.getElementById('active').classList.remove('active');
    document.getElementById('completed').classList.add('active');
    localStorage.setItem('pageName','completed');
}

function clearCompleted(){
    todoList.forEach((element)=>{
        if(element.completed===true)
        {
            document.getElementById(element.id).innerHTML='';
            document.getElementById(element.id).outerHTML='';
        }
    });
    todoList=todoList.filter((element)=>element.completed==false);
    document.getElementById('todo-arrow').style.opacity=activeCount>0?0.1:0.5;
    if(todoList.length===0){
        document.getElementById('todo-arrow').style.opacity=0;
        document.getElementById('todo-footer').classList.add('hide');
    }
    document.getElementById('clear-completed').style.opacity=todoList.length>activeCount?0.6:0;
}
