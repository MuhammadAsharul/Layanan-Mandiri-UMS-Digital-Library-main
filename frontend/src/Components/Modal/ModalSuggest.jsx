import React, {useState, useRef, useEffect, useMemo} from "react";
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
    ModalCloseButton ,
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
    Textarea
} from '@chakra-ui/react'

import { useDispatch, useSelector } from "react-redux";
import { addSuggest, updateSuggest, setTriggerSuggest, setTriggerDetailSuggest } from "../../features/suggestSlices";
import { MdOutlineWarningAmber } from 'react-icons/md';
import { useFormik } from "formik";
import { SUGGEST_VALIDATION } from "../../validation/validation";

const ModalSuggest = (props) => {

    const dispatch = useDispatch()
    const stateSuggest = useSelector(state => state.suggest)
    const toast = useToast({
        position: 'top-right',
        variant: 'left-accent',
        isClosable: true,
        duration: 2000
    })


    // Untuk Tambah Ulasan
    const formikInput = useFormik({
        initialValues: {
            title: '',
            author: '',
            publishercode: '',
            note: ''
        },

        onSubmit: async (values, {resetForm}) => {
            try {
                const res = await dispatch(addSuggest(values))
                if(res.type == "addSuggest/fulfilled"){

                    dispatch(setTriggerSuggest(true))
                    toast({
                        title: 'Suggest a Book',
                        description: 'Tambah Ulasan Berhasil',
                        status: 'success'
                    })
                    resetForm({values: ''})
                    props.onClose()

                } 
            } catch (error) {
                toast({
                    title: 'Suggest a Book',
                    description: 'Tambah Ulasan Gagal',
                    status: 'error'
                })
            }
        },

        validationSchema: SUGGEST_VALIDATION,
        validateOnChange: true
    })
    

    const formik = useFormik({
        initialValues: {
            suggestionid: stateSuggest.suggest.suggestionid,
            title: stateSuggest.suggest.title,
            author: stateSuggest.suggest.author,
            publishercode: stateSuggest.suggest.publishercode,
            note: stateSuggest.suggest.note
        },

        enableReinitialize: true, // To set value from props into initialValues

        onSubmit: (values) => {
            try {
                dispatch(updateSuggest(values))
                dispatch(setTriggerSuggest(true))
                console.log("values edit suggest", values)
                toast({
                    title: 'Edit Suggest a Book',
                    description: 'Edit Usulan Berhasil',
                    status: 'success'
                })
                values = {}
                props.onClose()
            } catch (error) {
                toast({
                    title: 'Edit Suggest a Book',
                    description: 'Edit Usulan Gagal',
                    status: 'error'
                })
            }
        }
    })
    
    useEffect (() => {
        setTimeout(() => {
            setTriggerDetailSuggest(false)
        }, 1000)
    }, [stateSuggest.triggerDetailSuggest])

    // const handleCloseModalSuggest = () => {
    //     try {
    //         dispatch(setRefreshSuggest())
    //         props.onClose()
    //     } catch (error) {
    //         console.log("error", error)
    //     }
    // }




    // useEffect(() => {
    //     console.log("DataInputSuggest", DataInputSuggest)
    // }, [DataInputSuggest])

    // useEffect(() => {
    //     setDataInputSuggest({
    //         ...DataInputSuggest,
    //         suggestionid: props.data
    //     })
    // }, [props.data])

    return (
        <>
            {props.type === 'SUGGEST' ? (
                <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>'
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Usulan Buku</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={formikInput.handleSubmit}>
                            <ModalBody>
                                <FormControl id="title" mt={4}>
                                    <FormLabel>Title</FormLabel>
                                    {formikInput.errors.title && formikInput.touched.title && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            <AlertDescription>{formikInput.errors.title}</AlertDescription>
                                        </Alert>
                                    )}
                                    <Input type="text" name="title" onChange={formikInput.handleChange} />
                                </FormControl>
                                <FormControl id="author" mt={4}>
                                    <FormLabel>Author</FormLabel>
                                    {formikInput.errors.author && formikInput.touched.author && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            <AlertDescription>{formikInput.errors.author}</AlertDescription>
                                        </Alert>
                                    )}
                                    <Input type="text" name="author" onChange={formikInput.handleChange} />
                                </FormControl>
                                <FormControl id="publishercode" mt={4}>
                                    <FormLabel>Publisher</FormLabel>
                                    {formikInput.errors.publishercode && formikInput.touched.publishercode && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            <AlertDescription>{formikInput.errors.publishercode}</AlertDescription>
                                        </Alert>
                                    )}
                                    <Input type="text" name="publishercode" onChange={formikInput.handleChange} />
                                </FormControl>
                                <FormControl id="note" mt={4}>
                                    <FormLabel>Description</FormLabel>
                                    {formikInput.errors.note && formikInput.touched.note && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            <AlertDescription>{formikInput.errors.note}</AlertDescription>
                                        </Alert>
                                    )}
                                    <Textarea type="text" name="note" onChange={formikInput.handleChange} />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="red" mr={3} onClick={props.onClose}>
                                    Close
                                </Button>
                                <Button 
                                    colorScheme="blue"
                                    // onClick={() => {
                                    //     handleSubmitSuggest(DataInputSuggest)
                                    // }}
                                    type="submit"
                                    isLoading={formikInput.isSubmitting}
                                >
                                    Tambah Usulan
                                </Button>
                            </ModalFooter>
                        </form>
                        </ModalContent>
                        </Modal>
            ) : 
            props.type === 'EDIT_SUGGEST' && (
                <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Usulan Buku</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={formik.handleSubmit}>
                            <ModalBody>
                                {/* { stateSuggest.loading ? (
                                    <Center>
                                        <Spinner 
                                            thickness="4px"
                                            speed="0.65s"
                                            emptyColor="gray.200"
                                            color="blue.500"
                                            size="xl"
                                        />
                                    </Center>
                                ) : (
                                    <> */}
                                        <FormControl id="title" mt={4} isRequired>
                                            <FormLabel>Title</FormLabel>
                                            <Input type="text" onChange={formik.handleChange} defaultValue={formik.values.title} />
                                        </FormControl>
                                        <FormControl id="author" mt={4}>
                                            <Input type="text" onChange={formik.handleChange} defaultValue={formik.values.author} />
                                        </FormControl>
                                        <FormControl id="publishercode" mt={4}>
                                            <Input type="text" onChange={formik.handleChange} defaultValue={formik.values.publishercode} />
                                        </FormControl>
                                        <FormControl id="note" mt={4}>
                                            <Textarea type="text" onChange={formik.handleChange} defaultValue={formik.values.note} />
                                        </FormControl>
                                    {/* </>
                                )} */}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="red" mr={3} onClick = {props.onClose}>
                                    Close
                                </Button>
                                <Button colorScheme="blue"
                                    // onClick={() => {
                                    //     handleEditSuggest(DataInputSuggest)

                                    //     console.log("DataInput ke Edit Suggest", DataInputSuggest)
                                    // }}
                                    type="submit"
                                    isLoading={formik.isSubmitting}
                                >
                                    Edit Usulan Buku
                                </Button>
                            </ModalFooter>
                        </form>
                        </ModalContent>
                        </Modal>
            )}
        </>

    )
}

export default ModalSuggest;