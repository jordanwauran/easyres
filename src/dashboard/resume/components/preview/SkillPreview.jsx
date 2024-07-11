import React from 'react'

function SkillPreview({resumeInfo}) {
  return (
    <div className='my-1'>
        <h2 className='text-center font-bold text-sm mb-2' 
        style={{
            color:resumeInfo?.themeColor
        }}>
           Skills
        </h2>
        <hr style={{
            color:resumeInfo?.themeColor
        }}/>

        <div className='grid my-2'>
            {resumeInfo?.skills.map((skill,index) => (
                <div key={index} className='flex '>
                    <h2 className='text-xs'>{skill.name}:</h2>
                    <div className='text-xs'>
                        &nbsp;{skill.description}
                    </div>
                </div>
            ))}
        </div>

    </div>
  )
}

export default SkillPreview