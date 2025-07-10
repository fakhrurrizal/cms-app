'use client'

import { CustomTextField } from '@/components'
import { LoginForm, loginSchema, useLoginMutation } from '@/modules/auth/login'
import { useAuth } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import { Box, Button, Card, CardContent, Container, Fade, Grid, Slide, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const LoginComponent: React.FC = () => {
    const router = useRouter()
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const [isVisible, setIsVisible] = useState(false)
    const { mutateAsync: login, isPending: isLoadingLogin } = useLoginMutation()
    const setAuth = useAuth(state => state.setAuth)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
            fullname: "Admin KLIK",
        },
    })

    console.log(errors)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const onSubmit = async (data: any) => {
        try {
            if (data.username === "admin" && data.password === "password") {
                const res = await login(data)
                const user = res
                setAuth({ user })
                toast.success('Login Berhasil')
                router.push('/')
            } else {
                toast.error('Login Gagal, Username atau Password Salah')
            }
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? '#0f172a' : undefined, // slate-900 untuk dark
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: isDark
                        ? 'linear-gradient(135deg, #0f172a, #1e293b)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e1f5fe 25%, #f0f9ff 50%, #fafbff 75%, #ffffff 100%)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: isDark
                            ? 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)'
                            : `
                                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(147, 197, 253, 0.03) 0%, transparent 50%),
                                radial-gradient(circle at 40% 70%, rgba(96, 165, 250, 0.02) 0%, transparent 50%)
                            `,
                    },
                }}
            />

            <Container maxWidth='sm' sx={{ position: 'relative', zIndex: 10 }}>
                <Fade in={isVisible} timeout={1000}>
                    <Card
                        sx={{
                            background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            boxShadow: isDark
                                ? '0 25px 50px rgba(30, 58, 138, 0.15)'
                                : '0 25px 50px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.6)',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 255, 255, 0.2)',
                            width: '100%',
                            maxWidth: '450px',
                            mx: 'auto',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: isDark
                                    ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                            },
                        }}
                    >
                        <CardContent sx={{ p: 6 }}>
                            <Slide direction='down' in={isVisible} timeout={1200}>
                                <Box sx={{ textAlign: 'center', mb: 6 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mx: 'auto',
                                            mb: 3,
                                            background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                        }}
                                    >
                                        <Icon icon="mdi:account-circle" style={{ fontSize: '48px', color: 'white' }} />
                                    </Box>

                                    <Typography
                                        variant='h4'
                                        sx={{
                                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            letterSpacing: '-0.025em',
                                            mb: 1,
                                        }}
                                    >
                                        Selamat Datang
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{
                                            color: isDark ? '#cbd5e1' : '#64748b',
                                            fontSize: '1rem',
                                            fontWeight: 400,
                                            letterSpacing: '0.025em',
                                        }}
                                    >
                                        Silakan masuk ke akun Anda
                                    </Typography>
                                </Box>
                            </Slide>

                            <Slide direction='up' in={isVisible} timeout={1400}>
                                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                control={control}
                                                size='medium'
                                                error={!!errors.username}
                                                name='username'
                                                label='Username'
                                                placeholder='masukan "admin"'
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                control={control}
                                                inputFormat='PASSWORD'
                                                size='medium'
                                                error={!!errors.password}
                                                name='password'
                                                placeholder='masukan "password"'
                                                label='Password'
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ pt: 4, mb: 4 }}>
                                        <Button
                                            type='submit'
                                            fullWidth
                                            variant='contained'
                                            disabled={isLoadingLogin}
                                            sx={{
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                                borderRadius: '12px',
                                                height: '52px',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                color: '#ffffff',
                                                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.35)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow:
                                                        '0 15px 35px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(59, 130, 246, 0.3)',
                                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(0px)',
                                                },
                                                '&:disabled': {
                                                    background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                                                    color: '#ffffff',
                                                    opacity: 0.7,
                                                },
                                            }}
                                        >
                                            {isLoadingLogin ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Icon icon='mdi:loading' className='animate-spin' />
                                                    Memproses...
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Icon icon='mdi:login' />
                                                    Masuk
                                                </Box>
                                            )}
                                        </Button>
                                    </Box>
                                </Box>
                            </Slide>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>

            <style jsx>{`
                @keyframes gentleFloat {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg) scale(1);
                        opacity: 0.05;
                    }
                    33% {
                        transform: translateY(-10px) rotate(2deg) scale(1.05);
                        opacity: 0.08;
                    }
                    66% {
                        transform: translateY(5px) rotate(-1deg) scale(0.95);
                        opacity: 0.03;
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </Box>
    )
}

export default LoginComponent
