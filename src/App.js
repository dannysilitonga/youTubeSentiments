import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { json } from 'd3';
import DateDropdown from './DateDropdown';


import ChartWrapper from './ChartWrapper';
import Table from './Table';

class App extends Component {
  state = {
    data: [],
    topVideoData: [],
    activeVideo: null
  }

  componentWillMount() { 
      json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_15_03.json") 
      .then(data => this.setState({ data }))
      .catch(error => console.log(error));

      
      json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_03.json")
      .then(topVideoData => this.setState({ topVideoData }))
      .catch(error => console.log(error));
  }
  
  updateVideo = (activeVideo) => this.setState({ activeVideo })


            

  renderChart() {
    if (this.state.data.length == 0) {
      return "No data yet"
    }
    return <ChartWrapper data={this.state.data} topVideoData={this.state.topVideoData} updateVideo={this.updateVideo} />
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
            <Col md={6} xs={12}><Table data={this.state.data} topVideoData={this.state.topVideoData} activeVideo={this.state.activeVideo}/></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
