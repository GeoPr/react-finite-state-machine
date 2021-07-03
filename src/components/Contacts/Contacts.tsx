import { FC } from 'react'
import { BoardView } from '../Board/View/View'

type Props = {
    toHome(): void
    toAbout(): void
}

const Contacts: FC<Props> = props => {
    return (
        <BoardView title="contacts" subtitle="lorem contacts">
            <button onClick={props.toAbout}>about</button>
            <button onClick={props.toHome}>home</button>
        </BoardView>
    )
}

export { Contacts as ContactsView }