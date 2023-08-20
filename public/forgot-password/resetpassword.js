const button=document.getElementById("button")

button.addEventListener('click',sendMail)

async function sendMail(e)
{
   try{
    e.preventDefault();
    const email=document.getElementById('reset-email').value
    
    const postData=await axios.post('http://3.7.45.255:3000/password/forgotpassword',{email})
      if(postData.data.success===true)
      {
         alert(postData.data.message)
         console.log(postData.data.token)
         document.body.innerHTML+=`<div style="color:red;">Mail Sent SuccessFully</div>`
         window.location.href='../login/login.html'
      }
     else
     {
       throw new Error (postData.data.message)
     }
   }
   catch(err)
   {
    document.body.innerHTML+=`<div style="color:red;">${err}</div>`
   }
}