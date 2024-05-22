import * as d3 from 'd3'

const MARGIN = { TOP: 20, BOTTOM: 80, LEFT: 100, RIGHT: 5 }
const WIDTH = 950 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM


class D3Chart {
	constructor(element, data, topVideoData, dataMarch22, topVideoDataMarch22, updateVideo) {
		//console.log("sentiments", dataMarch22)
		//console.log("top videos", topVideoDataMarch22)

		let vis = this
		vis.updateVideo = updateVideo

		const numberVideos = 50;
		
		// march 15 data
		const topVideoRestructured = restructureData(topVideoData).slice(0, numberVideos);
		const dataRestructured = restrucOrigData(data);
		const dataRestructuredUpdated = getPolarityCount(dataRestructured);
		const march15Data = reorganizeData(dataRestructuredUpdated);
		const filteredMarch15 = march15Data.filter(item => !(item.sentimentData.length < 3)); 
		const updatedData = combineData(filteredMarch15)
		const mergedMarch15 = flattenArray3(updatedData, topVideoRestructured);	
		vis.updatedDataMarch15 = mergedMarch15

		// march 22 data 
		const topVideoRestructuredMarch22 = restructureData(topVideoDataMarch22).slice(0,numberVideos);
		const dataRestructuredMarch22 = restrucOrigData(dataMarch22);
		const dataRestructuredUpdatedMarch22 = getPolarityCount(dataRestructuredMarch22);
		const march22Data = reorganizeData(dataRestructuredUpdatedMarch22)
		const filteredMarch22 = march22Data.filter(item => !(item.sentimentData.length < 3)); 
		const updatedDataMarch22 = combineData(filteredMarch22);
		const mergedMarch22 = flattenArray3(updatedDataMarch22, topVideoRestructuredMarch22);
		let mergedMarch22Sorted = mergedMarch22.sort((a, b) => a.percentNegative - b.percentNegative) //a.sentimentDiff - b.sentimentDiff);
		vis.updatedDataMarch22 = mergedMarch22Sorted

		
		//Promise.all([
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_03.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_22_03.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_29_03.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_05_04.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_04.json")
		//]).then((datasets) => {
			
		//	topTrendingMarch15 = restructureData(datasets[0]).slice(0, 20);
		//});

		//console.log("the top trending videos", topTrendingMarch15);


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
			.attr("font-size", 18)
			.attr("text-anchor", "middle")
			.text("Negative Sentiments (%)")

		vis.g.append("text")
			.attr("x", -(HEIGHT /2))
			.attr("y", -50)
			.attr("transform", "rotate(-90)")
			.attr("font-size", 18)
			.attr("text-anchor", "middle")
			.text("Positive Sentiments (%)")

		vis.update("march15")
		
	}

	update(date) {
		let vis = this

		vis.updatedData = (date == "march15") ? vis.updatedDataMarch15 : vis.updatedDataMarch22

		//if (date == "march15") vis.updatedData = vis.updatedDataMarch15
		//	else if (date == "march22") vis.updatedData = vis.updatedDataMarch22

		vis.x.domain([0, d3.max(vis.updatedData, d => Number(d.percentNegative))])
		vis.y.domain([0, d3.max(vis.updatedData, d => Number(d.percentPositive))])

		const xAxisCall = d3.axisBottom(vis.x)
		const yAxisCall = d3.axisLeft(vis.y)

		vis.xAxisGroup.transition(1000).call(xAxisCall)
		vis.yAxisGroup.transition(1000).call(yAxisCall)
		
		
	
		// JOIN 
		const circles = vis.g.selectAll("circle")
			.data(vis.updatedData, d => d.videoTitle)

	    // EXIT 
		circles.exit()
		.transition(1000)
			.attr("cy", vis.y(0))
			.remove()

		// UPDATE 
		circles.transition(1000)
			.attr("cx", d => vis.x(d.percentNegative))
			.attr("cy", d => vis.y(d.percentPositive))

		// ENTER
		circles.enter().append("circle")
			.attr("cy", vis.y(0))
			.attr("cx", d => vis.x(d.percentNegative))
			.attr("r", 5)
			.attr("fill", "grey")
			.on("click", d =>   vis.updateVideo(d.videoTitle)) 
			.transition(1000)
				.attr("cy", d => vis.y(d.percentPositive))


			

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

function flattenArray3(sentimentData, topVideoData){
	let merged = [];

	for(const videoID in topVideoData) {
		let total = sentimentData[videoID].positiveSentimentCount + sentimentData[videoID].negativeSentimentCount + sentimentData[videoID].neutralSentimentCount
		merged.push({
	   ...sentimentData[videoID], 
	   ...topVideoData[videoID],
	   sentimentDiff: ((sentimentData[videoID].negativeSentimentCount/total)*100).toFixed(1) - ((sentimentData[videoID].positiveSentimentCount/total)*100).toFixed(1), 
	   percentPositive: ((sentimentData[videoID].positiveSentimentCount/total)*100).toFixed(1),
	   percentNegative: ((sentimentData[videoID].negativeSentimentCount/total)*100).toFixed(1),
	   percentNeutral: ((sentimentData[videoID].neutralSentimentCount/total)*100).toFixed(1),
	   ...(sentimentData.find((itmInner) => itmInner.videoID === topVideoData[videoID].videoID))}
	  );
}
	return merged

}

function roundToDecimalPlaces(num, decimalPlaces) {
	const factor = Math.pow(10, decimalPlaces);
	return Math.round(num * factor) / factor;
  }



export default D3Chart