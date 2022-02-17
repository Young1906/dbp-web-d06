import { TodoItem, TodoList } from "./todo.js";
import { d } from "./fn.js";

class App {
    
    $container
    

    constructor(){
        this.$container = d("app-container");
        // this.todoItem = new TodoItem();

        let todoList = new TodoList();
        this.$container.appendChild(todoList.render())
    }

    render(){
        // this.$container.appendChild(this.todoItem.render());
        return this.$container
    }

    
}

export {
    App
}