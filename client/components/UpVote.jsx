import React, { useState } from 'react';
import axios from 'axios';


const UpVote = ({text}) => {
  console.log(text)

 // const { likes } = text;

  const [likes, setLikes] = useState(0);

  const handleLikes = () => {
    axios.post(`http://127.0.0.1:8080/text/${text.id}`, { action: 'like'})
    .then((textObj) => {
      if (textObj.status === 200) {
        setLikes(likes + 1);
      }
    })
    .catch((err) => console.error(`Error liking: ${err}`))

  };

  const handleDislikes = () => {
    axios.post(`/text/${text.id}`, {action: 'dislike'})
    .then((textObj) => {
      if (textObj === 200) {
        setLikes(likes - 1)
      }
    })
    .catch((err) => console.error(`Error disliking: ${err}`))
  };

  return (

    <div>
      <br />
        <span>Likes:{likes}</span>
        <br />
        <button
        className='upvote-btn'
        onClick={handleLikes}> ⬆️</button>
        <button
        className='upvote-btn'
        onClick={handleDislikes}>⬇️</button>
    </div>


  )



}

export default UpVote;