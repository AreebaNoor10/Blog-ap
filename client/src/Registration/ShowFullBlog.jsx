// FullBlogPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import { Grid, GridItem,Box, Heading} from '@chakra-ui/react'
import { LayoutGroup } from "framer-motion";

function ShowFullBlogs() {
  const location = useLocation();
  const { title, content } = location.state || {};

  return (
    <Grid templateColumns='repeat(5, 1fr)' gap={4}>
      <GridItem colSpan={1}  />
      <GridItem colStart={2} colEnd={5} >
          <Heading size={'lg'} textAlign='center' className="blog-title" mt={10}>{title}</Heading>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />  
      </GridItem>
      <GridItem colSpan={1}  />
    </Grid>
  );
}

export default ShowFullBlogs;
