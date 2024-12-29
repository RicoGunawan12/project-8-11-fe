import { Spinner } from '@nextui-org/react'
import React from 'react'

const Loading = () => {
  return (
    <div className='w-screen bg-white h-screen flex justify-center items-center'>
      <Spinner label="Loading" color="primary" labelColor="primary"/>
    </div>
  )
}

const LoadingOverlay = () => {
  return (
    <div className='fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50'>
      <Spinner label="Loading" color="primary" labelColor="primary"/>
    </div>
  )
}

export { Loading, LoadingOverlay }
