import react, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userTexts, setUserTexts] = useState([]);
  const [userId, setUserId] = useState(1);

  //axios request to retrieve user texts by id
  useEffect(() => {
    axios.get(`http://127.0.0.1:8080/text/${userId}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  })

  return (
    <div>
      <Link to='/' >
        <button className='user-home-button'>HomePage</button>
      </Link>
      <div className='user' >
        <h1 className='user-head' >My Stories</h1>
          <div className='user-data'>
            <ul className='user-ul'>
        {
          userTexts.map((entry, index) => {
            return <Link to="/user/text" 
            className='user-index' 
            entry={entry} 
            key={entry.id}>
               {entry.text}
            </Link>
          })
        }

            </ul>
          </div>
      </div>
    </div>
  )
}
export default User;
