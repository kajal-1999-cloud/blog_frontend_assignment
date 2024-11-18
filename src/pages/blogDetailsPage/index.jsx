

import { message } from 'antd';
import Navbar from '../../components/navbar'
import { BlogDetails } from './components/BlogDetails'

export function BlogDetailsPage()  {
    const token = localStorage.getItem("token");

    return(

        <div>
            <Navbar/>
            <BlogDetails/>
        </div>
    )
}