import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const { axios, user, currency } = useAppContext()

  const formatDate = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyBookings()
    }
  }, [user])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto'>
      <Title
        title='My Bookings'
        subTitle='View and manage all your car bookings'
        align='left'
      />

      <div className='mt-8'>
        {bookings.length === 0 ? (
          <div className='text-center py-16 text-gray-500 border border-borderColor rounded-lg bg-white shadow-sm'>
            <p className='text-lg font-medium text-gray-700'>No Bookings Found</p>
            <p className='text-sm text-gray-400 mt-1'>
              You haven't made any car bookings yet.
            </p>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div
              key={booking._id}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mb-6 bg-white shadow-sm'
            >
              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3 bg-gray-100'>
                  <img
                    src={booking.car?.image || assets.main_car}
                    alt={`${booking.car?.brand} ${booking.car?.model}`}
                    className='w-full h-auto aspect-video object-cover'
                  />
                </div>

                <p className='text-lg font-medium mt-2 text-gray-800'>
                  {booking.car?.brand} {booking.car?.model}
                </p>
                <p className='text-gray-500 text-xs mt-0.5'>
                  {booking.car?.year} · {booking.car?.category} · {booking.car?.location}
                </p>
              </div>

              <div className='md:col-span-2 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='px-3 py-1 bg-light text-gray-600 rounded-md font-medium text-xs'>
                      Booking #{index + 1}
                    </p>
                    <p
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.status || 'Pending'}
                    </p>
                  </div>

                  <div className='flex items-start gap-2.5 mt-4'>
                    <img src={assets.calendar_icon_colored} alt='' className='w-4 h-4 mt-1' />
                    <div>
                      <p className='text-gray-400 text-xs'>Rental Period</p>
                      <p className='text-gray-700 font-medium'>
                        {formatDate(booking.pickupDate)} to {formatDate(booking.returnDate)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-2.5 mt-3'>
                    <img src={assets.location_icon_colored} alt='' className='w-4 h-4 mt-1' />
                    <div>
                      <p className='text-gray-400 text-xs'>Pick-up Location</p>
                      <p className='text-gray-700 font-medium'>{booking.car?.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Date */}
              <div className='md:col-span-1 flex flex-col justify-between items-end max-md:items-start max-md:border-t max-md:pt-4 border-borderColor'>
                <div className='text-sm text-gray-500 md:text-right'>
                  <p className='text-xs text-gray-400'>Total Price</p>
                  <h1 className='text-2xl font-bold text-primary mt-0.5'>
                    {currency}{booking.price}
                  </h1>
                  <p className='text-xs text-gray-400 mt-2'>
                    Booked on {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBookings
