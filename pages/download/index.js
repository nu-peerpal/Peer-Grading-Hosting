import React, { useState } from 'react';
import ListContainer from '../../components/listcontainer';

const index = () => {

    const [data, setData] = useState([])

    return (
        <div className="Content">
            <ListContainer
                name="Download Data"
                data={data}
                link={"/download/peerGradingData"}
            />

        </div>  
    )
};

export default index;
