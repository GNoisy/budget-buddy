var express = require("express");
var router = express.Router();
var db = require("../models");
var userSignedIn;

// ~~~~~GET~~~~~~
router.get("/", function (req, res) {
  res.render("landing");
})

router.get("/sign-up", function (req, res) {
  res.render("sign-up");
})

router.get("/user/home", function (req, res) {
  var id = userSignedIn.id;
  var data = {};
  db.Categories.findAll({
      where: {
        UserId: id,
      }
    })
    .then((categories) => {
      var cats = [];
      for (var i = 0; i < categories.length; i++) {
        var cat = {
          name: categories[i].dataValues.name,
          id: categories[i].dataValues.id
        }
        cats.push(cat);
      }

      data.categories = cats;
      db.Users.findOne({
        where: {
          id: userSignedIn.id
        }
      }).then(function (user) {
        data.username = user.dataValues.username;
        data.userId = user.dataValues.id;
        console.log(data);
        // res.render("index", data);
        db.Account.findAll({
          limit: 1,
          order: [
            ["createdAt", "DESC"]
          ],
          where: {
            UserId: userSignedIn.id
          }
        }).then(async (results) => {
          console.log(results);
          let accountData = await checkAndCreateAccount(results);
          console.log(accountData);
          data.accountId = accountData[0].id;
          data.weeklyBudget = accountData[0].weeklyBudget;
          data.weeklyBudgetUsed = accountData[0].weeklyBudgetUsed;
          data.budgetRemaining = parseFloat(accountData[0].weeklyBudget) - parseFloat(accountData[0].weeklyBudgetUsed);
          res.render("index", data)
        })
      })
    })
})

router.get("/user/sign-out", function (req, res) {
  res.render("landing");

})

router.get("/calendar", function (req, res) {

  res.render("calendar", userSignedIn);
})

// get all information on a user
router.get("/api/user/:id", (req, res) => {
  // get ID from request
  const id = req.params.id;
  // find user with ID
  db.Users.findOne({
      where: {
        id: id
      }
    })
    .then((users) => {
      res.json(users)
    })
})

router.get("/calendar", function (req, res) {
  res.render("calendar");
})

// get all orders from a user. 
router.get("/api/user/:id/orders", (req, res) => {
  // get ID from request
  const id = req.params.id;
  // find user with ID
  db.Users.findOne({
      where: {
        id: id
      },
      include: [db.Orders]

    })
    .then((data) => {
      res.json(data)
    })
})

// get all orders from a user in ascending order. 
router.get("/api/user/:id/orders/asc", (req, res) => {
  // get ID from request
  const id = req.params.id;
  // find user with ID
  db.Orders.findAll({
      order: [
        ["orderDate", "ASC"]
      ],
      where: {
        UserId: id
      }

    })
    .then((data) => {
      res.json(data)
    })
})


// Get orders/items from a specific user for a specific category
router.get("/api/categories/:categoryID", (req, res) => {
  // get ID from request
  const categoryID = parseInt(req.params.categoryID);
  // find user with ID
  db.Categories.findAll({
      where: {
        id: categoryID
      },
      include: [db.Orders]
    })
    .then((data) => {
      res.json(data)
    })
})


router.get("/view/categories/:id", function (req, res) {
  var userId = req.params.id;
  var data = {};
  db.Categories.findAll({
      where: {
        UserId: userId,
      }
    })
    .then((categories) => {
      console.log(categories)
      var cats = [];
      for (var i = 0; i < categories.length; i++) {
        var cat = {
          name: categories[i].dataValues.name,
          budget: categories[i].dataValues.budget,
          budgetUsed: categories[i].dataValues.budgetUsed,
          id: categories[i].dataValues.id
        }
        cats.push(cat);
      }
      data.categories = cats
      console.log(data);
      res.render("category", data);
    })
})

router.get("/view/orders/:id", function (req, res) {
  var userId = req.params.id;
  var data = {};
  db.Categories.findAll({
      where: {
        UserId: userId,
      }
    })
    .then((categories) => {
      console.log(categories)
      var cats = [];
      for (var i = 0; i < categories.length; i++) {
        var cat = {
          name: categories[i].dataValues.name,
          budget: categories[i].dataValues.budget,
          budgetUsed: categories[i].dataValues.budgetUsed,
          id: categories[i].dataValues.id
        }
        cats.push(cat);
      }
      data.categories = cats
      res.render("orders", data);
    })

})

