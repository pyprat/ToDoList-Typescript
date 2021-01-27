"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TodoItem_1 = require("./TodoItem");
const jsonTodoCollection_1 = require("./jsonTodoCollection");
const inquirer = require("inquirer");
let todos = [
    new TodoItem_1.TodoItem(1, "Buy Flowers"), new TodoItem_1.TodoItem(2, "Get Shoes"),
    new TodoItem_1.TodoItem(3, "Collect Tickets"), new TodoItem_1.TodoItem(4, "Call Joe", true)
];
let collection = new jsonTodoCollection_1.JSONTodoCollection("Adam", todos);
let showCompleted = true;
function displayTodoList() {
    console.clear();
    console.log(`${collection.userName}'s Todo List` + `(${collection.getItemCounts().incompletedTask} items to do)`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Add Task";
    Commands["Complete"] = "Mark Completed Tasks";
    Commands["Toggle"] = "Hide/Show Completed";
    Commands["Purge"] = "Remove Completed Tasks";
    Commands["Quit"] = "Quit";
})(Commands || (Commands = {}));
function promptAdd() {
    console.clear();
    inquirer.prompt({
        type: "input",
        name: "add",
        message: "Enter a task: ",
    }).then(answers => {
        if (answers["add"] !== "") {
            collection.addTodo(answers["add"]);
        }
        promptUser();
    });
}
function promptCompleted() {
    console.clear();
    inquirer.prompt({
        type: "checkbox",
        name: "complete",
        message: "Mark completed tasks: ",
        choices: collection.getTodoItems(showCompleted).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        })),
    }).then(answers => {
        let completedTask = answers["complete"];
        collection.getTodoItems(true).forEach(item => collection.markComplete(item.id, completedTask.find(id => id === item.id) != undefined));
        promptUser();
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands),
    }).then(answers => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incompletedTask > 0) {
                    promptCompleted();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    });
}
promptUser();
