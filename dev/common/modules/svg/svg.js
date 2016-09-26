import React from 'react'
import ReactDom from 'react-dom'
import './index.less';

class Svg extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let self = this
    }

    render() {
        if (this.props.name) {
            var iconContent = require('./icons/' + this.props.name + '.svg');
            var match = iconContent.match(/<svg([^>]+)+>([\s\S]+)<\/svg>/i);
            var svgProps = {};
            var attrs = match[1];
            if (attrs) {
                svgProps = attrs.match(/([\w-:]+)(=)?("[^<>"]*"|'[^<>']*'|[\w-:]+)/g)
                    .reduce(function(obj, attr) {
                        var split = attr.split('=');
                        var name = split[0];
                        var value = true;
                        if (split && split[1]) {
                            value = split[1].replace(/['"]/g, '');
                        }
                        obj[name] = value;
                        return obj;
                    }, {})
            }
            for (var prop in this.props) {
                svgProps[prop] = this.props[prop];
            }
            return (<svg {...svgProps} dangerouslySetInnerHTML={{__html:match[2]}}>
                    </svg>)
            return null
        } else {
            return null;
        }

    }
}

module.exports = Svg