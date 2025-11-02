'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function DatenschutzPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(242, 159, 5, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(140, 29, 4, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #1a1820 0%, #1a1820 60%)
        `,
        backgroundAttachment: 'fixed',
        pt: { xs: 10, md: 14 },
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, height: 200, mx: 'auto' }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </Box>
        </Box>

        <Paper
            sx={{
              p: { xs: 3, md: 5 },
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(242, 159, 5, 0.3)',
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 4,
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Datenschutzerklärung
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#F29F05', mb: 1, fontWeight: 700 }}>
                1. Datenschutz auf einen Blick
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, lineHeight: 1.8 }}>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#F29F05', mb: 1, fontWeight: 700 }}>
                2. Verantwortliche Stelle
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, lineHeight: 1.8 }}>
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
                The Connection Key<br />
                [Adresse]<br />
                [Telefon]<br />
                [E-Mail]
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#F29F05', mb: 1, fontWeight: 700 }}>
                3. Erhebung und Speicherung personenbezogener Daten
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, lineHeight: 1.8 }}>
                Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch 
                Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sogenannten 
                Logfile gespeichert.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#F29F05', mb: 1, fontWeight: 700 }}>
                4. Ihre Rechte
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, lineHeight: 1.8 }}>
                Sie haben das Recht:<br />
                • Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten<br />
                • Berichtigung unrichtiger Daten zu verlangen<br />
                • Löschung Ihrer bei uns gespeicherten Daten zu verlangen<br />
                • Einschränkung der Datenverarbeitung zu verlangen<br />
                • Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen<br />
                • Datenübertragbarkeit
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#F29F05', mb: 1, fontWeight: 700 }}>
                5. Widerspruch oder Widerruf gegen die Verarbeitung Ihrer Daten
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
                Wenn Sie der Verarbeitung Ihrer personenbezogenen Daten widersprechen oder eine erteilte Einwilligung widerrufen möchten, 
                können Sie uns jederzeit kontaktieren.
              </Typography>
            </Box>

            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(242, 159, 5, 0.2)' }}>
              <Link
                href="/"
                style={{
                  color: '#F29F05',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                ← Zurück zur Startseite
              </Link>
            </Box>
          </Paper>
      </Container>
    </Box>
  );
}

