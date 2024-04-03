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
  FormLabel,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
// import { checkMyIssues, setDeleteCheckIssue, setDeleteIssue } from "../features/issueSlices";
import {
  addChekin,
  deleteChekin,
  updateChekin,
  checkMyIssues,
  setDeleteCheckIssue,
} from "../features/chekinSlices";

const dropBoxBuku = () => {
  const [InputBarcodeCheckin, setInputBarcodeCheckin] = useState({});
  const [loading, setLoading] = useState(false);
  const [disabledCheckinButton, setDisabledCheckinButton] = useState(true);
  const stateChekin = useSelector((state) => state.chekin);
  const dispatch = useDispatch();
  const toast = useToast({
    position: "top-right",
    duration: 2000,
    variant: "left-accent",
  });

  const handleInputCheckin = (e) => {
    setInputBarcodeCheckin({
      ...InputBarcodeCheckin,
      [e.target.name]: e.target.value,
    });
    console.log("InputBarcode", InputBarcodeCheckin);
  };

  useEffect(() => {
    if (
      InputBarcodeCheckin.barcode !== "" &&
      InputBarcodeCheckin.barcode !== undefined
    ) {
      setDisabledCheckinButton(false);
    } else {
      setDisabledCheckinButton(true);
    }
  }, [InputBarcodeCheckin]);

  const handleAddListCheckin = async () => {
    try {
      if (
        InputBarcodeCheckin.barcode === "" ||
        InputBarcodeCheckin.barcode === undefined
      ) {
        // return toast({
        //     title: "Masukkan Barcode",
        //     status: "warning",
        //     duration: 2000,
        //     isClosable: true,
        // })
        null;
      } else {
        const filter = stateChekin.listBookCheckIn.filter(
          (item) => item.barcode === InputBarcodeCheckin.barcode
        );
        if (filter.length > 0) {
          return toast({
            title: "Tidak boleh ada barcode yang sama",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          responseVoice.speak(
            "Tidak boleh ada barcode yang sama",
            "Indonesia Male",
            {
              rate: 1,
            }
          );
        } else {
          try {
            const res = await dispatch(
              checkMyIssues(InputBarcodeCheckin.barcode)
            );
            console.log("res", res);
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteListCheckin = (barcode) => {
    const filter = stateChekin.listBookCheckIn.filter(
      (item) => item.barcode !== barcode
    );
    return dispatch(setDeleteCheckIssue(filter));
  };

  const handleSubmitChekin = async () => {
    try {
      setLoading(true);
      const value = {
        data: stateChekin.listBookCheckIn.map((item) => {
          return {
            barcode: item.barcode,
          };
        }),
      };

      console.log("value", value);
      const res = await dispatch(addChekin(value));
      const resUpdate = await dispatch(updateChekin(value));
      const resDelete = await dispatch(deleteChekin(value));

      if (
        res.type === "addChekin/fulfilled" &&
        resUpdate.type === "updateChekin/fulfilled" &&
        resDelete.type === "deleteChekin/fulfilled"
      ) {
        responsiveVoice.speak("Pengembalian Buku Berhasil", "Indonesian Male", {
          rate: 1,
          onend: () => {
            toast({
              title: "Pengembalian Buku Berhasil",
              status: "success",
              isClosable: true,
            });
            setInputBarcodeCheckin({});
            setLoading(false);
          },
        });
      } else {
        responsiveVoice.speak("Pengembalian Buku Gagal", "Indonesian Male", {
          rate: 1,
          onend: () => {
            toast({
              title: "Pengembalian Buku Gagal",
              status: "error",
              isClosable: true,
            });
            setLoading(false);
            stateChekin.listBookCheckIn([]);
          },
        });
        setLoading(false);
        stateChekin.listBookCheckIn([]);
      }
    } catch (error) {
      responsiveVoice.speak("Pengembalian Buku Gagal", "Indonesian Male", {
        rate: 1,
        onend: () => {
          toast({
            title: "Pengembalian Buku Gagal",
            status: "error",
            isClosable: true,
          });
          setLoading(false);
        },
      });
    }
  };

  useEffect(() => {
    handleAddListCheckin();
  }, [InputBarcodeCheckin]);

  return (
    <>
      <div className="container mx-auto h-screen">
        <Navbar />
        <div className="flex flex-col justify-center items-center mt-4">
          <h1 className="text-2xl font-bold">Pengembalian Buku</h1>
          <h1 className="text-2xl font-bold text-blue-500">
            UMS Digital Library Self Service Center
          </h1>
        </div>
        <HStack spacing={4} justify="center" mt="10" w="100%">
          <Box w="50%" h="sm" rounded="md" p="4">
            <FormLabel>Masukkan Barcode Buku</FormLabel>
            <Input
              name="barcode"
              placeholder="Masukkan Barcode"
              bgColor="white"
              onChange={handleInputCheckin}
              mb={4}
            />
            <Center>
              {stateChekin.loading ? (
                <Center>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                  />
                </Center>
              ) : stateChekin.listBookCheckIn.length > 0 ? (
                <>
                  <table className="table table-striped w-full mx-auto text-center my-5">
                    <thead>
                      <tr>
                        <th scope="col">Barcode</th>
                        <th scope="col">Judul Buku</th>
                        <th scope="col">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {stateChekin.listBookCheckIn.map((item, index) => {
                        console.log("index", index);
                        return (
                          <tr key={index}>
                            <td>{item.barcode}</td>
                            <td>{item.title}</td>
                            <td>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  handleDeleteListCheckin(item.barcode)
                                }
                              >
                                Hapus
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <Center>
                  <Text mt="4" fontSize="md" fontWeight="bold">
                    Tidak ada buku yang diinputkan
                  </Text>
                </Center>
              )}
            </Center>
            <Center>
              <Button
                isDisabled={disabledCheckinButton}
                colorScheme="blue"
                mt="4"
                w="sm"
                onClick={handleSubmitChekin}
                isLoading={loading}
              >
                Kembalikan
              </Button>
            </Center>
          </Box>
          <Box
            w="50%"
            h="md"
            boxShadow="2xl"
            rounded="md"
            p="4"
            bgColor={"white"}
          >
            {stateChekin.checkIssue.length > 0 ? (
              <>
                <Center>
                  <Text mt="4" fontSize="2xl" fontWeight="bold">
                    Informasi Buku
                  </Text>
                </Center>
                <label
                  className="block text-gray-700 text-sm font-bold mt-4"
                  htmlFor="username"
                >
                  Judul Buku
                </label>
                <Text fontSize="md" fontWeight="bold">
                  {stateChekin.checkIssue[0]?.title}
                </Text>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                  htmlFor="username"
                >
                  Pengarang
                </label>
                <Text fontSize="md" fontWeight="bold">
                  {stateChekin.checkIssue[0]?.author}
                </Text>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                  htmlFor="username"
                >
                  Penerbit
                </label>
                <Text fontSize="md" fontWeight="bold">
                  {stateChekin.checkIssue[0]?.publishercode}
                </Text>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                  htmlFor="username"
                >
                  Tanggal Peminjaman
                </label>
                <Text fontSize="md" fontWeight="bold">
                  {new Date(
                    stateChekin.checkIssue[0]?.issuedate
                  ).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                {/* <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="username">
                                    Tanggal Deadline Pengembalian
                                </label>
                                <Text fontSize="md" fontWeight="bold">{stateIssue.checkIssue[0]?.date_due}</Text>
                                <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="username">
                                    Tanggal Perpanjangan Pengembalian
                                </label>
                                <Text fontSize="md" fontWeight="bold">{stateIssue.checkIssue[0]?.lastreneweddate}</Text> */}
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                  htmlFor="username"
                >
                  Denda Buku
                </label>
                <Text fontSize="xl" fontWeight="bold" color="red">
                  {stateChekin.checkIssue[0]?.amountoutstanding}
                </Text>
              </>
            ) : (
              <>
                <Center>
                  <Text mt="4" fontSize="2xl" fontWeight="bold">
                    Informasi Buku
                  </Text>
                </Center>
                <Center>
                  <Text mt="4" fontSize="md" fontWeight="bold">
                    Tidak ada buku yang diinputkan
                  </Text>
                </Center>
              </>
            )}
          </Box>
        </HStack>
      </div>
    </>
  );
};

export default dropBoxBuku;
