const loginText = document.querySelector(".title-text .login");
      const loginForm = document.querySelector("form.login");
      const loginBtn = document.querySelector("label.login");
      const signupBtn = document.querySelector("label.signup");
      const signupLink = document.querySelector("form .signup-link a");
      const pageTitle=document.querySelector('#page-title')
      signupBtn.onclick = (()=>{
         pageTitle.textContent='Signup'
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
      });
      loginBtn.onclick = (()=>{
         pageTitle.textContent='Login'
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
      });
      signupLink.onclick = (()=>{
         pageTitle.textContent='Signup'
        signupBtn.click();
        return false;
      });


//sign up and log in page js code      
const button=document.getElementById("signup-btn")

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
    const postData=await axios.post('http://3.7.45.255:3000/user/signup',obj)
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


const loginButton=document.getElementById("login-btn")

loginButton.addEventListener('click',userLogIn)
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
     
    const logInData=await axios.post('http://3.7.45.255:3000/user/login',obj)
      alert(logInData.data.responce)
      localStorage.setItem('token',logInData.data.token)
      window.location.href='../add-expence/addExpance.html'
   }

   catch(err)
   {
      showLoginMessage(err)
   }

}


function showLoginMessage(message)
{
     const ul=document.getElementById('list')
     const li=document.createElement('li')
     li.innerHTML=message
     ul.appendChild(li);
}