// get a specific catefory for a user category
router.get("/api/user/:id/category/:categoryID", (req, res) => {
  // get ID from request
  const id = req.params.id;
  const categoryID = parseInt(req.params.categoryID);
  // find user with ID
  db.Categories.findAll({
      where: {
        UserId: id,
        id: categoryID
      }
    })
    .then((data) => {
      res.json(data)
    })
})

//  Get all categories for a particular user
router.get("/api/user/:id/category", (req, res) => {
  // get ID from request
  const id = req.params.id;
  db.Categories.findAll({
      where: {
        UserId: id
      }
    })
    .then(data => {
      res.json(data)
    })
})


function checkAndCreateAccount(oldAccount) {

  if (oldAccount.length === 0 || oldAccount === undefined) {
    const startingDate = new Date();
    const endingDate = new Date(startingDate.getTime())
    endingDate.setDate(endingDate.getDate() + 7)

    db.Account.create({
      weeklyBudget: 1000,
      startingDate: startingDate,
      endingDate: endingDate,
      UserId: userSignedIn.id
    }).then((data) => {
      console.log("DATA FROM checkandCreateAccount: ", data);
      let result = []
      result.push(data.dataValues)
      console.log("RESULTS FROM checkandCreateAccount: ", result);
      return result;
    })
  } else if (new Date(oldAccount.endingDate).getTime() < Date.now()) {
    let {
      weeklyBudget,
      UserId
    } = oldAccount;

    const startingDate = new Date();
    const endingDate = new Date(startingDate.getTime())
    endingDate.setDate(endingDate.getDate() + 7)

    db.Account.create({
      weeklyBudget,
      startingDate,
      endingDate,
      UserId
    }).then((data) => {
      let result = []
      result.push(data)
      return result;
    })
  } else return oldAccount
}
// get the most recent account for a user
// can be used to get balance remainaing for the remainder of the week
// get total allowance for a week
router.get("/api/user/:id/account", (req, res) => {
  const id = req.params.id;
  db.Account.findAll({
    limit: 1,
    order: [
      ["createdAt", "DESC"]
    ],
    where: {
      UserId: id
    }
  }).then(data => {
    // check if ending date is passed
    console.log(data);
    if (!data.length) return -1;
    const oldAccount = data[0];
    res.json(checkAndCreateAccount(oldAccount))
  })
})

router.get("/api/account/:accountId/orders", (req, res) => {
  const accountId = req.params.accountId;

  db.Orders.findAll({
    where: {
      AccountId: accountId
    }
  }).then(data => {
    res.json(data)
  })
})

// ~~~~~POST~~~~~~
// create a new user
router.post("/user/new", (req, res) => {
  var newUser = req.body;
  console.log(newUser);
  db.Users.create({
    id: newUser.id,
    email: newUser.email,
    name: newUser.displayName,
    username: newUser.displayName
  }).then((user) => {
    console.log("success");
    userSignedIn = user;
    // res.send(newUser)
    res.end();
  })
})

// add a order for a user and updating the Account budget and category budget
router.post("/api/orders/new", (req, res) => {

  // get order details. INCLUDE USER ID.
  let {
    name,
    price,
    orderDate,
    UserId,
    CategoriesId,
    AccountId
  } = req.body
  db.Orders.create({
      name,
      price,
      orderDate,
      UserId,
      CategoryId: CategoriesId,
      AccountId
    })
    .then((data) => {
      addAmountToField("category", CategoriesId, price)
      addAmountToField("account", AccountId, price)
      res.json(data);
    });
})

