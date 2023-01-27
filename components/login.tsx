import React, { FC } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

const Login: FC = () => {
    const { data: session } = useSession()
    if (session && session.user) {
        return (
            <>
                <p>User: {session.user.email}</p>
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            <p>Logged out</p>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}

export default Login
