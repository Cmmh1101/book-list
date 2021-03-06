class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book){
        const list = document.getElementById("book-list");
  // Create tr element
  const row = document.createElement("tr");
  // Insert Cols
  row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;

  list.appendChild(row);
    }

    showAlert(message, className){
        // create div tag
        const div = document.createElement('div');
        // add classes
        div.className = `alert ${className}`;
        // add text 
        div.appendChild(document.createTextNode(message));
        // get a parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert Alert
        container.insertBefore(div, form);

        //  timeout after 3 secs
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
  }
    }
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local storage class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            // add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        
        books.forEach(function(book, index){
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//  Event Listeners for add book

document.getElementById("book-form").addEventListener("submit", function (e) {
  // Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  const book = new Book(title, author, isbn);

  // instantiate UI

  const ui = new UI();

// validate 
    if(title === '' || author === '' || isbn === '') {
        // error alert
        ui.showAlert('Please fill in all fields', 'error')
    } else {
        // add book to list 
        ui.addBookToList(book);

        //  Add to local Storage 
        Store.addBook(book);

        // add success alert
        ui.showAlert('Book Added!', 'success')

        // clear fields
        ui.clearFields();

    }

  e.preventDefault();
});


// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
  
  // instantiate UI
  const ui = new UI();

  // delete book
  ui.deleteBook(e.target); 

  // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show delete mesaje
  ui.showAlert('book removed', 'success')

  console.log(123);
  e.preventDefault();
})
