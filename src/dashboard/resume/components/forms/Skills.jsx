import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from '../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

function Skills() {

    const [skillsList,setSkillsList]=useState([{
        name:'',
        description:''
    }])

    const {resumeId}=useParams();
    const [loading,setLoading]=useState(false);
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
    
    useEffect(()=>{
        resumeInfo&&setSkillsList(resumeInfo?.skills)
    },[])

    const handleChange=(index,name,value)=>{
        const newEntries=skillsList.slice();
        newEntries[index][name]=value;
        setSkillsList(newEntries);
    }

    const AddNewSkills=()=>{
        setSkillsList([...skillsList,{
            name:'',
            description:''
        }])
    }

    const RemoveSkills=()=>{
        setSkillsList(skillsList=>skillsList.slice(0,-1))
    }


    const onSave=()=>{
        setLoading(true);
        const data={
            data:{
                skills:skillsList.map(({id,...rest}) => rest)
            }
        }

        GlobalApi.UpdateResumeDetail(resumeId,data)
        .then(resp=>{
            console.log(resp);
            setLoading(false);
            toast('Your details have been successfully updated.')
        },(error)=>{
            setLoading(false);
            toast('Server error. Please try again.')
        })
    }

    useEffect(()=>{
        setResumeInfo({
            ...resumeInfo,
            skills:skillsList
        })
    },[skillsList])


  return (

        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Skills</h2>
        <p>Add your top professional skills</p>

        <div >
            {skillsList.map((item,index)=>(
                <div key={index}>
                    <div>
                        <label className='text-xs'>Name</label>
                        <Input 
                        defaultValue={item.name}
                        onChange={(e)=>handleChange(index,'name',e.target.value)} />
                    </div>
                    <div>
                        <label className='text-xs'>Description</label>
                        <Input 
                        defaultValue={item.description}
                        onChange={(e)=>handleChange(index,'description',e.target.value)} />
                    </div>
                </div>
            ))}
        </div>

        <div className='flex justify-between my-2.5'>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={AddNewSkills}
                  className='text-primary'
                >
                  + Add More Skills
                </Button>
                <Button
                  variant='outline'
                  onClick={RemoveSkills}
                  className='text-primary'
                >
                  - Remove Skills
                </Button>
              </div>
              <Button disabled={loading} onClick={onSave}>
                {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
              </Button>
            </div> 
        </div>
  )
}

export default Skills