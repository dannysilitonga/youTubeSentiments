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
          <Navbar.Brand>Polarity Analysis on Top 50 Most Trending YouTube Videos</Navbar.Brand>
        </Navbar>
        <Container fluid>
          <Row>
            <Col md={6}>  
            <p style={{marginLeft: 15, marginTop: 5}}>This projects examines the level of polarity among the 50 most popular 
            videos on Youtube on a given day, measured from the viewers' comments for each video. Video popularity is determined 
            by the number of views received. The raw data also includes the text data of the viewers' 
            comments, which is pulled using the Google free API services. A ceiling of 100 comments for 
            each video extracted is imposed to adhere to Google's free API policies. </p>
            
            <p style={{marginLeft: 15}}> After the data has been cleaned, e.g. removing comments in 
            languages other than English, a Natural Language Process (NLP) model is applied to assess 
            the level of polarity of each comment for each video data processed. The NLP model determines 
            whether a given comment should be labeled negative, positive or neutral. </p>

            <p style={{marginLeft: 15}}> Both the top trending video data and the sentiment data are stored 
            in a realtime document database, employing Google's Firebase database. This database contains 
            daily data from mid-March to mid-May, from 5 predominantly English speaking countries: the US, the UK, Ireland, 
            Australia, and New Zealand. The database can be found: <a href="https://sentimentviz-default-rtdb.firebaseio.com/"> 
            Youtube Data on Firebase.</a> </p> 

            </Col>
            <Col md={6}> 
            
            <p style={{marginLeft: 15}}> Using their API services, the visualization app connects to both the top 
            trending video and the sentiment data from the Firebase database. The sentiment data is used to calculate 
            the percentages of negative, positive, and neutral comments for each video shown. The table on 
            the right displays the statistics for the 50 most popular videos for the selected day. 
            The bar chart on the left shows the histogram of the most trending videos for the selected date. 
            The scatterplot, below the bar chart, 
            shows the percentage of negative comments on the x-axis and the percentage of positive comments on 
            the y-axis. 
            Upon clicking on any of the circles in the scatterplot, the table on the right would highlight the video title, 
            and the percentages of negative, positive and neutral comments for the selected video. Please note: Some 
            video data has been removed from the table when a given video does not have at least 1 positive, 
            1 negative, and 1 neutral comment. This is done for simplicity purposes. The drop down menu allows the 
            user to select the date for which the data would be used to update the visualization. For simplicity purposes, there 
            are 2 date options, and the analysis is done for the US data only.
            </p>
            <p style={{marginLeft: 15}}>Netlify is used for deployment purposes. This is done for ease of use as well
            as for automatic deployment upon new code updates. The code for this project can be found on Github: 
            <a href="https://github.com/dannysilitonga/youTubeSentiments/tree/master"> YouTube Sentiments on Github.</a>
            </p>
            </Col>
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

