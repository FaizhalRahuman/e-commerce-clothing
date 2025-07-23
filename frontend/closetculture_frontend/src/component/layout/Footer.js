import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import CheckroomIcon from '@mui/icons-material/Checkroom';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'black', color: 'white', pt: 6, pb: 3, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="space-between">
          {/* Quick Links - Left */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <MuiLink href="/" color="gray" underline="hover">
                Home
              </MuiLink>
              <MuiLink href="/profile" color="gray" underline="hover">
                Profile
              </MuiLink>
              <MuiLink href="/products" color="gray" underline="hover">
                Products
              </MuiLink>
              <MuiLink href="/contact" color="gray" underline="hover">
                Contact
              </MuiLink>
            </Box>
          </Grid>

          {/* Logo and About - Center */}
          <Grid item xs={12} md={4} textAlign="center">
            <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
              <CheckroomIcon sx={{ mr: 1, color: 'white' }} />
              <Typography variant="h6" fontWeight={600}>
                Closet Culture
              </Typography>
            </Box>
            <Typography variant="body2" color="gray">
              Discover fashion that defines your style. Closet Culture is your
              go-to destination for curated clothing collections.
            </Typography>
          </Grid>

          {/* Social - Right */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box display="flex" justifyContent="center" gap={1}>
                <IconButton href="https://instagram.com" target="_blank" sx={{ color: 'white' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton href="https://facebook.com" target="_blank" sx={{ color: 'white' }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton href="https://twitter.com" target="_blank" sx={{ color: 'white' }}>
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: '#333', my: 3 }} />

        {/* Bottom Note */}
        <Typography variant="body2" color="gray" align="center">
          © {new Date().getFullYear()} Closet Culture. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;