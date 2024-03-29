'use client'
import { StateContext } from "@/app/context/stateContext"
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Code} from "@nextui-org/react"
import { use, useEffect } from "react"
const ModalViewUser = ({props}) => {
    const {manager} = use(StateContext)
    useEffect(() => {manager !== null && console.log(manager)},[manager])
    return <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        size="2xl"
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">VIEW USER & STAFF</ModalHeader>
                    <ModalBody className="flex flex-wrap !flex-row justify-between">
                        {manager?.user?.dataUser.map(u => <Code className={`w-[48%] flex justify-between items-center ${u.action === "active" ? "bg-green-500" : 'bg-zinc-800'} bg-opacity-80 text-white text-[10px]`}>#{u.idUser} - {u.role === 1 ? 'Staff' : 'User'} - {u.dateCreated.split("-").reverse().join("/")}</Code>)}
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