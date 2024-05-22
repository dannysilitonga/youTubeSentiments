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
    return <BarChartWrapper topVideoData={this.state.topVideoData} topVideoDataMarch22={this.state.topVideoDataMarch22} date={this.state.date} />
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
        <Container fluid>
          <Row> 
            <p style={{marginLeft: 15}}>This projects examines the level of positive and negative sentiments on Youtube among the 
            top 50 most trending videos. The original data comes from YouTube on a daily basis, which is extracted, along with their 
            associated comments, using YouTube free API services. After the data has been cleaned, e.g. removing comments in other than English, 
            a Natural Language Process model is applied to the comments to assess the level of polarity of each comment for each of 
            the top trending videos. The polarity level determines weather a comment is labeled negative, positive or neutral. Both 
            the top trending video data and the sentiment data are saved in a realtime document database using Google's Firebase. 
            The database contains daily data from mid March to mid May, from 5 English speaking countries: the US, the UK, Ireland, 
            Australia, and New Zealand. </p> 
            
            <p style={{marginLeft: 15}}> The visualization extracts both the top trending video and the sentiment data from the Firebase database. 
            The sentiment data is used to calculate the percentage of negative, positive and neutral comments for each video. 
            The table on the right shows the top 50 trending videos, with the percentage of negative, positive and neutral comments. 
            The bar chart on the left shows the top trending videos, determined by the number of views, for the selected date.
            The scatterplot shows the percentage of negative comments on the x-axis and the percentage of positive comments on the y-axis. 
            Upon clicking on a circle in the scatterplot, the table on the right will display the video title, and the percentage of negative, 
            positive and neutral comments for the selected video. The drop down menu allows the user to select the date for which the data. 
            
            </p>
            <p> </p>
            <p> </p>
          </Row>
          <Row>
            <Col xs={12}><DateDropdown dateSelected={this.dateSelected} /></Col>
          </Row>
         
        
            <Row>
              <Col md={7} xs={12}>
               <Row>
                <Col style={{display:'flex', justifyContent:'left'}} md={7} xs={12}>{this.renderBarChart()} </Col>
                </Row>
              <Row> 
                <Col style={{display:'flex', justifyContent:'left'}} md={7} xs={12}>{this.renderChart()} </Col>
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

