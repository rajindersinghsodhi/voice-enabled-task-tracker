import Board from '@/components/Board'
import ProtectedPage from '@/components/ProtectedPage'
import React from 'react'

const Tasks = () => {
  return (
    <ProtectedPage>
        <Board />
    </ProtectedPage>
  )
}

export default Tasks