import { LinearProgress } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress'
import {Box} from "@mui/material"

const ProgressBar = () => {

    return (
        <Box sx={{ width: '100%' }}>
            <CircularProgress color='orange'/>
        </Box>
    )  
}

export default ProgressBar