import React, { FC } from 'react'
import { signIn } from 'next-auth/react'
import styles from '@/styles/SignIn.module.css'

const SignIn: FC = () => {
    return (
        <section className={styles.wrap}>
            <div>
                <h1 className={styles.header}>Timecard Backup</h1>
                <button className={styles.signIn} onClick={(): void => { signIn() }}>Log In</button>
            </div>
        </section>
    )
}

export default SignIn
