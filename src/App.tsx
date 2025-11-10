import React from 'react'
import AppRoutes from './routes/AppRoutes'
import Header from './components/Header'
import Footer from './components/Footer'
import { Container } from '@mui/material'

export default function App() {
  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <AppRoutes />
        <Footer />
      </Container>
    </div>
  )
}
