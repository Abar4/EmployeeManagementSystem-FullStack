
import './App.css'
import HeaderComponent from './component/HeaderComponent'
import ListEmployeeComponent from './component/ListEmployeeComponent'
import FooterComponent from './component/FooterComponent'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import EmployeeComponent from './component/EmployeeComponent'

function App() {
  return (
    <>
     <BrowserRouter>
        <HeaderComponent/>
        <Routes>
           <Route path='/' element={<ListEmployeeComponent/>}></Route>

           <Route path='/employees' element={<ListEmployeeComponent/>}></Route>

           <Route path='/add-employee' element={<EmployeeComponent/>}></Route>

           <Route path='/edit-employee/:id' element={<EmployeeComponent/>}></Route>
        </Routes>
        <FooterComponent/>
     </BrowserRouter>
    </>
  )
}

export default App
