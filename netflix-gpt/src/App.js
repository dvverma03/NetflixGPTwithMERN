import './App.css';
import Body from './components/Body';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import { useEffect } from 'react';

function App() {
  useEffect(()=>{
    window.alert("If you are getting dangerous site error please use different browser or you can open with details button and only visit")
  },[])
  return (
    <div className="App">
      <Provider store={appStore}><Body/></Provider>
      
    </div>
  );
}

export default App;
