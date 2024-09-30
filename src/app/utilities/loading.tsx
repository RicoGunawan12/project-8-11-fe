import { Spinner } from '@nextui-org/react'
import React from 'react'

const Loading = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'><Spinner label="Loading" color="primary" labelColor="primary"/></div>
  )
}

export default Loading