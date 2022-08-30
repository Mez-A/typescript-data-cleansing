import { useState, useEffect } from "react";
import "./App.scss";
import axios from "axios";

const url =
    "https://edwardtanguay.netlify.app/share/techBooksUnstructured.json";

function App() {
    const [books, setBooks] = useState<IBook[]>([]);

    interface IBook {
        id: number;
        title: string;
        description: string;
        language: string;
        yearMonth: string;
        numberInStock: number;
        hasError: boolean;
    }

    const userIsAdmin = true;

    const getHasError = (rawBook:any, _language:string) => {
      return ["english", "french"].includes(_language) ? false : true
    }

    useEffect(() => {
        (async () => {
            const rawBooks = (await axios.get(url)).data;
            const _books: IBook[] = [];
            rawBooks.forEach((rawBook: any) => {
                const _language = rawBook.language
                    ? rawBook.language
                    : "english";
                const book: IBook = {
                    id: rawBook.id,
                    title: rawBook.title,
                    description: rawBook.description,
                    language: _language,
                    yearMonth: rawBook.yearMonth,
                    numberInStock: rawBook.numberInStock,
                    hasError: getHasError(rawBook, _language),
                };
                _books.push(book);
            });
            setBooks(_books);
        })();
    }, []);

    const bookIsAllowedToShow = (book:IBook) => {
        if (!book.hasError ||userIsAdmin) {
            return true;
        } else {
            return false;
        }
    };

    const getClassesForBook = (book:IBook) => {
      if (userIsAdmin && book.hasError) {
        return 'book error'
      } else {
        return 'book allowed'
      }
    }

    return (
        <div className="App">
            <h1>TypeScript site example</h1>
            <p>Testing</p>
            <div className="bookArea">
                {books.map((book, i) => {
                    return (
                        <>
                            {bookIsAllowedToShow(book) && (
                                <fieldset className={getClassesForBook(book)} key={i}>
                                    <legend>ID: {book.id}</legend>
                                    <div className="row">
                                        <label>Title</label>
                                        <div>{book.title}</div>
                                    </div>

                                    <div className="row">
                                        <label>Description</label>
                                        <div>{book.description}</div>
                                    </div>

                                    <div className="row">
                                        <label>Language</label>
                                        <div>{book.language}</div>
                                    </div>

                                    <div className="row">
                                        <label>Year/Month</label>
                                        <div>{book.yearMonth}</div>
                                    </div>

                                    <div className="row">
                                        <label>In Stock</label>
                                        <div>{book.numberInStock}</div>
                                    </div>
                                </fieldset>
                            )}
                        </>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
