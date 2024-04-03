import { Center, Box, Text, VStack, Input, Button, useToast, Divider  } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../services";
import { triggerFinesNotification } from "../features/finesSlices";
import {
    MdOutlineAutorenew,
    MdOutlineAssignmentReturned,
    MdOutlineLibraryAdd,
    MdOutlineInfo,
    MdOutlineWarningAmber
} from 'react-icons/md'

const FineUser = () => {
    const [ListMyFines, setListMyFines] = useState([])
    const [totalFines , setTotalFines] = useState([])
    const states = useSelector(state => state.login)
    const dispatch = useDispatch()
    const toast = useToast({
        position: 'top-right',
        duration: 2000,
        variant: 'left-accent',
    })
    
    const getListMyFines = async() => {
        try {
            const res = await API.listMyFines()
            if(res){
                setListMyFines(res.data)
                console.log("listMyFines", ListMyFines)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const getTotalFines = async() => {
        try {
            const res = await API.totalMyFines()
            if(res){
                setTotalFines(res.data[0])
                console.log("totalFines", totalFines)
            }
            
        } catch (error) {
            console.log("error", error)
        }
    }

    const initSnap = async() => {
        try {
            const snapScript = document.createElement('script')
            snapScript.src = process.env.MIDTRANS_IS_PRODUCTION ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js'
            snapScript.setAttribute('data-client-key', process.env.CLIENT_KEY_SANDBOX)
            document.head.appendChild(snapScript)

            return () => {
                document.head.removeChild(snapScript)
            }

        } catch (error) {
            console.log("error", error)
        }
    }



    const handleFines = async() => {
        try {
            initSnap()
            const res = await API.addpayFines()
            if(res){
                console.log("res", res.data)
                if (res.data.token) {
                    window.snap.pay(res.data.token, {
                        onSuccess: async function(result){
                            console.log("success", result)
                            toast({
                                title: 'Payment Success',
                                status: 'success',
                                isClosable: true,
                            })
                            dispatch(triggerFinesNotification(true))
                        },
                        onPending: async function(result){
                            toast({
                                title: 'Payment Pending',
                                status: 'warning',
                                isClosable: true,
                            })
                            console.log("pending result", result)

                        },
                        onError: async function(result){
                            console.log("error", result)

                        },
                        onClose: function(){
                            console.log('customer closed the popup without finishing the payment');
                            // getListMyFines()
                            // getTotalFines()
                        }
                    })
                }

            }

        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect (() => {
        getListMyFines(),
        getTotalFines()
    },[states.triggerLogin])

    useEffect (() => {
        getListMyFines()
        getTotalFines()
        setTimeout(() => {
            dispatch(triggerFinesNotification(false))
        }, 1000)
    },[states.triggerFinesNotification])


    return ( 
        <div className="bg-white shadow-md rounded w-full h-full p-4">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-3">
                <h2 className="text-xl font-semibold leading-tight">Denda Saya</h2>
                {ListMyFines.length > 0 ?
                    <Box overflowY="auto" overflowX="hidden" height='280px' mt='20px'>
                        {ListMyFines.map((item, index) => {
                            return (
                                <div key={index} className="flex sm:flex-row flex-col justify-content-between py-2">
                                    <Box flexDirection='column' w='85%' h='100%'>
                                        <Text fontSize='lg' fontWeight='bold' color="blue">{item.title}</Text>
                                        <Text fontSize='md' fontWeight='light' color="gray">{item.publishercode}</Text>
                                    </Box>
                                    <Box flexDirection='column' alignItems='center' pt='15px'>
                                        <Text fontSize='lg' fontWeight='semibold' textAlign='center' color='red.300'>
                                            Rp. {item.amountoutstanding}
                                        </Text>
                                    </Box>
                                </div>
                            )
                        })}
                    </Box>
                    :
                    <div className='flex justify-center items-center h-64'>
                        <div className='flex flex-col justify-center items-center'>
                            {/* <img src={Empty} alt='empty' className='w-64 h-64' /> */}
                            <MdOutlineInfo className='w-10 h-10 text-gray-500' />
                            <p className='text-2xl font-bold text-gray-500'>Tidak Ada Denda</p>
                        </div>
                    </div>
                }
                </div>
            </div>
            <Divider height='2px' bg='gray.300' />
            <Box w='100%' h='100px' mt='5px' bg='white' borderRadius='md' boxShadow='xl' px='10px'>
                        <Box  display='flex' justifyContent='space-between' alignItems='center' px='10px'>
                            <Text fontSize='xl' fontWeight='semibold'>Total Denda</Text>
                            <Text fontSize='2xl' fontWeight='semibold' color='red.500'>Rp.{totalFines.Outstanding}</Text>
                        </Box>
                        <Box display='flex' justifyContent='space-between' alignItems='center' px='20px'>
                            {(totalFines.Outstanding > 0) ?
                                <Button onClick={handleFines} colorScheme='blue' w='50%' mx='auto' my='10px'isDisabled={true}>Bayar Denda</Button> 
                                :
                                <Button onClick={handleFines} colorScheme='blue' w='50%' mx='auto' my='10px'>Bayar Denda</Button>
                            }
                        </Box>   
            </Box>

        </div>
     )
}


export default FineUser;