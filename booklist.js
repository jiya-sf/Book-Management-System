document.addEventListener("DOMContentLoaded", async() => {
    const container = document.getElementById("book-box");
    try{
        const books=await getBooks();
        if(books.length===0){
            container.innerHTML="<p>No books added yet.</p>";
            return;
        }
        books.forEach((book,i)=>{
            const age=calcBookAge(book.pubDate);
            const bookCard=document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.innerHTML=`
            <p>Title: ${book.title}</p>
            <p>Author: ${book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>Published: ${book.pubDate} (Age: ${age} years)</p>
            <p>Genre: ${book.genre}</p>
            <button onclick="deleteBook(${i})">DELETE</button>
            <button onclick="editBook(${i})">EDIT</button>
            `;
            container.appendChild(bookCard);
        });
    }catch(error){
        container.innerHTML=`<p>Books not loaded, try again: ${error.message}</p>`;
    }

    });

function getBooks(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            try{
                const books=JSON.parse(localStorage.getItem("books"))||[];
                resolve(books);
            }
             catch(err){
                reject(err);
             }
        },1000);
    });
}

function calcBookAge(pubDate){
    const pub=new Date(pubDate);
    const now=new Date();
    return now.getFullYear()-pub.getFullYear();
}

function deleteBook(i){
    const books=JSON.parse(localStorage.getItem("books"))||[];
    books.splice(i,1);
    localStorage.setItem("books",JSON.stringify(books));
    location.reload();
}

function editBook(i){
    const books=JSON.parse(localStorage.getItem("books"))||[];
    const editBook=books[i];
    localStorage.setItem("editCheck",i);
    localStorage.setItem("editBook",JSON.stringify(editBook));
    window.location.href="index.html";
}


