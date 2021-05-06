import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  FormHelperText,
  FormControl,
  FormLabel,
  Button,
  Input,
  Container,
  Box,
  Text,
  LightMode,
  Flex,
  useToast,
  Heading,
  VStack
} from "@chakra-ui/react";
import NavBar from './NavBar';

// import { useAuth } from "../useAuth";

const SignUp = () => {
  const [newUser, setNewUserField] = useState({
    email: "",
    password: "",
    confirmedUserPassword: "",
  });

  const [error, setError] = useState({
    verifyPassword: "",
  });

  const history = useHistory();
  const toast = useToast();

  const [toastMessage, setToastMessage] = useState(undefined);

  useEffect(() => {
    if (toastMessage) {
      toast({
        title: toastMessage.title,
        description: toastMessage.description,
        status: "warning",
        duration: toastMessage.duration,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [toastMessage, toast]);

  const handleAllInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setNewUserField({ ...newUser, [name]: value });
  };

  const validate = () => {
    const firstPasswordInput = newUser.password;
    const secondPasswordInput = newUser.confirmedUserPassword;
    if (firstPasswordInput !== secondPasswordInput) {
      setError({ ...error, verifyPassword: "passwords do not match" });
      return false;
    }
    return true;
  };

  // backend function passed down in props that will take the currentUser as input;
  const handleNewUserSubmit = (event) => {
    event.preventDefault();

    const errorStatus = validate();
    let title;
    let description;
    let duration;
    if (errorStatus) {
      fetch("/auth/signup", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          return res.json().then((data) => {
            throw data;
          });
        })
        .then((data) => {
          localStorage.setItem('curioToken', data.token);
          localStorage.setItem('curioUser', data.user);
          history.push('/')
          ;
        })
        .catch((error) => {
          title = "Error";
          description = `${error.err}`;
          duration = 9000;
          setToastMessage({ title, description, duration });
        });
    }
  };

  return (
    <LightMode>
      <NavBar displaySearch={true}/>
      <Flex justifyContent="center" h='100vh' backgroundImage='url(https://images.metmuseum.org/CRDImages/as/original/DP251139.jpg)'>
        <Box>
          <Container
            border="3px solid black"
            margin="auto"
            mb="50px"
            mt="100px"
            maxW="300px"
            py="20px"
            rounded="5%"
            bg='whitesmoke'
          >
            <Container marginBottom="1px solid silver" justifyContent="column">
              <form onSubmit={handleNewUserSubmit}>
                <FormControl isRequired mt="10px">
                  <FormLabel>Email:</FormLabel>
                  <Input
                    onChange={handleAllInputChange}
                    id="email"
                    name="email"
                    borderColor='black'
                    color='black'
                  />
                  <FormHelperText fontSize="12px" id="email-helper-text">
                    Your user account email address
                </FormHelperText>
                </FormControl>
                <FormControl mt="10px" isRequired>
                  <FormLabel>Password:</FormLabel>
                  <Input
                    onChange={handleAllInputChange}
                    id="password"
                    type="password"
                    name="password"
                    borderColor='black'
                    color='black'
                  />
                  {error.verifyPassword && (
                    <Text id="mismatchedPassword" fontSize="8px">
                      {error.verifyPassword}
                    </Text>
                  )}
                  <FormHelperText fontSize="12px" id="password-helper-text">
                    Set up a password
                </FormHelperText>
                </FormControl>
                <FormControl mt="10px" isRequired>
                  <FormLabel>Confirm Password:</FormLabel>
                  <Input
                    onChange={handleAllInputChange}
                    id="confirmedUserPassword"
                    type="password"
                    name="confirmedUserPassword"
                    borderColor='black'
                    color='black'
                  />
                  {error.verifyPassword && (
                    <Text id="mismatchedPassword" fontSize="8px">
                      {error.verifyPassword}
                    </Text>
                  )}
                  <FormHelperText fontSize="12px" id="password-helper-text">
                    Set up a password
                </FormHelperText>
                </FormControl>
                <Button
                  colorScheme="cyan"
                  color="white"
                  ml="60px"
                  mt={4}
                  type="submit"
                >
                  Sign Up
              </Button>
              </form>
            </Container>
            <Container>
              {/* <Flex ml="30px" maxW="180px" justifyContent="space-between"> */}
              <Flex justifyContent='space-evenly' padding={5}>
                <Text fontSize='12px'>Have an account?</Text>
                <NavLink to="/login">
                  <Text fontSize="12px" textDecoration='underline'>
                    Log In
                </Text>
                </NavLink>
              </Flex>
            </Container>
          </Container>
        </Box>
      </Flex>
    </LightMode>
  );
};

export default SignUp;
