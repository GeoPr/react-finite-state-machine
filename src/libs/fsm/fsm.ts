import { FSM, FSMInput, SubscriberCallback, Subscribers } from './types'

export class Subscriber {
    constructor(public callback: SubscriberCallback, public _id: number) {}
}

export const fsm = ({ initState, transitions, context }: FSMInput) => {
    const subscribers: Subscribers = {
        all: [],
        byTrigger: {}
    }

    class Machine implements FSM {
        state = initState
        context = context

        private notifyAllSubscribers() {
            if (subscribers.all.length) {
                subscribers.all.forEach(subscriber => subscriber.callback(this))
            }
        }

        private notifySubscribersByTrigger(trigger: string) {
            if (subscribers.byTrigger[trigger]?.length) {
                subscribers.byTrigger[trigger].forEach(subscriber =>
                    subscriber.callback(this)
                )
            }
        }

        private unsubscribe(subscribers: Subscriber[], subscriber: Subscriber) {
            return subscribers.filter(({ _id }) => subscriber._id !== _id)
        }

        async send(trigger: string) {
            const { target, actions } = transitions[this.state][trigger]

            if (target && target !== this.state) {
                this.state = target

                if (actions?.length) {
                    const { state, context } = this

                    for await (const action of actions) {
                        const newContext = await action({ state, context })
                        this.context = {
                            ...this.context,
                            ...newContext
                        }
                    }
                }

                this.notifyAllSubscribers()
                this.notifySubscribersByTrigger(trigger)
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
