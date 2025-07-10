import { useApplicationSettings } from '@/services'
import { IconButton, Tooltip } from '@mui/material'
import IconifyIcon from '../icon'

export const DarkModeToggleButton = () => {
    const screenMode = useApplicationSettings(state => state.value.screenMode)
    const toggleTheme = useApplicationSettings(state => state.changeScreenMode)
    const isDarkMode = screenMode === 'DARK'

    const handleToggle = () => {
        const newMode = isDarkMode ? 'LIGHT' : 'DARK'

        toggleTheme(newMode)

        const root = document.documentElement
        if (newMode === 'DARK') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }

    return (
        <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
            <IconButton onClick={handleToggle}>
                <IconifyIcon
                    icon={isDarkMode ? 'solar:sun-2-linear' : 'solar:moon-line-duotone'}
                    width={20}
                    height={20}
                />
            </IconButton>
        </Tooltip>
    )
}
