import { Subscriber } from './fsm'

export type Transitions = Record<string, Record<string, string>>

export type SubscriberCallback = (state: string) => any

export type Subscribers = {
    all: Subscriber[]
    byTrigger: Record<string, Subscriber[]>
}

export type FSM = {
    state: string
    send(trigger: string): void
    subscribe(callback: SubscriberCallback, trigger?: string | null): () => void
}
