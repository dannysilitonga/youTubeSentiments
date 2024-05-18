import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';




export default class Table extends Component {
    renderRows() {
	const topVideoRestructured = restructureData(this.props.topVideoData)
	const updatedData = combineData(reorganizeData(getPolarityCount(restrucOrigData(this.props.data))).slice(0,50))
	
	let mergedMarch15 = [];

		for(let i=0; i<updatedData.length; i++) {
			mergedMarch15.push({
   			...updatedData[i],
			sentimentDiff: updatedData[i].positiveSentimentCount - updatedData[i].negativeSentimentCount, 
   			...(topVideoRestructured.find((itmInner) => itmInner.videoID === updatedData[i].videoID))}
  			);
		}
	 
	let mergedMarch15Sorted = mergedMarch15.sort((a, b) => a.sentimentDiff - b.sentimentDiff);
	console.log("March 15 sorted", mergedMarch15Sorted)
        return (  
			     
            mergedMarch15Sorted.map(video => {
				
				const background = (video.videoTitle === this.props.activeVideo) ? "grey" : "white"
				
		
                return (
					
                    <Row
                        key={video.videoTitle}
                        style= {{ marginTop: "10px", backgroundColor: background }}
                    >
                        <Col xs={3} style= {{ fontSize: 12}}>{video.videoTitle}</Col>
                        <Col xs={3} style= {{ fontSize: 12}}>{video.negativeSentimentCount}</Col>
                        <Col xs={3}style= {{ fontSize: 12}}>{video.positiveSentimentCount}</Col>
						<Col xs={3}style= {{ fontSize: 12}}>{video.sentimentDiff}</Col>
                        
                </Row>
                )
            })
        )
    }
        
		//const dataRestructuredUpdated = getPolarityCount(dataRestructured);
		//console.log("march15DataTemp", dataRestructuredUpdated)
		//const march15Data = reorganizeData(dataRestructuredUpdated).slice(0, 50);
		//console.log("march 15 Data", vis.march15Data)
		
		
		


    render() {
        return (
        <div>
            <Row>
                <Col xs={3}>
                    <Form.Control 
                        placeholder={"Title"}
                        video ID={"videoTitle"}
                    />
                </Col>
                <Col xs={3}>
                    <Form.Control 
                        placeholder={"Neg"}
                        video ID={"negativeSentimentCount"}
                    />
                </Col>
                <Col xs={3}>
                    <Form.Control 
                        placeholder={"Pos"}
                        video ID={"positiveSentimentCount"}
                    />
                </Col>
				<Col xs={3}>
                    <Form.Control 
                        placeholder={"Diff"}
                        video ID={"sentimentDiff"}
                    />
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


