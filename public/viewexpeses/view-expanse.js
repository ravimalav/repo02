

//pagination
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
    console.log("pagination block")
    for (let i = 1; i < lastPage; i++) {
        const pageLink = document.createElement('span');
        pageLink.className = 'pagination-link';
        pageLink.innerText = i;
        pageLink.addEventListener('click', () => {
          currentPage = i;
          document.querySelector('#t-body').innerHTML=""
          getExpence(currentPage);
        });
        paginationContainer.appendChild(pageLink);
      }
    }

async function getExpenseFunction(page)
{
    try
    {
        const token=localStorage.getItem('token')
        const raws=localStorage.getItem('rawsPerPage')
        const getListItems=await axios.get(`http://3.7.45.255:3000/expence/get-expence?page=${page}`,{headers:{'Authorization':token,'Rawsperpage':raws}})
        for(let i=0;i<getListItems.data.responce.length;i++)
        {
             showExpence(getListItems.data.responce[i])
        }
        showPagination(getListItems.data)   
    }
    catch(err)
    {
        console.log(err)
    }
}


window.addEventListener('DOMContentLoaded',async()=>
{
    const page=1;  
    getExpenseFunction(page);
})

async function getExpence(page)
{
    getExpenseFunction(page);
}


function showExpence(obj)   
{
    const tBody=document.getElementById('t-body')
    const tr=document.createElement('tr')
    
    const delButton=document.createElement('button')
    delButton.appendChild(document.createTextNode('Delete Expense'))
    delButton.classList='btn btn-danger'
    tBody.appendChild(tr)
    tr.innerHTML=`<th scope="row">${obj.id}</th>
    <td >${obj.expence_amount}</td>
    <td >${obj.expence_desc}</td>
    <td >${obj.expence_category}</td>
    <td ></td>`
    tr.lastChild.appendChild(delButton)
    

    delButton.addEventListener('click',async()=>
    {
        await deleteExpence(obj.id)
        delButton.parentElement.parentElement.style.display='none'
    })
}

async function deleteExpence(expenceId)
{
    try
    {
        const token=localStorage.getItem('token')
        const deletedExpence=await axios.delete(`http://3.7.45.255:3000/expence/delete-expence/${expenceId}`,{headers:{'Authorization':token}})
        alert(deletedExpence.data.responce)
    }
    catch(err)
    {
        console.log(err)
    }
}
