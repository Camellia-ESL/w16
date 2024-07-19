import HeaderBar from './staticpanels/HeaderBar'
import MainFrame from './staticpanels/MainFrame'
import { User } from './core/user'

import './App.css'
import { useEffect } from 'react'

const App = () : JSX.Element => {

  useEffect(() => {
    // When the app starts tries to fetch user settings asynchronously
    User.loadUserSettings();
  }, []);

  return (
    <>
      <HeaderBar />
      <MainFrame />
    </>
  )
}

export default App