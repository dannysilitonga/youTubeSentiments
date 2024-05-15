import * as d3 from 'd3'

const MARGIN = { TOP: 10, BOTTOM: 80, LEFT: 70, RIGHT: 10 }
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 300 - MARGIN.TOP - MARGIN.BOTTOM

class D3Chart {
	constructor(element, data) {
		console.log(data)
		let vis = this
		const dataRestructured = restrucOrigData(data);
		const dataRestructuredUpdated = getPolarityCount(dataRestructured);
		//console.log("march15DataTemp", dataRestructuredUpdated)
		const march15Data = reorganizeData(dataRestructuredUpdated).slice(0, 50);
		console.log("march 15 Data", march15Data)
		
		vis.updatedData = [];
		march15Data.forEach(item => {
				const dataExp = {
					videoID: item.videoID,
					negativeSentimentCount: item.sentimentData.find(item =>item.analysis =="Negative")['count'],
					neutralSentimentCount: item.sentimentData.find(item =>item.analysis =="Neutral")['count'],
					positiveSentimentCount: item.sentimentData.find(item =>item.analysis =="Positive")['count']
				}
				vis.updatedData.push(dataExp);
			})
		console.log("New Data", vis.updatedData)


		vis.g = d3.select(element)
			.append("svg")
				.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
				.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
			.append("g")
				.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		vis.x = d3.scaleLinear()
			.range([0, WIDTH])

		vis.y = d3.scaleLinear()
			.range([HEIGHT, 0])	
		
		vis.xAxisGroup = vis.g.append("g")
			.attr("transform", `translate(0, ${HEIGHT})`)
		vis.yAxisGroup = vis.g.append("g")

		
		vis.g.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 40)
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.text("Negative Sentiments")

		vis.g.append("text")
			.attr("x", -(HEIGHT /2))
			.attr("y", -50)
			.attr("transform", "rotate(-90)")
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.text("Positive Sentiments")

		vis.update()	
		
	}

	update() {
		let vis = this

		vis.x.domain([0, d3.max(vis.updatedData, d => Number(d.negativeSentimentCount))])
		vis.y.domain([0, d3.max(vis.updatedData, d => Number(d.positiveSentimentCount))])

		const xAxisCall = d3.axisBottom(vis.x)
		const yAxisCall = d3.axisLeft(vis.y)

		vis.xAxisGroup.call(xAxisCall)
		vis.yAxisGroup.call(yAxisCall)
		
	
		// JOIN 
		const circles = vis.g.selectAll("circle")
			.data(vis.updatedData, d => d.videoID)

	    // EXIT 
		circles.exit().remove()

		// UPDATE 
		circles
			.attr("cx", d => vis.x(d.negativeSentimentCount))
			.attr("cy", d => vis.y(d.positiveSentimentCount))

		// ENTER
		circles.enter().append("circle")
			.attr("cx", d => vis.x(d.negativeSentimentCount))
			.attr("cy", d => vis.y(d.positiveSentimentCount))
			.attr("r", 5)
			.attr("fill", "grey")

			console.log("hello")

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



export default D3Chart