import React from 'react'
import { userapi_path, basename } from '../localconf.js'
import { connect } from 'react-redux'
// import '../css/base.less'

const Login = () => (
  <section>
    <p className='article'>BPA Submission Portal</p>
    <a className="btn btn-primary navbar-btn btn-sm login-button" href={userapi_path + 'login/google' + '?redirect=' + location.origin + basename}> Login from Google </a>
  </section>
)
export default Login
