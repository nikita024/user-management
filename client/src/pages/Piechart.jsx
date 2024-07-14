import { useEffect, useRef } from 'react'
import Chart from "chart.js/auto"
import  "../style.css";

 const Piechart = ({ usersCount, adminCount, profileCount})  =>{
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current){
            chartInstance.current.destroy()
        }
        const myChartRef = chartRef.current.getContext('2d');

        chartInstance.current= new Chart(myChartRef,{
            type:"pie",
            data:{
            labels:["Users","Profiles","Admin"],
            datasets :[
            {
                data: [usersCount, profileCount, adminCount],
                backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                        ],
                    }
                ]
            }
        })

        return () => {
            if (chartInstance.current){
                chartInstance.current.destroy()
            }
        }
    }, [usersCount, adminCount, profileCount]);

    return (
        <div className= "graph">
            <canvas 
                ref={chartRef} 
                style={{ width :"100%", height:"100%" }} 
            />
        </div>
    )
}

 export default Piechart;