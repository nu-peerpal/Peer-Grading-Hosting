import React, { useState, useRef, useEffect } from 'react';
import { Bar, Chart as ChartJS } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const PEER_DATASET_INDEX = 0
const TA_DATASET_INDEX = 1
const PEER_INACTIVE_BAR_COLOR = "rgba(79, 38, 131, 0.4)"
const PEER_ACTIVE_BAR_COLOR = "rgba(79, 38, 131, 1.0)" 
const TA_INACTIVE_BAR_COLOR = "rgba(255, 198, 47, 0.4)"
const TA_ACTIVE_BAR_COLOR = "rgba(255, 198, 47, 1.0)"

const BarChart = ({ chartData, passSelectedComment }) => {

  const chartRef = useRef()

  // useEffect cleanup function - potential memory leak fix
  useEffect(() => {
    return () => {

    }
  }, [])

  // select the bar for corresponding comment to scroll to view
  const selectBar = evt => {
    if (chartRef.current) {
      // retrieve the selected bar
      const chart = Chart.getChart(chartRef.current)
      console.log(chart)
      const clickedElement = chart.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true)[0]
      console.log(clickedElement)

      // change background colors
      setBackgroundColors(chart, clickedElement)

      // change new selected comment only if we click on a peer or ta bar (datasetIndex == 2 indicates "Max Points" bar)
      let newSelectedComment = clickedElement && clickedElement.datasetIndex < 2 
                                  ? [clickedElement.datasetIndex, clickedElement.index] 
                                  : []

      // pass new selected comment to parent
      passSelectedComment(newSelectedComment)

      console.log(newSelectedComment)
    }
  }

  // NOT WORKING
  const setBackgroundColors = (chart, clickedElement) => {
    // reset backgrounds
    const dataLength = chart.data.labels.length
    chart.data.datasets[PEER_DATASET_INDEX].backgroundColor = Array(dataLength).fill(PEER_INACTIVE_BAR_COLOR)
    chart.data.datasets[TA_DATASET_INDEX].backgroundColor = Array(dataLength).fill(TA_INACTIVE_BAR_COLOR)

    if (clickedElement) {
      switch (clickedElement.datasetIndex) {
        case PEER_DATASET_INDEX:
          chart.data.datasets[clickedElement.datasetIndex].backgroundColor[clickedElement.index] = PEER_ACTIVE_BAR_COLOR
          break;
        
        case TA_DATASET_INDEX:
          chart.data.datasets[clickedElement.datasetIndex].backgroundColor[clickedElement.index] = TA_ACTIVE_BAR_COLOR
          break;

        default:
          break;
      } 
    }
  }

  const options = {
    indexAxis: 'y',
    // borderSkipped: 'middle',
    // scales: {
    //   x: {
    //     beginAtZero: true,
    //   },
    //   y: {
    //     stacked: true,
    //   }
    // },
    plugins: {
      tooltip: {
        filter: function(tooltipItem, data) {
          return tooltipItem.label === "Max Points"
        }, 
        enabled: true
      }
    },
    interaction: {
      mode: 'nearest'
    },
    onClick: (evt , elem) => {
      selectBar(evt)
    },
  }

  return (
    <Bar data={chartData} 
         ref={chartRef} 
         options={options} 
    />
  )
}

export default BarChart