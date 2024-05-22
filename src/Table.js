import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { blob } from 'd3';
//import Table from 'react-bootstrap/Table';


export default class Table extends Component {
	renderRows() {
		const numberVideos = 50;
	// march 15
		const topVideoRestructured = restructureData(this.props.topVideoData).slice(0,numberVideos)
		const updatedData = combineData(reorganizeData(getPolarityCount(restrucOrigData(this.props.data))).slice(0,numberVideos))
		let mergedMarch15Sorted = flattenArray2(updatedData, topVideoRestructured);	 
		// let mergedMarch15Sorted = mergedMarch15.sort((a, b) => a.percentNegative - b.percentNegative) //a.sentimentDiff - b.sentimentDiff);
		
		//Data March 22
		const topVideoRestructuredMarch22 = restructureData(this.props.topVideoDataMarch22).slice(0,numberVideos)
		const updatedDataMarch22Temp = reorganizeData(getPolarityCount(restrucOrigData(this.props.dataMarch22)))
		const filteredMarch22 = updatedDataMarch22Temp.filter(item => !(item.sentimentData.length < 3));
		const updatedDataMarch22 = combineData(filteredMarch22);
		let mergedMarch22Sorted = flattenArray2(updatedDataMarch22, topVideoRestructuredMarch22); 
		//let mergedMarch22Sorted = mergedMarch22.sort((a, b) => a.percentNegative - b.percentNegative) //a.sentimentDiff - b.sentimentDiff);
		console.log("mergedMarch22Sorted", mergedMarch22Sorted)
		const data = (this.props.date == "march15") ?  mergedMarch15Sorted : mergedMarch22Sorted	

        return (  
            data.map(video => {
				
				const background = (video.videoTitle === this.props.activeVideo) ? "grey" : "white"
				
		
                return (
					
                    <Row 
                        key={video.videoTitle}
                        style= {{ marginTop: "10px", backgroundColor: background }}
                    >
                        <Col xs={6} style= {{ fontSize: 11}}  >{video.videoTitle}</Col>
                        <Col xs={2} style= {{ fontSize: 11,  display:'flex', justifyContent:'center'}} >{video.percentNegative}</Col>
                        <Col xs={2}style= {{ fontSize: 11,  display:'flex', justifyContent:'center'}}>{video.percentPositive}</Col>
						<Col xs={2}style= {{ fontSize: 11,  display:'flex', justifyContent:'center'}}>{video.percentNeutral}</Col>
                        
                </Row>
                )
            })
        )
    }
    render() {
        return (
        <div>
            <Row>
                <Col xs={6} style= {{ fontSize: 16,  display:'flex', justifyContent:'center'}}>
                    Video Title
                </Col>
                <Col xs={2} style= {{ fontSize: 16,  display:'flex', justifyContent:'center'}}>
                    Negative (%)
                </Col>
                <Col xs={2} style= {{ fontSize: 16,  display:'flex', justifyContent:'center'}}>
                    Positive (%)
                </Col>
				<Col xs={2} style= {{ fontSize: 16,  display:'flex', justifyContent:'center'}}>
					Neutral (%)
                </Col>
                
            </Row>
            {this.renderRows()}
        </div>
        )
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
				polarity: rawData['US'][videoID][user]['Polarity']
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
					positiveSentimentCount: item.sentimentData.find(item =>item.analysis =="Positive")['count']
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

function flattenArray(sentimentData, topVideoData){
	let merged = [];

	for(let i=0; i<sentimentData.length; i++) {
		let total = sentimentData[i].positiveSentimentCount + sentimentData[i].negativeSentimentCount + sentimentData[i].neutralSentimentCount
	merged.push({
	   ...sentimentData[i], 
	   sentimentDiff: ((sentimentData[i].negativeSentimentCount/total)*100).toFixed(1) - ((sentimentData[i].positiveSentimentCount/total)*100).toFixed(1), 
	   percentPositive: ((sentimentData[i].positiveSentimentCount/total)*100).toFixed(1),
	   percentNegative: ((sentimentData[i].negativeSentimentCount/total)*100).toFixed(1),
	   percentNeutral: ((sentimentData[i].neutralSentimentCount/total)*100).toFixed(1),
	   ...(topVideoData.find((itmInner) => itmInner.videoID === sentimentData[i].videoID))}
	  );
	}
	return merged

}

function flattenArray2(sentimentData, topVideoData){
	let merged = [];

	for(let i=0; i<topVideoData.length; i++) {
		let total = sentimentData[i].positiveSentimentCount + sentimentData[i].negativeSentimentCount + sentimentData[i].neutralSentimentCount
	merged.push({
	   ...sentimentData[i], 
	   ...topVideoData[i],
	   sentimentDiff: ((sentimentData[i].negativeSentimentCount/total)*100).toFixed(1) - ((sentimentData[i].positiveSentimentCount/total)*100).toFixed(1), 
	   percentPositive: ((sentimentData[i].positiveSentimentCount/total)*100).toFixed(1),
	   percentNegative: ((sentimentData[i].negativeSentimentCount/total)*100).toFixed(1),
	   percentNeutral: ((sentimentData[i].neutralSentimentCount/total)*100).toFixed(1),
	   ...(topVideoData.find((itmInner) => itmInner.videoID === sentimentData[i].videoID))}
	  );
}
	return merged

}

function roundToDecimalPlaces(num, decimalPlaces) {
	const factor = Math.pow(10, decimalPlaces);
	return Math.round(num * factor) / factor;
  }

  function roundNumber(num, scale) {
	if(!("" + num).includes("e")) {
	  return +(Math.round(num + "e+" + scale)  + "e-" + scale);
	} else {
	  var arr = ("" + num).split("e");
	  var sig = ""
	  if(+arr[1] + scale > 0) {
		sig = "+";
	  }
	  return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
	}
  }
