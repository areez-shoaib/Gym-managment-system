import React from 'react'
import {
    Box,
    Typography
} from '@mui/material'
function Footer() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 2,
                px: 2,
                mx: 'auto',
                maxWidth: '600px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                mt: 4,
                mb: 2
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    fontFamily: 'Times New Roman, serif'
                }}
            >
                © 2026 | Areez Korai Gym Management System | All Rights Reserved
            </Typography>
        </Box>)
}

export default Footer