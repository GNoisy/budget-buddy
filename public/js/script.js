/* THIS IS ALL HARD CODED EXAMPLES ON HOW TO USE THE API ROUTES


::NOTES:: 

Some how all these routes only work on the landing page. Not sure why, but its probably something simple that I cannot see right now. 
*/

// Create a new user 
// const newUser = {
//     id: "100", // THIS is referring to userID, not the auto_incremented ID
//     email: "email",
//     displayName: "name1"
// }

// $.post("/user/new", newUser).then((data) => {
//     console.log("User entered");
//     console.log(data);
// })

// Get a user by ID
// const id = "100"; // THIS is referring to auto_incremented ID, NOT userID. Can be quickly changed in api-routes later on. 
// $.get("/api/user/" + id, data => {
//     console.log(data);
// })


// Create a new category for a specific user
const newCategory = {
    name: "Health",
    budget: 100.00,
    budgetUsed: 20.00,
    UserId: "100"
}

// $.post("/api/category/new", newCategory).then((data) => {
//     console.log("Category entered");
//     console.log(data);
// })

// create a new Account for the user
const newAccount = {
    weeklyBudget: 1000,
    endingDate: new Date(2020, 8, 20), // month is 0 indexed so 08 -> 09
    UserId: "100"
}

// $.post("/api/account/new", newAccount).then((data) => {
//     console.log("Account Added");

//     console.log(data);
// })

// create a new order for a user 
const newOrder = {
    name: "Shampoo",
    price: 10,

    orderDate: new Date(2020, 07, 31),
    UserId: "100",
    CategoriesId: 1,
    AccountId: 1
}

// $.post("/api/orders/new", newOrder).then(data => {
//     console.log("Order Added");
//     console.log(data);
// })

// $.post("/api/orders/new", newOrder).then(data => {
//     console.log("Order Added");
//     console.log(data);
// })

// // Get orders/ items from a specific user
// $.get("/api/user/100/categories/1").then((data) => {
//     console.log("ORDER DATA: ", data);
// })

// get remaining balance from week
// $.get("/api/user/100/account").then((data) => {
//     console.log("ACCOUNT WEEKLY USED BUDGET: ", data);
// })

// $.ajax({
//     method: "DELETE",
//     url: "/api/category/1/delete"
// }).then(data => console.log("UPDATED: ", data))