import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductManagement from './pages/ProductManagement.jsx'

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<ProductManagement />} />
        </Routes>
    </BrowserRouter>
  )
}
