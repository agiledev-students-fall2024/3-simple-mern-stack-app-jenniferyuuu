import { useState, useEffect } from 'react'
import axios from 'axios'

/**
 * A React component that shows a form the user can use to create a new message, as well as a list of any pre-existing messages.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const About = props => {
  const [aboutUs, setAboutUs] = useState([])
  const [image, setImage] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  /**
   * A nested function that fetches messages from the back-end server.
   */
  const fetchInfo = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
      .then(response => {
        // axios bundles up all response data in response.data property
        const info = response.data.info
        setAboutUs(info)
        
        const image = response.data.image
        setImage(image)
  
      })
      .catch(err => {
        const errMsg = JSON.stringify(err, null, 2) // convert error object to a string so we can simply dump it to the screen
        setError(errMsg)
      })
      .finally(() => {
        // the response has been received, so remove the loading icon
        setLoaded(true)
      })
  }

  // set up loading data from server when the component first loads
  useEffect(() => {
    // fetch messages this once
    fetchInfo()

  }, []) // putting a blank array as second argument will cause this function to run only once when component first loads

  return (
    <div id='about'>
        <h1 id='title'>About Me</h1>
        {aboutUs.map((text, index) => (
            <p id="space" key={index}>{text}</p>
        ))}

        <br></br>
        <img id="resize" src={image} alt="about me"/>
    </div>
  )
}

// make this component available to be imported into any other file
export default About
