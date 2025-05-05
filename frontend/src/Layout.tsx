import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import {Outlet} from "react-router-dom"

type Props = {}

const Layout = (props: Props) => {
  return (
    <div>
        <Header/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Layout