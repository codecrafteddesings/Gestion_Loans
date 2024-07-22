import React from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';

const UserManagement = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h4" gutterBottom>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body1" paragraph>
              Aquí puedes gestionar todos los usuarios.
            </Typography>
            <Button variant="contained" color="primary">
              Añadir Usuario
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserManagement;