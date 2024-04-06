import { Link } from 'react-router-dom'

function NotFoundUser(){
    return (
        <div className='bg-hero bg-cover bg-center min-h-screen flex justify-center items-center'>
            <div className='bg-[#2d44f5] p-12 rounded-2xl'>
                <div className='flex flex-col gap-2 text-white text-4xl'>
                    <span className='text-center'>User not found</span>
                    <Link to='/ViewSessions'><span className='underline'>Back to view session</span></Link>
                </div>
            </div>
            
        </div>
        
    )

}

export default NotFoundUser