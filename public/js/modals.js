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
      console.log("category Submitted");
      console.log(data);
    });
  })

  $("#item_submit").on("click", function () {
    const id = $(this).data("value");
    console.log(id);
    const date = $('.datepicker').val();
    console.log(date);
    const year = parseInt(date.substr(0, 4));
    console.log(year);
    const month = parseInt(date.substr(5, 2)) - 1;
    console.log(month);
    const day = parseInt(date.substr(8, 2));
    console.log(day);
    const itemName = $("#item-name").val();
    console.log(itemName);
    const price = $("#item-price").val();
    console.log(parseFloat(price));
    const formatDate = new Date(year, month, day);
    const CategoryId = $("#item-category").val();
    console.log(typeof CategoryId);
    console.log(formatDate);
    const newItem = {
      name: itemName,
      price: price,
      CategoryId: parseInt(CategoryId),
      AccountId: 1,
      orderDate: formatDate,
      UserId: id
    }
    $.post("/api/orders/new", newItem).then(function (data) {
      console.log("order Submitted");
      console.log(data);
    });
  })
});