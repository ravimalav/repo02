const logButton=document.getElementById('button')
logButton.addEventListener('click',userLogIn)


async function userLogIn(event)
{
   try
   {
    console.log("try block of frontend")
    event.preventDefault();
    const email=document.getElementById('log-email').value
    const password=document.getElementById('log-password').value
    const obj=
    {
        email,
        password
    }
     
    const logInData=await axios.post('http://localhost:3000/user/login',obj)
      alert(logInData.data.responce)
      localStorage.setItem('token',logInData.data.token)
      window.location.href='../add-expence/addExpance.html'
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
     ul.appendChild(li);
}