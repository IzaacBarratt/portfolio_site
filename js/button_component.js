'use strict';

//import { portfolio as data } from '../data/index';
//const data = require('../data/index.js').portfolio
const e = React.createElement;

const data = [
    {
        id: 1,
        name: 'DAT ONE',
        description: 'asdlfkjalskdfj'
    }
]

class ButtonComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  formatPortfolioData = () => {
    var items = [];

      for (var i = 0; i < data.length; i ++) {
          console.log('portfolio+')

          
      }
  }

  returnContent = () => {

    const { liked } = this.state;

    if (liked === false) {
        return e(
            'h1',
            {},
            (this.state.liked === true) ? 'CLICKED' : 'PORTFOLIO'
        )
    } else {
        return e(
            'div',
            {},
            this.formatPortfolioData()
        )
    }
    
  }


  render() {

    console.log('comp')


    return e(
      'div',
      { 
        onClick: () => this.setState({ liked: true }),
        class: 'button lilacBackground'
     },
     this.returnContent()
    );
  }
}



const domContainer = document.querySelector('#button_comp');
ReactDOM.render(e(ButtonComp), domContainer);