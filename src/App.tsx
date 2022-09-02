import { useState, useEffect } from "react";
import "./App.scss";
import axios from "axios";

const url =
    "https://edwardtanguay.netlify.app/share/techBooksUnstructured.json";

function App() {
    const [books, setBooks] = useState<IBook[]>([]);

    enum Status {
      hasError,
      noError,
      unknown
    }

    interface IBook {
        id: number;
        title: string;
        description: string;
        language: string;
        yearMonth: string;
        numberInStock: number;
        status: Status
    }

    const userIsAdmin = true;

    const getHasError = (rawBook:any, _language:string, _numberInStock:(number|undefined)):Status => {
      let numberInStockIsBad = !rawBook.numberInStock
      if (_numberInStock === undefined) {
         numberInStockIsBad = true;
      }
      return !["english", "french"].includes(_language) || !rawBook.description || numberInStockIsBad || !rawBook.title ? Status.hasError : Status.noError;
    }

    useEffect(() => {
        (async () => {
            const rawBooks = (await axios.get(url)).data;
            const _books: IBook[] = [];
            rawBooks.forEach((rawBook: any) => {
              //language
                const _language = rawBook.language
                    ? rawBook.language
                    : "english";
              //numbers in Stock
              let _numberInStock:(number | undefined) = 0
                if(typeof(rawBook.numberInStock) === 'string') {
                  _numberInStock = Number(rawBook.numberInStock)
                  console.log(_numberInStock);
                  if (Number.isNaN(_numberInStock)){
                    _numberInStock = undefined
                  }          
      } 
                const book: IBook = {
                    id: rawBook.id,
                    title: rawBook.title,
                    description: rawBook.description,
                    language: _language,
                    yearMonth: rawBook.yearMonth,
                    numberInStock: rawBook.numberInStock,
                    status: getHasError(rawBook, _language, _numberInStock),
                };
                _books.push(book);
            });
            setBooks(_books);
        })();
    }, []);

    const bookIsAllowedToShow = (book:IBook) => {
      if (userIsAdmin) {
        return true;
      } else {

        if (book.status === Status.hasError) {
            return false;
        } else {
            return true;
        }
      }
    };

    const getClassesForBook = (book:IBook) => {
      if (userIsAdmin && book.status === Status.hasError) {
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
                        <div key={i}>
                            {bookIsAllowedToShow(book) && (
                                <fieldset className={getClassesForBook(book)}>
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
