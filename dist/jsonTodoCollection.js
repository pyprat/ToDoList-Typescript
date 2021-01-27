"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONTodoCollection = void 0;
const TodoItem_1 = require("./TodoItem");
const TodoCollection_1 = require("./TodoCollection");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
/* The type definition for Lowdb uses a schema to describe
the structure of the data that will be stored,
which is then applied using generic type arguments so
that the TypeScript compiler can check the data
types being used. */
class JSONTodoCollection extends TodoCollection_1.TodoCollection {
    constructor(userName, todoItems = []) {
        super(userName, []);
        this.userName = userName;
        this.database = lowdb(new FileSync("ToDo.json"));
        if (this.database.has("tasks").value()) {
            let dbItems = this.database.get("tasks").value();
            dbItems.forEach(item => this.itemMap.set(item.id, new TodoItem_1.TodoItem(item.id, item.task, item.complete)));
        }
        else {
            this.database.set("task", todoItems).write();
            todoItems.forEach(item => this.itemMap.set(item.id, item));
        }
    }
    addTodo(task) {
        let result = super.addTodo(task);
        this.storeTasks();
        return result;
    }
    markComplete(id, complete) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
    storeTasks() {
        this.database.set("tasks", [...this.itemMap.values()]).write();
    }
}
exports.JSONTodoCollection = JSONTodoCollection;
