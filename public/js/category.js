$(document).ready(function () {
   
    $('.modal').modal();

    $(".cat-modal-trig").on("click",function(){
        var catId = $(this).data("value");
        console.log(catId);
    })
    $(".update-cat-submit").on("click",function(){
        var catId = $(this).data("value");
        console.log(catId);
        var target = "#update-category-budget"+catId;
        var newBudget = $(target).val();
        console.log(newBudget);
        $.ajax({
            method: "PUT",
            url: "/api/categories/" + catId,
            data: {
                budget: newBudget,
            }
        }).then(data => {
            console.log("UPDATED: ", data)
            location.reload();
        })
    })

    $(".delete-cate").on("click", function() {
        var catId = $(this).data("value");
        console.log(catId);

        $.ajax({
            method: "DELETE",
            url: `/api/category/${catId}/delete`
        }).then(() => location.reload())
    })

})