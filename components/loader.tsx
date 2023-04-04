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

    // return content if load finished
    if (done) { return props.content }

    // display placeholder and content, transition between on load change
    return (
        <div className={styles.wrap}>
            <div className={props.loaded ? styles.hide : styles.show}>
                { props.placeholder }
            </div>
            <div className={props.loaded ? styles.show : styles.hide}>
                { props.content }
            </div>
        </div>
    )
}

export default Loader
