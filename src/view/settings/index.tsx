import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import {
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Container,
    Fade,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material'
import React, { useEffect, useState, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import ModalGroup from './components/modal-group'
import ModalMenu from './components/modal-menu'
import { GroupData, groupSchema, MenuData, menuSchema, MenuSettingsFormData, menuSettingsSchema } from './schema'
import { EntriesText, PaginationMui } from '@/components'

const initialData: MenuSettingsFormData = {
    groups: []
}

const SettingsMenuView: React.FC = () => {
    const theme = useTheme()
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [expandedGroups, setExpandedGroups] = useState<string[]>([])
    const [editingGroup, setEditingGroup] = useState<GroupData | null>(null)
    const [editingMenu, setEditingMenu] = useState<{ menu: MenuData; groupIndex: number } | null>(null)
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState<boolean>(false)
    const [isMenuDialogOpen, setIsMenuDialogOpen] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null)
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [pageSize] = useState<number>(5)
    const toggleDialogGroup = () => setIsGroupDialogOpen(!isGroupDialogOpen)
    const toggleMenuDialog = () => setIsMenuDialogOpen(!isMenuDialogOpen)
    const handlePageChange = (event: any, newPage: number) => {
        setPage(newPage)
    }

    const loadFromLocalStorage = (): MenuSettingsFormData => {
        if (typeof window === 'undefined') {
            return initialData
        }
        try {
            const savedData = localStorage.getItem('menuSettings')
            if (savedData && savedData !== 'undefined' && savedData !== 'null') {
                const parsedData = JSON.parse(savedData)
                if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.groups)) {
                    return parsedData
                }
            }
        } catch (error) {
            console.error('Error parsing localStorage:', error)
        }

        return initialData
    }

    const saveToLocalStorage = (data: MenuSettingsFormData) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('menuSettings', JSON.stringify(data))
            } catch (error) {
                toast.error(`Error saving to localStorage: ${error}`)
            }
        }
    }

    const { control, watch, reset } = useForm<MenuSettingsFormData>({
        resolver: zodResolver(menuSettingsSchema),
        defaultValues: initialData,
    })

    const { fields: groupFields, append: appendGroup, remove: removeGroup, update: updateGroup, } =
        useFieldArray({
            control,
            name: 'groups',
        })

    const watchedGroups = watch('groups')

    const paginatedGroups = useMemo(() => {
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize

        return groupFields.slice(startIndex, endIndex)
    }, [groupFields, page, pageSize])

    const totalGroups = groupFields.length

    useEffect(() => {
        const savedData = loadFromLocalStorage()
        if (savedData.groups.length > 0) {
            reset(savedData)
        }
        setIsDataLoaded(true)
    }, [reset])

    useEffect(() => {
        if (isDataLoaded) {
            const currentData = { groups: watchedGroups }
            saveToLocalStorage(currentData)
        }
    }, [watchedGroups, isDataLoaded])

    useEffect(() => {
        setIsVisible(true)
    }, [])

    useEffect(() => {
        const maxPage = Math.ceil(totalGroups / pageSize) || 1
        if (page > maxPage) {
            setPage(1)
        }
    }, [totalGroups, pageSize, page])

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        )
    }

    const handleAddGroup = () => {
        setEditingGroup(null)
        groupForm.reset({ id: '', name: '', description: '' })
        setIsGroupDialogOpen(true)
    }

    const handleEditGroup = (group: GroupData, displayIndex: number) => {
        const actualIndex = (page - 1) * pageSize + displayIndex
        setEditingGroup(group)
        groupForm.reset({
            id: group.id,
            name: group.name,
            description: group.description,
        })
        setSelectedGroupIndex(actualIndex)
        setIsGroupDialogOpen(true)
    }

    const handleDeleteGroup = (displayIndex: number) => {
        const actualIndex = (page - 1) * pageSize + displayIndex
        removeGroup(actualIndex)
        toast.success('Grup berhasil dihapus')
    }

    const handleSaveGroup = (data: any) => {
        if (editingGroup && selectedGroupIndex !== null) {
            const currentGroup = watchedGroups[selectedGroupIndex]
            updateGroup(selectedGroupIndex, {
                ...currentGroup,
                ...data,
            })
            toast.success('Grup berhasil diperbarui')
        } else {
            appendGroup({
                ...data,
                id: Date.now().toString(),
                menus: [],
            })
            toast.success('Grup berhasil ditambahkan')

            const newTotalGroups = totalGroups + 1
            const newMaxPage = Math.ceil(newTotalGroups / pageSize)
            if (newMaxPage > Math.ceil(totalGroups / pageSize)) {
                setPage(newMaxPage)
            }
        }
        setIsGroupDialogOpen(false)
        setEditingGroup(null)
        setSelectedGroupIndex(null)
    }

    const handleAddMenu = (displayIndex: number) => {
        const actualIndex = (page - 1) * pageSize + displayIndex
        setEditingMenu(null)
        setSelectedGroupIndex(actualIndex)
        menuForm.reset({ id: '', name: '', icon: '', path: '' })
        setIsMenuDialogOpen(true)
    }

    const handleEditMenu = (menu: MenuData, displayIndex: number) => {
        const actualIndex = (page - 1) * pageSize + displayIndex
        setEditingMenu({ menu, groupIndex: actualIndex })
        setSelectedGroupIndex(actualIndex)
        menuForm.reset(menu)
        setIsMenuDialogOpen(true)
    }

    const handleDeleteMenu = (displayIndex: number, menuIndex: number) => {
        const actualIndex = (page - 1) * pageSize + displayIndex
        const currentGroup = watchedGroups[actualIndex]
        const updatedMenus = currentGroup.menus.filter((_, index) => index !== menuIndex)
        updateGroup(actualIndex, {
            ...currentGroup,
            menus: updatedMenus,
        })
        toast.success('Menu berhasil dihapus')
    }

    const handleSaveMenu = (data: any) => {
        if (selectedGroupIndex === null) return
        const currentGroup = watchedGroups[selectedGroupIndex]
        if (editingMenu) {
            const updatedMenus = currentGroup.menus.map(menu =>
                menu.id === editingMenu.menu.id ? { ...data } : menu
            )
            updateGroup(selectedGroupIndex, {
                ...currentGroup,
                menus: updatedMenus,
            })
            toast.success('Menu berhasil diperbarui')
        } else {
            const newMenu = {
                ...data,
                id: Date.now().toString(),
            }
            updateGroup(selectedGroupIndex, {
                ...currentGroup,
                menus: [...currentGroup.menus, newMenu],
            })
            toast.success('Menu berhasil ditambahkan')
        }
        setIsMenuDialogOpen(false)
        setEditingMenu(null)
        setSelectedGroupIndex(null)
    }

    const groupForm = useForm<Omit<GroupData, 'menus'>>({
        resolver: zodResolver(groupSchema.omit({ menus: true })),
        defaultValues: {
            id: '',
            name: '',
            description: '',
        },
    })

    const menuForm = useForm<MenuData>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            id: '',
            name: '',
            icon: '',
            path: '',
        },
    })

    if (!isDataLoaded) {
        return (
            <Box sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
                className='transition-colors duration-300 bg-white dark:bg-gray-900'
            >
                <Typography>Loading...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: theme.palette.background.default
        }}
            className='transition-colors duration-300  bg-blue-50 dark:from-gray-800 rounded-lg dark:bg-gray-900'
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Fade in={isVisible} timeout={800}>
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Settings Menu
                            </Typography>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                                Kelola grup menu dan menu aplikasi
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={handleAddGroup}
                                startIcon={<Icon icon="mdi:plus" />}
                                sx={{
                                    background: 'transparent',
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    color: theme.palette.primary.main,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        border: `1px solid ${theme.palette.primary.main}`,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                    },
                                }}
                            >
                                Tambah Grup
                            </Button>
                        </Box>
                        {totalGroups === 0 ? (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 6,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                    <Icon
                                        icon="mdi:folder-open"
                                        style={{
                                            fontSize: '48px',
                                            color: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1'
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                                    Data Kosong
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                    Silahkan tambah grup menu untuk memulai
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        maxHeight: 'calc(100vh - 40px)',
                                        pr: 1,
                                        mb: 3,
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: theme.palette.mode === 'dark' ? '#4B5563' : '#E5E7EB',
                                            borderRadius: '4px',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <Stack spacing={2}>
                                            {paginatedGroups.map((group, groupIndex) => (
                                                <Fade in key={group.id} timeout={300 + groupIndex * 100}>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            borderRadius: { xs: 2, sm: 3 },
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            bgcolor: theme.palette.background.paper,
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            overflow: 'hidden',
                                                            '&:hover': {
                                                                boxShadow: theme.shadows[4],
                                                                transform: 'translateY(-2px)',
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: { xs: 2, sm: 3 },
                                                                bgcolor: theme.palette.mode === 'dark'
                                                                    ? 'rgba(30, 41, 59, 0.5)'
                                                                    : 'rgba(248, 250, 252, 0.8)',
                                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    gap: 2,
                                                                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: { xs: 1, sm: 2 },
                                                                        flex: 1,
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => toggleGroup(group.id)}
                                                                        size={isMobile ? 'small' : 'medium'}
                                                                        sx={{
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                            color: theme.palette.primary.main,
                                                                            '&:hover': {
                                                                                bgcolor: theme.palette.primary.main + '25',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <Icon
                                                                            icon={expandedGroups.includes(group.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                                                                            fontSize={isMobile ? 18 : 20}
                                                                        />
                                                                    </IconButton>

                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Typography
                                                                            variant={isMobile ? 'subtitle1' : 'h6'}
                                                                            sx={{
                                                                                fontWeight: 600,
                                                                                color: theme.palette.text.primary,
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap',
                                                                            }}
                                                                        >
                                                                            {group.name}
                                                                        </Typography>
                                                                        {group.description && !isMobile && (
                                                                            <Typography
                                                                                variant="body2"
                                                                                sx={{
                                                                                    color: theme.palette.text.secondary,
                                                                                    mt: 0.5,
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap',
                                                                                }}
                                                                            >
                                                                                {group.description}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>

                                                                    <Chip
                                                                        label={`${group.menus.length} menu${group.menus.length !== 1 ? 's' : ''}`}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: theme.palette.primary.main + '15',
                                                                            color: theme.palette.text.primary,
                                                                            fontWeight: 500,
                                                                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                                        }}
                                                                    />
                                                                </Box>

                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        gap: 0.5,
                                                                        flexShrink: 0,
                                                                        ...(isMobile && { width: '100%', mt: 1, justifyContent: 'flex-end' })
                                                                    }}
                                                                >
                                                                    <Tooltip title="Add Menu" arrow>
                                                                        <IconButton
                                                                            onClick={() => handleAddMenu(groupIndex)}
                                                                            size={isMobile ? 'small' : 'medium'}
                                                                            sx={{
                                                                                bgcolor: 'rgba(34, 197, 94, 0.1)',
                                                                                color: '#22c55e',
                                                                                '&:hover': {
                                                                                    bgcolor: 'rgba(34, 197, 94, 0.2)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Icon icon="mdi:plus" fontSize={isMobile ? 16 : 18} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Edit Group" arrow>
                                                                        <IconButton
                                                                            onClick={() => handleEditGroup(group, groupIndex)}
                                                                            size={isMobile ? 'small' : 'medium'}
                                                                            sx={{
                                                                                bgcolor: 'rgba(249, 115, 22, 0.1)',
                                                                                color: '#f97316',
                                                                                '&:hover': {
                                                                                    bgcolor: 'rgba(249, 115, 22, 0.2)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Icon icon="mdi:pencil" fontSize={isMobile ? 16 : 18} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Group" arrow>
                                                                        <IconButton
                                                                            onClick={() => handleDeleteGroup(groupIndex)}
                                                                            size={isMobile ? 'small' : 'medium'}
                                                                            sx={{
                                                                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                                                color: '#ef4444',
                                                                                '&:hover': {
                                                                                    bgcolor: 'rgba(239, 68, 68, 0.2)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Icon icon="mdi:delete" fontSize={isMobile ? 16 : 18} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Box>

                                                            {group.description && isMobile && (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: theme.palette.text.secondary,
                                                                        mt: 1,
                                                                        lineHeight: 1.4,
                                                                    }}
                                                                >
                                                                    {group.description}
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        <Collapse in={expandedGroups.includes(group.id)} timeout={300}>
                                                            <CardContent sx={{ p: 0 }}>
                                                                {group.menus.length === 0 ? (
                                                                    <Box
                                                                        sx={{
                                                                            p: { xs: 3, sm: 4 },
                                                                            textAlign: 'center',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                        }}
                                                                    >
                                                                        <Avatar
                                                                            sx={{
                                                                                width: { xs: 48, sm: 64 },
                                                                                height: { xs: 48, sm: 64 },
                                                                                bgcolor: theme.palette.action.hover,
                                                                                mb: 2,
                                                                            }}
                                                                        >
                                                                            <Icon
                                                                                icon="mdi:menu-open"
                                                                                fontSize={isMobile ? 24 : 32}
                                                                                color={theme.palette.text.disabled}
                                                                            />
                                                                        </Avatar>
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: theme.palette.text.secondary,
                                                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                                                            }}
                                                                        >
                                                                            Belum ada menu dalam grup ini
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <Box sx={{ p: { xs: 1, sm: 2 } }}>
                                                                        <Grid container spacing={1}>
                                                                            {group.menus.map((menu, menuIndex) => (
                                                                                <Grid item xs={12} key={menu.id}>
                                                                                    <Card
                                                                                        variant="outlined"
                                                                                        sx={{
                                                                                            borderRadius: 2,
                                                                                            bgcolor: theme.palette.mode === 'dark'
                                                                                                ? 'rgba(30, 41, 59, 0.3)'
                                                                                                : 'rgba(248, 250, 252, 0.5)',
                                                                                            border: `1px solid ${theme.palette.divider}`,
                                                                                            transition: 'all 0.2s ease',
                                                                                            '&:hover': {
                                                                                                bgcolor: theme.palette.mode === 'dark'
                                                                                                    ? 'rgba(30, 41, 59, 0.5)'
                                                                                                    : 'rgba(241, 245, 249, 0.8)',
                                                                                                transform: 'translateY(-1px)',
                                                                                                boxShadow: theme.shadows[2],
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        <Box
                                                                                            sx={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'space-between',
                                                                                                p: { xs: 1.5, sm: 2 },
                                                                                                gap: 2,
                                                                                            }}
                                                                                        >
                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                                                                                <Avatar
                                                                                                    sx={{
                                                                                                        width: { xs: 36, sm: 40 },
                                                                                                        height: { xs: 36, sm: 40 },
                                                                                                        borderRadius: 2,
                                                                                                        background: theme.palette.mode === 'dark'
                                                                                                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
                                                                                                            : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                                                                                                    }}
                                                                                                >
                                                                                                    <Icon
                                                                                                        icon={menu.icon}
                                                                                                        fontSize={isMobile ? 18 : 20}
                                                                                                        color="#6366f1"
                                                                                                    />
                                                                                                </Avatar>
                                                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                                                    <Typography
                                                                                                        variant={isMobile ? 'body2' : 'body1'}
                                                                                                        sx={{
                                                                                                            fontWeight: 500,
                                                                                                            color: theme.palette.text.primary,
                                                                                                            overflow: 'hidden',
                                                                                                            textOverflow: 'ellipsis',
                                                                                                            whiteSpace: 'nowrap',
                                                                                                        }}
                                                                                                    >
                                                                                                        {menu.name}
                                                                                                    </Typography>
                                                                                                    <Typography
                                                                                                        variant="caption"
                                                                                                        sx={{
                                                                                                            color: theme.palette.text.secondary,
                                                                                                            overflow: 'hidden',
                                                                                                            textOverflow: 'ellipsis',
                                                                                                            whiteSpace: 'nowrap',
                                                                                                            display: 'block',
                                                                                                        }}
                                                                                                    >
                                                                                                        {menu.path}
                                                                                                    </Typography>
                                                                                                </Box>
                                                                                            </Box>
                                                                                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                                                                                <Tooltip title="Edit Menu" arrow>
                                                                                                    <IconButton
                                                                                                        onClick={() => handleEditMenu(menu, groupIndex)}
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            bgcolor: 'rgba(249, 115, 22, 0.1)',
                                                                                                            color: '#f97316',
                                                                                                            '&:hover': {
                                                                                                                bgcolor: 'rgba(249, 115, 22, 0.2)',
                                                                                                            },
                                                                                                        }}
                                                                                                    >
                                                                                                        <Icon icon="mdi:pencil" fontSize={14} />
                                                                                                    </IconButton>
                                                                                                </Tooltip>
                                                                                                <Tooltip title="Delete Menu" arrow>
                                                                                                    <IconButton
                                                                                                        onClick={() => handleDeleteMenu(groupIndex, menuIndex)}
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                                                                            color: '#ef4444',
                                                                                                            '&:hover': {
                                                                                                                bgcolor: 'rgba(239, 68, 68, 0.2)',
                                                                                                            },
                                                                                                        }}
                                                                                                    >
                                                                                                        <Icon icon="mdi:delete" fontSize={14} />
                                                                                                    </IconButton>
                                                                                                </Tooltip>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    </Card>
                                                                                </Grid>
                                                                            ))}
                                                                        </Grid>
                                                                    </Box>
                                                                )}
                                                            </CardContent>
                                                        </Collapse>
                                                    </Card>
                                                </Fade>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>


                            </>
                        )}
                    </Box>
                </Fade>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    px: { xs: 1, sm: 0 },
                }}>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        '& .MuiPagination-root': {
                            '& .MuiPagination-ul': {
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }
                        }
                    }}>
                        <PaginationMui
                            total={totalGroups}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                    <EntriesText
                        currentPage={page}
                        pageSize={pageSize}
                        totalEntries={totalGroups}
                    />
                </Box>
            </Container>

            {isGroupDialogOpen && (
                <ModalGroup open={isGroupDialogOpen} toggle={toggleDialogGroup} isEdit={editingGroup !== null} handleSubmit={groupForm.handleSubmit(handleSaveGroup)} form={groupForm} />
            )}
            {isMenuDialogOpen && (
                <ModalMenu open={isMenuDialogOpen} toggle={toggleMenuDialog} isEdit={editingMenu !== null} handleSubmit={menuForm.handleSubmit(handleSaveMenu)} form={menuForm} />
            )}
        </Box>
    )
}

export default SettingsMenuView