import { FC } from 'react'

type Props = {
    title: string
    subtitle: string
}

const View: FC<Props> = props => {
    return (
        <div>
            <h4>{props.title}</h4>
            <p>{props.subtitle}</p>
            {props.children}
        </div>
    )
}

export { View as BoardView }
