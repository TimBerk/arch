"use client";

import {Container, CssBaseline, ThemeProvider, createTheme} from '@mui/material'
import NavBar from '@/components/NavBar'

const theme = createTheme({
    palette: {
        primary: {
            main: "#1a1a1a",
        },
        secondary: {
            main: "#ccc",
        },
    },
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
            <CssBaseline />
            <ThemeProvider theme={theme}>
            <NavBar />
            <Container maxWidth="lg">
                {/*<Component {...pageProps} />*/}
                {children}
            </Container>
            </ThemeProvider>
        </body>
        </html>
    );
}