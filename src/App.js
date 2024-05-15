import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { json } from 'd3';


import ChartWrapper from './ChartWrapper';
import Table from './Table';

class App extends Component {
  state = {
    data: []
  }

  componentWillMount() {
    json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_15_03.json")
      .then(data => this.setState({ data }))
      .catch(error => console.log(error));
  }

  renderChart() {
    if (this.state.data.length == 0) {
      return "No data yet"
    }
    return <ChartWrapper data={this.state.data} />
  }

  render() {
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Brand>Sentiment Analysis</Navbar.Brand>
        </Navbar>
        <Container>
          <Row> 
            <p>This projects examines the level of positive and negative sentiments on Youtube top trending videos. </p>
            <p> </p>
            <p> </p>
          </Row>
          
         
          <Row>
            <Col md={6} xs={12}>{this.renderChart()}</Col>
            <Col md={6} xs={12}><Table data={this.state.data} /></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
