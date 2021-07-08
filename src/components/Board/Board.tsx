import { FC, useCallback } from 'react'
import { fsm } from '../../libs/fsm/fsm'
import { useMachine } from '../../libs/fsm/useMachine'
import { AboutView } from '../About/About'
import { ContactsView } from '../Contacts/Contacts'
import { HomeView } from '../Home/Home'

const updateMessage = (message: string) => ({
    message: `${message} now`
})

export const Board: FC = () => {
    const boardFsm = fsm({
        initState: 'home',
        context: {
            message: 'home now'
        },
        transitions: {
            home: {
                toAbout: {
                    target: 'about',
                    actions: [({ state }) => updateMessage(state)]
                }
            },
            about: {
                toHome: {
                    target: 'home',
                    actions: [({ state }) => updateMessage(state)]
                },
                toContacts: {
                    target: 'contacts',
                    actions: [({ state }) => updateMessage(state)]
                }
            },
            contacts: {
                toAbout: {
                    target: 'about',
                    actions: [({ state }) => updateMessage(state)]
                },
                toHome: {
                    target: 'home',
                    actions: [({ state }) => updateMessage(state)]
                }
            }
        }
    })

    const { state: currentPage, context } = useMachine(boardFsm)

    const send = (msg: string) => () => boardFsm.send(msg)

    const toAbout = useCallback(send('toAbout'), [])

    const toHome = useCallback(send('toHome'), [])

    const toContacts = useCallback(send('toContacts'), [])

    const pages = {
        home: <HomeView toAbout={toAbout} />,
        about: <AboutView toContacts={toContacts} toHome={toHome} />,
        contacts: <ContactsView toAbout={toAbout} toHome={toHome} />
    }

    return (
        <>
            {pages[currentPage as keyof typeof pages]}
            {context?.message}
        </>
    )
}
