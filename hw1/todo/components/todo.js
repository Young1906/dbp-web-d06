import { d, btn, icn, uuidv4 } from "./fn.js"

class TodoItem {
    $container;
    $title;
    $description;
    $date;

    data = {
        id: null,
        title: null,
        desc: null,
        date: null,
        is_done: false
    };

    // Initially, dont let user edit content of todoItem
    is_editable = false;
    is_collapsed = true

    // btn: Edit, Detail, Delete, Done
    $editBtn;
    $collapseBtn;
    $delBtn;
    $doneBtn;

    // btn Container
    $btnContainer;

    constructor(item_data){
        
        this.$container     = d("todoItem-container");
        this.$title         = d("todoItem-title");
        
        this.$description   = d("todoItem-desc");
        this.$description.classList.add("collapsed");

        this.$date          = document.createElement("input")
        this.$date.type     = "date";
        // this.$date.value    = "2022-01-01";
        this.$date.classList.add("todoItem-date");
        this.$date.disabled = true;

        // Btn Part
        this.$btnContainer  = d("todoItem-btnContainer");
        this.$editBtn       = btn("todoItem-btn", null, "edit");
        this.$collapseBtn   = btn("todoItem-btn", null, "expand_more");
        this.$delBtn        = btn("todoItem-btn", null, "delete");
        this.$doneBtn       = btn("todoItem-btn", null, "done");

        if (!item_data) {
            this.$title.innerText = "New Todo item"
            this.$description.innerText = "Place lengthy description here."
            this.data.id = uuidv4();

        } else {
            // Read existing todo Item from local storage
            this.data = item_data;
            this.$title.innerText = item_data.title;
            this.$description.innerText = item_data.description;
            this.$date.value = item_data.date;
            
            console.log(item_data)
            if (item_data.is_done){
                this.$container.classList.add("collapsed")
                this.$description.classList.add("collapsed")
                this.$container.classList.add("done")

                // Disable Edit
                this.$editBtn.disabled = true;
                this.$date.disabled = true;
            }
        }

        // EVENT AND OTHER STUFF 
        this.$title.addEventListener("input", ()=>{
            this.data.title = this.$title.innerText;
            // this.$title.innerText = this.data.title;
        });

        this.$description.addEventListener("input", ()=>{
            this.data.description = this.$description.innerText;
        });
        
        // On Edit, toggle content Editable
        this.$editBtn.onclick = ()=>{
            if (!this.is_editable){
                this.$container.classList.remove("collapsed")
                this.$description.classList.remove("collapsed")
                this.is_collapsed = false;
                this.$collapseBtn.innerHTML = icn("expand_less")
            } else {
                this.$container.classList.add("collapsed")
                this.$description.classList.add("collapsed")
                this.is_collapsed = true;
                this.$collapseBtn.innerHTML = icn("expand_more")
            }
                
            // toggle Editable
            this.is_editable = !this.is_editable;

            this.$title.contentEditable = this.is_editable;
            this.$description.contentEditable = this.is_editable;
            this.$date.disabled = this.is_editable ? false : true

            // Toggle Icon between Edit and save
            this.$editBtn.innerHTML = icn(this.is_editable?"save":"edit");

            // Update data 
            if (!this.is_editable) {
                this.data.title         = this.$title.innerText
                this.data.description   = this.$description.innerText
                this.data.date          = this.$date.value
                this.data.is_done       = false

                console.log(this.data);
                
                // Send event to TodoList to update to local storage
                const e = new CustomEvent("save-item-event", {
                    bubbles: true,
                    detail :{
                        data: this.data
                    }
                })

                this.$container.dispatchEvent(e);
                console.log(e);
            }
            

        }

        // On Expand, toggle Description
        this.$collapseBtn.onclick = ()=>{
            if (this.is_collapsed) {
                this.$description.classList.remove("collapsed");
                this.$container.classList.remove("collapsed");
            } else {
                this.$description.classList.add("collapsed");
                this.$container.classList.add("collapsed");
            }
                

            // Toggle Todo stage
            this.is_collapsed = !this.is_collapsed;

            // Toggle Btn
            this.$collapseBtn.innerHTML = icn(this.is_collapsed ? "expand_more" : "expand_less");

        }

        // On Deletion
        this.$delBtn.onclick = ()=>{
            const e = new CustomEvent("delete-todoItem", {
                bubbles:true,
                detail: {
                    item: this.$container
                }
            })

            console.log(e);

            this.$container.dispatchEvent(e);
        }

        // On Done 
        this.$doneBtn.onclick = () =>{
            this.data.is_done = true;
            this.$container.classList.add("collapsed")
            this.$description.classList.add("collapsed")
            this.$container.classList.add("done")

            

            // Disable Edit
            this.$editBtn.disabled = true;
            this.$date.disabled = true;

            // Update status
            let e = new CustomEvent("update-item-status", {
                bubbles: true,
                detail: {
                    data: this.data
                }
            })

            this.$container.dispatchEvent(e);


        }

        // console.log(this.data)
    }

    render(){
        this.$container.appendChild(this.$title);
        this.$container.appendChild(this.$date);
        this.$container.appendChild(this.$description);

        
        this.$btnContainer.appendChild(this.$editBtn);
        this.$btnContainer.appendChild(this.$collapseBtn);
        this.$btnContainer.appendChild(this.$delBtn);
        this.$btnContainer.appendChild(this.$doneBtn);

        this.$container.appendChild(this.$btnContainer);

        return this.$container;
    }
}

class TodoList {
    $container = d("todolist-container");
    $todolist_container = d("todolist-todoContainer");
    
    $title;
    $stat;

    $newTaskBtn;


    storage = window.localStorage;
    todolist = [];

    constructor(){
        // const storage = window.localStorage;
        // clear local storage
        // window.localStorage.clear()

        // try read todolist from local storage
        this.todolist = this.storage.getItem("todolist");

    

        if (this.todolist){
            this.todolist = JSON.parse(this.todolist)
            for (let item_data of this.todolist) {
                let todoItem = new TodoItem(item_data);
                this.$todolist_container.appendChild(todoItem.render())
            };
        } else {
            this.todolist = [];
        }


        // New btn

        // btn 
        this.$newTaskBtn = document.createElement("button")
        this.$newTaskBtn.innerText = "Add"
        this.$newTaskBtn.classList.add("app-addBtn");
        this.$newTaskBtn.onclick = ()=>{
            let newItem = new TodoItem();
            this.$todolist_container.insertAdjacentElement("beforeend", newItem.render())
        }

        // btn div container
        this.$btnContainer = d("app-btnContainer");


        // Storage Stuff
        this.$container.addEventListener("save-item-event", (e)=>{
            let incoming_item = e.detail.data;

            let is_exist = false
            if (this.todolist){
                for (let item of this.todolist) {
                    if (item.id == incoming_item.id) {
                        item = incoming_item;
                        is_exist = true
                        break;
                    }
                }
            }
            

            if (!is_exist)
                this.todolist.push(incoming_item)

            // Update 
            this.storage.setItem("todolist", JSON.stringify(this.todolist))
        })

        this.$container.addEventListener(
            "update-item-status", 
            (e)=>{
                let incoming_item = e.detail.data;
                console.log(incoming_item);

                for (let item of this.todolist) {
                    if (item.id == incoming_item.id) {
                        item = incoming_item;
                        // is_exist = true
                        break;
                    }
                }

                // Update 
                this.storage.setItem("todolist", JSON.stringify(this.todolist))
            }
        )
    }

    render(){
        this.$btnContainer.appendChild(this.$newTaskBtn)
        this.$container.appendChild(this.$btnContainer)
        this.$container.appendChild(this.$todolist_container)
        return this.$container
    }


}


export {
    TodoItem,
    TodoList
}
