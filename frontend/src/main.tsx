import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.tsx'
import Home from './Home.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import SignUp from './components/SignUp.tsx'
import LogIn from './components/LogIn.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path='signup' element ={<SignUp/>}/>
      <Route path='login' element = {<LogIn/>}/>
    </Route>
  )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="sheetcode-theme">
      <RouterProvider router={router}/>
    </ThemeProvider>
  </StrictMode>,
)
