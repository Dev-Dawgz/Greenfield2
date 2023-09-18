import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userId, setUserId] = useState(1);
  const [userTexts, setUserTexts] = useState([]);
  const [userBadgesSt, setUserBadgesSt] = useState('');
  const [userBadgeObj, setUserBadgeObj] = useState({Likeable: 0, Contributor: 0, Matcher: 0})
  const [username, setUsername] = useState('yeauxdejuan');
  const [badgeId, setBadgeId] = useState(1)

 
  const getUserId = (username) => {
    axios.get(`/user/${username}`)
      .then((userData) => {
        let user = userData.data[0];
          setUserBadgesSt(user.badges)
          setUserId(user.id);
      })
      .catch((err) => {
        console.error('Could not retrieve user ID', err)
      });
  };
 
  const manipulateBadgeData = () => {
    userBadgesSt.split('+').forEach((badge) => {
      if(badge.length > 0){
        setUserBadgeObj((userBadgeObj) => ({...userBadgeObj, [badge]: userBadgeObj[badge]+1}));
      }
    })
  }

  //axios request to retrieve user texts by id
  const getStoryWithResponse = (badgeId) => {
    axios.get(`http://127.0.0.1:8080/text/winner/1/${badgeId}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  };

  //runs when dom is compounded
  useEffect(() => {
    getUserId(username);
    getStoryWithResponse(badgeId)
  }, []);
  
  //runs when userBadgeSt changes
  useEffect(() => {
    manipulateBadgeData();
  }, [userBadgesSt])

  return (
    <div>
      <nav>
        <Link to='/home' >
          <button className='user-home-button'>HomePage</button>
        </Link>
      </nav>
        <h1 className='user-head'>MY STORIES</h1>
      <div className='user' >
          <div className='user-data'>
            <ul className='user-ul'>
        {userTexts.map((entry) => {
            return (
              <div key={entry.id} className='user-entry-box'>
                <Link
                  to={`/user/text/${entry.id}`}
                  className='user-index'
                  entry={entry}
                >
                  <div>
                    <strong>Username:</strong> {username}
                  </div>
                  <div>
                    <strong>Story:</strong> {entry.prompt.matchWords}
                  </div>
                  <div>
                    <strong>Response:</strong> {entry.text}
                  </div>
                  <div className='small-text'>
                    <strong>Likes:</strong> {entry.likes}
                     &nbsp;&nbsp;&nbsp;
                    <strong>Created:</strong> {entry.prompt.createdAt.substring(0, 10)}

                  </div>
                </Link>
              </div>
            );
          })}

            </ul>
          </div>
      </div>
      <h1 className='badges-header' >Badges</h1>
      <div>
        {
          Object.entries(userBadgeObj).map((category, i) => {
            if(category[1] >= 10) {
              return <div><div className='gold-badge' id={i}>{category[0]}</div><br/></div>
            }
            if(category[1] >= 5) {
              return <div><div className='bronze-badge' id={i}>{category[0]}</div><br/></div>
            }
            if(category[1] > 0 ) {
              return <div><div className='silver-badge' id={i}>{category[0]}</div><br/></div>
            }
          })
        }
      </div>
    </div>
  )
}

export default User;
