document.addEventListener("DOMContentLoaded", () => {
    const form=document.getElementById("bms-form");
    const editCheck=parseInt(localStorage.getItem("editCheck"));
    const editBook=JSON.parse(localStorage.getItem("editBook"));
    if (!isNaN(editCheck)&&editBook) {
        document.getElementById("title").value = editBook.title;
        document.getElementById("author").value = editBook.author;
        document.getElementById("isbn").value = editBook.isbn;
        document.getElementById("pub-date").value = editBook.pubDate;
        document.getElementById("genre").value = editBook.genre;
    }

    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        const title=document.getElementById("title").value;
        const author=document.getElementById("author").value;
        const isbn=document.getElementById("isbn").value;
        const pubDate=document.getElementById("pub-date").value;
        const genre=document.getElementById("genre").value;
        if (!title|| !author|| !isbn|| !pubDate|| genre === "") {
            alert("Please fill in all fields");
            return;
        }
        const newBook={ title, author, isbn, pubDate, genre };
        try{
            const updatedBooks= await saveBooks(newBook,editCheck);
            localStorage.setItem("books",JSON.stringify(updatedBooks));
            localStorage.removeItem("editCheck");
            localStorage.removeItem("editBook");
            alert(editCheck!==null&&!isNaN(editCheck) ?"The book has been updated sucessfully":"The book has been added successfully.");
            console.log("books are stored");
            form.reset();
        }
        catch(error){
            alert("Could not save the book, pls try again"+error.message);
        }
        
    });
});

function saveBooks(book,editCheck){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            try{
                const books=JSON.parse(localStorage.getItem("books"))||[];
                if(!isNaN(editCheck)){
                    books[editCheck]=book;
                }
                else{
                    books.push(book);

                }
                console.log("books that r going to be saved are",books);
                resolve(books);
            }
            catch(err){
                reject(err);
            }
        
        },1000);
    });
}
