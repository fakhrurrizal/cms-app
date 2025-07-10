import { forwardRef } from 'react'

import { styled } from '@mui/material/styles'
import TextField, { TextFieldProps } from '@mui/material/TextField'

const TextFieldStyled = styled(TextField)<TextFieldProps>(({ theme }) => {
    const isDarkMode = theme.palette.mode === 'dark'

    return {
        alignItems: 'flex-start',

        '& .MuiInputLabel-root': {
            transform: 'none',
            lineHeight: 1.154,
            position: 'relative',
            marginBottom: '3px',
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.text.primary,
        },

        '& .MuiInputBase-root': {
            borderRadius: 8,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${isDarkMode ? '#5A5F73' : 'rgba(47,43,61, 0.2)'}`,
            fontSize: theme.typography.body2.fontSize,
            transition: theme.transitions.create(['border-color', 'box-shadow'], {
                duration: theme.transitions.duration.shorter,
            }),

            '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
                borderColor: isDarkMode ? '#8F90A6' : 'rgba(47,43,61, 0.28)',
            },

            '&:before, &:after': {
                display: 'none',
            },

            '&.MuiInputBase-sizeSmall': {
                borderRadius: 6,
            },

            '&.Mui-error': {
                borderColor: theme.palette.error.main,
            },

            '&.Mui-focused': {
                boxShadow: theme.shadows[2],

                '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
                    transform: 'translateX(4px)',
                },

                borderColor: theme.palette.primary.main,
            },

            '&.Mui-disabled': {
                backgroundColor: theme.palette.action.selected,
            },

            '& .MuiInputAdornment-root': {
                marginTop: '0 !important',
            },
        },

        '& .MuiInputBase-input': {
            color: theme.palette.text.primary,

            '&:not(textarea)': {
                padding: '15.5px 13px',
            },

            '&:not(textarea).MuiInputBase-inputSizeSmall': {
                padding: '5.5px 13px',
            },

            '&:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
                opacity: 0.6,
                transition: theme.transitions.create(['opacity', 'transform'], {
                    duration: theme.transitions.duration.shorter,
                }),
                color: theme.palette.text.primary,
            },

            '&.MuiInputBase-inputAdornedStart:not(.MuiAutocomplete-input)': {
                paddingLeft: 0,
            },
            '&.MuiInputBase-inputAdornedEnd:not(.MuiAutocomplete-input)': {
                paddingRight: 0,
            },
        },

        '& .MuiFormHelperText-root': {
            lineHeight: 1,
            margin: theme.spacing(0.8, 0, 0),
            color: theme.palette.text.secondary,
            fontSize: theme.typography.subtitle1,
            '&.Mui-error': {
                color: theme.palette.error.main,
            },
        },

        '& .MuiSelect-select:focus, & .MuiNativeSelect-select:focus': {
            backgroundColor: 'transparent',
        },

        '& .MuiSelect-filled .MuiChip-root': {
            height: 22,
        },

        '& .MuiAutocomplete-input': {
            paddingLeft: '6px !important',
            paddingTop: '7.5px !important',
            paddingBottom: '7.5px !important',
            '&.MuiInputBase-inputSizeSmall': {
                paddingLeft: '6px !important',
                paddingTop: '1.5px !important',
                paddingBottom: '1.5px !important',
            },
        },

        '& .MuiAutocomplete-inputRoot': {
            paddingTop: '8px !important',
            paddingLeft: '8px !important',
            paddingBottom: '8px !important',
            '&:not(.MuiInputBase-sizeSmall).MuiInputBase-adornedStart': {
                paddingLeft: '13px !important',
            },
            '&.MuiInputBase-sizeSmall': {
                paddingTop: '5px !important',
                paddingLeft: '5px !important',
                paddingBottom: '5px !important',
                '& .MuiAutocomplete-tag': {
                    margin: 2,
                    height: 22,
                },
            },
        },

        '& .MuiInputBase-multiline': {
            padding: '15.25px 13px',
            '&.MuiInputBase-sizeSmall': {
                padding: '7.25px 13px',
            },
            '& textarea.MuiInputBase-inputSizeSmall:placeholder-shown': {
                overflowX: 'hidden',
            },
        },

        '& + .react-datepicker__close-icon': {
            top: 11,
            '&:after': {
                fontSize: '1.6rem !important',
            },
        },
    }
})

export const MUITextField = forwardRef((props: TextFieldProps, ref) => {
    const { size = 'small', InputLabelProps, ...rest } = props

    return (
        <TextFieldStyled
            size={size}
            inputRef={ref}
            {...rest}
            variant='filled'
            InputLabelProps={{ ...InputLabelProps, shrink: true }}
        />
    )
})
