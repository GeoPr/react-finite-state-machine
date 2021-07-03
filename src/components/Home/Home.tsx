import { FC } from 'react'
import { BoardView } from '../Board/View/View'

type Props = {
    toAbout(): void
}

const Home: FC<Props> = props => (
    <>
        <BoardView title="home" subtitle="lorem home">
            <button onClick={props.toAbout}>about</button>
        </BoardView>
    </>
)

export { Home as HomeView }
