import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const AddCar = () => {

  const { axios, currency } = useAppContext()
  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
    isAvailable: true,
  })


  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const { data } = await axios.post('/api/owner/add-car', formData)

      if (data.success) {
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: '',
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          description: '',
          isAvailable: true,
        })
        // Redirect to owner dashboard to view listed cars
        navigate('/owner')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full px-4 py-10 md:px-10 flex-1'>
      <div className='w-full max-w-3xl text-left flex flex-col items-start'>
        <Title
          title='Add New Car'
          subtitle='Fill in details to list a new car for booking, including pricing, availability, and car specification.'
        />

        <form onSubmit={onSubmitHandler} className='w-full flex flex-col gap-5 text-gray-500 dark:text-gray-400 text-sm mt-6'>
          <div className='flex items-center gap-2 w-full justify-start'>
            <label htmlFor='car-image' className='cursor-pointer'>
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_icon}
                alt=''
                className='h-14 w-14 rounded object-cover'
              />
              <input
                type='file'
                id='car-image'
                accept='image/*'
                hidden
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Upload a picture of your car</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
            <div className='flex flex-col w-full'>
              <label>Brand</label>
              <input
                type='text'
                placeholder='e.g. BMW, Mercedes, Audi...'
                required
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.brand}
                onChange={(e) => setCar({ ...car, brand: e.target.value })}
              />
            </div>

            <div className='flex flex-col w-full'>
              <label>Model</label>
              <input
                type='text'
                placeholder='e.g. X5, E-Class, M4...'
                required
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.model}
                onChange={(e) => setCar({ ...car, model: e.target.value })}
              />
            </div>

            <div className='flex flex-col w-full'>
              <label>Year</label>
              <select
                required
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.year}
                onChange={(e) => setCar({ ...car, year: e.target.value })}
              >
                <option value=''>Select year</option>
                {[2025, 2024, 2023, 2022, 2021, 2020].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col w-full'>
              <label>Daily Price (₹)</label>
              <input
                type='number'
                min='0'
                placeholder='e.g. 2000'
                required
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.pricePerDay}
                onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
              />
            </div>

            <div className='flex flex-col w-full md:col-span-2'>
              <label>Category</label>
              <select
                required
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.category}
                onChange={(e) => setCar({ ...car, category: e.target.value })}
              >
                <option value=''>Select a category</option>
                <option value='SUV'>SUV</option>
                <option value='Sedan'>Sedan</option>
                <option value='Hatchback'>Hatchback</option>
                <option value='Luxury'>Luxury</option>
              </select>
            </div>

            <div className='flex flex-col w-full'>
              <label>Transmission</label>
              <select
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.transmission}
                onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              >
                <option value=''>Select transmission</option>
                <option value='Automatic'>Automatic</option>
                <option value='Manual'>Manual</option>
                <option value='Semi-Automatic'>Semi-Automatic</option>
                <option value='CVT'>CVT</option>
              </select>
            </div>

            <div className='flex flex-col w-full'>
              <label>Fuel Type</label>
              <select
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.fuel_type}
                onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              >
                <option value=''>Select fuel type</option>
                <option value='Petrol'>Petrol</option>
                <option value='Diesel'>Diesel</option>
                <option value='Electric'>Electric</option>
                <option value='Hybrid'>Hybrid</option>
              </select>
            </div>

            <div className='flex flex-col w-full'>
              <label>Seating Capacity</label>
              <input
                type='number'
                min='1'
                placeholder='e.g. 4'
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.seating_capacity}
                onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
              />
            </div>

            <div className='flex flex-col w-full'>
              <label>Location</label>
              <select
                className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none'
                value={car.location}
                onChange={(e) => setCar({ ...car, location: e.target.value })}
              >
                <option value=''>Select location</option>
                <option value='New Delhi'>New Delhi</option>
                <option value='Lucknow'>Lucknow</option>
                <option value='Kanpur'>Kanpur</option>
                <option value='Prayagraj'>Prayagraj</option>
                <option value='Mumbai'>Mumbai</option>
                <option value='Other'>Other</option>
              </select>
            </div>
          </div>

          <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea
              rows='4'
              placeholder='Write a short description about the car...'
              className='px-3 py-2 mt-1 border border-borderColor dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md outline-none resize-none'
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            />
          </div>

          <div className='flex justify-end w-full mt-4'>
            <button
              type='submit'
              className='bg-primary text-white px-4 py-2 rounded-md'
              disabled={isLoading}
            >
              {isLoading ? 'Listing...' : 'List Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCar

