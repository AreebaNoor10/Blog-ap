import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  useBreakpointValue,
  Button,
  Center
} from '@chakra-ui/react';
import {
  FiHome,
  FiMenu,
  FiEdit2
} from 'react-icons/fi';
import {TbBrandBlogger} from 'react-icons/tb'
import {RiDraftLine} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';
const LinkItems = [
  { path: "/dashboard", name: "Dashboard", icon: FiHome },
  { path: "/editor", name: "Editor", icon: FiEdit2},
  { path: "/draft", name: "Draft", icon: RiDraftLine },
  { path: "/publish", name: "Blogs", icon:TbBrandBlogger  },
];

const SidebarContent = ({ onClose, isMobile, ...rest }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or perform any other necessary actions
    navigate('/login');
  };
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={isMobile ? 'full' : { base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        {isMobile ? (
          <CloseButton onClick={onClose} />
        ) : (
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        )}
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
      <Center  h='100px' color='white'>
      <Button colorScheme='blue' size='lg' onClick={handleLogout}>Logout</Button>
      </Center>
    </Box>
  );
};

const NavItem = ({ icon: IconComponent, children, path, ...rest }) => {
  return (
    <>
    <Link to={path} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {IconComponent && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={IconComponent}
          />
        )}
        {children}
      </Flex>
    </Link>
    </>
  );
};

const MobileNav = ({ onOpen }) => {
  return (
    <Flex
      px="4"
      py="2"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="space-between"
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      {isMobile ? (
        <MobileNav onOpen={onOpen} />
      ) : (
        <SidebarContent onClose={onClose} isMobile={isMobile} />
      )}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
