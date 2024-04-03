import { useEffect, useState } from "react";
import {
  Center,
  Box,
  Text,
  VStack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/loginSlices";
import { useNavigate } from "react-router-dom";
import API from "../services";
import { setTriggerIssue } from "../features/issueSlices";

const ScanUserLogin = () => {
  const [idcard, setIdcard] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 2000,
    variant: "left-accent",
  });

  const handleInput = (e) => {
    e.preventDefault();
    setIdcard({ ...idcard, [e.target.name]: e.target.value });
    console.log("setIdCard", idcard);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await dispatch(loginUser({ type: "LOGIN", payload: idcard }));

      if (res.type === "loginUser/fulfilled") {
        // dispatch(setTriggerIssue(true))
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard/user");
        }, 1000);
        responsiveVoice.speak("Berhasil Login", "Indonesian Male", {
          rate: 1,
        });
        toast({
          title: "Login Success",
          status: "success",
          isClosable: true,
        });
      } else {
        setLoading(false);
        responsiveVoice.speak("ID Card TIdak Ditemukan", "Indonesia Male", {
          rate: 1,
        });
        toast({
          title: "Login Failed",
          description: "ID Card TIdak Ditemukan",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        status: "error",
        isClosable: true,
      });
      console.log("error", error);
    }
  };

  useEffect(() => {
    console.log("idcard", idcard);
  }, [idcard]);

  return (
    <>
      <VStack spacing={6} align="center" my="20">
        <h1 className="text-4xl font-bold">Welcome to</h1>
        <h1 className="text-4xl font-bold text-blue-500">
          UMS Digital Library Self Service Center
        </h1>
        <Text fontSize="md" text="center">
          Scan or Input Your ID Card To Login
        </Text>

        <Input
          autoFocus
          placeholder="ID Card Number"
          name="cardnumber"
          w="2xl"
          h="50px"
          bgColor="white"
          onChange={handleInput}
          onKeyUp={(e) => (e.key === "Enter" ? handleSubmit(e) : null)}
        />

        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          w="sm"
          isLoading={loading}
          loadingText="Loading"
        >
          Login
        </Button>
      </VStack>
    </>
  );
};

export default ScanUserLogin;
