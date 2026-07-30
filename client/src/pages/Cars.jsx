import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import CarCard from '../components/CarCard'
import { assets } from '../assets/assets'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation') || ''
  const pickupDate = searchParams.get('pickupDate') || ''
  const returnDate = searchParams.get('returnDate') || ''

  const { cars, axios } = useAppContext()

  const [input, setInput] = useState('')
  const [availableCars, setAvailableCars] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const isSearchData = Boolean(pickupLocation && pickupDate && returnDate)

  const searchCarAvailability = async () => {
    try {
      setIsSearching(true)
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      })

      if (data.success) {
        setAvailableCars(data.availableCars)
        if (data.availableCars.length === 0) {
          toast.error('No cars available for selected location and dates', { id: 'search-cars-error' })
        }
      } else {
        toast.error(data.message || 'Failed to check availability', { id: 'search-cars-error' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: 'search-cars-error' })
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability()
    }
  }, [pickupLocation, pickupDate, returnDate])

  const baseCars = isSearchData ? availableCars : (cars || [])

  const displayCars = baseCars.filter((car) => {
    if (!input.trim()) return true
    const term = input.toLowerCase()
    return (
      car.brand?.toLowerCase().includes(term) ||
      car.model?.toLowerCase().includes(term) ||
      car.category?.toLowerCase().includes(term) ||
      car.location?.toLowerCase().includes(term) ||
      car.transmission?.toLowerCase().includes(term) ||
      car.fuel_type?.toLowerCase().includes(term)
    )
  })

  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title
          title='Available Cars'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />

        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt='' className='w-4.5 h-4.5 mr-2' />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />

          <img src={assets.filter_icon} alt='' className='w-4.5 h-4.5 ml-2' />
        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>
          {isSearching ? 'Checking availability...' : `Showing ${displayCars.length} Cars`}
        </p>

        {displayCars.length === 0 && !isSearching ? (
          <div className='text-center py-16 text-gray-500'>
            <p className='text-xl font-medium'>No cars available</p>
            <p className='text-sm mt-2'>Try adjusting your search criteria or pickup location.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
            {displayCars.map((car) => (
              <div key={car._id}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cars
