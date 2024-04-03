import React, { useState, useRef, useEffect, useMemo } from "react";
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
  FormControl,
  useToast,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
  Box,
  FormLabel,
  Toast,
  Spinner,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";

import { useFormik, ErrorMessage } from "formik";
import { USER_VALIDATION } from "../../validation/validation";
import { useDispatch, useSelector } from "react-redux";
import {
  checkDropboxBuku,
  setDeleteCheckin,
  setTriggerChekin,
  updateCheckDropbox,
} from "../../features/chekinSlices";

const ModalDropbox = (props) => {
  const dispatch = useDispatch();
  const stateDropbox = useSelector((state) => state.chekin);
  const toast = useToast({
    position: "top-right",
    duration: 2000,
    variant: "left-accent",
  });
  const [dataInput, setDataInput] = useState({});

  const handleChangeInput = (e) => {
    setDataInput({ ...dataInput, [e.target.name]: e.target.value });
  };

  const addListDropbox = async (e) => {
    try {
      if (dataInput.barcode === "" || dataInput.barcode === undefined) {
        // return toast({
        //     title: "Barcode tidak boleh kosong",
        //     status: "error",
        //     duration: 2000,
        //     isClosable: true,
        // })
        null;
      } else {
        const filter = stateDropbox.listDropboxBookPending.filter(
          (item) => item.barcode === dataInput.barcode
        );
        if (filter.length > 0) {
          return toast({
            title: "Tidak boleh ada barcode yang sama",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        } else {
          return (
            dispatch(checkDropboxBuku(dataInput.barcode)),
            setTimeout(() => {
              setDataInput("");
            }, 1000)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteListCheckout = (barcode) => {
    const filter = stateDropbox.listDropboxBookPending.filter(
      (item) => item.barcode !== barcode
    );
    dispatch(setDeleteCheckin(filter));
  };

  const submitCheckDropbox = async () => {
    try {
      const value = {
        data: stateDropbox.listDropboxBookPending.map((item) => {
          return {
            barcode: item.barcode,
          };
        }),
      };

      const res = await dispatch(updateCheckDropbox(value));

      if (res.type === "updateCheckDropbox/fulfilled") {
        dispatch(setTriggerChekin(true));

        toast({
          title: "Berhasil melakukan checkin",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        responsiveVoice.speak("Berhasil melakukan checkin", "Indonesian Male", {
          rate: 1,
        });
        props.onClose();
      } else {
        toast({
          title: "Gagal melakukan checkin",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        responsiveVoice.speak("Gagal melakukan checkin", "Indonesian Male", {
          rate: 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    addListDropbox();
    console.log("dropbox bukuuu", stateDropbox.listDropboxBookPending);
  }, [dataInput]);

  return (
    <>
      <Modal
        isCentered
        isOpen={props.isOpen}
        onClose={props.onClose}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cek Pengembalian Buku</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>
                Masukkan kode buku untuk melakukan pengecekan
              </FormLabel>
              <Input
                type="text"
                placeholder="Masukkan kode buku"
                onChange={handleChangeInput}
                name="barcode"
              />
            </FormControl>
            <Box
              my={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {stateDropbox.loading ? (
                <Center>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                  />
                </Center>
              ) : (
                <>
                  {stateDropbox.listDropboxBookPending.length > 0 ? (
                    <>
                      <table className="table table-striped w-full mx-auto text-center my-3">
                        <thead>
                          <tr>
                            <th scope="col">Barcode</th>
                            <th scope="col">Judul Buku</th>
                            <th scope="col">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stateDropbox.listDropboxBookPending.map(
                            (item, index) => {
                              console.log("index", index);
                              return (
                                <tr key={index}>
                                  <td>{item.barcode}</td>
                                  <td>{item.title}</td>
                                  <td>
                                    <Button
                                      colorScheme="red"
                                      onClick={() =>
                                        handleDeleteListCheckout(item.barcode)
                                      }
                                    >
                                      Hapus
                                    </Button>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <Text>Tidak ada data</Text>
                  )}
                </>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={props.onClose}>
              Close
            </Button>
            <Button
              onClick={submitCheckDropbox}
              mr={3}
              colorScheme="blue"
              type="submit"
            >
              Scan Buku
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDropbox;
