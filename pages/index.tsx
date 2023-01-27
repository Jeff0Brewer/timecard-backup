import React from 'react'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import ClockIn from '@/components/clock-in'
// import styles from '@/styles/Home.module.css'

export default function Home () {
    const { data: session } = useSession()
    return (
        <>
            <Head>
                <title>Timecard</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>{
                session?.user?.email
                    ? <>
                        <button onClick={() => signOut()}>log out</button>
                        <ClockIn userEmail={session.user.email}/>
                    </>
                    : <button onClick={() => signIn()}>log in</button>
            }
        </>
    )
}
