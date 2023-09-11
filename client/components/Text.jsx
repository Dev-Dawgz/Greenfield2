import React, {useState, useEffect} from 'react';
import axios from 'axios';
import UpVote from './UpVote.jsx';

const Text = ({text}) => {
  console.log(text)
  
  const [prompt, setText] = useState('');

  useEffect(() => {

    axios.get(`/text/${text.id}`)
    .then((textData) => {
      setText(textData.data.text);
    })
    .catch((err) => console.error(`Error getting text:${err}`))
  }, [text])


  return (
    <div>  
      <br/>
      <p>{prompt}</p>
      <UpVote text={text}/>
    </div>
  )
}
export default Text;