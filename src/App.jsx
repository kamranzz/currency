import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import InputAmount from './components/InputAmout'; // Fixed typo in component name
import SelectCountry from './components/SelectCountry';
import SwitchCurrency from './components/SwitchCurrency';
import { CurrencyContext } from './context/CurrencyContext';
import './App.css';

function App() {
  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    firstAmount,
  } = useContext(CurrencyContext);
  const [resultCurrency, setResultCurrency] = useState(0);
  const [balance, setBalance] = useState(0);
  const codeFromCurrency = fromCurrency.split(' ')[1];
  const codeToCurrency = toCurrency.split(' ')[1];

  const handleConvert = () => {
    // Trigger conversion logic here
    fetchData();
  };

  useEffect(() => {
    fetchData(); // Initial conversion when component mounts
  }, [firstAmount, fromCurrency, toCurrency, codeFromCurrency, codeToCurrency]);

  const fetchData = async () => {
    try {
      if (firstAmount) {
        const response = await axios.get(
          'https://api.freecurrencyapi.com/v1/latest',
          {
            params: {
              apikey: import.meta.env.VITE_API_KEY,
              base_currency: codeFromCurrency,
              currencies: codeToCurrency,
            },
          }
        );
        const conversionRate = response.data.data[codeToCurrency];
        setResultCurrency(conversionRate);
        setBalance((prevBalance) => prevBalance + firstAmount * conversionRate);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // Provide user-friendly error feedback if needed
    }
  };

  const boxStyles = {
    background: '#ffffff',
    marginTop: '15%',
    textAlign: 'center',
    color: '#222',
    minHeight: '20rem',
    borderRadius: 2,
    padding: '4rem 2rem',
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,.4)',
    position: 'relative',
  };

  return (
    <>
      <AppBar position="static" sx={{ background: '#0009' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
            NUAR Currency
          </Typography>
          <Link href="#" color="inherit">
            Home
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={boxStyles}>
        <Typography variant="h5" sx={{ marginBottom: '2rem' }}>
        Trusted Global Currency Converter & Money Transfer Solutions
        </Typography>
        <Grid container spacing={2}>
          <InputAmount />
          <SelectCountry value={fromCurrency} setValue={setFromCurrency} label="From" />
          <SwitchCurrency />
          <SelectCountry value={toCurrency} setValue={setToCurrency} label="To" />
        </Grid>

        {firstAmount ? (
          <Box sx={{ textAlign: 'left', marginTop: '1rem', position: 'relative',marginBottom: '30px'}}>
            <Typography>
              {firstAmount} {fromCurrency} =
            </Typography>
            <Typography variant="h5" sx={{ marginTop: '5px', fontWeight: 'bold' }}>
              {resultCurrency * firstAmount} {toCurrency}
            </Typography>
            <Typography variant="h6" sx={{ position: 'absolute', bottom: 0, right: 0, marginTop: '1rem' }}>
              Balance: {balance.toFixed(2)} {toCurrency}
            </Typography>
          </Box>
        ) : (
          ''
        )}

        <Button
          variant="contained"
          onClick={handleConvert}
          sx={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          Add Balance
        </Button>
      </Container>
    </>
  );
}

export default App;
