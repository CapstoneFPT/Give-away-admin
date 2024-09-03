import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageTitle } from '../../../_metronic/layout/core'
import OrderList from './OrderList.tsx'

const OrderPage = () => {
  return (
    <>    
      <OrderList className="mb-5 mb-xl-8"  />        
    </>
       
  )
}

export default OrderPage