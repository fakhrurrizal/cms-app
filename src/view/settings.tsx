import { CustomTextField } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    Grid,
    IconButton,
    Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

// Schema untuk Menu
const menuSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Nama menu wajib diisi'),
    icon: z.string().min(1, 'Icon wajib diisi'),
    path: z.string().min(1, 'Path wajib diisi'),
})

// Schema untuk Group
const groupSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Nama grup wajib diisi'),
    description: z.string().optional(),
    menus: z.array(menuSchema),
})

// Schema untuk keseluruhan form
const menuSettingsSchema = z.object({
    groups: z.array(groupSchema),
})

type MenuSettingsFormData = z.infer<typeof menuSettingsSchema>
type GroupData = z.infer<typeof groupSchema>
type MenuData = z.infer<typeof menuSchema>

// Data awal kosong
const initialData: MenuSettingsFormData = {
    groups: []
}

const SettingsMenuView: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [expandedGroups, setExpandedGroups] = useState<string[]>([])
    const [editingGroup, setEditingGroup] = useState<GroupData | null>(null)
    const [editingMenu, setEditingMenu] = useState<{ menu: MenuData; groupIndex: number } | null>(null)
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
    const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null)
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    // Load dari localStorage jika tersedia
    const loadFromLocalStorage = (): MenuSettingsFormData => {
        if (typeof window === 'undefined') {
            return initialData
        }

        try {
            const savedData = localStorage.getItem('menuSettings')

            if (savedData && savedData !== 'undefined' && savedData !== 'null') {
                const parsedData = JSON.parse(savedData)
                // Validasi struktur data
                if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.groups)) {
                    return parsedData
                }
            }
        } catch (error) {
            console.error('Error parsing localStorage:', error)
        }

        return initialData
    }

    // Simpan ke localStorage
    const saveToLocalStorage = (data: MenuSettingsFormData) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('menuSettings', JSON.stringify(data))
            } catch (error) {
                console.error('Error saving to localStorage:', error)
            }
        }
    }

    const { control, handleSubmit, watch, reset } = useForm<MenuSettingsFormData>({
        resolver: zodResolver(menuSettingsSchema),
        defaultValues: initialData, // Start dengan data kosong
    })

    const { fields: groupFields, append: appendGroup, remove: removeGroup, update: updateGroup } =
        useFieldArray({
            control,
            name: 'groups',
        })

    const watchedGroups = watch('groups')

    // Load data dari localStorage saat component mount
    useEffect(() => {
        const savedData = loadFromLocalStorage()
        if (savedData.groups.length > 0) {
            reset(savedData)
        }
        setIsDataLoaded(true)
    }, [reset])

    // Simpan ke localStorage setiap kali data berubah (tapi hanya setelah data pertama kali dimuat)
    useEffect(() => {
        if (isDataLoaded) {
            const currentData = { groups: watchedGroups }
            saveToLocalStorage(currentData)
        }
    }, [watchedGroups, isDataLoaded])

    useEffect(() => {
        setIsVisible(true)
    }, [])

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

    const handleEditGroup = (group: GroupData, index: number) => {
        setEditingGroup(group)
        groupForm.reset({
            id: group.id,
            name: group.name,
            description: group.description,
        })
        setSelectedGroupIndex(index)
        setIsGroupDialogOpen(true)
    }

    const handleDeleteGroup = (index: number) => {
        removeGroup(index)
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
        }
        setIsGroupDialogOpen(false)
        setEditingGroup(null)
        setSelectedGroupIndex(null)
    }

    const handleAddMenu = (groupIndex: number) => {
        setEditingMenu(null)
        setSelectedGroupIndex(groupIndex)
        menuForm.reset({ id: '', name: '', icon: '', path: '' })
        setIsMenuDialogOpen(true)
    }

    const handleEditMenu = (menu: MenuData, groupIndex: number) => {
        setEditingMenu({ menu, groupIndex })
        setSelectedGroupIndex(groupIndex)
        menuForm.reset(menu)
        setIsMenuDialogOpen(true)
    }

    const handleDeleteMenu = (groupIndex: number, menuIndex: number) => {
        const currentGroup = watchedGroups[groupIndex]
        const updatedMenus = currentGroup.menus.filter((_, index) => index !== menuIndex)
        updateGroup(groupIndex, {
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

    // Form untuk dialog group
    const groupForm = useForm<Omit<GroupData, 'menus'>>({
        resolver: zodResolver(groupSchema.omit({ menus: true })),
        defaultValues: {
            id: '',
            name: '',
            description: '',
        },
    })

    // Form untuk dialog menu
    const menuForm = useForm<MenuData>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            id: '',
            name: '',
            icon: '',
            path: '',
        },
    })

    // Jangan render component sampai data selesai dimuat
    if (!isDataLoaded) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Loading...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Fade in={isVisible} timeout={800}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Settings Menu
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                                Kelola grup menu dan menu aplikasi Anda
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={handleAddGroup}
                                startIcon={<Icon icon="mdi:plus" />}
                                sx={{
                                    background: 'transparent',
                                    borderRadius: '8px',
                                    border: '1px solid #3b82f6',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        border: '1px solid #3b82f6',
                                    },
                                }}
                            >
                                Tambah Grup
                            </Button>
                        </Box>

                        {groupFields.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Icon icon="mdi:folder-open" fontSize={48} color="#cbd5e1" />
                                <Typography variant="h6" sx={{ mt: 2, color: '#64748b' }}>
                                    Data Kosong
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    Silakan tambah grup menu untuk memulai
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {groupFields.map((group, groupIndex) => (
                                    <Grid item xs={12} key={group.id}>
                                        <Card
                                            sx={{
                                                borderRadius: '16px',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                    p: 3,
                                                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <IconButton
                                                            onClick={() => toggleGroup(group.id)}
                                                            sx={{
                                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                                color: '#3b82f6',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(59, 130, 246, 0.2)',
                                                                },
                                                            }}
                                                        >
                                                            <Icon
                                                                icon={expandedGroups.includes(group.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                                                                fontSize={20}
                                                            />
                                                        </IconButton>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                                {group.name}
                                                            </Typography>
                                                            {group.description && (
                                                                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                                                                    {group.description}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Chip
                                                            label={`${group.menus.length} menu`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                                color: '#3b82f6',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton
                                                            onClick={() => handleAddMenu(groupIndex)}
                                                            sx={{
                                                                bgcolor: 'rgba(34, 197, 94, 0.1)',
                                                                color: '#22c55e',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(34, 197, 94, 0.2)',
                                                                },
                                                            }}
                                                        >
                                                            <Icon icon="mdi:plus" fontSize={18} />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleEditGroup(group, groupIndex)}
                                                            sx={{
                                                                bgcolor: 'rgba(249, 115, 22, 0.1)',
                                                                color: '#f97316',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(249, 115, 22, 0.2)',
                                                                },
                                                            }}
                                                        >
                                                            <Icon icon="mdi:pencil" fontSize={18} />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleDeleteGroup(groupIndex)}
                                                            sx={{
                                                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                                color: '#ef4444',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(239, 68, 68, 0.2)',
                                                                },
                                                            }}
                                                        >
                                                            <Icon icon="mdi:delete" fontSize={18} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Collapse in={expandedGroups.includes(group.id)}>
                                                <CardContent sx={{ p: 0 }}>
                                                    {group.menus.length === 0 ? (
                                                        <Box sx={{ p: 4, textAlign: 'center' }}>
                                                            <Icon icon="mdi:menu-open" fontSize={48} color="#cbd5e1" />
                                                            <Typography variant="body2" sx={{ color: '#64748b', mt: 2 }}>
                                                                Belum ada menu dalam grup ini
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ p: 2 }}>
                                                            {group.menus.map((menu, menuIndex) => (
                                                                <Box
                                                                    key={menu.id}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        p: 2,
                                                                        mb: menuIndex < group.menus.length - 1 ? 1 : 0,
                                                                        bgcolor: 'rgba(248, 250, 252, 0.8)',
                                                                        borderRadius: '12px',
                                                                        border: '1px solid rgba(226, 232, 240, 0.6)',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(241, 245, 249, 0.8)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                        <Box
                                                                            sx={{
                                                                                width: 40,
                                                                                height: 40,
                                                                                borderRadius: '10px',
                                                                                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                            }}
                                                                        >
                                                                            <Icon icon={menu.icon} fontSize={20} color="#6366f1" />
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                                                {menu.name}
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                                                {menu.path}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                                                                            <Icon icon="mdi:pencil" fontSize={16} />
                                                                        </IconButton>
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
                                                                            <Icon icon="mdi:delete" fontSize={16} />
                                                                        </IconButton>
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Collapse>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Fade>
            </Container>

            {/* Dialog untuk Grup */}
            <Dialog open={isGroupDialogOpen} onClose={() => setIsGroupDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGroup ? 'Edit Grup Menu' : 'Tambah Grup Menu'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit(handleSaveGroup)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <CustomTextField control={groupForm.control} name="name" label="Nama Grup" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField
                                    control={groupForm.control}
                                    name="description"
                                    label="Deskripsi"
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsGroupDialogOpen(false)}>Batal</Button>
                    <Button onClick={groupForm.handleSubmit(handleSaveGroup)} variant="contained">
                        {editingGroup ? 'Update' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog untuk Menu */}
            <Dialog open={isMenuDialogOpen} onClose={() => setIsMenuDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingMenu ? 'Edit Menu' : 'Tambah Menu'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit(handleSaveMenu)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <CustomTextField control={menuForm.control} name="name" label="Nama Menu" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField control={menuForm.control} name="icon" label="Icon" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField control={menuForm.control} name="path" label="Path" fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsMenuDialogOpen(false)}>Batal</Button>
                    <Button onClick={menuForm.handleSubmit(handleSaveMenu)} variant="contained">
                        {editingMenu ? 'Update' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SettingsMenuView