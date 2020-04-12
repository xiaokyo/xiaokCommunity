import React from 'react'

export default ({ icon, className, ...props }) => {

  return (
    <>
      <svg className={`${className} iconFont`} aria-hidden="true" {...props}>
        <use xlinkHref={`#${icon}`}></use>
      </svg>
    </>
  )
}