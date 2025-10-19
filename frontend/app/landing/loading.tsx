import { Box, CircularProgress } from '@mui/material';
import Image from 'next/image';

export default function LandingLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#000000',
        gap: 4,
        padding: 3
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: { xs: 300, sm: 400, md: 500 },
          height: { xs: 140, sm: 180, md: 220 },
          mb: 2
        }}
      >
        <Image
          src="/images/connection-key-logo.png"
          alt="The Connection Key"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </Box>

      {/* Loading Spinner */}
      <CircularProgress
        size={80}
        thickness={4}
        sx={{
          color: '#e8b86d',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
    </Box>
  );
}

