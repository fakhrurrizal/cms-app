export const menu_static = [
    {
        path: '/',
        name: 'Home',
        icon: 'solar:home-outline',
        children: [],
    },
    {
        path: '/settings',
        name: 'Settings',
        icon: 'mdi:settings-outline',
        children: [],
    },
]

export interface MenuItem {
    path: string
    name: string
    icon: string
    role?: number[]
    children?: MenuItem[]
}
