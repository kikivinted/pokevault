import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CollectionProvider } from './context/CollectionContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Collection from './pages/Collection'
import CardDetail from './pages/CardDetail'
import Stats from './pages/Stats'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <CollectionProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recherche" element={<Search />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/carte/:id" element={<CardDetail />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CollectionProvider>
  )
}
