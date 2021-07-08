import { Subscriber } from './fsm'

type Model = Omit<FSM, 'send' | 'subscribe'>

type Transition = {
    target: string
    actions?: Array<
        (model: Model) => FSMInput['context'] | Promise<FSMInput['context']>
    >
}

export type Transitions = Record<string, Record<string, Transition>>

export type SubscriberCallback = (currentMachine: FSM) => any

export type Subscribers = {
    all: Subscriber[]
    byTrigger: Record<string, Subscriber[]>
}

export type FSMInput = {
    initState: string
    transitions: Transitions
    context?: Record<string, any>
}

export type FSM = {
    state: string
    context: FSMInput['context']
    send(trigger: string): void
    subscribe(callback: SubscriberCallback, trigger?: string | null): () => void
}
