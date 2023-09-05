import React from 'react'
import { SimpleGrid,Box,Container, Card,CardHeader, CardBody, CardFooter,Heading,Text,Button } from '@chakra-ui/react'
import { useAuthentication } from '../Authentication/useAuthentication';
const Dashboard = () => {
  const isAuthenticated = useAuthentication();
    return isAuthenticated && (
      <Box ml={{ base: 0, md: 60 }} p="4">
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
          <Card align='center' style={{background:" rgb(238,174,202)", background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)', color:'#fff'}}>
            <CardBody>
              <Text>Search Keywords</Text>
              <Heading size='lg'>3500+</Heading>
            </CardBody>
          </Card>
          <Card align='center' style={{background:" rgb(238,174,202)", background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)', color:'#fff'}}>
            <CardBody>
              <Text>Total Blogs</Text>
              <Heading size='lg'>1000+</Heading>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    );
  }
  
  export default Dashboard;
  
