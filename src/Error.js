import { Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Error = () => {

    return (
        <Stack justifyContent={'center'} alignItems={'center'} height={'100vh'} width={'100vw'}>
            <Stack justifyContent={'center'} alignItems={'center'} height={300} width={500} backgroundColor={'white'}>
                <Typography>Sorry, something went wrong</Typography>
                <Typography>Please return to the <Link to={'/Home'}>home page</Link> and try your request again</Typography>
                <Typography>ERROR 404 Requested Resource Not Found</Typography>
            </Stack>
        </Stack>
    )

}

export default Error