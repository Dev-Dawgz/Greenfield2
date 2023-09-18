import React, { useState, useEffect} from 'react';
import UpVote from './UpVote.jsx';
//import axios from 'axios';

const Post = ({text}) => {
  //console.log(username)

  //const [username, setUsername] = useState('');
  const [newTimeStamp, setNewTimeStamp] = useState('')
  useEffect(() => {
    // axios.get(`/text/user/${user.id}/${user.username}`)
    // .then((res) => {
    //   setUsername(res.data.user.username)
    // })
    // .catch((err) => {
    //   console.error("err", err);

    // })


    const timeStamp = new Date();
    const formattedDate = timeStamp.toLocaleString('en-US', {
      year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
  
    const formattedTime = timeStamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  
    setNewTimeStamp(`${formattedTime}-${formattedDate}`);
  
  }, []);



  return (
    <div className="text-container">
      <div className="upvote-container">
       </div>
        <div className='text-context'>
      <p> {text.text} </p>
      <UpVote text={text}/>
      <p className='timeStamp'>{newTimeStamp}</p>
    </div>
    </div>
  )
}

export default Post;