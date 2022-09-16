import './App.css';
import Cloud from './components/cloud/Cloud.tsx';
import Bg1 from './assets/bg-1.jpg';
import { useEffect, useMemo, useState } from 'react';
import {getAllMessages, deleteMessage} from './services/messages.js';

function App() {
  const [activeId, setActiveId] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [queue, setQueue] = useState([]);
  const [timerId, setTimerId] = useState(null);

  const getNewMessages = async () => {
    const recursiveShow = (array) => {
      if (array.length) {
        let item = array.shift();
        let showedMessages = localStorage.getItem('showedMessages');
        showedMessages = JSON.parse(showedMessages);
        if (showedMessages.indexOf(item.id) == -1) {
          const countOfSymbols = item.text.length;
          const countOfSeconds = countOfSymbols / 25;
          setActiveId(item.id);
          setTimeout(() => {
            localStorage.setItem('showedMessages', JSON.stringify([...showedMessages, item.id]))
            setActiveId(-1);
            recursiveShow(array)
          }, countOfSeconds < 5 ? 5000 : countOfSeconds > 30 ? 30000 : countOfSeconds * 1000)
        } else {
          recursiveShow(array)
        }
      }
    }

    const res = await getAllMessages();

    let showedMessages = localStorage.getItem('showedMessages');
    if (showedMessages) {
      showedMessages = JSON.parse(showedMessages)
    } else {
      showedMessages = []
      localStorage.setItem('showedMessages', JSON.stringify([]))
    }

    setMessages(res.data.filter(item => showedMessages.indexOf(item.id) > -1));

    if (showedMessages.length < res.data.length) {
      let unshowedMessages = res.data.filter(item => showedMessages.indexOf(item.id) == -1);
      setQueue(prevState => {
        return  [...prevState, ...unshowedMessages.filter(item => !prevState.find(prevItem => prevItem.id == item.id))]
      });
    } else if (showedMessages.length > res.data.length) {
      let messagesIds = res.data.map(item => item.id);
      localStorage.setItem('showedMessages', JSON.stringify(messagesIds));
      setMessages([...res.data])
    }
  }
  
  const handleDeleteDown = (event) => {
    if (event.key == 'Delete' && activeId > -1) {
      deleteMessage(activeId)
      setMessages(prevState => [...prevState.filter(item => item.id != activeId)]);
      localStorage.setItem('showedMessages', JSON.stringify(JSON.parse(localStorage.getItem('showedMessages')).filter(item => item != activeId)))
    }
  }

  const showNewMessage = () => {
    const item = queue.at(-1);
    const countOfSymbols = item.text.length;
    const countOfSeconds = countOfSymbols / 25;
    let showedMessages = JSON.parse(localStorage.getItem('showedMessages'));
    setMessages(prevState => [...prevState, item])
    localStorage.setItem('showedMessages', JSON.stringify([...showedMessages, item.id]));
    setQueue(prevState => [...prevState.filter(el => el.id != item.id)])
    setActiveId(item.id);
    let timer = setTimeout(() => {
      setActiveId(-1);
    }, countOfSeconds < 5 ? 5000 : countOfSeconds > 30 ? 30000 : countOfSeconds * 1000)
    setTimerId(timer);
  }

  useEffect(() => {
    if (activeId == -1 && queue.length) {
      showNewMessage()
    }
  }, [activeId, queue])

  useEffect(() => {
    getNewMessages()
    setInterval(() => {
      getNewMessages()
    }, 10000)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleDeleteDown)
    return () => {
      window.removeEventListener('keydown', handleDeleteDown)
    }
  })

  const setCloudActive = (id) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    setActiveId(activeId == id ? -1 : id);
  }

  let clouds = useMemo(() => {
    let res = [];
    for (let i = 0; i < 1; i++) {
      res.push(<Cloud width={200} key={`index-${i}`}/>)
    }
    return res;
  });

  return (
    <div 
      className="App" 
      style={{
        overflowX: 'hidden', 
        overflowY: 'scroll', 
        position: 'relative', 
        width: '100vw', 
        height: '2500px',
        background: Bg1
      }}
    >
      {messages.map((item) => 
        <Cloud 
          width={200} 
          key={item.id} 
          isActive={activeId == item.id} 
          setActive={() => {setCloudActive(item.id)}} 
          text={item.text} 
          author={item.author}
        />)}
    </div>
  );
}

export default App;
