import { alpha, createTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import { useApplicationSettings } from './use-application-settings'

export const useIsDarkMode = () => {
    const screenMode = useApplicationSettings(state => state.value.screenMode)

    return screenMode === 'DARK'
}

export const useGetTheme = () => {
    const isDarkMode = useIsDarkMode()

    const primary = '#1e40af '
    const error = '#ff3a6e'
    const success = '#6fd943'
    const warning = '#facc15'
    const info = '#93c5fd'
    const secondary = '#808080'

    const borderRadius = 4

    const fontColor = isDarkMode ? '#F4F5FA' : '#474955'
    const fontDark = isDarkMode ? '#474955' : primary
    const mainColor = '#f1f5f9'

    const colors = {
        background: {
            default: isDarkMode ? '#252836' : '#FFFFFF',
            paper: isDarkMode ? '#2F3241' : '#FFFFFF',
            surface: isDarkMode ? '#3B3F52' : mainColor,
        },

        border: isDarkMode ? '#5A5F73' : '#E0E0E0',
        divider: isDarkMode ? '#4C5165' : '#E0E0E0',

        hover: isDarkMode ? alpha('#FFFFFF', 0.04) : alpha('#000000', 0.04),
        selected: alpha(primary, 0.15),

        fontColor: fontColor,
        fontSecondary: fontDark,
        shadow: 'rgba(47, 43, 61, 0.1)',
    }

    const useTheme = useMemo(
        () =>
            createTheme({
                shape: {
                    borderRadius,
                },

                palette: {
                    mode: isDarkMode ? 'dark' : 'light',

                    primary: {
                        main: primary,
                    },

                    error: {
                        main: error,
                    },

                    success: {
                        main: success,
                    },

                    secondary: {
                        main: secondary,
                    },

                    warning: {
                        main: warning,
                    },

                    info: {
                        main: info,
                    },

                    background: {
                        default: colors.background.default,
                        paper: colors.background.paper,
                    },

                    text: {
                        primary: fontColor,
                        secondary: fontColor,
                    },

                    divider: colors.divider,

                    mainColor: mainColor,
                    fontColor: fontColor,
                },

                typography: {
                    fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
                    fontSize: 13.125,
                    h1: {
                        fontWeight: 500,
                        fontSize: '2.375rem',
                        lineHeight: 1.368421,
                    },
                    h2: {
                        fontWeight: 500,
                        fontSize: '2rem',
                        lineHeight: 1.375,
                    },
                    h3: {
                        fontWeight: 500,
                        lineHeight: 1.38462,
                        fontSize: '1.625rem',
                    },
                    h4: {
                        fontWeight: 500,
                        lineHeight: 1.364,
                        fontSize: '1.375rem',
                    },
                    h5: {
                        fontWeight: 500,
                        lineHeight: 1.3334,
                        fontSize: '1.125rem',
                    },
                    h6: {
                        lineHeight: 1.4,
                        fontSize: '0.9375rem',
                    },
                    subtitle1: {
                        fontSize: '1rem',
                        letterSpacing: '0.15px',
                    },
                    subtitle2: {
                        lineHeight: 1.32,
                        fontSize: '0.875rem',
                        letterSpacing: '0.1px',
                    },
                    body1: {
                        lineHeight: 1.467,
                        fontSize: '0.9375rem',
                    },
                    body2: {
                        fontSize: '0.8125rem',
                        lineHeight: 1.53846154,
                    },
                    button: {
                        lineHeight: 1.2,
                        fontSize: '0.9375rem',
                        letterSpacing: '0.43px',
                    },
                    caption: {
                        lineHeight: 1.273,
                        fontSize: '0.6875rem',
                    },
                    overline: {
                        fontSize: '0.75rem',
                        letterSpacing: '1px',
                    },
                },

                shadows: [
                    'none',
                    '0px 2px 4px 0px rgba(47, 43, 61, 0.12)',
                    '0px 2px 6px 0px rgba(47, 43, 61, 0.14)',
                    '0px 3px 8px 0px rgba(47, 43, 61, 0.14)',
                    '0px 3px 9px 0px rgba(47, 43, 61, 0.15)',
                    '0px 4px 10px 0px rgba(47, 43, 61, 0.15)',
                    '0px 4px 11px 0px rgba(47, 43, 61, 0.16)',
                    '0px 4px 18px 0px rgba(47, 43, 61, 0.1)',
                    '0px 4px 13px 0px rgba(47, 43, 61, 0.18)',
                    '0px 5px 14px 0px rgba(47, 43, 61, 0.18)',
                    '0px 5px 15px 0px rgba(47, 43, 61, 0.2)',
                    '0px 5px 16px 0px rgba(47, 43, 61, 0.2)',
                    '0px 6px 17px 0px rgba(47, 43, 61, 0.22)',
                    '0px 6px 18px 0px rgba(47, 43, 61, 0.22)',
                    '0px 6px 19px 0px rgba(47, 43, 61, 0.24)',
                    '0px 7px 20px 0px rgba(47, 43, 61, 0.24)',
                    '0px 7px 21px 0px rgba(47, 43, 61, 0.26)',
                    '0px 7px 22px 0px rgba(47, 43, 61, 0.26)',
                    '0px 8px 23px 0px rgba(47, 43, 61, 0.28)',
                    '0px 8px 24px 6px rgba(47, 43, 61, 0.28)',
                    '0px 9px 25px 0px rgba(47, 43, 61, 0.3)',
                    '0px 9px 26px 0px rgba(47, 43, 61, 0.32)',
                    '0px 9px 27px 0px rgba(47, 43, 61, 0.32)',
                    '0px 10px 28px 0px rgba(47, 43, 61, 0.34)',
                    '0px 10px 30px 0px rgba(47, 43, 61, 0.34)',
                ],

                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                backgroundColor: colors.background.default,
                                color: colors.fontColor,
                                '*::-webkit-scrollbar': {
                                    width: '8px',
                                    height: '8px',
                                },
                                '*::-webkit-scrollbar-thumb': {
                                    backgroundColor: isDarkMode ? '#4B5563' : '#CBD5E1',
                                    borderRadius: '4px',
                                },
                                '*::-webkit-scrollbar-track': {
                                    backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9',
                                },
                            },
                        },
                    },

                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: `${colors.background.paper} !important`,
                                    '& fieldset': {
                                        borderColor: colors.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: alpha(primary, 0.7),
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: primary,
                                    },
                                    '& input::placeholder': {
                                        color: colors.fontColor,
                                        opacity: 0.6,
                                    },
                                },
                            },
                        },
                        defaultProps: {
                            fullWidth: true,
                        },
                    },

                    MuiInputAdornment: {
                        styleOverrides: {
                            root: {
                                '& .MuiTypography-root': {
                                    color: colors.fontSecondary,
                                },
                            },
                        },
                    },
                    MuiOutlinedInput: {
                        styleOverrides: {
                            root: {
                                backgroundColor: colors.background.paper,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: primary,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(primary, 0.7),
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.border,
                                },
                            },
                            input: {
                                color: colors.fontColor,
                                '&::placeholder': {
                                    color: colors.fontColor,
                                    opacity: 0.6,
                                },
                            },
                        },
                    },
                    MuiDialog: {
                        styleOverrides: {
                            paper: {
                                backgroundColor: colors.background.paper,
                                color: colors.fontColor,
                                borderRadius: borderRadius,
                                border: `1px solid ${colors.border}`,
                                boxShadow: `0px 10px 30px ${colors.shadow}`,
                            },
                        },
                    },

                    MuiDialogTitle: {
                        styleOverrides: {
                            root: {
                                color: colors.fontColor,
                                fontWeight: 600,
                                fontSize: '1.125rem',
                            },
                        },
                    },

                    MuiDialogContent: {
                        styleOverrides: {
                            root: {
                                color: colors.fontColor,
                                backgroundColor: colors.background.paper,
                            },
                        },
                    },

                    MuiDialogActions: {
                        styleOverrides: {
                            root: {
                                padding: '12px 24px',
                            },
                        },
                    },

                    MuiBackdrop: {
                        styleOverrides: {
                            root: {
                                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },

                    MuiInputLabel: {
                        styleOverrides: {
                            root: {
                                color: colors.fontColor,
                                '&.Mui-focused': {
                                    color: primary,
                                },
                                '&.Mui-error': {
                                    color: error,
                                },
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                boxShadow: 'none',
                                textTransform: 'none',
                                ':hover': {
                                    boxShadow: 'none',
                                },
                            },
                            contained: {
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: alpha(primary, 0.8),
                                },
                            },
                            outlined: {
                                borderColor: colors.border,
                                color: colors.fontColor,
                                '&:hover': {
                                    borderColor: primary,
                                    backgroundColor: alpha(primary, 0.04),
                                },
                            },
                            text: {
                                color: colors.fontColor,
                                '&:hover': {
                                    backgroundColor: colors.hover,
                                },
                            },
                        },
                    },

                    MuiListItemIcon: {
                        styleOverrides: {
                            root: {
                                minWidth: '38px',
                                color: colors.fontSecondary,
                            },
                        },
                    },

                    MuiListItem: {
                        styleOverrides: {
                            root: {
                                borderRadius: borderRadius + 'px',
                                color: colors.fontColor,
                            },
                        },
                    },

                    MuiListItemButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: borderRadius + 'px',
                                color: colors.fontColor,

                                ':hover': {
                                    boxShadow: 'none',
                                    backgroundColor: colors.hover,
                                },

                                '&.Mui-selected': {
                                    backgroundColor: colors.selected,

                                    '& .MuiButtonBase-root': {
                                        color: primary,
                                    },

                                    '& .MuiTypography-root': {
                                        color: primary,
                                        fontWeight: 500,
                                    },

                                    '& .MuiSvgIcon-root': {
                                        color: primary,
                                    },

                                    '& .MuiListItemIcon-root': {
                                        color: primary,
                                    },

                                    '&:hover': {
                                        backgroundColor: alpha(primary, isDarkMode ? 0.2 : 0.16),
                                    },
                                },
                            },
                        },
                    },

                    MuiStepLabel: {
                        styleOverrides: {
                            root: {
                                '& .MuiSvgIcon-root': {
                                    width: '1.25em',
                                    height: '1.25em',
                                },
                            },
                            label: {
                                fontSize: '0.85rem',
                                color: colors.fontColor,
                            },
                        },
                    },

                    MuiCard: {
                        styleOverrides: {
                            root: {
                                boxShadow: 'none',
                                backgroundImage: 'none',
                                backgroundColor: colors.background.paper,
                                border: `1px solid ${colors.border}`,
                            },
                        },
                    },

                    MuiTableCell: {
                        styleOverrides: {
                            root: {
                                borderBottom: `1px solid ${colors.border}`,
                                color: colors.fontColor,
                            },
                            head: {
                                fontWeight: 600,
                                backgroundColor: colors.background.surface,
                                color: colors.fontColor,
                            },
                        },
                    },

                    MuiTooltip: {
                        styleOverrides: {
                            tooltip: {
                                backgroundColor: isDarkMode ? '#374151' : '#1F2937',
                                color: isDarkMode ? '#E5E7EB' : '#FFFFFF',
                                fontSize: '13px',
                            },
                        },
                        defaultProps: {
                            placement: 'bottom',
                        },
                    },

                    MuiButtonGroup: {
                        styleOverrides: {
                            root: {
                                boxShadow: 'none',
                            },
                        },
                    },

                    MuiCardContent: {
                        styleOverrides: {
                            root: {
                                ':last-child': {
                                    paddingBottom: '16px',
                                },
                            },
                        },
                    },

                    MuiAutocomplete: {
                        styleOverrides: {
                            root: {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: colors.background.paper,
                                },
                            },
                            tag: ({ ownerState }) => ({
                                backgroundColor: colors.background.surface,
                                color: colors.fontColor,
                                border: `1px solid ${colors.border}`,
                                ...(ownerState.size === 'small' && {
                                    height: '22px',
                                }),
                            }),
                            paper: {
                                backgroundColor: colors.background.paper,
                                border: `1px solid ${colors.border}`,
                            },
                            option: {
                                color: colors.fontColor,
                                '&:hover': {
                                    backgroundColor: colors.hover,
                                },
                                '&.Mui-selected': {
                                    backgroundColor: colors.selected,
                                },
                            },
                        },
                    },

                    MuiDivider: {
                        styleOverrides: {
                            root: {
                                borderColor: colors.divider,
                            },
                        },
                    },

                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundColor: colors.background.paper,
                                color: colors.fontColor,
                            },
                        },
                    },

                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: colors.background.paper,
                                color: colors.fontColor,
                                borderBottom: `1px solid ${colors.border}`,
                            },
                        },
                    },

                    MuiDrawer: {
                        styleOverrides: {
                            paper: {
                                backgroundColor: colors.background.paper,
                                borderRight: `1px solid ${colors.border}`,
                            },
                        },
                    },
                },
            }),

        [
            isDarkMode,
            colors.fontColor,
            colors.fontSecondary,
            colors.background,
            colors.border,
            colors.hover,
            colors.selected,
            colors.divider,
            fontColor,
            primary,
            colors.shadow,
        ]
    )

    return useTheme
}
