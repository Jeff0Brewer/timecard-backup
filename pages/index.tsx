import React from 'react'
import Head from 'next/head'
import Login from '@/components/login'
// import styles from '@/styles/Home.module.css'

export default function Home () {
    return (
        <>
            <Head>
                <title>Timecard</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Login />
        </>
    )
}
