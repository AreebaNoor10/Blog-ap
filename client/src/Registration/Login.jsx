import React, { useState } from 'react';
import validation  from './LoginValidation';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
export default function Login() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [values,setvalues] = useState({
      email:'',
      password:''
  })
  const [error,setError] = useState({})
  const handleinput = (event) => {
    console.log("Input changed:", event.target.name, event.target.value);
    setvalues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const err = validation(values);

    if (err === null) {
      axios
        .post('http://localhost:8000/login', values)
        .then((res) => {
          console.log('Response from server:', res.data);

          if (res.data.token) {
            // Store the access token in localStorage
            localStorage.setItem('token', res.data.token);

            // You should receive and store the refresh token from the server
            if (res.data.refreshToken) {
              localStorage.setItem('refreshToken', res.data.refreshToken);
            }

            navigate('/dashboard');
          } else {
            alert('No record existed');
          }
        })
        .catch((error) => {
          console.error('Login error:', error);

          if (error.response && error.response.status === 401) {
            // The current access token has expired; try refreshing it
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              axios
                .post('http://localhost:8000/token/refresh', {
                  refreshToken,
                })
                .then((res) => {
                  if (res.data.token) {
                    // Store the new access token in localStorage
                    localStorage.setItem('token', res.data.token);
                    navigate('/dashboard');
                  } else {
                    alert('Unable to refresh token');
                  }
                })
                .catch((refreshError) => {
                  console.error('Token refresh error:', refreshError);
                  alert('Unable to refresh token');
                });
            } else {
              alert('Refresh token not found');
            }
          }
        });
    } else {
      setError(err);
    }
  };

  
  
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Login</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
               onChange={handleinput}
               name='email'
              />
              {error.email && <Text color="red">{error.email}</Text>}
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={handleinput}
                name='password'
              />
              {error.password && <Text color="red">{error.password}</Text>}
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link color={'blue.400'} to="/register">
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}>
                    Register
                  </Button>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
