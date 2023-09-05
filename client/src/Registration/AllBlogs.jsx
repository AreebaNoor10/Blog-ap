import React,{useState,useEffect} from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Collapse,
  useColorModeValue,
  useDisclosure,
  Stack,
  Heading,
  SimpleGrid
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import BlogList from './Bloglist';
export default function AllBlogs() {
  const { isOpen, onToggle } = useDisclosure();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch all published blog posts when the component mounts
    async function fetchAllBlogs() {
      try {
        const response = await axios.get("http://localhost:8000/api/allBlogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchAllBlogs();
  }, []);




  return (
    <Box>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            fontFamily={'heading'}
            color='red'
          >
            Logo
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'/login'}>
            Sign In
          </Button>
          <Button
            as={'a'}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'/register'}
            _hover={{
              bg: 'pink.300',
            }}>
            Sign Up
          </Button>
        </Stack>
      </Flex>
      
      <Box >
      <Heading textAlign='center'>All Blogs</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }}spacing='40px' mt={5}>
        {blogs.map((post) => (
          <BlogList
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            image_url={post.image_url}
          />
        ))}
            </SimpleGrid>
    </Box>

 
    </Box>
  );
}
