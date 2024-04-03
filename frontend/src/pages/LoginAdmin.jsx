import React, {useEffect, useState} from "react";
import { 
    Box, 
    Card, 
    Container, 
    Heading,
    FormControl,
    FormErrorMessage,
    Text,
    FormHelperText,
    FormLabel,
    Input,
    Button,
    useToast  
} from '@chakra-ui/react'

import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../features/loginSlices";
import { useNavigate } from "react-router-dom";
import API from "../services/index"


const loginAdmin = () => {
    
    const [inputAdmin, setInputAdmin] = useState({})
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast({
        position: 'top-right',
        duration: 2000,
        variant: 'left-accent',
    })

    const handleInput = (e) => {
        setInputAdmin({...inputAdmin, [e.target.name]: e.target.value})
        console.log("setinputAdmin", inputAdmin)
    }

    const handleSubmitLogin = async() => {
        // console.log(inputAdmin)
        try {
            setLoading(true)
            const res = await dispatch(adminLogin(inputAdmin))

            if(res.type === 'adminLogin/fulfilled') {  
                setLoading(false)     
                navigate('/dashboard/admin')
                toast({
                    title: 'Login Success',
                    status: 'success',
                    isClosable: true,
                })
            }else {
                setLoading(false)   
                toast({
                    title: 'Login Failed',
                    description: 'Username atau Password Salah',
                    status: 'error',
                    isClosable: true,
                })
            }
        } catch (error) {
            setLoading(false)   
            toast({
                title: 'Login Failed',
                status: 'error',
                isClosable: true,
            })
            console.log("error", error)
        }
    }

    useEffect(() => {
        console.log("inputAdmin", inputAdmin)
    }, [inputAdmin])

    return (
        <div className="h-screen">
            <Container maxW='container.xl' >
                <Navbar />
                <Box w='100%' h='80vh' p='50px' >
                    <Card alignItems='center' w='50%' h='100%' margin='0 auto'>
                        <Heading as='h3' size='lg' textAlign='center' pt='20px' mb={1} >
                            Welcome Back, Admin
                        </Heading>
                        <Heading as='h6' size='md' textAlign='center' p='5px'mb={5} color="blue.500" >
                            UMS Digital Library
                        </Heading>
                        <Box p={2} display='grid' w='90%' gap={5}>
                            <FormControl>
                                <FormLabel>Username</FormLabel>
                                <Input type="text" name="userid" onChange={handleInput} bgColor='white' />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input  type="password" name="password" onChange={handleInput} bgColor='white'/>
                            </FormControl>
                            <Button colorScheme='blue' isLoading ={loading} loadingText="Loading" type="submit" mt={2} onClick={handleSubmitLogin}> Login </Button>
                        </Box>
                    </Card>
                </Box>
            </Container>
            <Box w='100%' bg='white' p='5px' mt="30px" >
                <Text fontSize='sm' textAlign='center'>© All rights reserved by UMS Library - 2022™</Text>
            </Box>
        </div>
    )
}

export default loginAdmin
