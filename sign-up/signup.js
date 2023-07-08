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
      showMessage(postData.data.responce)
   }
   catch(err)
   {
      showMessage("something went wrong with sign up data")
   }
}

function showMessage(message)
{
   const ul=document.getElementById('list')
   const li=document.createElement('li')
   li.innerHTML=message
   ul.appendChild(li)
}