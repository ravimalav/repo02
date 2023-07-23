const addExpenceButton=document.getElementById('expence-button')
addExpenceButton.addEventListener('click',addExpenceToList)


//to decode jwt token at front End side
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const pageList1=document.getElementById('button-list1')
const pageList2=document.getElementById('button-list2')
const pageList3=document.getElementById('button-list3')
let check=true

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    previousPage,
    hasPreviousPage,
    lastPage
})

// its a block
{
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= lastPage; i++) {
        const pageLink = document.createElement('span');
        pageLink.className = 'pagination-link';
        pageLink.innerText = i;
        pageLink.addEventListener('click', () => {
          currentPage = i;
          document.querySelector('#ul-list').innerHTML=""
          getExpence(currentPage);
        });
        paginationContainer.appendChild(pageLink);
      }
    }




window.addEventListener('DOMContentLoaded',async()=>
{
    const token=localStorage.getItem('token')
    const checkPremiumStatus=parseJwt(token).isPremiumUser
    const page=1;
    console.log(checkPremiumStatus + " and " +parseJwt(token).userId)
    if(checkPremiumStatus===true) 
    {
        premiumButton.value='Premium Account'
        showLeaderBoard();
        downloadExpenceButton();
        listOfExpencesButton();
    }
    try{
        const getListItems=await axios.get(`http://localhost:3000/expence/get-expence?page=${page}`,{headers:{'Authorization':token}})
        for(let i=0;i<getListItems.data.responce.length;i++)
        {
             showExpence(getListItems.data.responce[i])
        }
        showPagination(getListItems.data)
    }
    catch(err){
        console.log(err)
    }
})

async function getExpence(page)
{
    try
    {
        const token=localStorage.getItem('token')
        const getListItems=await axios.get(`http://localhost:3000/expence/get-expence?page=${page}`,{headers:{'Authorization':token}})
        for(let i=0;i<getListItems.data.responce.length;i++)
        {
             showExpence(getListItems.data.responce[i])
        }
        check=false;
        showPagination(getListItems.data)   
    }
    catch(err)
    {
        console.log(err)
    }
}

async function addExpenceToList(e)
{
    try
    {
        e.preventDefault();
        const token=localStorage.getItem('token')
        const amount=document.getElementById('expence-amount').value
        const description=document.getElementById('expence-desc').value
        const category=document.getElementById('expence-category').value

        const obj=
        {
            amount,
            description,
            category
        }

        const postExpence=await axios.post('http://localhost:3000/expence/add-expence',obj,{headers:{'Authorization':token}})
          if(globalCount%10 !==0)    
          {
            showExpence(postExpence.data.responce)
          }
    }
    catch(err)
    {
        console.log(err)
    }
}

function showExpence(obj)   
{
    const ul=document.getElementById('ul-list')
    const li=document.createElement('ol')
    
    const delButton=document.createElement('button')
    delButton.appendChild(document.createTextNode('Delete Expence'))
    delButton.classList='btn btn-danger'
    ul.appendChild(li)
    li.innerHTML=obj.expence_amount+" ,"+obj.expence_desc+" ,"+obj.expence_category+" "
    li.appendChild(delButton)
    

    delButton.addEventListener('click',async()=>
    {
        await deleteExpence(obj.id)
        delButton.parentElement.style.display='none'
    })
}

async function deleteExpence(expenceId)
{
    try
    {
        const token=localStorage.getItem('token')
        const deletedExpence=await axios.delete(`http://localhost:3000/expence/delete-expence/${expenceId}`,{headers:{'Authorization':token}})
        alert(deletedExpence.data.responce)
    }
    catch(err)
    {
        console.log(err)
    }
}

