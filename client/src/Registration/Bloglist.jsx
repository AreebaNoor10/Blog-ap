import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@chakra-ui/react";
import { Card,CardBody, CardFooter,Image,Heading,Stack,Divider} from '@chakra-ui/react'

function BlogList({ id, title, content,image_url}) {
  const navigate = useNavigate(); 
  const handleShowFullBlog = () => {
    navigate(`/show`, { state: { title, content } });
  };


  return( 
          <> 
          <Card maxW='100%' height='100%' >
    <CardBody>
      <Stack mt='6' spacing='3'>
        <Heading size='md'>{title}</Heading>
        <Image
        src={image_url}
        alt='image'
        borderRadius='lg'
        width='100%'
        height="40vh"
      />
      </Stack>
    </CardBody>
    <Divider />
          <CardFooter>
          <Button colorScheme="teal" onClick={handleShowFullBlog} className="btn">
            Show Full Blog
          </Button>
          </CardFooter>
  </Card>
        </>
  );

}

export default BlogList;
