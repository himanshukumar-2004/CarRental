import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { toast } from 'react-hot-toast'

const CarDetails = () => {

  const { id } = useParams()
  const { cars, axios, pickupDate, setPickupDate, setReturnDate, returnDate, user, setAuthRole, setShowLogin } = useAppContext()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book a car')
      setAuthRole('customer')
      setShowLogin(true)
      return
    }

    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })

      if (!data.success) {
        toast.error(data.message)
        return
      }

      // Open Razorpay Checkout (Test Mode) directly so the user pays before the booking is finalized
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Car Rental',
        description: `Booking for ${car.brand} ${car.model}`,
        order_id: data.order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#2563eb'
        },
        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post('/api/bookings/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              car: id,
              pickupDate,
              returnDate
            })

            if (verifyData.success) {
              toast.success(verifyData.message)
              navigate('/my-bookings')
            } else {
              toast.error(verifyData.message)
            }
          } catch (error) {
            toast.error(error.message)
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpayCheckout = new window.Razorpay(options)
      razorpayCheckout.open()

    } catch (error) {
      toast.error(error.message)
    }
  }

  const location = useLocation()

  useEffect(() => {
    if (location.state && location.state.car) {
      setCar(location.state.car)
    } else {
      setCar(cars.find(c => c._id === id) ?? null)
    }
  }, [cars, id, location])

  return car ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => navigate('/cars')}
        className='flex items-center gap-2 mb-6 text-gray-500 dark:text-gray-400 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
        Back to all cars
      </motion.button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <div className='lg:col-span-2'>
          <motion.img
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-auto max-h-96 object-cover rounded-xl mb-6 shadow-md'
          />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold dark:text-gray-100'>
                {car.brand} {car.model}
              </h1>
              <p className='text-gray-500 dark:text-gray-400 text-lg'>
                {car.category} · {car.year}
              </p>
            </div>

            <hr className='border-borderColor dark:border-gray-700 my-6' />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt='' className='h-5 mb-2' />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}>
              <h2 className='text-xl font-medium mb-3 dark:text-gray-100'>Description</h2>
              <p className='text-gray-500 dark:text-gray-400'>{car.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}>
              <h2 className='text-xl font-medium mb-3 dark:text-gray-100'>Features</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {['360 camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear View Mirror'].map(item => (
                  <li key={item} className='flex items-center text-gray-500 dark:text-gray-400'>
                    <img src={assets.check_icon} alt='' className='h-4 mr-2' />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          onSubmit={handleSubmit} className='shadow-lg h-max sticky top-16 rounded-xl p-6 space-y-6 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800'>
          <p className='flex items-center justify-between text-2xl text-gray-800 dark:text-gray-100'>
            {currency}{car.pricePerDay}
            <span className='text-base text-gray-400 dark:text-gray-500 font-normal'>per day</span>
          </p>
          <hr className='border-borderColor dark:border-gray-700 my-6' />

          <div className='flex flex-col gap-2'>
            <label htmlFor='pickup-date'>Pickup Date</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
              type='date'
              id='pickup-date'
              min={new Date().toISOString().split('T')[0]}
              className='border border-borderColor dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-3 py-2 rounded-lg'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              type='date'
              id='return-date'
              className='border border-borderColor dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-3 py-2 rounded-lg'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'
          >
            Book Now
          </button>

          <p className='text-center text-sm'>No credit card required to reserve</p>
        </motion.form>
      </div>
    </motion.div>
  ) : (
    <Loader />
  )
}

export default CarDetails
