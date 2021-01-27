import { TodoItem } from './TodoItem';
import { TodoCollection } from "./TodoCollection";
import { JSONTodoCollection } from "./jsonTodoCollection";
import * as inquirer from "inquirer";


let todos: TodoItem[] = [
    new TodoItem(1, "Buy Flowers"), new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"), new TodoItem(4, "Call Joe", true)];

let collection: TodoCollection = new JSONTodoCollection("Adam", todos);

let showCompleted = true;

function displayTodoList(): void {
    console.clear();
    console.log(`${collection.userName}'s Todo List` + `(${collection.getItemCounts().incompletedTask} items to do)`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
    Add = "Add Task",
    Complete = "Mark Completed Tasks",
    Toggle = "Hide/Show Completed",
    Purge = "Remove Completed Tasks",
    Quit = "Quit",
}

function promptAdd(): void {
    console.clear();
    inquirer.prompt({
        type: "input",
        name: "add",
        message: "Enter a task: ",
    }).then(answers => {
        if(answers["add"] !== ""){
            collection.addTodo(answers["add"]);
        }

        promptUser();
    })
}

function promptCompleted(): void {
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
        let completedTask = answers["complete"] as number[];
        
        collection.getTodoItems(true).forEach(item =>
            collection.markComplete(item.id, completedTask.find(id => id === item.id) != undefined)
        );
        
        promptUser();
    })
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands),
    }).then(answers => {
       switch(answers["command"]){
           case Commands.Toggle: 
                showCompleted = !showCompleted;
                promptUser();
                break;

            case Commands.Add: 
                promptAdd();
                break;

            case Commands.Complete: 
                if(collection.getItemCounts().incompletedTask > 0) {
                    promptCompleted();
                } else {
                    promptUser()
                }
                break;
            
            case Commands.Purge: 
                collection.removeComplete();
                promptUser();
                break;
       }
    })
}

promptUser();