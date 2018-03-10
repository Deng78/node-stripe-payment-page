const output = document.getElementById('output');
function getCustomers(){
    axios.get('/customers')
    .then(res =>{
        let data = res.data;
        data.forEach(customer => {
            output.innerHTML += `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.createdAt}</td>
            </tr>
            `;
        });
    })
}
function getTransactions(){
    axios.get('/transactions')
    .then(res =>{
        let data = res.data;
        data.forEach(customer => {
            output.innerHTML += `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.customerID}</td>
                <td>${customer.product}</td>
                <td>$${(customer.amount/100).toFixed(2)} ${customer.currency.toUpperCase()}</td>
                <td>${customer.createdAt}</td>
            </tr>
            `;
        });
    })
}
