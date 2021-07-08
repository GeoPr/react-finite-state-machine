import { FSM, SubscriberCallback, Subscribers, Transitions } from './types'

export class Subscriber {
    constructor(public callback: SubscriberCallback, public _id: number) {}
}

export const fsm = (initState: string, transitions: Transitions) => {
    const subscribers: Subscribers = {
        all: [],
        byTrigger: {}
    }

    class Machine implements FSM {
        state = initState

        private notifyAllSubscribers(state: string) {
            if (subscribers.all.length) {
                subscribers.all.forEach(subscriber =>
                    subscriber.callback(state)
                )
            }
        }

        private notifySubscribersByTrigger(state: string, trigger: string) {
            if (subscribers.byTrigger[trigger]?.length) {
                subscribers.byTrigger[trigger].forEach(subscriber =>
                    subscriber.callback(state)
                )
            }
        }

        private unsubscribe(subscribers: Subscriber[], subscriber: Subscriber) {
            return subscribers.filter(({ _id }) => subscriber._id !== _id)
        }

        send(trigger: string) {
            const nextState = transitions[this.state][trigger]

            if (nextState && nextState !== this.state) {
                this.state = nextState

                this.notifyAllSubscribers(this.state)
                this.notifySubscribersByTrigger(this.state, trigger)
            }
        }

        subscribe(callback: SubscriberCallback, trigger: string | null = null) {
            if (trigger) {
                subscribers.byTrigger[trigger] =
                    subscribers.byTrigger[trigger] ?? []

                const subscribersByCurrentTrigger =
                    subscribers.byTrigger[trigger]

                const subscriber = new Subscriber(
                    callback,
                    subscribersByCurrentTrigger.length
                )

                subscribersByCurrentTrigger.push(subscriber)

                return () => {
                    subscribers.byTrigger[trigger] = this.unsubscribe(
                        subscribers.byTrigger[trigger],
                        subscriber
                    )
                }
            }

            const subscriber = new Subscriber(callback, subscribers.all.length)
            subscribers.all.push(subscriber)

            return () => {
                subscribers.all = this.unsubscribe(subscribers.all, subscriber)
            }
        }
    }

    return new Machine()
}
