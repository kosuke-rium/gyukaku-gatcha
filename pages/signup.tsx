import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormEvent } from 'react'
import { useMutateAuth } from '../hooks/useMutateAuth'
import Link from 'next/link'
import { Spinner } from '../components/Spinner'

const theme = createTheme();

export default function SignIn() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    registerMutation,
  } = useMutateAuth() // importしたファイルからstateやメソッド等を持ってきている？

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    registerMutation.mutate()
  }

  if (registerMutation.isLoading) {
    return(
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography 
            component="h1"
            variant="h5"
            paddingTop={3}
            paddingBottom={2}
            sx={{
              width: '100%',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            WWWAVE GYUKAKU GACHA Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
            <Box
              sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              >
                <Link href="/login" passHref prefetch={false}>
                  <span style={{color:'#1976d2'}}>
                    アカウントをお持ちの方はこちら▶︎
                  </span>
                </Link>
              </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}