import React from 'react'
import {
	Typography ,
    TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    required: {
        color: 'red'
    }
}))

const SiteDetails = () => {
    const classes = useStyles()

    return (
        <>
            <Typography variant='subtitle2'>
                Site name<span className={classes.required}>*</span>
            </Typography>
            <TextField name="name" fullWidth  variant="outlined" defaultValue="Boddington"/>
        </>     
    )
}

export default SiteDetails