const premiumButton=document.getElementById('premium')

    premiumButton.addEventListener('click',premiumSubscription)

    async function premiumSubscription(e)
    {
        try{
            e.preventDefault();
            const token=localStorage.getItem('token')
            console.log("token")
    
            //first step=1
            const paymentData=await axios.get('http://localhost:3000/user/create-order',{headers:{'Authorization':token}})
            console.log("paymentData" , paymentData)  
            var options=
            {
                "key":paymentData.data.key_id,    //Enter key id generated from Dashboard
                "order_id":paymentData.data.order.id,   //order_id for one time payment
                //This handler function handle the success payment 
                "handler": async function(paymentData)    //third step(3) 
                {
                   const premuimUserData= await axios.post('http://localhost:3000/user/updated-transaction-details',
                    {
                        order_id:options.order_id,
                        payment_id:paymentData.razorpay_payment_id
                    },
                    {
                        headers:{'Authorization':token}     //To inform the backend that which user is belongs to this payment
                    })
                    alert("You are Premium User Now")
                    localStorage.setItem('token',premuimUserData.data.token)    //update the token to show premiuim status
                    premiumButton.value='Premium Account'
                }
                
            }
            const rzp1=new Razorpay(options);     //second step(2)       // call server api if payment is succesful than update data at   server side   
            rzp1.open();                                      // open the razorpay frontend page
            e.preventDefault();
    
            rzp1.on('payment failed',async function(paymentData)    //callback function on payment failed
            {
                const paymentfailed=await axios.post('http://localhost:3000/user/failed-transaction-details',
                {
                    order_id:paymentData.data.order.id,
                    payment_id:paymentData.razorpay_payment_id
                },
                {
                    headers:{'Authorization':token}     //To inform the backend that which user is belongs to this payment
                })
                alert("Something Went Wrong")
            });
        }
        catch(err)
        {
            console.log(err)
        }
    }


 

async function showLeaderBoard()
{
    try{
        const div=document.getElementById('LeaderBoard-Div')
        const input=document.createElement('input')
        input.type='button'
        input.value='Show LeaderBoard'
        input.classList='btn btn-secondary'
        div.appendChild(input)
        input.onclick=async()=>
        {
            const token=localStorage.getItem('token')
            const leaderBoardArray=await axios.get('http://localhost:3000/premium/leader-board',{headers:{'Authorization':token}})
            const ul=document.getElementById('leaderBoardlist')
            const li=document.createElement('li')
            ul.innerHTML=`<h2>Leader Board</h2>`
            ul.appendChild(li)
            leaderBoardArray.data.responce.forEach(element => {
                li.innerHTML+=`<li>Name- ${element.name} , Total Expence ${element.total_expence}</li>`
            });
        }
    }
    catch(err)
    {
        console.log(err)
    }
}


function downloadExpenceButton()
{
    const div=document.getElementById('LeaderBoard-Div2')
    const input=document.createElement('input')
    input.type='button'
    input.value='Download Expence'
    input.classList='btn btn-secondary'
    div.appendChild(input)
    input.addEventListener('click',()=>
    {
        downloadExpenceFunction();
    })
}

async function downloadExpenceFunction()
{
   try
   {
    
    const token=localStorage.getItem('token')
    const downloadUrl=await axios.get('http://localhost:3000/expence/download',{headers: {"Authorization" : token}})
      if(downloadUrl.status===201)
      {
        console.log("fileUrl==>>"+downloadUrl.data.url)
        const a=document.createElement('a')
        a.href=downloadUrl.data.url
        a.download=`Expence.txt`
        a.click()
      }
      else
      {
        throw new Error(downloadUrl.responce)
      }
   }
   catch(err)
   {
    console.log(err)
   }
}

async function listOfExpencesButton()
{
    try{
         const div=document.getElementById('expence-url')
         const input=document.createElement('input')
         input.type='button'
         input.value='Expences List'
         input.classList='btn btn-secondary'
         div.appendChild(input)
        input.addEventListener('click',()=>
        {
            downloadExpenceListFunction();
        })
    }
    catch(err)
    {
        console.log(err)
    }
}

async function downloadExpenceListFunction()
{
    try
    {
        
    const token=localStorage.getItem('token')
          const urlList=await axios.get('http://localhost:3000/user/file-url-list',{headers: {"Authorization" : token}})
          if(urlList.status===201)
          {
        console.log(urlList.data.fileList)
          const a=document.createElement('a')
          a.href=urlList.data.fileList
          a.download='urlList.pdf'
          a.click()
          
          }
          else
          {
            throw new Error(urlList.error)
          }
    }
    catch(err)
    {
        console.log(err)
    }
}