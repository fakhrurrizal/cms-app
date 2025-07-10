import { localKey } from '@/utils'
import { create } from 'zustand'

export type ScreenMode = 'DARK' | 'LIGHT'

export interface ApplicationSettings {
    screenMode: ScreenMode
    expandSidebar: boolean
}

export interface ApplicationSettingsState {
    value: ApplicationSettings

    isHydrated: boolean

    changeScreenMode: (screenMode: ScreenMode) => void

    toggleExpandSidebar: () => void

    setExpandSidebar: (expandSidebar: boolean) => void

    hydrate: () => void
}

const defaultValue: ApplicationSettings = {
    screenMode: 'LIGHT',
    expandSidebar: true,
}

const getInitialState: () => ApplicationSettings = () => {
    if (typeof window === 'undefined') return defaultValue

    const storedData = localStorage.getItem(localKey.application_settings)

    if (!storedData) return defaultValue

    const parseStoredData: ApplicationSettings = JSON.parse(storedData)

    return parseStoredData
}

const initialState: ApplicationSettings = getInitialState()

export const useApplicationSettings = create<ApplicationSettingsState>()(set => ({
    value: initialState,

    isHydrated: false,

    hydrate: () => {
        const stored = getInitialState()
        set({
            value: stored,
            isHydrated: true,
        })
    },

    changeScreenMode: screenMode =>
        set(state => {
            const nextState: ApplicationSettings = { ...state.value, screenMode }

            localStorage.setItem(localKey.application_settings, JSON.stringify(nextState))

            return { ...state, value: nextState }
        }),

    toggleExpandSidebar: () =>
        set(state => {
            const nextState: ApplicationSettings = {
                ...state.value,
                expandSidebar: !state.value.expandSidebar,
            }

            localStorage.setItem(localKey.application_settings, JSON.stringify(nextState))

            return { ...state, value: nextState }
        }),

    setExpandSidebar: expandSidebar =>
        set(state => {
            const nextState: ApplicationSettings = {
                ...state.value,
                expandSidebar,
            }

            localStorage.setItem(localKey.application_settings, JSON.stringify(nextState))

            return { ...state, value: nextState }
        }),
}))
