import { useEffect, useState } from 'react'
import { FSM } from './types'

export const useMachine = (machine: FSM) => {
    const [model, setModel] = useState(machine)

    useEffect(() => {
        const unsubscribe = machine.subscribe(newMachine => {
            setModel(prev => ({
                ...prev,
                ...newMachine
            }))
        })

        return () => unsubscribe()
    }, [])

    return model
}
