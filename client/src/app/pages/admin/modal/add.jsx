'use client'
import { fetchCreateFilm } from "@/app/api/apiFilm"
import { StateContext } from "@/app/context/stateContext"
import { getToken } from "@/app/utils"
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalBody, Input, Button, Checkbox,Textarea} from "@nextui-org/react"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
const ModalAddNew = ({ props }) => {
  const { timeFrame,setFilm,film } = use(StateContext)
  const [time,setTime] = useState([])
  const { register, handleSubmit, formState: { errors }, } = useForm()
  const GetToken = getToken()
  const ColFilm = [
    {wFull:false,type:Input,key:'id'},
    {wFull:false,type:Input,key:'title'},
    {wFull:true,type:Input,key:'director'},
    {wFull:true,type:Textarea,key:'cast'},
    {wFull:true,type:Textarea,key:'description'},
    {wFull:false,type:Input,key:'release'},
    {wFull:false,type:Input,key:'time'},
    {wFull:false,type:Input,key:'background'},
    {wFull:false,type:Input,key:'thumbnails'},
    {wFull:true,type:Input,key:'trailer'}
]
  const onSubmit = async data => {
    if(time.length === 0){
      alert('Please select time frame')
      return
    }
    const token = await GetToken()
    fetchCreateFilm(token,{...data,title:data.title.toUpperCase(),frame:time}).then(res => 
      {
        if(res.status === 201){
          setFilm([{thumbnails:data.thumbnails,title:data.title,id:data.id},...film])
        }
        alert(res.message)
      }
    )
  }
  const handleCheckbox = (t) => {
    time.includes(t) ? setTime(time.filter(e => e !== t)) : setTime([...time,t])
  }
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
          <ModalHeader className="flex flex-col gap-1">Create film ticket</ModalHeader>
          <ModalBody className="flex flex-wrap !flex-row justify-around">
            {ColFilm.map(e => <e.type 
              className={`${!e.wFull ? 'w-[48%]' : 'w-full'}`}
              type={e.key === 'release'? 'date':'text'} 
              variant="bordered" 
              label={e.key.toUpperCase()} isInvalid={errors[e.key] ? true : false} 
              {...register(`${e.key}`, { required: true })} />)}
            <span className="w-full">Time frame</span>
            {timeFrame.map(t => (
              <Checkbox onClick={() => {handleCheckbox(t)}} className="w-[30%]" color="primary">
                {t}:00
              </Checkbox>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => { handleSubmit(onSubmit)() }}>Add film</Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
}
export default ModalAddNew