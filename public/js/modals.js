$(document).ready(function () {
  // $( "#datepicker" ).datepicker( "option", "showAnim", "fold");
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  $(".datepicker").datepicker({
    format: "yyyy/mm/dd"
  });

  $("#cat_submit").on("click", function () {
    var id = $(this).data("value");
    console.log(id);
    var goal = $("#category_goal").val();
    console.log(parseFloat(goal));
    var name = $("#category_name").val();
    console.log(name);
    var newCategory = {
      name: name,
      budget: goal,
      budgetUsed: 0,
      UserId: id
    }
    $.post("/api/category/new", newCategory).then(function (data) {
      location.reload();
      console.log("category Submitted");
      console.log(data);
    });
  })

  $("#item_submit").on("click", function () {
    const id = $(this).data("value");
    const date = $('.datepicker').val();
    const year = parseInt(date.substr(0, 4));
    const month = parseInt(date.substr(5, 2)) - 1;
    const day = parseInt(date.substr(8, 2));
    const itemName = $("#item-name").val();
    const price = $("#item-price").val();
    const formatDate = new Date(year, month, day);
    const CategoryId = parseInt($("#item-category").val());
    const accountid = $("#remain-budget").data("id");
    const newItem = {
      name: itemName,
      price: price,
      CategoriesId: CategoryId,
      AccountId: accountid,
      orderDate: formatDate,
      UserId: id
    }
    $.post("/api/orders/new", newItem).then(function (data) {
      location.reload();
    });
  })





  $("#account-submit").on("click", function () {
    const amount = $("#accountamount").val();
    const accountid = $("#remain-budget").data("id");
    const UserId = $("#account-submit").data("value")

    $.ajax({
      method: "PUT",
      url: `/api/user/${UserId}/account/${accountid}`,
      data: {
        weeklyBudget: amount
      }
    }).then(() => {
      location.reload()
    })
  })

});