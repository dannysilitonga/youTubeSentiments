import * as d3 from 'd3'

//const MARGIN = { TOP: 30, BOTTOM: 300, LEFT: 90, RIGHT: 30 }
//const WIDTH = 860 - MARGIN.LEFT - MARGIN.RIGHT;
//const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM;

const MARGIN = { TOP: 10, BOTTOM: 120, LEFT: 100, RIGHT: 10 }
const WIDTH = 1100 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

export default class D3BarChart {
	constructor(element, topVideoData, topVideoDataMarch22) {
		
		const vis = this
		const numberVideos = 50;
		

		vis.svg = d3.select(element)
			.append("svg")
				.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
				.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
			.append("g")
				.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		vis.xLabel = vis.svg.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 80)
			.attr("text-anchor", "middle")
			.style("font-size", "19px")

		vis.svg.append("text")
			.attr("x", -(HEIGHT / 2))
			.attr("y", -75)
			.attr("text-anchor", "middle")
			.text("Number of Views")
			.attr("transform", "rotate(-90)")

		vis.xAxisGroup = vis.svg.append("g")
			.attr("transform", `translate(0, ${HEIGHT})`)

		vis.yAxisGroup = vis.svg.append("g")

		//Promise.all([
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_03.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_22_03.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_29_03.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_05_04.json"),
		//	d3.json("https://sentimentviz-default-rtdb.firebaseio.com/top_videos_24_15_04.json")
		//]).then((datasets) => {
			
		//	vis.march15Data = restructureData(datasets[0]).slice(0, 20)
		//	vis.march22Data = restructureData(datasets[1]).slice(0, 20)
		//	vis.march29Data = restructureData(datasets[2]).slice(0, 20)
		//	vis.april05Data = restructureData(datasets[3]).slice(0, 20)
		//	vis.april15Data = restructureData(datasets[4]).slice(0,20)
		//	vis.update("march15")

		//})
		vis.march15Data = restructureData(topVideoData).slice(0, numberVideos)
			vis.march22Data = restructureData(topVideoDataMarch22).slice(0, numberVideos)
			vis.update("march15")
	}

	update(date) {
		const vis = this
		
		

		//vis.data = (date == "march15") ? vis.march15Data : vis.april15Data;

		if (date == "march15") vis.data = vis.march15Data
		else if (date == "march22") vis.data = vis.march22Data
		//else if (date == "march29") vis.data = vis.march29Data
		//else if (date == "april05") vis.data = vis.april05Data
		//else if (date == "april15") vis.data = vis.april15Data

		


		const month = date.slice(0, -2).charAt(0).toUpperCase() + date.slice(0, -2).slice(1) 
		const convertedDate = date.substr(date.length-2);
		const converted_month_date = month.concat(" ", convertedDate)

		//console.log("converted date month", converted_month_date)

		console.log("data", vis.march15Data);	
		vis.xLabel.text(`Top Trending Videos on ${converted_month_date}`)

		const titleLimit = 8;

		const x = d3.scaleBand()
      		.range([0, WIDTH])
      		.domain(vis.data.map((d) => truncate(d.videoTitle, titleLimit)))
      		.padding(0.5)
    	
		const xAxisCall = d3.axisBottom(x)
    
		vis.xAxisGroup.transition().duration(500).call(xAxisCall)
      		.selectAll("text")
      		.style("font-size", "8px")
      		.attr("transform", "translate(-10,0)rotate(-45)")
      		.style("text-anchor", "end")
  
    	const y = d3.scaleLinear()
        	.domain([
          	d3.min(vis.data, d => d.videoCount) *0.95, 
          	d3.max(vis.data, d => d.videoCount)
        	])
        	.range([HEIGHT, 0])
  
    	const yAxisCall = d3.axisLeft(y)
    	vis.yAxisGroup.transition().duration(500).call(yAxisCall)
    	console.log("hello again")

    	// DATA JOIN
    	const rects = vis.svg.selectAll("rect")
      		.data(vis.data)

    	// EXIT 
    	rects.exit()
        	.transition().duration(500)
        		.attr("height", 0)
        		.attr("y", HEIGHT)
        		.remove()

    	// UPDATE 
    	rects.transition().duration(500)
      		.attr("x", d => x(truncate(d.videoTitle, titleLimit)))
      		.attr("y", d => y(d.videoCount))
      		.attr("width", x.bandwidth)
      		.attr("height", d => HEIGHT - y(d.videoCount))

    	// ENTER
    	rects.enter().append("rect")
      	.attr("x", d => x(truncate(d.videoTitle, titleLimit)))
      	.attr("width", x.bandwidth)
      	.attr("fill", "#5f0f40")
      	.attr("y", HEIGHT)
      	.transition().duration(500)
        	.attr("height", d => HEIGHT - y(d.videoCount))
        	.attr("y", d => y(d.videoCount))
	}
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

function truncate(str, n){
	return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
  };