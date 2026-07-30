import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';

const Testimonial = () => {

        const testimonials = [
        { name: "Raj Kumar", 
          location: "Kolkata,West Bengal", 
          image: assets.testimonial_image_1,  
          testimonial: "I have rented cars from various companies, but the experience with CarRental was exceptional" 
        },
        
        { name: "Manpreet Kumar Roy", 
          location: "Muzzarfur, Bihar", 
          image: assets.testimonial_image_2,  
          testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!" 
        },

        { name: "Mihir Sharma", 
          location: "New Delhi", 
          image: assets.testimonial_image_1,  
          testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like i am getting the best deals with excellent service" 
        },
    ];


  return (
          <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

               <Title title="What Our Customers Say" subTitle="Discover why discerning travellers choose
               StayVentures for their luxury accommodation around the world."/>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">

                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl dark:text-gray-200">{testimonial.name}</p>
                                <p className="text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img  key={index} src={assets.star_icon} alt="star-icon"
                                 />
                            ))}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial
