import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import Todo from "../models/Todo";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
})
export class TodoListComponent implements OnInit {
  todo: Todo = {
    title: "",
  };

  todos: Observable<Todo[]>;
  todosCollection: AngularFirestoreCollection<Todo>;
  todoDoc: AngularFirestoreDocument<Todo>;

  constructor(private firestore: AngularFirestore) {
    this.todosCollection = this.firestore.collection("todos", (ref) =>
      ref.orderBy("title", "asc")
    );

    this.todos = this.todosCollection.snapshotChanges().pipe(
      map((changes) =>
        changes.map((a) => {
          const data = a.payload.doc.data() as Todo;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.todo.title != "") {
      this.addTodo(this.todo);
      this.todo.title = "";
    }
  }

  addTodo(todo: Todo) {
    this.todosCollection.add(todo);
  }

  deleteTodo(todo: Todo) {
    this.todoDoc = this.firestore.doc(`todos/${todo.id}`);
    this.todoDoc.delete();
  }
}
