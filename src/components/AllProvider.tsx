"use client"
import { Provider } from "react-redux"
import { store } from "../store"
import { SessionProvider } from "next-auth/react"

interface Props {
    children :  React.ReactNode
} 

const AllProvider = ( { children } : Props ) => {
    return (
        <SessionProvider>
            <Provider store={store}>
                {children}
            </Provider>
        </SessionProvider>
    )
}

export default AllProvider;