import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/Homepage/HomePage'
import ChatPage from './Pages/ChatPage/ChatPage'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/chats' element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
