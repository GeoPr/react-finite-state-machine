import { FC } from 'react'
import { BoardView } from '../Board/View/View'

type Props = {
    toHome(): void
    toContacts(): void
}

const About: FC<Props> = props => {
    return (
        <>
            <BoardView title="about" subtitle="lorem about">
                <button onClick={props.toHome}>home</button>
                <button onClick={props.toContacts}>contacts</button>
            </BoardView>
        </>
    )
}

export { About as AboutView }
