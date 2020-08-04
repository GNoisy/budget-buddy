$(document).ready(function () {
    const id = $("#my-roadmap").data("id");
    $.get(`/api/user/${id}/orders/asc`).then(data => {
        // const orders = data.Orders;
        const events = [];
        console.log(data);
        data.forEach(order => {
            const date = order.orderDate.slice(0, 10);
            const content = order.name;
            const price = order.price;
            events.push({
                date: date,
                content: content + ` <small>Price: $${price}</small?`
            })
        });

        $('#my-roadmap').roadmap(events, {
            eventsPerSlide: 8,
            slide: 1,
            prevArrow: '<i class="material-icons">keyboard_arrow_left</i>',
            nextArrow: '<i class="material-icons">keyboard_arrow_right</i>',
            onBuild: function() {
            }
        });

    })
});