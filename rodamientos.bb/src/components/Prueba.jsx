import React from 'react'

const Prueba = () => {
  return (
    <div>

<div
  className="modal fade"
  id="exampleModal"
  tabIndex={-1}
  role="dialog"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-body">
        <div className="column" id="main">
          <h1>Sign Up </h1>
          <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h3>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputName">Name</label>
              <input
                type="name"
                className="form-control"
                id="exampleInputName"
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">E-mail </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="E-mail"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
        </div>
        <div>
          {/*?xml version="1.0" encoding="UTF-8"?*/}
          <svg
            width="67px"
            height="578px"
            viewBox="0 0 67 578"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            {/* Generator: Sketch 53.2 (72643) - https://sketchapp.com */}
            <title>Path</title>
            <desc>Created with Sketch.</desc>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth={1}
              fill="none"
              fillRule="evenodd"
            >
              <path
                d="M11.3847656,-5.68434189e-14 C-7.44726562,36.7213542 5.14322917,126.757812 49.15625,270.109375 C70.9827986,341.199016 54.8877465,443.829224 0.87109375,578 L67,578 L67,-5.68434189e-14 L11.3847656,-5.68434189e-14 Z"
                id="Path"
                fill="#F9BC35"
              />
            </g>
          </svg>
        </div>
        <div className="column" id="secondary">
          <div className="sec-content">
            <h2>Welcome Back!</h2>
            <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h3>
            <button type="button" className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
  )
}

export default Prueba


