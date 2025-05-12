import React from 'react'
import { useEffect } from 'react'
import { useProblemStore } from '../store/useProblemStore'

function Problems() {
  const {getAllProblems , problems , isProblemLoading} = useProblemStore()

  useEffect(() => {
    getAllProblems()
  }, [])
  
  return (
    <div>Problems</div>
  )
}

export default Problems