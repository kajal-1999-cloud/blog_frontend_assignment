import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/homePage'
import { CreatePostPage } from './pages/createPostPage'
import ProfilePage from './pages/profilePage'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {BlogDetailsPage} from './pages/blogDetailsPage'

function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreatePostPage />} />
    <Route path="/blogDetails/:id" element={<BlogDetailsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    </Routes>
    </>
  )
}

export default App
