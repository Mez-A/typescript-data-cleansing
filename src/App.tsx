import { useState, useEffect } from 'react'
import './App.scss'
import axios from 'axios'

const url = 'https://edwardtanguay.netlify.app/share/techBooksUnstructured.json'

function App() {
  const [books, setBooks] = useState([])

   useEffect(() => {
    (async () => {
      setBooks((await axios.get(url)).data)
    })();
  }, []);

  return (
    <div className="App">
      <h1>TypeScript site example</h1>
      <p>Testing</p>
      <h2>There are {books.length} books.</h2>
    </div>
  )
}

export default App
