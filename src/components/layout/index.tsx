import { useApplicationSettings } from '@/services'
import { Box } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('./navbar-default-layout'), { ssr: false })

export const appBarHeight = 100
const normalSideBarWidth = 250
const miniSideBarWidth = 60


export const DefaultLayout = ({ children }: { children: ReactNode }) => {

    const isExpandDrawer = useApplicationSettings(state => state.value.expandSidebar)

    const drawerWidth = useMemo(() => {
        if (isExpandDrawer) {
            return normalSideBarWidth
        } else {
            return miniSideBarWidth
        }
    }, [isExpandDrawer])


    return (
        <>
            <Navbar drawerWidth={drawerWidth} />

            <Box
                component="main"
                sx={({ breakpoints, palette, shape }) => ({
                    flexGrow: 1,
                    padding: 2,
                    backgroundColor: palette.background.default,
                    minHeight: `calc(100vh - ${appBarHeight}px)`,
                    maxHeight: `calc(100vh - ${appBarHeight}px)`,
                    overflowY: 'auto',
                    marginTop: `calc(${appBarHeight}px)`,
                    borderTopLeftRadius: shape.borderRadius,
                    borderTopRightRadius: shape.borderRadius,
                    marginRight: '0px',
                    transition: 'background-color 0.3s ease',
                    [breakpoints.up('md')]: {
                        paddingLeft: `calc(${drawerWidth}px + 15px)`,
                    },
                    [breakpoints.down('md')]: {
                        marginInline: '8px',
                        paddingRight: 2,
                        paddingY: 1,
                    },
                })}
                className="transition-colors duration-300 bg-white dark:bg-gray-900 rounded-md"
            >
                {children}
            </Box>

        </>
    )
}
