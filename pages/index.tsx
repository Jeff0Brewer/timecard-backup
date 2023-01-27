import React from 'react'
import Head from 'next/head'
import { useSession, signOut } from 'next-auth/react'
import ClockIn from '@/components/clock-in'
import SignIn from '@/components/sign-in'
import styles from '@/styles/Home.module.css'

export default function Home () {
    const { data: session } = useSession()
    return (
        <>
            <Head>
                <title>Timecard</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.home}>{
                session?.user?.email
                    ? <div>
                        <button className={styles.signOut} onClick={() => signOut()}>log out</button>
                        <ClockIn userEmail={session.user.email}/>
                    </div>
                    : <SignIn />
            }</main>
        </>
    )
}
