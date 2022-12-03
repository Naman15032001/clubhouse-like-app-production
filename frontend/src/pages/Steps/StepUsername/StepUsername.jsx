import React from 'react'
import styles from './StepUsername.module.css';

const StepUsername = ({onNext}) => {
  return (
    <>
      <div>StepUsername</div>
      <button onClick={onNext}>Next</button>
    </>
  )
}

export default StepUsername