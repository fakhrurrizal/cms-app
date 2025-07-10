'use client'

import { useApplicationSettings, useAuth } from '@/services'
import { menu_static, pathnames } from '@/utils'
import { MenuOutlined } from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { PropsWithChildren, useState } from 'react'
import { appBarHeight } from '..'
import ExpandedDrawer from './drawer'
import { GenerateMiniListItem } from './mini-navbar'
import { DarkModeToggleButton } from '@/components/darkmode'
import { useTheme } from '@mui/material/styles'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const UserMenu = dynamic(() => import('@/components/user-menu').then(mod => mod.UserMenu), { ssr: false })

interface NavbarProps extends PropsWithChildren<any> {
    drawerWidth?: number
}

const Navbar: React.FC<NavbarProps> = ({ drawerWidth }: NavbarProps) => {
    const { push } = useRouter()
    const logout = useAuth(state => state.logout)
    const list_menu = menu_static
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)
    const isExpandDrawer = useApplicationSettings(state => state.value.expandSidebar)
    const toggleExpandDrawer = useApplicationSettings(state => state.toggleExpandSidebar)
    const theme = useTheme()



    const handleDrawerToggle = () => setMobileOpen(prev => !prev)

    const handleLogout = async () => {
        logout()
        push(pathnames.login)
    }

    return (
        <Box sx={({ palette }) => ({ backgroundColor: palette.background.default })}>
            <AppBar
                position='fixed'
                sx={{
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    zIndex: theme.zIndex.drawer + 1,
                }}
                className='!shadow-sm border-b-2'
            >
                <Toolbar sx={{ minHeight: `${appBarHeight}px !important` }} className='flex justify-between gap-3'>
                    <Box className='page-header flex gap-1 shrink-0'>
                        <div className="flex-shrink-0 md:ml-11 py-1 text-xl font-bold tracking-wide text-blue-600 ">
                            CMS <span className="text-orange-500">App</span>
                        </div>

                        <Box
                            sx={({ breakpoints }) => ({
                                width: 30,
                                display: 'flex',
                                marginLeft: 8,
                                alignItems: 'center',
                                [breakpoints.down('md')]: {
                                    display: 'none',
                                },
                            })}
                        >
                            <IconButton onClick={toggleExpandDrawer}>
                                <MenuOutlined color='primary' />
                            </IconButton>
                        </Box>

                        <Box
                            sx={({ breakpoints }) => ({
                                display: 'none',
                                alignItems: 'center',
                                [breakpoints.down('md')]: {
                                    display: 'flex',
                                },
                            })}
                        >
                            <IconButton onClick={handleDrawerToggle}>
                                <MenuOutlined color='primary' />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box className='flex items-center gap-2'>
                        <DarkModeToggleButton />
                        <div className='sm:flex hidden items-center h-full'>
                            <UserMenu handleLogout={handleLogout} />
                        </div>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant='permanent'
                transitionDuration={300}
                sx={({ breakpoints }) => ({
                    width: drawerWidth,
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'all .5s',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: theme.palette.background.default,
                        pt: '10px',
                        pr: '3px',
                    },
                    [breakpoints.down('md')]: {
                        display: 'none',
                    },
                })}
                className='shadow-md'
            >
                {isExpandDrawer ? (
                    <ExpandedDrawer
                        items={list_menu}
                        appBarHeight={appBarHeight}
                        handleLogout={handleLogout}
                    />
                ) : (
                    <GenerateMiniListItem items={list_menu} />
                )}
            </Drawer>

            <Drawer
                variant='temporary'
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: '80%',
                        paddingTop: `${appBarHeight}px`,
                        borderRight: 'none',
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                <ExpandedDrawer items={list_menu} appBarHeight={appBarHeight} handleLogout={handleLogout} />
            </Drawer>
        </Box>
    )
}

export default Navbar
