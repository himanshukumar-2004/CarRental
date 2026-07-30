import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)

  const {
    cars,
    axios,
    currency,
    user,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useAppContext()

  useEffect(() => {
    if (cars && cars.length > 0) {
      const foundCar = cars.find((c) => c._id === id)
      if (foundCar) {
        setCar(foundCar)
        return
      }
    }
    // Fallback to dummy data if not found in context cars
    const dummyFound = dummyCarData.find((c) => c._id === id)
    if (dummyFound) {
      setCar(dummyFound)
    }
  }, [cars, id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to book a car')
      setShowLogin(true)
      return
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates')
      return
    }

    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
      })

      if (data.success) {
        toast.success(data.message || 'Booking Created Successfully!')
        navigate('/my-bookings')
      } else {
        toast.error(data.message || 'Failed to book car')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button
        onClick={() => navigate('/cars')}
        className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <div className='lg:col-span-2'>
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-auto max-h-96 object-cover rounded-xl mb-6 shadow-md'
          />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>
                {car.brand} {car.model}
              </h1>
              <p className='text-gray-500 text-lg'>
                {car.category} · {car.year}
              </p>
            </div>

            <hr className='border-borderColor my-6' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt='' className='h-5 mb-2' />
                  <span className='text-sm text-gray-600'>{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className='text-xl font-medium mb-3'>Description</h2>
              <p className='text-gray-500'>{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className='text-xl font-medium mb-3'>Features</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {['360 camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear View Mirror'].map(
                  (item) => (
                    <li key={item} className='flex items-center text-gray-500'>
                      <img src={assets.check_icon} alt='' className='h-4 mr-2' />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <form
          onSubmit={handleSubmit}
          className='shadow-lg h-max sticky top-16 rounded-xl p-6 space-y-6 text-gray-500 bg-white border border-gray-100'
        >
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.pricePerDay}
            <span className='text-base text-gray-400 font-normal'>per day</span>
          </p>
          <hr className='border-borderColor my-6' />

          <div className='flex flex-col gap-2'>
            <label htmlFor='pickup-date'>Pickup Date</label>
            <input
              type='date'
              id='pickup-date'
              value={pickupDate || ''}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='border border-borderColor px-3 py-2 rounded-lg text-gray-700 outline-none focus:border-primary'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input
              type='date'
              id='return-date'
              value={returnDate || ''}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className='border border-borderColor px-3 py-2 rounded-lg text-gray-700 outline-none focus:border-primary'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer shadow'
          >
            Book Now
          </button>

          <p className='text-center text-sm text-gray-400'>No credit card required to reserve</p>
        </form>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

export default CarDetails
