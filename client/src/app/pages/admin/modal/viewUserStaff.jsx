'use client'
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Button} from "@nextui-org/react"
const ModalViewUser = ({props}) => {
    return <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        size="2xl"
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">VIEW USER & STAFF</ModalHeader>
                    <ModalBody className="flex flex-wrap !flex-row justify-around">
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button>Add</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}
export default ModalViewUser