import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'

const CARD_ASPECT = 63 / 88

function compressImage(canvas, maxW = 500) {
  const ratio = Math.min(maxW / canvas.width, 1)
  const out = document.createElement('canvas')
  out.width = Math.round(canvas.width * ratio)
  out.height = Math.round(canvas.height * ratio)
  out.getContext('2d').drawImage(canvas, 0, 0, out.width, out.height)
  return out.toDataURL('image/jpeg', 0.78)
}

export default function Scan() {
  const navigate = useNavigate()
  const { scannedDispatch } = useCollection()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const guideRef = useRef(null)
  const streamRef = useRef(null)

  const [step, setStep] = useState('intro')
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
  const [cardName, setCardName] = useState('')
  const [cameraError, setCameraError] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')

  async function startCamera(mode = 'environment') {
    stopCamera()
    setCameraReady(false)
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setCameraReady(true)
        }
      }
    } catch (err) {
      setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraReady(false)
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (step === 'front' || step === 'back') {
      startCamera(facingMode)
    } else {
      stopCamera()
    }
  }, [step, facingMode])

  function capture() {
    const video = videoRef.current
    const guide = guideRef.current
    if (!video || !guide || !cameraReady) return null

    const videoRect = video.getBoundingClientRect()
    const guideRect = guide.getBoundingClientRect()

    const scaleX = video.videoWidth / videoRect.width
    const scaleY = video.videoHeight / videoRect.height

    const cropX = Math.max(0, (guideRect.left - videoRect.left) * scaleX)
    const cropY = Math.max(0, (guideRect.top - videoRect.top) * scaleY)
    const cropW = Math.min(guideRect.width * scaleX, video.videoWidth - cropX)
    const cropH = Math.min(guideRect.height * scaleY, video.videoHeight - cropY)

    const canvas = document.createElement('canvas')
    canvas.width = cropW
    canvas.height = cropH
    canvas.getContext('2d').drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

    return compressImage(canvas)
  }

  function handleCaptureFront() {
    const img = capture()
    if (img) {
      setFrontImage(img)
      setStep('frontPreview')
    }
  }

  function handleCaptureBack() {
    const img = capture()
    if (img) {
      setBackImage(img)
      setStep('confirm')
    }
  }

  function handleSave() {
    const card = {
      id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: cardName.trim() || 'Carte scannée',
      frontImage,
      backImage,
      addedAt: Date.now(),
      isScanned: true,
    }
    scannedDispatch({ type: 'ADD_SCANNED', card })
    navigate('/classeur')
  }

  function flipCamera() {
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newMode)
  }

  // ─── INTRO ───
  if (step === 'intro') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📸</div>
          <h1 className="section-title mb-3">Scanner une carte</h1>
          <p className="text-poke-muted mb-8 leading-relaxed">
            Scannez le recto et le verso de votre carte pour l'ajouter au classeur.
            La carte sera conservée telle quelle — état, illustration, tout.
          </p>

          <div className="card-base text-left mb-6 space-y-3">
            {[
              { n: '1', t: 'Placez la carte dans le cadre' },
              { n: '2', t: 'Prenez le recto (face illustration)' },
              { n: '3', t: 'Prenez le verso (dos de la carte)' },
              { n: '4', t: 'Nommez et ajoutez au classeur' },
            ].map(({ n, t }) => (
              <div key={n} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-poke-yellow text-black text-sm font-black flex items-center justify-center flex-shrink-0">{n}</span>
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('front')}
            className="btn-primary w-full justify-center py-4 text-base"
          >
            📸 Commencer le scan
          </button>
        </div>
      </div>
    )
  }

  // ─── FRONT PREVIEW ───
  if (step === 'frontPreview') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-sm w-full text-center">
          <h2 className="text-2xl font-black mb-2">Recto capturé ✓</h2>
          <p className="text-poke-muted mb-6">C'est bon ? Passons au verso.</p>
          <div className="rounded-2xl overflow-hidden mb-6 border-2 border-poke-yellow/50">
            <img src={frontImage} alt="Recto" className="w-full"/>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('front')} className="btn-secondary flex-1 justify-center">
              ↩ Reprendre
            </button>
            <button onClick={() => setStep('back')} className="btn-primary flex-1 justify-center">
              Verso →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── CONFIRM ───
  if (step === 'confirm') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <h2 className="text-2xl font-black mb-2 text-center">Carte scannée ✓</h2>
          <p className="text-poke-muted mb-6 text-center">Vérifiez les deux côtés et donnez un nom.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <p className="text-xs text-poke-muted text-center mb-2">Recto</p>
              <div className="rounded-xl overflow-hidden border border-poke-yellow/40">
                <img src={frontImage} alt="Recto" className="w-full"/>
              </div>
            </div>
            <div>
              <p className="text-xs text-poke-muted text-center mb-2">Verso</p>
              <div className="rounded-xl overflow-hidden border border-poke-border">
                <img src={backImage} alt="Verso" className="w-full"/>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-poke-muted mb-2">Nom de la carte (optionnel)</label>
            <input
              type="text"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="Ex: Dracaufeu EX Holo..."
              className="input-base"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setBackImage(null); setStep('back') }} className="btn-secondary flex-1 justify-center text-sm">
              ↩ Reprendre verso
            </button>
            <button onClick={handleSave} className="btn-primary flex-1 justify-center">
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── CAMERA VIEW (front or back) ───
  const isFront = step === 'front'

  return (
    <div className="min-h-screen pt-16 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur z-10">
        <button
          onClick={() => { stopCamera(); setStep(isFront ? 'intro' : 'frontPreview') }}
          className="text-white/70 hover:text-white transition-colors p-1"
        >
          ← Retour
        </button>
        <div className="text-center">
          <p className="font-bold text-sm">{isFront ? '📸 Recto' : '🔄 Verso'}</p>
          <p className="text-xs text-white/60">{isFront ? 'Face illustration' : 'Dos de la carte'}</p>
        </div>
        <button onClick={flipCamera} className="text-white/70 hover:text-white transition-colors p-1" title="Retourner caméra">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>

      {/* Camera */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        {cameraError ? (
          <div className="text-center px-8">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-white font-semibold mb-2">Caméra non disponible</p>
            <p className="text-white/60 text-sm mb-6">{cameraError}</p>
            <button onClick={() => startCamera(facingMode)} className="btn-primary">
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            <canvas ref={canvasRef} className="hidden"/>

            {/* Card guide overlay */}
            {cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Dark sides */}
                <div className="absolute inset-0 bg-black/55"/>

                {/* Guide box — card proportions */}
                <div
                  ref={guideRef}
                  className="relative bg-transparent"
                  style={{
                    width: 'min(55vw, 200px)',
                    aspectRatio: `${CARD_ASPECT}`,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                    border: `2px solid ${isFront ? '#FFDE00' : '#ffffff'}`,
                    borderRadius: '8px',
                    zIndex: 1,
                  }}
                >
                  {/* Corner markers */}
                  {[
                    'top-0 left-0 border-t-4 border-l-4 rounded-tl-lg',
                    'top-0 right-0 border-t-4 border-r-4 rounded-tr-lg',
                    'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
                    'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
                  ].map((cls, i) => (
                    <span key={i} className={`absolute w-5 h-5 ${cls} ${isFront ? 'border-poke-yellow' : 'border-white'}`}/>
                  ))}
                </div>

                {/* Label */}
                <div className="absolute bottom-24 left-0 right-0 text-center pointer-events-none">
                  <p className="text-white/80 text-sm font-medium bg-black/40 inline-block px-4 py-1.5 rounded-full">
                    {isFront ? 'Centrez le recto dans le cadre' : 'Centrez le verso dans le cadre'}
                  </p>
                </div>
              </div>
            )}

            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              </div>
            )}
          </>
        )}
      </div>

      {/* Capture button */}
      <div className="bg-black px-6 py-6 flex items-center justify-center gap-8">
        {/* Thumbnail of front (shown on back step) */}
        {!isFront && frontImage && (
          <div className="w-10 h-14 rounded-lg overflow-hidden border border-poke-yellow/50 opacity-80">
            <img src={frontImage} alt="Recto" className="w-full h-full object-cover"/>
          </div>
        )}

        <button
          onClick={isFront ? handleCaptureFront : handleCaptureBack}
          disabled={!cameraReady}
          className={`w-16 h-16 rounded-full border-4 transition-all duration-200 active:scale-90 flex items-center justify-center ${
            cameraReady
              ? 'border-white bg-white hover:bg-white/90'
              : 'border-white/30 bg-white/20 cursor-not-allowed'
          }`}
        >
          <div className={`w-11 h-11 rounded-full ${cameraReady ? 'bg-poke-dark' : 'bg-white/30'}`}/>
        </button>
      </div>
    </div>
  )
}
