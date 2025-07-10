import { localKey } from '@/utils'
import { create } from 'zustand'

export interface Auth {
    user?: { username: string; password: string, fullname: string}
}

const emptyUser: Auth = {
    user: undefined,
}

const getInitialState: () => Auth = () => {
    if (typeof window === 'undefined') return emptyUser

    const storedData = localStorage.getItem(localKey.auth)

    if (!storedData) {
        return emptyUser
    }

    const parseStoredData: Auth = JSON.parse(atob(storedData))

    return parseStoredData
}

const initialState: Auth = getInitialState()

export interface AuthState {
    value: Auth

    setAuth: (auth: Auth) => void

    setUser: (auth: Auth) => void

    isLogin: () => boolean

    logout: () => void
}

export const useAuth = create<AuthState>()((set, getState) => ({
    value: initialState,

    setAuth: auth => {
        localStorage.setItem(localKey.auth, btoa(JSON.stringify(auth)))

        return set(state => ({
            ...state,
            value: { ...state.value, user: auth.user },
        }))
    },

    isLogin: () => {
        const state = getState()
        const user = state.value.user

        return Boolean(user)
    },

    setUser: (user: any) => {
        localStorage.setItem(localKey.auth, btoa(JSON.stringify({ ...getState().value, user })))

        return set(state => ({
            value: { ...state.value, user },
        }))
    },

    logout: async () => {
        localStorage.clear()

        return set(state => ({
            ...state,
            value: emptyUser,
        }))
    },
}))
