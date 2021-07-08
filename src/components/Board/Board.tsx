import { FC, useCallback } from 'react'
import { fsm } from '../../libs/fsm/fsm'
import { useMachine } from '../../libs/fsm/useMachine'
import { AboutView } from '../About/About'
import { ContactsView } from '../Contacts/Contacts'
import { HomeView } from '../Home/Home'

export const Board: FC = () => {
    const boardFsm = fsm('home', {
        home: {
            toAbout: 'about'
        },
        about: {
            toHome: 'home',
            toContacts: 'contacts'
        },
        contacts: {
            toAbout: 'about',
            toHome: 'home'
        }
    })

    const currentPage = useMachine(boardFsm)

    const send = (msg: string) => () => boardFsm.send(msg)

    const toAbout = useCallback(send('toAbout'), [])

    const toHome = useCallback(send('toHome'), [])

    const toContacts = useCallback(send('toContacts'), [])

    const pages = {
        home: <HomeView toAbout={toAbout} />,
        about: <AboutView toContacts={toContacts} toHome={toHome} />,
        contacts: <ContactsView toAbout={toAbout} toHome={toHome} />
    }

    return <>{pages[currentPage as keyof typeof pages]}</>
}
