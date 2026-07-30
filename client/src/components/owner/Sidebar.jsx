import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Sidebar = () => {

  const { user, axios, fetchUser } = useAppContext()
  const location = useLocation()
  const [previewImage, setPreviewImage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (file) {
      setSelectedImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const updateImage = async () => {
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const { data } = await axios.post('/api/owner/update-image', formData)

      if (data.success) {
        await fetchUser()
        toast.success(data.message)
        setSelectedImage(null)
        setPreviewImage('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor dark:border-gray-700 text-sm'>
      <div className='group relative'>
        <label htmlFor='image'>
          <img
            src={previewImage || user?.image || 'https://images.unsplash.com/photo-163332755192-727a05c4013d?q=80&w=300'}
            alt='User profile'
            className='w-14 h-14 rounded-full object-cover'
          />
          <input type='file' id='image' accept='image/*' hidden onChange={handleImageChange} />

          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center'>
            <img src={assets.edit_icon} alt='' />
          </div>
        </label>
      </div>

      {selectedImage && (
        <button
          type='button'
          onClick={updateImage}
          className='absolute top-0 right-0 flex items-center gap-1 p-2 bg-primary/10 text-primary cursor-pointer rounded'
        >
          Save <img src={assets.check_icon} width={13} alt='' />
        </button>
      )}

      <p className='mt-2 text-base max-md:hidden dark:text-gray-200'>{user?.name}</p>

      <div className='w-full'>
        {ownerMenuLinks.map((link, index) => {
          const isActive = location.pathname === link.path || (link.path !== '/owner' && location.pathname.startsWith(link.path))

          return (
            <NavLink
              key={index}
              to={link.path}
              className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <img src={isActive ? link.coloredIcon : link.icon} alt='' />
              <span className='max-md:hidden'>{link.name}</span>
              <div className={`${isActive ? 'bg-primary' : ''} w-1.5 h-8 rounded-l absolute right-0`} />
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
