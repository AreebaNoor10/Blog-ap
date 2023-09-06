import React, { useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useAuthentication } from '../Authentication/useAuthentication';
import {
  Input,
  Button,
  Box,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Stack,
  Select,
} from "@chakra-ui/react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
} from "@chakra-ui/react";
const steps = [
  { title: "Add Keyword", description: "Search Keyword" },
  { title: "Add/Edit Title", description: "Edit Blog Title and Content" },
  { title: "Preview & Save Blog", description: "Preview Blog" },
];
function Editor() {
  const isAuthenticated = useAuthentication();
  const [content, setContent] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [activeStep, setActiveStep] = useState(0);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const config = {
    uploader: {
      insertImageAsBase64URI: false,
    },
    height: 400,
    allowResizeX: false,
    allowResizeY: false,
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const wordCount = content
        .split(/\s+/)
        .filter((word) => word !== "").length;

      if (wordCount < 50) {
        toast.error("Words are less than 50.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (status === "draft" && draftId) {
          await axios.delete(`http://localhost:8000/api/deleteBlog/${draftId}`);
        }
      const response = await axios.post(
        "http://localhost:8000/api/saveBlog",
        {
          title,
          content,
          status: "draft",
          image_url: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      

        console.log("Content saved as draft:", response.data);
        setDraftId(response.data.id);
        setIsDraftSaved(true);
      } catch (error) {
        console.error("Error saving blog as draft:", error);
        toast.error("There was an error saving the blog as draft");
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/search?keyword=${searchKeyword}`
      );
      const blogPosts = response.data
        .map((post) => post.content)
        .join("<br />");
      setContent(blogPosts);
      setIsDraftSaved(true);
      handleNext();
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBlog = async () => {
    const wordCount = content.split(/\s+/).filter((word) => word !== "").length;

    if (wordCount < 50) {
      toast.error("Words are less than 50. Cannot save the blog.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); 
      if (status === "draft" && draftId) {
        await axios.delete(`http://localhost:8000/api/deleteBlog/${draftId}`,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      }

      const response = await axios.post("http://localhost:8000/api/saveBlog", {
        title,
        content,
        status: "publish",
        image_url: imageUrl,
      },{
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      console.log("Content saved as publish:", response.data);
      toast.success("Blog Published Successfully");

      setContent("");
      setTitle("");
      setImageUrl("");
      setActiveStep(0);
      setIsDraftSaved(false);
      setDraftId(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("There was an error processing your request");
    }
  };
  const Dropzone = () => {
    const onDrop = (acceptedFiles) => {
      const file = acceptedFiles[0]; 
      if (file) {
       
        console.log("Accepted File:", file);
        console.log("File Type:", file.type);

   
        if (!file.type.startsWith("image/")) {
          toast.error("Invalid file type. Please upload an image");
          return;
        }

        setImageFile(file);
        previewImage(file);
      }
    };

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: "image/*",
      multiple: false, 
    });

    return (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {imageFile ? (
          <div className="image-preview">
            <img src={imageUrl} alt="Uploaded" />
          </div>
        ) : (
          <p className="dropzone-text">
            Drag & drop an image here, or click to select an image
          </p>
        )}
      </div>
    );
  };

  return isAuthenticated &&(
    <>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber>{index + 1}</StepNumber>}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>
                  Step {index + 1}: {step.title}
                </StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <div>
            <Card align="center" marginTop={10}>
              <CardHeader>
                <Heading size="lg">Categories</Heading>
              </CardHeader>
              <CardBody>
                <Select placeholder="Select Categories" width="100%">
                  <option value="option1">Food Blogs</option>
                  <option value="option2">Travel Blogs</option>
                  <option value="option3">Health and fitness Blogs</option>
                  <option value="option3">Lifestyles Blogs</option>
                  <option value="option3">Fashion and Beauty Blogs</option>
                  <option value="option3">Photography blogs</option>
                  <option value="option3">Personal blogs</option>
                  <option value="option3">DIY craft blogs</option>
                </Select>
              <CardHeader>
                <Heading size="lg">Enter Keywords</Heading>
              </CardHeader>
                <Input
                  placeholder="Search Keyword"
                  size="md"
                  type="text"
                  value={searchKeyword}
                  width="100%"
                  onChange={(event) => setSearchKeyword(event.target.value)}
                />
              </CardBody>
              <CardFooter width="20%">
                <Button
                  colorScheme="teal"
                  onClick={handleSearch}
                  size="md"
                  className="search-button"
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <Card align="center" marginTop={10}>
              <Heading align="center" size="lg">
                Blog Title
              </Heading>
              <CardBody width="50%">
                <Input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="title-input-field"
                />
              <Heading align='center' size='lg' mb={2}>Blog Image</Heading>
                <Dropzone />
              </CardBody>
            </Card>

            <JoditEditor
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={(newContent) => {}}
            />

            <Stack
              spacing={4}
              direction="row"
              align="left"
              justifyContent="flex-end"
            >
              <Button
                colorScheme="blue"
                onClick={handleBack}
                size="md"
                className="search-button"
                width="20%"
              >
                Back
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleNext}
                size="md"
                className="search-button"
                width="20%"
              >
                Preview
              </Button>
            </Stack>
          </div>
        )}

        {activeStep === 2 && (
          <div className="editor" style={{ marginTop: "50px" }}>
            {isDraftSaved && (
              <>
                <Stack
                  spacing={4}
                  direction="row"
                  align="left"
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={() => {
                      setStatus("publish");
                      handleBlog();
                    }}
                    colorScheme="teal"
                    size="lg"
                  >
                    Publish
                  </Button>
                  <Button onClick={handleBack} colorScheme="teal" size="lg">
                    Edit
                  </Button>
                </Stack>
              </>
            )}
              <div dangerouslySetInnerHTML={{ __html: content }} style={{mt:5}}/>
          </div>
        )}
      </Box>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default Editor;
