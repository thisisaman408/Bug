import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { GreenButton, RedButton } from "../utils/buttonStyles";

const AlertDialogSlide = ({ dialog, showDialog, setShowDialog ,taskHandler}) => {
    const handleClose = () => {
        setShowDialog(false);
    };

    
    return (
        // bug fix 
      <Dialog
        open={showDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"  // include this 
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You won't be able to recover it back. Decide Now
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <GreenButton onClick={handleClose}>No</GreenButton>
          </div>
          <div>
            <RedButton
              onClick={() => {
                handleClose();
                // bug fix taskHandler not defined 
                // taskHandler();
              }}
            >
              Yes
            </RedButton>
          </div>
        </DialogActions>
      </Dialog>
    );
}
AlertDialogSlide.propTypes = {
  dialog: PropTypes.string.isRequired,
  showDialog: PropTypes.bool.isRequired,
  setShowDialog: PropTypes.func.isRequired,
  taskHandler: PropTypes.func.isRequired,
};
export default AlertDialogSlide;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});