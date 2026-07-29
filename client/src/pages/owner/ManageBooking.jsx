import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const ManageBooking = () => {

  const { axios, currency } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <div className='text-left'>
        <h1 className='text-2xl font-semibold text-gray-800'>Manage Bookings</h1>
        <p className='text-sm text-gray-500 mt-1'>Track all customer bookings, approve
            or cancel requests, and manage booking status.</p>
      </div>

      <div className='mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
        <div className='grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600'>
          <div>Car</div>
          <div>Date Range</div>
          <div>Total Price</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {bookings.length === 0 ? (
          <div className='px-4 py-12 text-center text-gray-400'>
            <p className='text-lg font-medium'>No bookings yet</p>
            <p className='text-sm mt-1'>Bookings will appear here when customers book your cars.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className='grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] items-center gap-4 border-b border-gray-200 px-4 py-3 text-sm last:border-b-0'>
              <div className='flex items-center gap-3'>
                <img src={booking.car?.image} alt='' className='h-12 w-12 rounded object-cover' />
                <div>
                  <p className='font-medium text-gray-800'>{booking.car?.brand} {booking.car?.model}</p>
                  <p className='text-xs text-gray-500'>{booking.car?.category}</p>
                </div>
              </div>

              <div className='text-gray-600'>
                {new Date(booking.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              <div className='text-gray-600'>{currency} {booking.price}</div>

              <div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
              </div>

              <div>
                <select
                  value={booking.status}
                  onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                  className='rounded border border-gray-200 bg-white px-2 py-2 text-sm outline-none'
                >
                  <option value='pending'>Pending</option>
                  <option value='confirmed'>Confirmed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageBooking
