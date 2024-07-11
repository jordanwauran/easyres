import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIchatSession } from '../../../../service/AIModel';
import { toast } from 'sonner';
const PROMPT='My position title is: {positionTitle}, Based on that information give me 5-7 bullet points for my experience section in my resume and give me the result in HTML formal'

function RichTextEditor({onRichTextEditorChange, index, defaultValue}) {
    const [value,setValue]=useState(defaultValue);
    const {resumeInfo, setResumeInfo}=useContext(ResumeInfoContext);
    const [loading, setLoading]=useState(false);

    const GenerateSummaryFromAI=async()=> {
        
        if(!resumeInfo.Experience[index]?.title) {
            toast('Please Add Job Title');
            return ;
        }
        setLoading(true)
        const prompt=PROMPT.replace('{positionTitle}',resumeInfo.Experience[index].title);

        const result=await AIchatSession.sendMessage(prompt);
        console.log(result.response.text());
        const resp=result.response.text();
        setValue(resp.replace('[','').replace(']','').replace(/"/g,'').replace(/(\.),/g, "$1"));
        setLoading(false);
    }
  return (
    <div>
        <div className='flex my-2 justify-between'>
            <label className='text-xs'>Summary</label>
            <Button variant='outline' size='sm' 
            onClick={GenerateSummaryFromAI}
            disabled={loading}
            className='flex gap-2 border-primary text-primary'>
                {loading?
                    <LoaderCircle className='animate-spin'/>:
                    <>
                      <Brain className='h-4 w-4'/>Generate from AI
                    </>
                }
            </Button>
        </div>
    <EditorProvider>
      <Editor value={value} onChange={(e)=>{
        setValue(e.target.value);
        onRichTextEditorChange(e);
      }}>
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnUnderline/>
          <BtnStrikeThrough/>
          <Separator/>
          <BtnNumberedList/>
          <BtnBulletList/>
          <Separator/>
          <BtnLink/>
          <BtnClearFormatting/>
          <HtmlButton/>
          <Separator/>
          <BtnStyles/>
        </Toolbar>
      </Editor>
    </EditorProvider>
    </div>
  )
}

export default RichTextEditor