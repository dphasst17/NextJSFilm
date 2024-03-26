'use client'
import { confirmTicket } from "@/app/api/apiFilm";
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalBody,Button} from "@nextui-org/react"
import { useEffect, useState } from "react";
import { QrReader } from 'react-qr-reader';
const ModalScan = ({props}) => {
    const [data, setData] = useState('');
    useEffect(() => {
      if(data !== ''){
        
        confirmTicket(data)
        .then(res => {
          alert(res.message)
          setData('')
        })
      }
    },[data])
    return <Modal
    isOpen={props.isOpen}
    onOpenChange={props.onOpenChange}
    backdrop="opaque"
    size="2xl"
    classNames={{
      backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
    }}
    placement="top-center"
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">SCAN QR CODE</ModalHeader>
          <ModalBody className="flex flex-wrap !flex-row justify-around">
            <QrReader
                onResult={(result, error) => {
                if (!!result) {
                    setData(result?.text);
                }

                if (!!error) {
                    console.info(error);
                }
                }}
                style={{height:'200px' }}
                className="w-full"
            />
          </ModalBody>
          <ModalFooter>
            <Button >SCAN</Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
}
export default ModalScan