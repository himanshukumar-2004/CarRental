import React from 'react'

const Title = ({ title, subTitle, subtitle, align }) => {
  const description = subTitle ?? subtitle ?? ''

  return (
    <div className={`flex flex-col items-start text-left ${align === 'left' ? 'items-start text-left' : 'items-center text-center'}`}>
      <h1 className='font-semibold text-4xl md:text-[40px] text-left'>{title}</h1>
      {description ? <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-156 text-left'>{description}</p> : null}
    </div>
  )
}

export default Title
