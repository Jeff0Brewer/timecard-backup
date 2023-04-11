import React, { ReactElement } from 'react'
import Head from 'next/head'
import { useSession, signOut } from 'next-auth/react'
import SignIn from '@/components/sign-in'
import App from '@/components/app'
import styles from '@/styles/Home.module.css'

export default function Home (): ReactElement {
    const { data: session, status } = useSession()

    const renderFromStatus = (status: string): ReactElement => {
        switch (status) {
            case 'loading':
                return <div className={styles.loading}></div>

            case 'unauthenticated':
                return <SignIn />

            case 'authenticated':
                if (!session?.user?.email) {
                    throw new Error('No user email in current session')
                }
                return (
                    <div>
                        <App userEmail={session.user.email} />
                        <button className={styles.signOut} onClick={(): void => { signOut() }}>
                            log out
                        </button>
                    </div>
                )
        }
        throw new Error('Session status type unknown')
    }

    return (
        <>
            <Head>
                <title>Timecard Backup</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.home}>{ renderFromStatus(status) }</main>
        </>
    )
}
