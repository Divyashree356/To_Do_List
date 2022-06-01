
let addbtn = document.querySelector('.add-button');
let mainCont= document.querySelector('.main-cont');
let addFlag= false;
let removeFlag=false;
let color= ['pink' , 'blue' , 'green' , 'black'];
let allPrioirityColors= document.querySelectorAll('.priority-color');
let textArea= document.querySelector('.textarea-cont')
let removeBtn= document.querySelector('.remove-button')

let priorityColor= color[color.length-1];  //by default- black
let toolBoxColor= document.querySelectorAll('.color');
let lockClass= 'fa-lock';
let unlockClass= 'fa-lock-open';

let locked=true;
 
let ticketArr= [];


//get local storage
if(localStorage.getItem('tickets'))
{
 ticketArr= JSON.parse(localStorage.getItem('tickets'));
 ticketArr.forEach(function(ticket)
 {
     createTicket(ticket.ticketColor , ticket.ticketValue , ticket.ticketId);
 })

}

//filtering tickets with respect to colors
for(let i=0;i<toolBoxColor.length;i++)
{
    toolBoxColor[i].addEventListener('click' , function(e)
    {
        let currentSelColor= toolBoxColor[i].classList[0];
        console.log(currentSelColor);

        let filteredTicket = ticketArr.filter(function(ticketObj)
        {
            return currentSelColor === ticketObj.ticketColor;
        })

        //remove previous tickets
        let allTickets= document.querySelectorAll('.ticket-cont');

        for(let i=0;i<allTickets.length;i++)
        {
            allTickets[i].remove();
        }

        //displaying filtered tickets
        filteredTicket.forEach(function(filterdObj)
        {
            // console.log('printing')
              createTicket(filterdObj.ticketColor ,filterdObj.ticketValue , filterdObj.ticketId);
        })
    });

    toolBoxColor[i].addEventListener('dblclick' , function(e)
    {
        let allTickets= document.querySelectorAll('.ticket-cont');

        for(let i=0;i<allTickets.length;i++)
        {
            allTickets[i].remove();
        }

        ticketArr.forEach(function(ticketObj)
        {
            createTicket(ticketObj.ticketColor , ticketObj.ticketValue , ticketObj.ticketId)
        })

    })
}




let modelContainer= document.querySelector('.model-cont')
addbtn.addEventListener('click' , function(e)
{
    //display model 
    //add flag ->true then we have to display model otherwise hide
  addFlag = !addFlag;
  if(addFlag==true)
  {
      modelContainer.style.display="flex";
  }
  else
    { modelContainer.style.display='none';
}
})

 //generate ticket
 modelContainer.addEventListener('keydown' , function(e)
 {
     let key = e.key;
     if(key == 'Shift')
      {
      createTicket(priorityColor , textArea.value);  //it will create ticket
      modelContainer.style.display='none';
      addFlag= false;
      textArea.value="";
        }
 });


 //changing priority color

 allPrioirityColors.forEach(function(colorEle)
 {
     colorEle.addEventListener('click' , function(e)
     {
         allPrioirityColors.forEach(function(currColorEle)
         {
             currColorEle.classList.remove('active');
         })
         colorEle.classList.add('active');

         priorityColor= colorEle.classList[0];
     })
 })

 function createTicket(ticketColor , ticketValue, ticketId)
 {
     let id= ticketId|| shortid();

     let ticketCont= document.createElement('div');
     ticketCont.setAttribute('class' , 'ticket-cont');
     ticketCont.innerHTML=` <div class="ticket-color ${ticketColor}">

     </div>
     <div class="ticket-id">
        #${id}
     </div>
     <div class="task-area ">
       ${ticketValue}
     </div>
     <div class="lock-cont">
         <i class="fa-solid fa-lock"></i>
     </div>`

     mainCont.appendChild(ticketCont);
     handleRemover(ticketCont ,id);
     handlelock(ticketCont,id);
     handleColorBar(ticketCont ,id);

     if(!ticketId)
       {
        ticketArr.push({ticketColor , ticketValue , ticketId :id});
        localStorage.setItem('tickets' , JSON.stringify(ticketArr))
      }
 }

 removeBtn.addEventListener('click' , function(e)
 {
   removeFlag= !removeFlag;
   if(removeFlag==true)
      removeBtn.style.color='blue';
    else
      removeBtn.style.color='black';

 })


 //remove ticket function
 function handleRemover(ticket,id)
 {
     ticket.addEventListener('click' , function(e)
     {
         if(!removeFlag) return;

         //updating local storage
         let idx= getTicketIdx(id);
         ticketArr.splice(idx,1);   //deleting ticket from array

         let updtaedTicketArr= JSON.stringify(ticketArr);

         localStorage.setItem('tickets' , updtaedTicketArr); 
         
             ticket.remove();
         
     })
 }
 

 //function for lock and unlock

 function handlelock(ticket ,id)
 {
  let ticketlockEle = ticket.querySelector('.lock-cont');
  
  //taking out children of div element
  let ticketLock= ticketlockEle.children[0];
  let ticketTaskarea= ticket.querySelector('.task-area');

  ticketLock.addEventListener('click' , function(e)
  {
      let idx= getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass))
        {

            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskarea.setAttribute('contenteditable', 'true');
            

        }
        else{

            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskarea.setAttribute('contenteditable', 'false');

        }
        
        ticketArr[idx].ticketValue= ticketTaskarea.innerText;
        localStorage.setItem('tickets' ,JSON.stringify(ticketArr));

  })

 }


 //handle color over ticket
 function handleColorBar(ticket ,id)
 {
    let colorBarele = ticket.querySelector('.ticket-color');

    colorBarele.addEventListener('click', function(e)
    {
        let currBarColor= colorBarele.classList[1];
        let idx= getTicketIdx(id);

        let colorIdx=  color.findIndex(function(currColor)
        {
            return currBarColor === currColor;
        })

        colorIdx++;
        let newColorIdx= colorIdx% color.length;
        let newColor= color[newColorIdx];

        colorBarele.classList.remove(currBarColor);
        colorBarele.classList.add(newColor);
        
        //modify in ticket color array and then in local storage
        ticketArr[idx].ticketColor= newColor;
        localStorage.setItem('tickets' ,JSON.stringify(ticketArr));

    })
 }

 //get index of the ticket which we want to remove
 function getTicketIdx(id)
 {
     let ticketIdx= ticketArr.findIndex(function(obj)
     {
         return obj.ticketId==id;
     })
     return ticketIdx;
 }
