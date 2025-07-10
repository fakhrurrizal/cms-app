import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { useState, useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { MUITextField } from '../mui'
import { Icon } from '@iconify/react'
import { useIsDarkMode } from '@/services'

export type TextFieldProps<T extends FieldValues = Record<string, any>> = Omit<MuiTextFieldProps, 'name'> & {
    inputFormat?: 'NORMAL' | 'PASSWORD' | 'PHONE'
    name: Path<T>
    control: Control<T>
    onValueChange?: (value: string) => void
    isReadOnly?: boolean
    variant?: 'standard' | 'outlined' | 'filled'
    placeholder?: string
    textUppercase?: boolean
    textLowercase?: boolean
    maxLength?: number
}

export function CustomTextField<T extends FieldValues = Record<string, any>>(props: TextFieldProps<T>) {
    const {
        control,
        inputFormat = 'NORMAL',
        onValueChange,
        isReadOnly = false,
        variant,
        placeholder = '',
        textUppercase = false,
        textLowercase = false,
        maxLength,
        ...moreProps
    } = props

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const isPasswordType = inputFormat === 'PASSWORD'

    const isDarkMode = useIsDarkMode()

    const endAdornment = useMemo(() => {
        switch (inputFormat) {
            case 'PASSWORD':
                return (
                    <InputAdornment position='end'>
                        <IconButton onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? (
                                <Icon icon='ic:outline-visibility-off' className='text-base' />
                            ) : (
                                <Icon icon='ic:outline-visibility' className='text-base' />

                            )}
                        </IconButton>
                    </InputAdornment>
                )

            default:
                return moreProps.InputProps?.endAdornment
        }
    }, [inputFormat, showPassword, moreProps.InputProps?.endAdornment])

    return (
        <Controller
            render={({ field, fieldState, formState: { isSubmitSuccessful } }) => {
                const error = !isSubmitSuccessful && Boolean(fieldState?.error)

                const helperText = !isSubmitSuccessful && fieldState?.error?.message

                const { onChange, ...moreField } = field

                return (
                    <MUITextField
                        {...moreProps}
                        {...moreField}
                        error={error}
                        fullWidth
                        onChange={(e: any) => {
                            if (textUppercase) {
                                if (onValueChange) {
                                    onValueChange(e.target.value.toUpperCase())
                                }
                                onChange(e.target.value.toUpperCase())
                            } else if (textLowercase) {
                                const modifiedValue = e.target.value.toLowerCase().replace(/\s+/g, '_')
                                if (onValueChange) {
                                    onValueChange(modifiedValue)
                                }
                                onChange(modifiedValue)
                            } else {
                                if (onValueChange) {
                                    onValueChange(e.target.value)
                                }
                                onChange(e.target.value)
                            }
                        }}

                        helperText={helperText}
                        type={!isPasswordType ? moreProps.type : showPassword ? 'text' : 'password'}
                        placeholder={isReadOnly ? undefined : placeholder ? placeholder : `${props?.label || ''}...`}
                        InputProps={{
                            ...moreProps.InputProps,
                            endAdornment,
                            autoComplete: 'off',
                            readOnly: isReadOnly,
                        }}
                        inputProps={{
                            inputMode: inputFormat === 'PHONE' ? 'numeric' : 'text',
                            maxLength,
                        }}
                        variant={variant}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                cursor: isReadOnly ? 'default' : '',
                                backgroundColor: isDarkMode ? '#2F3241' : '#ffffff',
                            },
                            '& .MuiOutlinedInput-input:hover': {
                                cursor: isReadOnly ? 'default' : '',
                              },
                        }}

                    />
                )
            }}
            name={props.name}
            control={control}
        />
    )
}
