import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import "./UserReports.css";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);



function UserReports(){



    // Temporary data (later connect PostgreSQL)

    const statusData = {


        labels:[
            "Pending",
            "Ongoing",
            "Completed"
        ],


        datasets:[

            {

                data:[
                    5,
                    3,
                    8
                ],

                backgroundColor:[

                    "#f59e0b",

                    "#3b82f6",

                    "#22c55e"

                ]

            }

        ]

    };





    const priorityData = {


        labels:[

            "Low",

            "Medium",

            "High"

        ],



        datasets:[


            {


                data:[

                    4,

                    7,

                    5

                ],



                backgroundColor:[

                    "#22c55e",

                    "#f59e0b",

                    "#ef4444"

                ]

            }


        ]

    };







    return(


        <div className="user-reports-page">



            <h2>

                Task Reports

            </h2>






            <div className="charts-container">





                <div className="chart-card">


                    <h3>

                        Task Status

                    </h3>



                    <Doughnut

                        data={statusData}

                    />


                </div>







                <div className="chart-card">


                    <h3>

                        Task Priority

                    </h3>




                    <Doughnut

                        data={priorityData}

                    />



                </div>





            </div>



        </div>


    );

}


export default UserReports;