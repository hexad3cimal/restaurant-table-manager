import React, { useState } from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import { useDispatch } from "react-redux";
import { deleteBranch, getBranches, hideAlert, initiateBranchAdd, setBranch } from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Results = ({ branches }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const onEdit = (branch) => {
    dispatch(setBranch(branch))
    dispatch(initiateBranchAdd(true))
  };
  const onDelete = (branch) => {
    dispatch(deleteBranch(branch))
    setTimeout(()=>{dispatch(hideAlert())},100)
    dispatch(getBranches())
  };


  return (
    <Card className={classes.root}>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search with branch name"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches &&
                branches.slice(0, limit).map((branch) => (
                  <TableRow hover key={branch.id}>
                    <TableCell>
                          {branch.name}
                    </TableCell>
                    <TableCell>{branch.userName}</TableCell>

                    <TableCell>{branch.address}</TableCell>
                    <TableCell>{branch.contact}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => onEdit(branch)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => onDelete(branch)}
                        style={{margin:'1rem'}}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={branches.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

export default Results;
