"use client";

import { AppBar, Toolbar, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function NavBar() {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        LinkComponent={Link}
                        href="/"
                        color="inherit"
                    >
                        Home
                    </Button>
                    <Button
                        LinkComponent={Link}
                        href="/domain-strategy"
                        color="inherit"
                    >
                        Домены
                    </Button>
                    <Button
                        LinkComponent={Link}
                        href="/architecture-styles"
                        color="inherit"
                    >
                        Архитектурные стили
                    </Button>
                    <Button
                        LinkComponent={Link}
                        href="/databases"
                        color="inherit"
                    >
                        Базы Данных
                    </Button>
                    <Button
                        LinkComponent={Link}
                        href="/influence-matrix"
                        color="inherit"
                    >
                        Матрица влияния
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}