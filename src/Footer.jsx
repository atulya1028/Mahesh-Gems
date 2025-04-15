import React from 'react'

const Footer = () => {
  return (
    <div className="mt-[50vh]">
      <hr className="m-10 border-t-2 border-gray-500" />
      <p className="pb-5 text-sm text-center text-gray-600">
        &copy; {new Date().getFullYear()} Mahesh Gems. All rights reserved.
      </p>
    </div>
  )
}

export default Footer