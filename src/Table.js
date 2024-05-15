import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';




export default class Table extends Component {
    renderRows() {
        return (
            console.log("New Data2", restrucOrigData(this.props.data).slice(0,20)),
           
            combineData(reorganizeData(getPolarityCount(restrucOrigData(this.props.data))).slice(0,50)).map(video => {
                console.log(video)
                return (
                    <Row
                        key={video.videoID}
                        style= {{marginTop: "10px", marginLeft: "10px"}}
                    >
                        <Col xs={3} style= {{ fontSize: 12}}>{video.videoID}</Col>
                        <Col xs={3} style= {{ fontSize: 12}}>{video.negativeSentimentCount}</Col>
                        <Col xs={3}style= {{ fontSize: 12}}>{video.positiveSentimentCount}</Col>
                        
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
                        placeholder={"ID"}
                        video ID={"videoID"}
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

		