function addAmountToField(table, id, amount) {
  if (typeof amount != "number") amount = parseFloat(amount);
  if (typeof id != "number") id = parseFloat(id);

  switch (table) {
    case "category":
      db.Categories.findOne({
        where: {
          id: id
        }
      }).then(data => {
        let {
          id,
          name,
          budget,
          budgetUsed
        } = data
        budgetUsed = parseFloat(budgetUsed) + amount
        let updatedCategory = {
          name,
          budget,
          budgetUsed
        }
        db.Categories.update(updatedCategory, {
          where: {
            id: id
          }
        }).then(() => console.log("Category updated"))
      })
      break;
    case "account":
      db.Account.findOne({
        where: {
          id: id
        }
      }).then(data => {
        let {
          id,
          weeklyBudget,
          weeklyBudgetUsed
        } = data;
        weeklyBudgetUsed = parseFloat(weeklyBudgetUsed) + amount;

        let updatedAccount = {
          weeklyBudget,
          weeklyBudgetUsed
        }

        db.Account.update(updatedAccount, {
          where: {
            id: id
          }
        }).then(() => {
          console.log("Account updated");
        })
      })
      break;
    default:
      break;
  }
}
// add a new category for a user 
router.post("/api/category/new", (req, res) => {
  const category = req.body;
  console.log(category);
  let {
    name,
    budget,
    budgetUsed,
    UserId
  } = category;

  db.Categories.create({
    name,
    budget,
    budgetUsed,
    UserId

  }).then((data) => {
    res.json(data);
  })
})

// Add a new account for a user 
router.post("/api/account/new", (req, res) => {
  const newAccount = req.body;
  let {
    weeklyBudget,
    UserId
  } = newAccount;
  const startingDate = new Date();
  const endingDate = new Date(startingDate.getTime())
  endingDate.setDate(endingDate.getDate() + 7)

  db.Account.create({
    weeklyBudget,
    startingDate,
    endingDate,
    UserId
  }).then((data) => {
    res.json(data);
  })

})

router.post("/user", function (req, res) {
  userSignedIn = req.body;
  console.log(userSignedIn);
  res.redirect("/user/home");
})

// ~~~~~UPDATE~~~~~~

// update the budget for a category (budget total / budget Used)
router.put("/api/categories/:categoryID", (req, res) => {
  const CategoryId = parseInt(req.params.categoryID);
  let updatedCategory = req.body;

  db.Categories.update(updatedCategory, {
    where: {
      id: CategoryId
    }
  }).then(data => res.send(data))
})


// Update Account information (weeklyBudgetUsed)
router.put("/api/user/:id/account/:accountId", (req, res) => {
  const UserId = req.params.id;
  const accountId = parseInt(req.params.accountId);
  let updatedAccount = req.body;
  console.log(updatedAccount);
  db.Account.update(updatedAccount, {
    where: {
      UserId: UserId,
      id: accountId
    }
  }).then(data => res.send(data))
})

// Update Order Information
router.put("/api/order/:orderId", (req, res) => {
  const orderId = parseInt(req.params.accountId);
  let updatedOrder = req.body;

  db.Orders.update(updatedOrder, {
    where: {
      id: orderId
    }
  }).then(data => res.send(data))
})

// ~~~~~DELETE~~~~~~
// delete a Category
router.delete("/api/category/:categoryid/delete", (req, res) => {
  const categoryId = parseInt(req.params.categoryid);

  db.Categories.destroy({
    where: {
      id: categoryId
    }
  }).then(() => res.send(200))
})

// delete a order and update budget for category and account
router.delete("/api/order/:orderid/delete", (req, res) => {
  const orderId = parseInt(req.params.orderid);
  db.Orders.findOne({
    where: {
      id: orderId
    }
  }).then(function (data) {
    var accountId = data.AccountId;
    var categoryId = data.CategoryId;
    var price = data.price * -1;
    addAmountToField("account", accountId, price);
    addAmountToField("category", categoryId, price);
    db.Orders.destroy({
      where: {
        id: orderId
      }
    }).then(() => res.send(200))
  })
})

// delete a account
router.delete("/api/account/:accountid/delete", (req, res) => {
  const accountId = parseInt(req.params.accountid);

  db.Account.destroy({
    where: {
      id: accountId
    }
  }).then(() => res.send(200))
})

// delete a user
router.delete("/api/user/:userid/delete", (req, res) => {
  const userId = parseInt(req.params.userid);

  db.Users.destroy({
    where: {
      id: userId
    }
  }).then(() => res.send(200))
})
module.exports = router;