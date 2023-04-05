import React, { FC, ReactElement, useState, useEffect } from 'react'
import styles from '@/styles/Loader.module.css'

type LoaderProps = {
    loaded: boolean,
    placeholder: ReactElement,
    content: ReactElement
}

const Loader: FC<LoaderProps> = props => {
    const [done, setDone] = useState<boolean>(false)

    useEffect(() => {
        // set done state after waiting for animation to finish
        if (!done && props.loaded) {
            window.setTimeout(() => { setDone(true) }, 1000)
        }
    }, [props.loaded])

    return (
        <div className={done ? '' : styles.wrap}>
            { done ||
                <div className={props.loaded ? styles.hide : styles.show}>
                    { props.placeholder }
                </div> }
            { props.content }
        </div>
    )
}

export default Loader
