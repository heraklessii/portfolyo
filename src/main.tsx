import { render } from 'preact'
import { App } from './App'
import './styles/base.css'
import './styles/os.css'
import './styles/apps.css'
import './styles/print.css'

render(<App />, document.getElementById('app')!)
