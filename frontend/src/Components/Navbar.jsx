import React, { useState, useRef, useEffect } from "react";
import {
  Center,
  Flex,
  Button,
  Image,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import Images from "../assets/perpus.png";
import { MdOutlineArrowForward, MdOutlineArrowBack } from "react-icons/md";
import { SlSocialDropbox } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import parseJwt from "../utils/parseJwt";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/loginSlices";
import API from "../services/index";
import Cookies from "../utils/cookies";

const Navbar = () => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [password, setPassword] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector((state) => state.login);

  const toast = useToast({
    position: "top-right",
    duration: 2000,
    variant: "left-accent",
  });

  const handlePassword = (e) => {
    setPassword({ [e.target.name]: e.target.value });
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const data = parseJwt(localStorage.getItem("token"));

    const value = {
      password: password.password,
      userid: data.userid,
    };

    // const verify = {
    //     password: password.password,
    //     userid: data.userid
    // }

    try {
      const res = await API.logout(value);

      console.log("res verfiy", res.data);

      if (res.status) {
        toast({
          title: "Logout Success",
          status: "success",
          isClosable: true,
        });
        dispatch(logout({ type: "LOGOUT", payload: value }));
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Wrong Password",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleLogoutUser = (e) => {
    e.preventDefault();
    Cookies.delCookies("CERT");
    navigate("/index");
  };

  useEffect(() => {
    console.log("state effect", state);
  }, [dispatch]);

  return (
    <div className="container">
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Insert Password to Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Password Admin</FormLabel>
              <Input
                ref={initialRef}
                type="password"
                placeholder="Password"
                name="password"
                onChange={handlePassword}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleLogout} colorScheme="blue" mr={3}>
              {state.loading ? "Loading..." : "Logout"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex minWidth="max-content" alignItems="center" p={2}>
        <Center alignItems="center">
          <Image src={Images} alt="logo" w="200px" h="50px" />
        </Center>
        <Spacer />
        {location.pathname === "/index" ? (
          <Center>
            <Button
              onClick={() => navigate("dropbox")}
              mr={4}
              leftIcon={<SlSocialDropbox />}
              colorScheme="green"
              variant="outline"
            >
              Pengembalian Buku
            </Button>
            <Button
              onClick={onOpen}
              rightIcon={<MdOutlineArrowForward />}
              colorScheme="red"
              variant="outline"
            >
              Back to Homepage
            </Button>
          </Center>
        ) : location.pathname === "/dashboard/user" ? (
          <Center>
            <Button
              rightIcon={<MdOutlineArrowForward />}
              colorScheme="red"
              variant="outline"
              onClick={handleLogoutUser}
            >
              Logout
            </Button>
          </Center>
        ) : location.pathname === "/index/dropbox" ? (
          <Center>
            <Button
              leftIcon={<MdOutlineArrowBack />}
              colorScheme="red"
              variant="outline"
              onClick={() => navigate("/index")}
            >
              Kembali ke Dashboard
            </Button>
          </Center>
        ) : location.pathname === "/admin" ? (
          <Center>
            <Button
              rightIcon={<MdOutlineArrowForward />}
              colorScheme="red"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Kembali ke Homepage
            </Button>
          </Center>
        ) : (
          location.pathname === "/" && (
            <Center>
              <Button
                rightIcon={<MdOutlineArrowForward />}
                colorScheme="teal"
                variant="ghost"
                onClick={() => navigate("/admin")}
              >
                Admin Page
              </Button>
            </Center>
          )
        )}
      </Flex>
    </div>
  );
};

export default Navbar;
