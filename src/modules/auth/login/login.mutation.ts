import { useMutation } from '@tanstack/react-query'
import { LoginForm } from './login.schemas'

export interface SessionData {
    fullname: string
    username: string
    password: string
    session: string
}

export const useLoginMutation = () =>
    useMutation<SessionData, Error, LoginForm>({
        mutationFn: async data => {
            await new Promise(resolve => setTimeout(resolve, 2000))

            const sessionData = {
                ...data,
                session: `session-${Date.now()}`,
            }

            localStorage.setItem('user', JSON.stringify(sessionData))

            return sessionData
        },
        mutationKey: ['LOGIN'],
    })
