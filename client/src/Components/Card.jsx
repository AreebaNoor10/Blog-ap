import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import JoditEditor from "jodit-react";
import { Button } from "@chakra-ui/react";
import { Card,  CardBody, CardFooter,Image,Heading,Stack,Divider,ButtonGroup } from '@chakra-ui/react'
import { useAuthentication } from '../Authentication/useAuthentication';

function Card1({ id, title, content, status, onUpdate, onDelete ,image_url}) {
  const isAuthenticated = useAuthentication();
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const navigate = useNavigate(); 

  const handleEdit = () => {
    setEditing(true);
  };

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
      askBeforePasteFromWord: false,
      askBeforePasteHTML: false,
    },
    height: 200,
    allowResizeX: false,
    allowResizeY: false,
  };
  const handleSave = async () => {
    try {
       // Update the status to "draft" and send the update to the server
       const token = localStorage.getItem("token"); 
       const updatedStatus = "publish";
      const response = await axios.put(
        `http://localhost:8000/api/editBlog/${id}`,
        {
          title,
          content,
          status: updatedStatus,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate(id, response.data.content, updatedStatus);
      setEditing(false);
      onUpdate(id, editedContent);
    } catch (error) {
      console.error("Error editing blog:", error);
    }
  };


  const handleCancel = () => {
    setEditing(false);
    setEditedContent(content);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/deleteBlog/${id}`); 
      onDelete(id);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleShowFullBlog = () => {
    navigate(`/show/${id}`, { state: { title, content } });
  };


  return isAuthenticated &&(
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
    {editing ? (
        // Editing mode
        <>
         <CardBody>
          <JoditEditor
            config={config}
            value={editedContent}
            tabIndex={1}
            onBlur={(newContent) => setEditedContent(newContent)}
            onChange={(newContent) => {}}
          />
          </CardBody>
          <CardFooter>
          <ButtonGroup spacing={2}>
          <Button onClick={handleSave} colorScheme="blue">
            Save
          </Button>
          <Button onClick={handleCancel} colorScheme="blue">
            Cancel
          </Button>
          </ButtonGroup>
          </CardFooter>
        </>
      ) : (
        <>
            <CardFooter>
        <ButtonGroup spacing={2}>
          <Button colorScheme="teal" onClick={handleShowFullBlog} className="btn">
            Show Full Blog
          </Button>
          <Button colorScheme="yellow" className="btn" onClick={handleEdit}>
            Edit
          </Button>
          <Button colorScheme="red" className="btn" onClick={handleDelete}>
            Delete
          </Button>
          </ButtonGroup>
          </CardFooter>
        </>
      )}
  </Card>
        </>
  );

}

export default Card1;
