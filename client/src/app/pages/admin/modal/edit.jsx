'use client'
import { fetchCreateFilm, fetchUpdateFilm } from "@/app/api/apiFilm"
import { StateContext } from "@/app/context/stateContext"
import { useFetchDataByKey } from "@/app/hooks/useFetchData"
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalBody, Input, Button, Checkbox, Textarea } from "@nextui-org/react"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
const ModalEditFilm = ({ props }) => {
    const {data:dataEdit,err} = useFetchDataByKey('film','fetchFilmDetail',props.idEdit)
    const { timeFrame } = use(StateContext)
    const [data,setData] = useState(null)
    const [time, setTime] = useState([])
    const { register, handleSubmit, formState: { errors }, } = useForm()
    useEffect(() => {
        dataEdit !== null && setData(dataEdit.data)
        dataEdit !== null && setTime(dataEdit.data.flatMap(d => d.frame))
    },[dataEdit])
    const ColFilm = [
        { wFull: false, type: Input, key: 'id' },
        { wFull: false, type: Input, key: 'title' },
        { wFull: true, type: Input, key: 'director' },
        { wFull: true, type: Textarea, key: 'cast' },
        { wFull: true, type: Textarea, key: 'des' },
        { wFull: false, type: Input, key: 'release' },
        { wFull: false, type: Input, key: 'time' },
        { wFull: false, type: Input, key: 'background' },
        { wFull: false, type: Input, key: 'thumbnails' },
        { wFull: true, type: Input, key: 'trailer' }
    ]
    const onSubmit = dataSubmit => {
        const key = Object.keys(dataSubmit)
        const dataFrame = data?.flatMap(d => d.frame)
        const resultData = data?.map(d => {
            let obj = {...d}
            delete obj.frame
            return obj
        })
        if (time.length === 0) {
            alert('Please select time frame')
            return
        }
        const isChangeFrame = dataFrame.length === time.length ? dataFrame.every((f,i) => f === time[i]) : false
        const isConstant = resultData.every(d => key.every(k => d[k] === dataSubmit[k]))
        if(!isChangeFrame || !isConstant){
            const dataFetch = {...dataSubmit,frame:time}
            fetchUpdateFilm(dataFetch)
            .then(res=> {
                if(res.status === 200){
                    props.onOpenChange,props.setNameModal("")
                }
                alert(res.message)
            })
        }
    }
    const handleCheckbox = (t) => {
        time.includes(t) ? setTime(time.filter(e => e !== t)) : setTime([...time, t])
    }
    return <Modal
        isOpen={props.isOpen}
        onOpenChange={()=>{props.onOpenChange,props.setNameModal("")}}
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
                    {data !== null && data.map(d => <ModalBody className=" flex flex-wrap !flex-row justify-around">
                        {ColFilm.map(e => <e.type
                            className={`${!e.wFull ? 'w-[48%]' : 'w-full'}`}
                            type={e.key === 'release'? 'date':'text'} 
                            variant="bordered"
                            defaultValue={d[e.key === "description" ? "des":e.key]}
                            label={e.key.toUpperCase()} isInvalid={errors[e.key] ? true : false}
                            {...register(`${e.key}`, { required: true })} />)}
                        <span className="w-full">Time frame</span>
                        {timeFrame.map(t => (
                            <Checkbox onClick={() => { handleCheckbox(t)}} isSelected={time.includes(t) ? true :false} className="w-[30%]" color="primary">
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