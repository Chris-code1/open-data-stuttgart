// src/App.tsx
import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Switch,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import DataChart from './components/DataChart';
import MapComponent from './components/MapComponent';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const cards = [
    { title: 'Card 1', content: 'This is a sample card' },
    { title: 'Card 2', content: 'Another sample card' },
    { title: 'Card 3', content: 'Yet another sample card' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Material UI Demo
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {cards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2">
                      {card.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {<Grid item xs={12}>
              <DataChart />
            </Grid>}
            <MapComponent />
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;