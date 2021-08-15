function getTranslateX(box){
    var style =window.getComputedStyle(box);
    var matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41;
}

function getTranslateY(box){
    var style =window.getComputedStyle(box);
    var matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m42;
}

var sizeOfGrid = 3;

const btns = document.querySelectorAll(".choose");
const puzzle = document.getElementById("puzzle");
const solve = document.getElementById("solve");
const begin = document.getElementById("begin");
const reset = document.getElementById("scramble");
const time = document.querySelector(".time");
const pause = document.querySelector("#pause");


const win = document.querySelector(".win");
const jumble = document.querySelector("#scramble");

var SCORES = JSON.parse(localStorage.getItem('SCORE'));
if(SCORES){
    win.innerText = `Best: ${getMinTime(SCORES)}s`;
}


jumble.addEventListener("click",()=>{
    start(sizeOfGrid,scramble(sizeOfGrid));
    stop=false;
    Time=0;
});

reset.addEventListener('click',()=>{
    Time=0;
    stop=true;
    pause.innerText='Pause'
});


var stop = true;
var Time=0;

var score = new Array();

function getMinTime(arr){
    var min = 1000;
    for(var i=0;i<arr.length;i++){
        if(min>arr[i]){
            min = arr[i];
        }
    }
    return min;
}

begin.addEventListener("click",increase);

function increase(){
    if(stop){
        setInterval(() => {
            if(stop){
                Time++;
            }
            console.log(Time);
            time.innerText = `${Time}s`;
        }, 1000);
    }
      
}

pause.addEventListener("click", ()=>{
    begin.removeEventListener("click", increase)
    stop = !stop;
    if(!stop){
        pause.innerText='Play';
    }else{
        pause.innerText='Pause'
    }
});


solve.addEventListener("click",()=>{
    stop=false;
    score.push(Time);
    localStorage.setItem('SCORE',JSON.stringify(score));
    SCORES = JSON.parse(localStorage.getItem('SCORE'));
    win.innerText = `Best: ${getMinTime(SCORES)}s`;
    Time=0;
    var sortedArray = new Array();
    for(var i=0;i<sizeOfGrid*sizeOfGrid;i++){
        sortedArray[i] = i+1;
    }
    start(sizeOfGrid, sortedArray);
});


btns.forEach(btn=>{
    btn.addEventListener("click",(e)=>{
        stop=false;Time=0;
        sizeOfGrid = parseInt(e.target.id);
        console.log(sizeOfGrid)
        start(sizeOfGrid, scramble(sizeOfGrid));
    });
});


function start(size,array){
    puzzle.innerHTML=``;
    puzzle.style.width = `${80*size}px`
    puzzle.style.height = `${80*size}px`
    for(var i=1;i<=size*size;i++){
        var current = document.createElement('div');
        current.classList.add('box');
        current.classList.add('effect');
        if(i===size*size){
            current.classList.add('empty');
        }
        current.setAttribute('id', `${i}`);
        current.style.top = `${80*(parseInt((i-1)/size))}px`
        current.style.left = `${80*((i-1)%size)}px`
        current.innerText = array[i-1];
        if(i===size*size){
            current.innerText = '';
        }
        
        puzzle.appendChild(current);
    }
    applyJS();
}

start(sizeOfGrid, scramble(sizeOfGrid));

function scramble(size){
    var elements = new Array();
    for(var i=1;i<=size*size;i++){
        elements.push(i);
    }
    var currentIndex = size*size;var randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [elements[currentIndex], elements[randomIndex]] = [elements[randomIndex], elements[currentIndex]];
  }
    var index = elements.indexOf(size*size);
    elements.splice(index,1)
    return elements;

}




function getNeighbors(id,size){
    neighbors  = new Array();
    
    var index = id;
    while(index-size>0){
        neighbors.push(index-size);
        index -= size;
    }
    index = id;
    while(index+size<=size*size){
        neighbors.push(index+size);
        index += size;
    }
    for(var i=1;i<=size;i++){
        if((id-1)%size+1+i<=size){
            neighbors.push(id+i);
        }
        if((id-1)%size +1-i>0){
            neighbors.push(id-i);
        }
    }
    return neighbors;
}

function applyJS(){
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box=>{
        box.addEventListener('click', (e)=>{
            var size=sizeOfGrid;
            var id = parseInt(e.target.id)
            
            document.querySelectorAll(".box").forEach(box=>{
                if(box.classList.contains('empty')){
                    emptyId = parseInt(box.id);
                    box.remove();
                }
            })
            
            var Neighbors= getNeighbors(id,sizeOfGrid);
            
            for(var i=0;i<Neighbors.length;i++){
                if(emptyId===Neighbors[i]){
                    const emptyBox = document.createElement('div');
                    emptyBox.classList.add('box');
                    emptyBox.classList.add('empty');
                    emptyBox.setAttribute('id', id);
                    if((emptyId-id)%sizeOfGrid===0){
                        emptyBox.style.top = `${80*(parseInt((id-1)/size))}px`
                        emptyBox.style.left = `${80*((id-1)%size)}px`
                        
                        box.style.top =`${80*(parseInt((id-1)/size))}px`
                        box.style.transform =`translate(${getTranslateX(box)}px,${((emptyId-id)/size)*80}px)`;

                    }else{
                        emptyBox.style.top = `${80*(parseInt((emptyId-1)/size))}px`
                        emptyBox.style.left = `${80*((id-1)%size)}px`

                        
                        box.style.left = `${80*((id-1)%size)}px`
                        box.style.transform = `translate(${(emptyId-id)*80}px, ${getTranslateY(box)}px)`;
                        
                    }
                    box.style.transition = '0.25s ease-in';
                    box.style.zIndex='3';
                    puzzle.appendChild(emptyBox);
                    box.setAttribute('id',emptyId)
                }
            }
        })
    })
}












