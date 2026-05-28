import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CollectionProvider } from './context/CollectionContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Series from './pages/Series'
import SeriesDetail from './pages/SeriesDetail'
import Scan from './pages/Scan'
import Classeur from './pages/Classeur'
import Marche from './pages/Marche'
import CardDetail from './pages/CardDetail'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <LanguageProvider>
      <CollectionProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/series" element={<Series />} />
              <Route path="/series/:setId" element={<SeriesDetail />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/classeur" element={<Classeur />} />
              <Route path="/marche" element={<Marche />} />
              <Route path="/carte/:id" element={<CardDetail />} />
              <Route path="/parametres" element={<Settings />} />
              <Route path="/recherche" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CollectionProvider>
    </LanguageProvider>
  )
}
