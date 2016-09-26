import './loading.less'
import React from 'react'
import ReactDom from 'react-dom'

class Loading extends React.Component {

        constructor(props) {
            super(props)
        }

        render() {
            return ( < div className = {
                    "globalLoading " +
                    (this.props.show ? " show " : "") +
                    (this.props.opacity ? " opacity " : "") +
                    (this.props.background === false ? " hideBackground " : "") +
                    (this.props.fixedHeight ? " fixedHeight" : "") +
                    (this.props.className || "")  
                    }>
                        <div className="loadingContainer">
                            <div className="dot dot1"></div>
                            <div className="dot dot2"></div>
                            <div className="dot dot3"></div>
                            <div className="dot dot4"></div>
                        </div> 
                </div>)
            }
}

module.exports = Loading
