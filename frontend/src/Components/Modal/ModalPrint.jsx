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
    Textarea,
    FormErrorMessage
} from '@chakra-ui/react'

import { useDispatch, useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import { TemplateReceipt } from '../Print/TemplateReceipt'

const ModalPrint = (props) => {
    
        const dispatch = useDispatch()
        const toast = useToast ({
            position: 'top-right',
            duration: 2000,
            variant: 'left-accent',
        })

        const componentRef = useRef();
        const stateIssue = useSelector(state => state.issue)


        return (
            <>
                <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl" >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Cetak Bukti Peminjaman</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <iframe style={{width: '100%', height: '300px'}} src={`https://embed.lottiefiles.com/animation/91636`} frameborder="0"></iframe>
                        </ModalBody>
                        <ModalFooter>
                                <ReactToPrint
                                    trigger={() => <Button colorScheme="blue" mr={3} w="100%" onClick={props.onClose}>Cetak Bukti Peminjaman</Button>}
                                    content={() => componentRef.current}
                                    pageStyle={ "@page { size: 80mm 80mm; margin: 0mm auto ; } @media print { body { -webkit-print-color-adjust: exact; } }" }
                                />
                                <div style={{ display: 'none' }}>
                                    <TemplateReceipt ref={componentRef} data={stateIssue.listBarcodeIssue} />
                                </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
}

export default ModalPrint;
