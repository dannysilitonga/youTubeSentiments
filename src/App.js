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
    dataMarch22: [],
    topVideoDataMarch22: [],
    activeVideo: null, 
    date: "march15"
  }

  dateSelected = (date) => this.setState({ date })

  componentWillMount() { 

      Promise.all([
        json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_15_03.json"),
        json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_03.json"),

        json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_22_03.json"),
        json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_22_03.json")
       ]).then(([data, topVideoData, dataMarch22, topVideoDataMarch22]) => {
        this.setState({ data: data, 
                        topVideoData: topVideoData, 
                        
                        dataMarch22: dataMarch22, 
                        topVideoDataMarch22 : topVideoDataMarch22  
        });
       }).catch(error => {
        console.log(error)
      });
 /*    
      json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_15_03.json") 
      .then(data => this.setState({ data }))
      .catch(error => console.log(error));

      json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_03.json")
      .then(topVideoData => this.setState({ topVideoData }))
      .catch(error => console.log(error));

      json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_22_03.json") 
      .then(topVideoDataMarch22 => this.setState({ topVideoDataMarch22 }))
      .catch(error => console.log(error));

      
      json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_22_03.json")
      .then( dataMarch22  => this.setState({ dataMarch22 }))
      .catch(error => console.log(error));
  
  */
  }
  
  updateVideo = (activeVideo) => this.setState({ activeVideo })
  dateSelected = (date) => this.setState({ date })
  


  renderChart() {
    if (this.state.data.length == 0) {
      return "No data yet"
    }
    //console.log("dataMarch22", this.state.dataMarch22)
    return <ChartWrapper data={this.state.data} topVideoData={this.state.topVideoData} dataMarch22={this.state.dataMarch22} topVideoDataMarch22={this.state.topVideoDataMarch22} updateVideo={this.updateVideo} date={this.state.date} />
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
            <Col xs={12}><DateDropdown dateSelected={this.dateSelected} /></Col>
          </Row>
         
          <Row>
            <Col md={6} xs={12}>{this.renderChart()}</Col>
            <Col md={6} xs={12}><Table data={this.state.data} topVideoData={this.state.topVideoData} dataMarch22={this.state.dataMarch22} topVideoDataMarch22={this.state.topVideoDataMarch22} activeVideo={this.state.activeVideo}/></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
