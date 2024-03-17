'use client'
import { fetchCreateFilm } from "@/app/api/apiFilm"
import { StateContext } from "@/app/context/stateContext"
import { useFetchDataByKey } from "@/app/hooks/useFetchData"
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalBody, Input, Button, Checkbox, Textarea } from "@nextui-org/react"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
const ModalEditFilm = ({ props }) => {
    const { timeFrame } = use(StateContext)
    const {data,err} = useFetchDataByKey('film','fetchFilmDetail',`${props.idEdit}`)
    const [time, setTime] = useState([])
    const { register, handleSubmit, formState: { errors }, } = useForm()
    const ColFilm = [
        { wFull: false, type: Input, key: 'id' },
        { wFull: false, type: Input, key: 'title' },
        { wFull: true, type: Input, key: 'director' },
        { wFull: true, type: Textarea, key: 'cast' },
        { wFull: true, type: Textarea, key: 'description' },
        { wFull: false, type: Input, key: 'release' },
        { wFull: false, type: Input, key: 'time' },
        { wFull: false, type: Input, key: 'background' },
        { wFull: false, type: Input, key: 'thumbnails' },
        { wFull: true, type: Input, key: 'trailer' }
    ]
    const onSubmit = data => {
        if (time.length === 0) {
            alert('Please select time frame')
            return
        }
        console.log({ ...data, frame: time })
        fetchCreateFilm({ ...data, title: data.title.toUpperCase(), frame: time }).then(res => { alert(res.message) })
    }
    const handleCheckbox = (t) => {
        time.includes(t) ? setTime(time.filter(e => e !== t)) : setTime([...time, t])
    }
    useEffect(() => {data !== null && console.log(data)},[data])
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
                    <ModalHeader className="flex flex-col gap-1">Edit film ticket</ModalHeader>
                    {data !== null && data.data?.map(d => <ModalBody className="flex flex-wrap !flex-row justify-around">
                        {ColFilm.map(e => <e.type
                            className={`${!e.wFull ? 'w-[48%]' : 'w-full'}`}
                            type={e.key === 'release'? 'date':'text'} 
                            variant="bordered"
                            defaultValue={d[e.key === "description" ? "des":e.key]}
                            label={e.key.toUpperCase()} isInvalid={errors[e.key] ? true : false}
                            {...register(`${e.key}`, { required: true })} />)}
                        <span className="w-full">Time frame</span>
                        {timeFrame.map(t => (
                            <Checkbox onClick={() => { handleCheckbox(t)}} isSelected={d.frame.includes(t) ? true :false} className="w-[30%]" color="primary">
                                {t}:00
                            </Checkbox>
                        ))}
                    </ModalBody>)}
                    
                    <ModalFooter>
                        <Button onClick={() => { handleSubmit(onSubmit)() }}>Edit</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}
export default ModalEditFilm