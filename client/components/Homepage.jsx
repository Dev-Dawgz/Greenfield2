import React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from'axios';
import Post from './Post.jsx';
import Timer from './Timer.jsx'
import bestOf from '../badgeHelpers/bestOf.jsx';
// import Text from './Text.jsx';

function Homepage() {
  //setting states of generated word, current story, and input using hooks
  //building story from post winners
  const [story, setStory] = useState([])
  const [currentBadgeId, setBadgeId] = useState(1) 
  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  //contenders for next part of the story
  const [posts, setPosts] = useState([])
  const [textCount, setTextCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState({})
  

  //set the starting time for the timer
  const actionInterval = 30000; // 30 seconds for testing

  //read the target time from localStorage or set it initially
  const storedTargetTime = localStorage.getItem('targetTime');
  const initialTargetTime = storedTargetTime ? parseInt(storedTargetTime, 10) : Date.now() + actionInterval;

  const storedTimerStart = localStorage.getItem('timerStart');
  const initialTimerStart = storedTimerStart ? parseInt(storedTimerStart, 10) : Date.now() / 1000; // Convert milliseconds to seconds


  //calculate the remaining time based on the target time and current time
  const [remainingTime, setRemainingTime] = useState(initialTargetTime - Date.now());

  //useEffect to fetch data from database upon mounting
  let latestPrompt;
  let latestBadgeStory;
  let postCount = 0

  //creates a new round of submissions for the next iteration of the main story
  const newRound = () => {
    return axios.get('https://random-word-api.herokuapp.com/word?number=5')
            .then((response) => {
              const wordsForDb = response.data.join(' ')
              //creates new prompt with new matchWords and current story id
              axios.post('/prompt', {matchWords: wordsForDb, badgeId: currentBadgeId})
              .then(() => {
                //grabs latest prompt
                axios.get('/prompt/find/last')
                .then((response) => {
                  latestPrompt = response.data[0]
                  const wordArray = latestPrompt.matchWords.split(' ')
                  //sets words for prompt
                  setWords(wordArray)
                  //sets current state prompt to latest
                  setCurrentPrompt(latestPrompt);
                  //sets posts to zero
                  setPosts([]);
                })
                .catch((err) => {
                console.error("Could not get prompts", err)
                })
    
              })
              .catch((err) => {
                console.error("Could not Submit!", err)
              })
          localStorage.setItem('lastUpdate', new Date().toString())
        })
        .catch((err) => {
          console.error("Couldnt get words!", err)
        })
  }

  //starts a new story, should reset once a day
  const newStory = () => {
    //creates a new badge/story
    axios.post('/badges')
      .then(() => {
        //grabs newly created badge
        axios.get('/badges/find/last')
          .then((response) => {
            latestBadgeStory = response.data[0]
            //sets the new story state id
            setBadgeId(latestBadgeStory.id)
            setStory([]);
          })
          .catch((error) => console.error('could not get badges', error))
      })
      .catch((error) => console.error('could not create new badge', error));
  }

  //picks submission with most likes and makes it part of the main story
  const promptWinner = () => {
    //grab texts with the current promptId
    axios.get(`/text/prompt/${latestPrompt.id}`)
      .then((textArr) => {
        //runs through function to determine submission with most likes
        bestOf(textArr.data)
          .then((best) => {
            //changes the winning state in the text db
            axios.post(`/text/winner/${best.id}`)
            //rerenders story to show new text
            setStory((story) => ([...story, best]));
          })
          .catch((error) => console.error('could not set most likes', error));
      })
      .catch((error) => {
        console.error('no posts submitted', error);
      })
  }

  useEffect(() => {
    //grabs latest prompt, sets words, renders any submissions
      axios.get('/prompt/find/last')
      .then((response) => {
        //only hit if prompts table is empty
        if(response.data.length === 0){
          newRound()
        }else{
          latestPrompt = response.data[0]
          //sets the words of most current prompt
          const wordArray = latestPrompt.matchWords.split(' ')
          setWords(wordArray)
          //grabs all submissions for current prompt
          axios.get(`/text/prompt/${latestPrompt.id}`)
          .then((response) => {
            //renders all posts to page
            setPosts(response.data)
          })
          .catch((error) => console.error('could not get latest prompt submissions', error));
          //sets the most current prompt in state
          setCurrentPrompt(latestPrompt)
          }
      
        })
      .catch((err) => {
        console.error('Error getting words:', err)
      })
    
    //grabs the most current story
    axios.get('/badges/find/last')
      .then((response) => {
        //only hits if badges table is empty
        if(response.data.length === 0){
        newStory();
        }else{
        //sets the most current badge
          latestBadgeStory = response.data[0]
          setBadgeId(latestBadgeStory.id)
        }
      })
      .catch((err) => {
        console.error('Error getting story:', err)
      })

    //grabs all of the texts that are already a part of the main story
    axios.get(`/text/winner/1/${currentBadgeId}`)
      .then((winnerArr) => {
        //sets story to an array of text obj
        setStory(winnerArr.data)
      })
      .catch((error) => console.error('could not grab winner texts for story'));
    
    //picks winning submission and starts a new round
    const promptInterval = setInterval(() => {
      promptWinner()
      newRound();
    }, actionInterval) // this is where to change interval time between prompt changes (currently set to an hour)

    //resets the story to start a new one, starts a new round
    const storyInterval = setInterval(() => {
      newStory()
      newRound();
    }, 30000)
    
    return () => {
      clearInterval(promptInterval);
      clearInterval(storyInterval);
    }


  }, [])

  useEffect(() => {
    const appInterval = setInterval(() => {
      console.log('Action triggered');

      //update target time for next action
      const newTargetTime = Date.now() + actionInterval;
      localStorage.setItem('targetTime', newTargetTime.toString());

      //calculate the remaining time 
      setRemainingTime(newTargetTime - Date.now());
    }, actionInterval);


    const timer = setInterval(() => {
      setRemainingTime(prevRemainingTime => {
        if (prevRemainingTime <= 0) {
          return actionInterval;
        }
        return prevRemainingTime - 1000;
      });
    }, 1000);

    //cleanup
    return () => {
      setInterval(timer)
      clearInterval(appInterval);
    };
  }, [actionInterval]);

  

  // Calculate minutes and seconds from the remaining time
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);


  //function to handle input change
  const handleInput = (event) => {
    setInput(event.target.value)
    setTextCount(event.target.value.length)
  }

  //function to handle user submit
  const handleSubmit = () => {
    //sets story to current story plus users input
    if(input !== ''){
      //setStory(` ${story}`)
      setInput('')
      setTextCount(0)
      //add userId as well once its ready
      axios.post('/text', {text: input, promptId: currentPrompt.id})
      .then(() => {
        axios.get('/text/find/last')
        .then((response) => {
          setPosts((posts) => ([...posts, response.data[0]]));
        })
      })
      .catch((err) => {
        console.error("err", err)
      })
    }

  }

  
  //return dom elements and structure
  return (
    <div>
      
      <nav className='nav-btn' >
      <div className='user-div'>
        <Link to="/user">
          <button className='user-btn'>User</button>
        </Link>
      <Link to=''>
        <button className='user-btn' >Button for Logan</button>
      </Link>
      <div>
        <Timer minutes={minutes} seconds={seconds} />
      </div>
      </div>
      </nav>

    {/* //div for wrapper containing all homepage elements */}
    <div className='wrapper'>
      
      <div className='word-container'>
        {words.map((word, i) => (
        <span key={i}>{word } </span>
      ))}
      </div>
      
        <div className='story-container'>
          {
            story.map((submission, i) => {
              return <div key={submission.id}>{submission.text}</div>
            })
          }
        </div>

        <div >
          
          <textarea 
          className='user-input'
          type='text'
          placeholder='Add to the story!' 
          onChange={handleInput}
          value={input}
          maxLength={150}
          />
          <div className='text-count'>
            {textCount}/150
          </div>
          <div className='submit'>
          <button className='submit-btn' onClick={handleSubmit}>Submit</button>
          </div>

          <div>
          {
              posts.map((post) => {
                return <Post key={post.id} text={post}/>
              })
            }
            
          </div>
        </div>

        <div className='posts'>
        </div>

    </div>
    
  </div>
  )
};

export default Homepage