import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import { SimpleGrid,Box} from '@chakra-ui/react'
import { useAuthentication } from '../Authentication/useAuthentication';
function Published() {
  const isAuthenticated = useAuthentication();
  const [publishedPosts, setPublishedPosts] = useState([]);

  useEffect(() => {
    // Fetch all published blog posts when the component mounts
    async function fetchAllPublished() {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from localStorage
        console.log("Token:", token);
        const response = await axios.get("http://localhost:8000/api/published",{
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        });
        setPublishedPosts(response.data);
      } catch (error) {
        console.error("Error fetching published posts:", error);
      }
    }

    fetchAllPublished();
  }, []);

  const handleUpdate = (id, updatedContent, updatedStatus) => {
    // Update the content and status of the specific published blog post in the state
    setPublishedPosts((prevPublishedPosts) =>
      prevPublishedPosts.map((post) =>
        post.id === id
          ? { ...post, content: updatedContent, status: updatedStatus }
          : post
      )
    );
  };

  const handleDelete = (id) => {
    // Remove the specific published blog post from the state
    setPublishedPosts((prevPublishedPosts) =>
      prevPublishedPosts.filter((post) => post.id !== id)
    );
  };

  return isAuthenticated &&(
    <Box ml={{ base: 0, md: 60 }} p="4">
        <div className="heading"><h1>Published Posts</h1></div>
      <div className="card-container">
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }}spacing='40px'>
        {publishedPosts.map((post) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            image_url={post.image_url}
            status={post.status}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
            </SimpleGrid>
      </div>
    </Box>
  );
}

export default Published;
