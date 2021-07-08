import { useEffect, useState } from 'react'
import { FSM } from './types'

export const useMachine = (machine: FSM) => {
    const [currentState, setCurrentState] = useState(machine.state)

    useEffect(() => {
        const unsubscribe = machine.subscribe(nextState => {
            setCurrentState(nextState)
        })

        return () => unsubscribe()
    }, [])

    return currentState
}
