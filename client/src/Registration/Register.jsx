import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function validation(values) {
  let errors = {};

  if (!values.fname) {
    errors.fname = 'First name should not be empty';
  }

  if (!values.lname) {
    errors.lname = 'Last name should not be empty';
  }

  if (!values.username) {
    errors.username = 'Username should not be empty';
  }

  if (!values.email) {
    errors.email = 'Email should not be empty';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is not valid';
  }

  if (!values.password) {
    errors.password = 'Password should not be empty';
  }

  if (values.password !== values.cpassword) {
    errors.cpassword = 'Passwords do not match';
  }

  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fname: '',
    lname: '',
    username: '',
    email: '',
    pnumber: '', 
    password: '',
    cpassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validation(values);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8000/signup', values);
        console.log('Successful POST response:', response.data);
        navigate('/login');
      } catch (error) {
        console.log('Error during POST request:', error);
      }
    }

    setErrors(formErrors);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handlePhoneNumberChange = (value) => {
    setValues((prev) => ({ ...prev, pnumber: value }));
  };
  return (
    <>
    <Flex
    minH={'100vh'}
    bg={useColorModeValue('gray.50', 'gray.800')}
    align={'center'}
    justify={'center'}
  >

      <Stack spacing={6} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          as="form"
          onSubmit={handleSubmit}
        >
          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              name="fname"
              value={values.fname}
              onChange={handleInput}
            />
            {errors.fname && <Text color="red">{errors.fname}</Text>}
          </FormControl>

          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              name="lname"
              value={values.lname}
              onChange={handleInput}
            />
            {errors.lname && <Text color="red">{errors.lname}</Text>}
          </FormControl>

          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={values.username}
              onChange={handleInput}
            />
            {errors.username && <Text color="red">{errors.username}</Text>}
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <Text color="red">{errors.email}</Text>}
          </FormControl>
          <FormControl id="phoneNumber">
            <FormLabel>Phone Number</FormLabel>
            <PhoneInput
              inputProps={{
                name: 'pnumber',
                required: true,
              }}
              country={'us'} // Set the default country code or use your own logic
              value={values.pnumber}
              onChange={handlePhoneNumberChange}
            />
            {errors.pnumber && <Text color="red">{errors.pnumber}</Text>}
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && <Text color="red">{errors.password}</Text>}
          </FormControl>
 
          <FormControl id="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="cpassword"
              value={values.cpassword}
              onChange={handleInput}
            />
            {errors.cpassword && <Text color="red">{errors.cpassword}</Text>}
          </FormControl>
     <Stack pt={5}>
          <Button
            type="submit"
            size="lg"
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
          >
            Sign up
          </Button>
          </Stack>
          <Stack pt={5}>
              <Text align={'center'}>
                have an account?
                <Link color={'blue.400'} to="/login">
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}>
                    Login
                  </Button>
                </Link>
              </Text>
            </Stack>
        </Box>
      </Stack>
    </Flex>
    </>
  );
}
