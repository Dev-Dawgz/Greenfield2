import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userId, setUserId] = useState();
  const [userTexts, setUserTexts] = useState([]);
  const [userBadges, setUserBadges] = useState('');
  const  [username, setUsername] = useState('yeauxDejuan');

 
  const getUserId = (username) => {
    axios.get(`/user/${username}`)
      .then((userData) => {
        userData.data.forEach(element => {
          setUserId(element.id);
          setUserBadges(element.badges);
        });
      })
      .catch((err) => {
        console.error('Could not retrieve user ID', err)
      });
  };
 
  //axios request to retrieve user texts by id
  const getUserTexts = (id) => {
    axios.get(`http://127.0.0.1:8080/text/user/${id}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  };

  useEffect(() => {
    getUserId(username)
    getUserTexts(userId);
  });

  return (
    <div>
      <nav>
        <Link to='/home' >
          <button className='user-home-button'>HomePage</button>
        </Link>
      </nav>
        <h1 className='user-head' >MY STORIES</h1>
      <div className='user' >
          <div className='user-data'>
            <ul className='user-ul'>
        {
          userTexts.map((entry) => {
            return <Link
             to={`/user/text/${entry.id}`}
            className='user-index'
            entry={entry}
            key={entry.id}>
              <div>
                <strong> Response:</strong> {entry.text}
              </div>
              <div>
              <strong> Prompt:</strong> {entry.text}
              </div>

               {/* {entry.text} */}

            </Link>
          })
        }

            </ul>
          </div>
      </div>
      <h1 className='badges-header' >Badges</h1>
      <div className='user-badges'>{userBadges}</div>
    </div>
  )
}

export default User;
