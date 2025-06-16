document.addEventListener("DOMContentLoaded", async () => {
    const container=document.getElementById("book-box");
    try {
        const books=await getBooks();
        if (books.length===0) {
            container.innerHTML="<p class='text-gray-600'>No books added yet.</p>";
            return;
        }
        books.forEach((book, i) => {
            const age=calcBookAge(book.pubDate);
            const bookCard=document.createElement("div");
            bookCard.className=
                // "w-80 p-6 border rounded-lg shadow-lg bg-gray-800 border-gray-700";
                "w-80 p-6 rounded-lg shadow-lg bg-white/30   backdrop-blur-sm";
            bookCard.innerHTML= `
                <h5 class="mb-2 text-xl font-bold text-white">${book.title}</h5>
                <p class="mb-1 text-gray-800">Author: ${book.author}</p>
                <p class="mb-1 text-gray-800">ISBN: ${book.isbn}</p>
                <p class="mb-1 text-gray-800">Published: ${book.pubDate} (Age: ${age} yrs)</p>
                <p class="mb-4 text-gray-800">Genre: ${book.genre}</p>
                <div class="flex gap-2">
                    <button onclick="deleteBook(${i})" class="px-3 py-2  text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none">Delete</button>
                    <button onclick="editBook(${i})" class="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none">Edit </button>
                </div>`;
            container.appendChild(bookCard);
        });
    } catch (error) {
        container.innerHTML=`<p class='text-red-600'>Error loading books: ${error.message}</p>`;
    }
});
function getBooks() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            try{
                            const books=JSON.parse(localStorage.getItem("books")) || [];
                            resolve(books);
            }catch(err) {
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
    const books=JSON.parse(localStorage.getItem("books")) ||[];
    books.splice(i,1);
    localStorage.setItem("books",JSON.stringify(books));
    location.reload();
}
function editBook(i){
    const books=JSON.parse(localStorage.getItem("books")) ||[];
    const editBook=books[i];
    localStorage.setItem("editCheck",i);
    localStorage.setItem("editBook",JSON.stringify(editBook));
    window.location.href="index.html";
}
