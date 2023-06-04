const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const { isNull } = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost:27017/ToDoList");
mongoose.connect(
  "mongodb+srv://Humza1011:Humza118056@cluster1.bgb1fvt.mongodb.net/ToDoList?retryWrites=true&w=majority"
);

const itemSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo list",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<== Press this to delete an item",
});
const itemArr = [item1, item2, item3];

const itemListSchema = mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const ItemList = mongoose.model("ItemList", itemListSchema);

// HOME ROUTE

app.get("/", function (req, res) {
  let day = date.getDate();
  ItemList.findOne({ name: "Today" }, function (err, dbItem) {
    if (!err) {
      if (isNull(dbItem)) {
        const itemList = new ItemList({
          name: "Today",
          items: itemArr,
        });
        itemList.save();
        res.status(200).redirect("/");
      } else {
        res.status(200).render("list", {
          listTitle: day,
          NewItem: dbItem.items,
          route: "/",
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  let item = req.body.toDoItem.trim();
  if (item != "") {
    let inputItem = { name: item };
    ItemList.findOne({ name: "Today" }, function (err, dbItems) {
      dbItems.items.push(inputItem);
      dbItems.save();
      res.redirect("/");
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  // CHECKS IF LIST NAME IS A VALID DATE OR NOT
  if (isNaN(Date.parse(listName))) {
    // ItemList.findOne({ name: listName }, function (err, dbItem) {
    //   dbItem.items = dbItem.items.filter(
    //     (element) => element.id !== checkedItemId
    //   );
    //   dbItem.save();
    //   res.redirect("/" + listName);
    // });

    // USING PULL __ SHORT AND EFFICIENT
    ItemList.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, dbItem) {
        res.redirect("/" + listName);
      }
    );
  } else {
    // ItemList.findOne({ name: "Today" }, function (err, dbItem) {
    //   dbItem.items = dbItem.items.filter(
    //     (element) => element.id !== checkedItemId
    //   );
    //   dbItem.save();
    //   res.redirect("/");
    // });

    // USING PULL __ SHORT AND EFFICIENT
    ItemList.findOneAndUpdate(
      { name: "Today" },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, dbItem) {
        res.redirect("/");
      }
    );
  }
});

// CUSTOM ROUTE
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  ItemList.findOne({ name: customListName }, function (err, dbItem) {
    if (!err) {
      if (dbItem == null) {
        const itemList = new ItemList({
          name: customListName,
          items: itemArr,
        });
        ItemList.insertMany([itemList], function (err) {
          if (!err) {
            console.log("Successfully inserted items in itemList");
          }
        });
        res.redirect("/" + customListName);
      } else {
        if (!err) {
          res.render("list", {
            listTitle: customListName,
            NewItem: dbItem.items,
            route: "/" + customListName,
          });
        }
      }
    }
  });
});

app.post("/:customListName", function (req, res) {
  const customListName = req.params.customListName;
  let item = req.body.toDoItem.trim();
  if (item != "") {
    let inputItem = { name: item };
    ItemList.findOne({ name: customListName }, function (err, dbItems) {
      dbItems.items.push(inputItem);
      dbItems.save();
      res.redirect("/" + customListName);
    });
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is Started.");
});
