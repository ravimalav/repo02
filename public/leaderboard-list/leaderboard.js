window.addEventListener('DOMContentLoaded',async()=>
{const token=localStorage.getItem('token')
                const leaderBoardArray=await axios.get('http://3.7.45.255:3000/premium/leader-board',{headers:{'Authorization':token}})
         
                const lBoardData=document.getElementById('total-expense-table')
                console.log(lBoardData)
                lBoardData.innerHTML+=`<tr></tr>`
    
                leaderBoardArray.data.responce.forEach(element => {
                    // li.innerHTML+=`<li>Name- ${element.name} , Total Expence ${element.total_expence}</li>`
                    tr.innerHTML+=`<th scope="row">${element.id}</th>
                                    <td >${element.name}</td>
                                    <td >${element.total_expence}</td>`
                });
               window.location.href='/leaderboard-list/leaderboard.html'}
)
