const addExpenceButton=document.getElementById('expence-button')
addExpenceButton.addEventListener('click',addExpenceToList)
const logoutBtn=document.querySelector('#logout-btn')

logoutBtn.addEventListener('click',()=>
{
    localStorage.clear();
})

//to decode jwt token at front End side
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const select=document.getElementById('raws-per-page')
select.addEventListener('change',()=>
{
    const rawsPerPage=document.getElementById('raws-per-page').value 
    localStorage.setItem('rawsPerPage',rawsPerPage)
})




window.addEventListener('DOMContentLoaded',async()=>
{
    
    try{
        const token=localStorage.getItem('token')
        const checkPremiumStatus=parseJwt(token).isPremiumUser
        if(checkPremiumStatus===true) 
        {
            premiumButton.innerHTML='Premium User'
            const div=document.getElementById('outer')
            div.innerHTML+=`<button class="HomePageButtons lBoard" id="leaderBoard-btn"><a>LeaderBoard</a></button>
             <button class="HomePageButtons" id="downloadExpense-btn"><a>Download Expenses</a></button>
            <button class="HomePageButtons" id="downloadExpense-List"><a>Expenses List</a></button>`
            showLeaderBoard();
            downloadExpenceButton();
            listOfExpencesButton();
        }
    }
    catch(err){
        console.log(err)
    }
})

// post expence request

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
          
            alert('Successfully Added New Expense!');
        
    }
    catch(err)
    {
        console.log(err)
    }
}

// purchasing premium subscription

const premiumButton=document.getElementById('premium-btn')

    premiumButton.addEventListener('click',premiumSubscription)

    async function premiumSubscription(e)
    {
        try{
            e.preventDefault();
            const token=localStorage.getItem('token')
            console.log("token")

            //first step=1
            const paymentData=await axios.get('http://localhost:3000/user/create-order',{headers:{'Authorization':token}})
            
            var options=
            {
                "key":paymentData.data.key_id,    //Enter key id generated from Dashboard
                "order_id":paymentData.data.order.id,   //order_id for one time payment
                //This handler function handle the success payment 
                "handler": async function(paymentData)    //third step(3) ()third party is razorpay
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
                    premiumButton.innerHTML='Premium User'
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


//  leader board table

async function showLeaderBoard()
{
    try{
        document.addEventListener('click',async(event)=>
        {
            if (event.target.closest('.lBoard'))
            {
                const token=localStorage.getItem('token')
                const leaderBoardArray=await axios.get('http://localhost:3000/premium/leader-board',{headers:{'Authorization':token}})
         
                const lBoardTable=document.querySelector('.table')
                lBoardTable.innerHTML=` <thead class="table-dark">
                <tr>
                  <!-- <th scope="col">Id</th> -->
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Total Expense</th>
                </tr>
              </thead>
              <tbody id="total-expense-table">
              </tbody>`
               
                // lBoardData.innerHTML+=`<tr></tr>`
                const lBoardData=document.getElementById('total-expense-table')
                leaderBoardArray.data.responce.forEach(element => {
                
                    lBoardData.innerHTML+=`<tr>
                                    <th scope="row">${element.id}</th>
                                    <td >${element.name}</td>
                                    <td >${element.total_expence}</td>
                                    </tr>`
                });
         
            }
           
        })
    }
    catch(err)
    {
        console.log(err)
    }
}


function downloadExpenceButton()
{

    const input=document.getElementById('downloadExpense-btn')
    input.addEventListener('click',(event)=>
    {
        if(event.target.closest('#downloadExpense-btn'))
        {
            downloadExpenceFunction();
        }
        
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
    const input=document.getElementById('downloadExpense-List')
        input.addEventListener('click',(event)=>
        {
            if(event.target.closest('#downloadExpense-List'))
            {
                downloadExpenceListFunction();
            }
            
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
        console.log(urlList.data.url)
          const a=document.createElement('a')
          a.href=urlList.data.url
          a.download='urlList.txt'
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