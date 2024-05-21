import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { json } from 'd3';
import DateDropdown from './DateDropdown';


import ChartWrapper from './ChartWrapper';
import Table from './Table';
import BarChartWrapper from './BarChartWrapper';

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
        json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_22_03.json"), 

        json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_29_03.json"),
        json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_29_03.json"),
			  
        json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_05_04.json"),
        json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_05_04.json"),
			  
        json("https://sentimentviz-default-rtdb.firebaseio.com/sentiments_24_15_04.json"),
        json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_04.json")
       ]).then(([data, topVideoData, dataMarch22, topVideoDataMarch22, dataMarch29, topVideoDataMarch29, dataApril05, topVideoDataApril05, dataApril15, topVideoDataApril15]) => {
        this.setState({ data: data, 
                        topVideoData: topVideoData, 
                        
                        dataMarch22: dataMarch22, 
                        topVideoDataMarch22 : topVideoDataMarch22,
                        
                        dataMarch29: dataMarch29, 
                        topVideoDataMarch29 : topVideoDataMarch29,

                        dataApril05: dataApril05, 
                        topVideoDataApril05 : topVideoDataApril05,

                        dataApril15: dataApril15, 
                        topVideoDataApril15 : topVideoDataApril15,
        });
       }).catch(error => {
        console.log(error)
      });
  }
  
  updateVideo = (activeVideo) => this.setState({ activeVideo })
  dateSelected = (date) => this.setState({ date })
  
	
  renderBarChart() {
    if (this.state.data.length == 0) {
      return "No data yet"
    }
    return <BarChartWrapper data={this.state.data} topVideoData={this.state.topVideoData} dataMarch22={this.state.dataMarch22} topVideoDataMarch22={this.state.topVideoDataMarch22} activeVideo={this.state.activeVideo} date={this.state.date} />
  }

  renderChart() {
    if (this.state.data.length == 0) {
      return "No data yet"
    }
    //console.log("dataMarch22", this.state.dataMarch22)
    return <ChartWrapper data={this.state.data} topVideoData={this.state.topVideoData} dataMarch22={this.state.dataMarch22} topVideoDataMarch22={this.state.topVideoDataMarch22} activeVideo={this.state.activeVideo}  date={this.state.date} updateVideo={this.updateVideo} />
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
              <Col md={7} xs={12}>
               <Row>
                <Col md={7} xs={12}>{this.renderChart()}</Col>
                </Row>
              <Row> 
                <Col md={7} xs={12}>{this.renderBarChart()}</Col>
              </Row>
              </Col>
            <Col md={5} xs={12}><Table data={this.state.data} topVideoData={this.state.topVideoData} dataMarch22={this.state.dataMarch22} topVideoDataMarch22={this.state.topVideoDataMarch22} activeVideo={this.state.activeVideo} date={this.state.date}/></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function restrucOrigData(rawData) {
	const newData = [];
	for (const videoID in rawData['US']){
		for ( const user in rawData['US'][videoID]){
			newData.push({
				videoID: videoID,
				user: user,
				analysis: rawData['US'][videoID][user]['Analysis'],
				comments: rawData['US'][videoID][user]['Comments'],
				polarity: rawData['US'][videoID][user]['Polarity'],
				title: rawData['US'][videoID][user]['title']
			})
		}
	}
	return newData
}

function getPolarityCount(rawData){
	const res = rawData.reduce((acc, obj) => {
		const existingIndex = acc.findIndex(
			el => el.videoID == obj.videoID && el.analysis == obj.analysis
		)
		if (existingIndex > -1) {
			acc[existingIndex].count += 1
		} else {
			acc.push({
				videoID: obj.videoID,
				analysis: obj.analysis,
				title: obj.title,
				count: 1
			})
		}
		return acc
	}, [])
	return res
}

function reorganizeData(polarityData) {
	const result = [ ...polarityData
		.reduce((acc, {videoID, analysis, count}) => {
			const group = acc.get(videoID)
			//group ? group.sentimentData.push({analysis, count}) : acc.set(videoID, {videoID, "sentimentData":[{analysis, count}]})
			group ? group.sentimentData.push({analysis, count}) : acc.set(videoID, {videoID, "sentimentData":[{analysis, count}]})
			return acc
		}, new Map)
		.values()
	]
	return result 
	}

function combineData(data) {
	const updatedData = [];
		data.forEach(item => {
				const dataExp = {
					videoID: item.videoID,
					negativeSentimentCount: item.sentimentData.find(item =>item.analysis =="Negative")['count'],
					neutralSentimentCount: item.sentimentData.find(item =>item.analysis =="Neutral")['count'],
					positiveSentimentCount: item.sentimentData.find(item =>item.analysis =="Positive")['count']  //reduce((amt, t) => t.analysis === "Positive " ? t.positiveSentimentCount: amt, 0)
				}
				updatedData.push(dataExp);
		})
	return updatedData   
}	

function restructureData(raw_data) {
	var USAVideoCount = [];
	for(const videoID in raw_data['US']) {
		USAVideoCount.push({
			videoID: videoID,
			videoTitle: raw_data['US'][videoID]['title'],	
			videoCount: Number(raw_data['US'][videoID]['view_count'])
		});
	}
	USAVideoCount = USAVideoCount.sort((a,b) => (a.videoCount < b.videoCount) ? 1: -1) 
	return USAVideoCount
}

export default App;

