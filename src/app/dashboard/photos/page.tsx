'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, Trash2, Upload, Images } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ImageUpload } from '@/components/ImageUpload'

export default function PhotosPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [contractorId, setContractorId] = useState<number | null>(null)

  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [gallery, setGallery] = useState<string[]>([])
  const [savingMeta, setSavingMeta] = useState(false)
  const [savedMeta, setSavedMeta] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('tbf_contractors')
      .select('id, logo_url, cover_image_url, gallery_urls')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setContractorId(data.id)
          setLogoUrl(data.logo_url ?? null)
          setCoverUrl(data.cover_image_url ?? null)
          setGallery((data as { gallery_urls?: string[] }).gallery_urls ?? [])
        }
        setLoading(false)
      })
  }, [user])

  async function saveMainImages() {
    if (!contractorId) return
    setSavingMeta(true)
    const supabase = createClient()
    await supabase
      .from('tbf_contractors')
      .update({ logo_url: logoUrl, cover_image_url: coverUrl })
      .eq('id', contractorId)
    setSavingMeta(false)
    setSavedMeta(true)
    setTimeout(() => setSavedMeta(false), 2500)
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !contractorId) return
    setUploadingGallery(true)
    const supabase = createClient()

    const newUrls: string[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      const path = `contractors/${contractorId}/gallery/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('contractor-photos').upload(path, file, { upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('contractor-photos').getPublicUrl(path)
        newUrls.push(data.publicUrl)
      }
    }

    const updated = [...gallery, ...newUrls]
    setGallery(updated)
    await supabase
      .from('tbf_contractors')
      .update({ gallery_urls: updated })
      .eq('id', contractorId)

    setUploadingGallery(false)
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  async function removeGalleryPhoto(url: string) {
    if (!contractorId) return
    const supabase = createClient()

    // Remove from storage
    const urlObj = new URL(url)
    const path = urlObj.pathname.split('/object/public/contractor-photos/')[1]
    if (path) await supabase.storage.from('contractor-photos').remove([path])

    const updated = gallery.filter((u) => u !== url)
    setGallery(updated)
    await supabase
      .from('tbf_contractors')
      .update({ gallery_urls: updated })
      .eq('id', contractorId)
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Photos" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Photos" subtitle="Manage your logo, cover image, and work gallery" />
      <main className="flex-1 p-6 space-y-6 max-w-2xl">
        {/* Logo + Cover */}
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Logo & cover image</h2>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">Logo</p>
                <ImageUpload
                  bucket="contractor-photos"
                  path={`contractors/${contractorId}/logo`}
                  value={logoUrl}
                  onChange={setLogoUrl}
                  label="Upload logo"
                  aspectRatio="square"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Cover image</p>
                <ImageUpload
                  bucket="contractor-photos"
                  path={`contractors/${contractorId}/cover`}
                  value={coverUrl}
                  onChange={setCoverUrl}
                  label="Upload cover"
                  aspectRatio="wide"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={saveMainImages}
              disabled={savingMeta}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
            >
              {savingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save
            </button>
            {savedMeta && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Work gallery</h2>
              <p className="text-xs text-gray-500 mt-0.5">{gallery.length} photo{gallery.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploadingGallery}
              className="flex items-center gap-1.5 text-sm bg-gray-900 text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {uploadingGallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Add photos
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryUpload}
            />
          </div>

          {gallery.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <Images className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No gallery photos yet.</p>
              <p className="text-xs text-gray-300 mt-1">Photos of your work build trust with customers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {gallery.map((url) => (
                <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryPhoto(url)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
