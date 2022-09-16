import logo from './logo.svg';
import './App.css';
import Cloud from './components/cloud/Cloud.tsx';
import Bg1 from './assets/bg-1.jpg';
import { useEffect, useMemo, useState } from 'react';
import {getAllMessages} from './services/messages.js';

function App() {
  const [activeId, setActiveId] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [queue, setQueue] = useState([]);

  const getNewMessages = async () => {
    console.log('start getNewMessages')
    const recursiveShow = (array) => {
      if (array.length) {
        let item = array.shift();
        console.log('item: ', item)
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
    setMessages(res.data);

    let showedMessages = localStorage.getItem('showedMessages');
    if (showedMessages) {
      showedMessages = JSON.parse(showedMessages)
    } else {
      showedMessages = []
      localStorage.setItem('showedMessages', JSON.stringify([]))
    }

    if (showedMessages.length < res.data.length) {
      let unshowedMessages = res.data.filter(item => showedMessages.indexOf(item.id) == -1 && queue.indexOf(item.id) == -1);
      unshowedMessages = [...queue, ...unshowedMessages]
      setQueue(unshowedMessages)
      console.log('unshowedMessages: ', unshowedMessages)
      recursiveShow([...unshowedMessages])
    } else if (showedMessages.length > res.data.length) {
      let deletedMessages = res.data.filter(item => res.data.indexOf(item) == -1);
      deletedMessages.forEach
    }
  }

  useEffect(() => {
    console.log('useEffect')
    getNewMessages()
    setInterval(() => {
      getNewMessages()
    }, 10000)
  }, [])

  const setCloudActive = (id) => {
    console.log('set id: ', id)
    setActiveId(activeId == id ? -1 : id);
    //setTimeout(() => {setActiveId(-1)}, 7000)
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
