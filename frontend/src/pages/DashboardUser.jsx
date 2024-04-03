import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import {
  Box,
  Card,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  Image,
  Text,
  Input,
  Button,
  HStack,
  Stack,
  useToast,
  Center,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";

import TablePinjaman from "../Components/Table/TablePinjaman";
import TableSuggest from "../Components/Table/TableSuggest";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import {
  setAutomaticLogout,
  setTriggerUpdateProfile,
} from "../features/loginSlices";
import API from "../services";
import ModalProfile from "../Components/Modal/ModalProfile";
import TableChekin from "../Components/Table/TableCheckin";
import FineUser from "../Components/FineUser";

const dashboardUser = () => {
  // const stateIssue = useSelector(state => state.issue)
  const stateLogin = useSelector((state) => state.login);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [type, setType] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [urlImage, setUrlImage] = useState("");
  const [dataUser, setDataUser] = useState({});
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();

  const timeoutCookies = () => {
    setTimeout(() => {
      dispatch(setAutomaticLogout());
      navigate("/index");
    }, stateLogin.users.duration);
  };

  const getDataUser = async () => {
    try {
      const res = await API.getDataUser();
      console.log("res user", res.data);
      setDataUser(res.data);
    } catch (error) {
      return error;
    }
  };

  const getPhotoProfile = async () => {
    try {
      const res = await API.getPhotoProfile();
      console.log("res photo", res.data);
      setUrlImage(res.data);
    } catch (error) {
      console.log("error photo", error);
    }
  };

  useEffect(() => {
    const dataCookies = Cookies.certCookies();
    setData(dataCookies);
    // console.log("data cookies", dataCookies)
    getDataUser();
    getPhotoProfile();
  }, []);

  useEffect(() => {
    if (new Date() > new Date(data.dateexpiry)) {
      toast({
        position: "top-right",
        title: "Session Expired",
        description: "Masa berlaku kartu telah habis",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      navigate("/index");
    }
  }, [data]);

  useEffect(() => {
    console.log("test timeoutcookies");
    timeoutCookies();
  }, []);

  useEffect(() => {
    console.log("image", urlImage);
  }, [urlImage]);

  useEffect(() => {
    getDataUser();
    setTimeout(() => {
      dispatch(setTriggerUpdateProfile(false));
    }, 1000);
  }, [stateLogin.triggerLogin]);

  return (
    <>
      <div className="container mx-auto h-screen">
        <Navbar />
        <HStack spacing={4} w="100%" align="center">
          <Box w="20%" h="full" p="5px" ml={10}>
            <Card
              alignItems="center"
              w="100%"
              bgColor="transparent"
              boxShadow="transparent"
              h="100%"
            >
              <Heading fontSize="2xl" textAlign="center">
                {data.surname}
              </Heading>
              <Heading
                fontSize="2xl"
                my={3}
                textAlign="center"
                color="green.500"
              >
                {data.cardnumber}
              </Heading>

              {urlImage.image ? (
                <Image
                  boxSize="250px"
                  mx="auto"
                  my={3}
                  borderRadius="full"
                  src={"data:image/jpeg;base64," + urlImage.image}
                  alt="No Image Found"
                />
              ) : (
                <img
                  boxSize="250px"
                  src="https://www.kindpng.com/picc/m/80-807524_no-profile-hd-png-download.png"
                  alt="No Profile, HD Png Download@kindpng.com"
                ></img>
              )}

              <Heading fontSize="md" my={3} textAlign="center">
                Masa Aktif Kartu
              </Heading>
              {new Date() > new Date(data.dateexpiry) ? (
                <Heading fontSize="md" color="red.500" textAlign="center">
                  {new Date(data.dateexpiry).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Heading>
              ) : (
                <Heading fontSize="md" color="green.500" textAlign="center">
                  {new Date(data.dateexpiry).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Heading>
              )}

              <Text fontSize="sm" my={1} textAlign="center">
                {dataUser.address}
              </Text>
              <Text fontSize="sm" my={1} textAlign="center">
                {dataUser.phone}
              </Text>

              {/* <Heading fontSize='lg' my={3} textAlign='center'>Status : 
                                    {(new Date() > new Date(data.dateexpiry)) ? (
                                        <Text as={'span'} color='red.500'> Expired </Text>
                                    ) : (
                                        <Text as={'span'} color='green.500'> Active </Text>
                                    )}
                            </Heading> */}
              <Button
                colorScheme="blue"
                mx="auto"
                alignItems="center"
                w="75%"
                my={2}
                onClick={() => {
                  setType("PROFILE");
                  onOpen();
                  setSelectedProfile({
                    address: dataUser.address,
                    phone: dataUser.phone,
                  });
                }}
              >
                Ubah Profile
              </Button>
            </Card>
          </Box>
          <Box w="100%" h="550px" p="5px">
            <Card
              w="100%"
              alignItems="center"
              bgColor="transparent"
              boxShadow="transparent"
              h="100%"
            >
              {/* <Heading fontSize='2xl' my={3} textAlign='center'>Self Services</Heading> */}
              <Tabs variant="solid-rounded" colorScheme="blue">
                <TabList display="flex" gap={3}>
                  <Tab>Peminjaman Buku</Tab>
                  <Tab>Pengembalian Buku</Tab>
                  <Tab>Usulan Buku</Tab>
                  <Tab>Denda Buku</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel position="relative" height="450px">
                    <TablePinjaman />
                  </TabPanel>
                  <TabPanel position="relative" height="450px">
                    <TableChekin />
                  </TabPanel>
                  <TabPanel position="relative" height="450px">
                    <TableSuggest />
                  </TabPanel>
                  <TabPanel position="relative" width="1040px" height="450px">
                    <FineUser />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          </Box>
        </HStack>

        <ModalProfile
          isOpen={isOpen}
          onClose={onClose}
          type={type}
          data={selectedProfile}
        />
      </div>
    </>
  );
};

export default dashboardUser;
