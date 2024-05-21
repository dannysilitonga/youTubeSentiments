import React, { Component } from 'react';
import D3BarChart from './D3BarChart';

export default class  BarChartWrapper extends Component {
	componentDidMount() {
		this.setState({
			chart: new D3BarChart(this.refs.chart, this.props.topVideoData, this.props.topVideoDataMarch22)

		})
	}

	shouldComponentUpdate() {
		return false 
	}

	componentWillReceiveProps(nextProps) {
		//this.setState({
		//	chart: nextProps.date
		//})	
		//this.setState({ data: data, 
		//this.state.chart.update(nextProps.activeVideo)
		this.state.chart.update(nextProps.date)

	}
	
	render() {

		return <div className="chart-area" ref="chart"></div>
	}
}

