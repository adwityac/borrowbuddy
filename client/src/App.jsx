import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import MyItemsPage from './pages/MyItemsPage'
import ItemDetailPage from './pages/ItemDetailPage'
import RequestsPage from './pages/RequestsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import IncomingRequestsPage from "./pages/IncomingRequestsPage";
import MyRequestsPage from "./pages/MyRequestsPage";




export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage/>} />

        <Route path="login" element={<LoginPage/>} />
        <Route path="register" element={<RegisterPage/>} />

        <Route path="browse" element={<BrowsePage/>} />

        <Route path="items" element={
          <ProtectedRoute><MyItemsPage/></ProtectedRoute>
        } />

        <Route path="item/:itemId" element={
          <ProtectedRoute><ItemDetailPage/></ProtectedRoute>
        } />

        

        <Route path="requests" element={
          <ProtectedRoute><RequestsPage/></ProtectedRoute>
        } />

        <Route path="profile" element={
          <ProtectedRoute><ProfilePage/></ProtectedRoute>
        } />

        <Route path="admin" element={
          <ProtectedRoute><AdminPage/></ProtectedRoute>
        } />

        <Route path="incoming-requests" element={
          <ProtectedRoute><IncomingRequestsPage /></ProtectedRoute>
        } />

        <Route path="my-requests" element={
          <ProtectedRoute><MyRequestsPage /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}
