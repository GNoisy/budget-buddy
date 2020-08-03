$(document).ready(function () {
    
    $("#search-item-category").on("change", () => {
        $("#items-table").empty();
        const categoryID = $("#search-item-category").val()
        $.get(`/api/categories/${categoryID}`).then( (results) => {
        const orders = results[0].Orders
        console.log(typeof orders[0].price);
        let table = `
        <table> 
            <thead>
            <tr>
                <th>Item Name</th>
                <th>Order Date</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>`;


            orders.forEach(order => {
            const row = `
            <tr>
                <td>${order.name}</td>
                <td>${order.orderDate.slice(0,10)}</td>
                <td>$${order.price}</td>
                <td><button class = "waves-effect waves-light btn white modal-trigger blue-text text-darken-2 delete-order" data-value = "${order.id}">Delete Order</td>
            </tr>`
            table += row
            });
            table += `</tbody></table>`
        $("#items-table").append(table)
        })
    })
    
})

$(document).on("click",".delete-order",function(){
    var orderId = $(this).data("value");
    console.log("hello");
    var route = "/api/order/" + orderId + "/delete";
    console.log(route);
    $.ajax({
        method: "DELETE",
        url: route
    }).then(function(response){
        console.log(response);
        location.reload()
    });
})