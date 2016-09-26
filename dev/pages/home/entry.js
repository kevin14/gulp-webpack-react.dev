import './index.less'
import React from 'react'
import ReactDom from 'react-dom'

class Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }

    }

    componentDidMount() {

       
    }

    render() {
        Lang.config(trans);
        var self = this;

        return (<div className="pageMain">
                   12345
                 </div>)
    }
}



if (!$) {
    module.exports = Component;
} else {
    document.addEventListener("DOMContentLoaded", function() {
        ReactDom.render(
            <Component></Component>, document.querySelector('#container')
        )
    })
}