




const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='addorupdate'>
      {message}
    </div>
  )
}


export default Notification