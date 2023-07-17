const button=document.getElementById("button")

button.addEventListener('click',signupData)

async function signupData(e)
{
   try{
    e.preventDefault();
    const username=document.getElementById('username').value
    const useremail=document.getElementById('useremail').value
    const userpass=document.getElementById('userpass').value
    const obj=
    {
        username,
        useremail,
        userpass
    }
    const postData=await axios.post('http://localhost:3000/user/signup',obj)
      if(postData.data.success===true)
      {
         alert(postData.data.responce)
         console.log(postData.data.token)
         localStorage.setItem('token',postData.data.token)
         window.location.href='../add-expence/addExpance.html'
      }
     else
     {
       throw new Error (postData.data.responce)
     }
   }
   catch(err)
   {
      showMessage(err)
   }
}

function showMessage(message)
{
   const ul=document.getElementById('list')
   const li=document.createElement('li')
   li.innerHTML=message
   ul.appendChild(li)
}