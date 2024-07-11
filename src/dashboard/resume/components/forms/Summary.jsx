import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from '../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { Brain, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { AIchatSession } from '../../../../../service/AIModel'

const prompt='Job Title: {jobTitle} , Depending on the job title give me a list of summaries for 3 experience levels, Mid Level and fresh levels in 5-6 lines in array format, with summary and experience_level field in JSON format'
function Summary({enabledNext}) {

   // enabledNext(true);

    const {resumeInfo, setResumeInfo}=useContext(ResumeInfoContext);
    const [summary, setSummary]=useState();
    const [loading, setLoading]=useState(false);
    const params=useParams();
    const [aiGeneratedSummaryList, setAiGeneratedSummary]=useState();

    useEffect(()=>{
        summary&&setResumeInfo({
            ...resumeInfo,
            summary:summary
        })
    }, [summary])

    const GenerateSummary=async()=>{
        setLoading(true);
        const PROMPT=prompt.replace('{jobTitle}',resumeInfo?.jobTitle)
        const result=await AIchatSession.sendMessage(PROMPT);
        console.log(JSON.parse(result.response.text()));

        setAiGeneratedSummary(JSON.parse(result.response.text()));
        setLoading(false);
    }

    const onSave=(e)=>{
        e.preventDefault();
        setLoading(true);

        const data={
            data:{
                summary:summary
            }
        }

        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
            console.log(resp);
            enabledNext(true);
            setLoading(false);
            toast("Your summary has been updated");
        },(error)=>{
            setLoading(false);
        });
    }

  return (
    <div>
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add a summary for your job title</p>
        
        <form className='mt-7' onSubmit={onSave}>
            <div className='flex justify-between items-end'>
                <label>Add Summary</label>
                <Button variant='outline' onClick={()=>GenerateSummary()} 
                size='sm' type='button' className='border-primary text-primary flex gap-2'>
                <Brain className='h-4 w-4'/>
                    Generate from AI
                </Button>
            </div>

            <Textarea className='mt-5' required
                value={summary}
                defaultValue={summary?summary:resumeInfo?.summary}
                onChange={(e)=>setSummary(e.target.value)}
            />

            <div className='mt-2 flex justify-end'>
                <Button type='submit'
                    disabled={loading}>
                    {loading ? <LoaderCircle className='animate-spin'/> : 'Save'}
                </Button>
            </div>
        </form>
        </div>

        {aiGeneratedSummaryList && <div className='my-5'>
            <h2 className='font-bold text-lg'>Suggestions</h2>
            {aiGeneratedSummaryList?.map((item,index)=>(
                <div key={index} 
                onClick={()=>setSummary(item?.summary)}
                className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
                    <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
                    <p>{item?.summary}</p>
                </div>
            ))}
        </div>}

    </div>
  )
}

export default Summary