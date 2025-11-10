import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SearchPage from '../features/search/SearchPage'
import AnimeDetail from '../features/anime/AnimeDetail'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/anime/:id" element={<AnimeDetail />} />
    </Routes>
  )
}
