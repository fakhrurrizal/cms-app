import { ErrorBoundary } from '@/components'
import { useApplicationSettings } from '@/services'
import { useGetTheme } from '@/services/theme'
import '@/styles/globals.css'
import { NextPageWithLayout, queryClient, ToastProvider } from '@/utils'
import { ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'


type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const theme = useGetTheme()

    const getLayout = Component.getLayout ?? (page => page)

    const components = getLayout(<Component {...pageProps} />)

    useEffect(() => {
        const root = document.documentElement
        const screenMode = useApplicationSettings.getState().value.screenMode
        useApplicationSettings.getState().hydrate()
        if (screenMode === 'DARK') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [])

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                    <link rel='icon' href='/logos.ico' />
                    <title>CMS App</title>
                </Head>
                <ErrorBoundary>
                    <ThemeProvider theme={theme}>
                        <ToastProvider>{components}</ToastProvider>
                    </ThemeProvider>
                </ErrorBoundary>
            </QueryClientProvider>
        </>
    )
}
